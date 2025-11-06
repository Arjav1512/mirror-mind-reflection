import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface BiasesListProps {
  userId: string;
}

const BiasesList = ({ userId }: BiasesListProps) => {
  const [biases, setBiases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBiases();

    // Set up realtime subscription
    const channel = supabase
      .channel('biases-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cognitive_biases',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchRecentBiases();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchRecentBiases = async () => {
    try {
      const { data, error } = await supabase
        .from("cognitive_biases")
        .select("id, bias_type, excerpt, explanation, confidence_score, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching biases:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setBiases(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBiasColor = (type: string) => {
    const colors: Record<string, string> = {
      catastrophizing: "destructive",
      black_white_thinking: "outline",
      emotional_reasoning: "secondary",
      fortune_telling: "outline",
      overgeneralization: "secondary",
    };
    return colors[type] || "secondary";
  };

  const formatBiasType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-accent rounded animate-pulse" />
          <div className="h-6 w-48 bg-accent rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-accent/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-accent/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-accent/50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (biases.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Cognitive Biases</h3>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            No biases detected in your entries yet
          </p>
          <p className="text-xs text-muted-foreground/70">
            AI will analyze your thinking patterns as you journal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Cognitive Biases Detected</h3>
      </div>

      <div className="space-y-4">
        {biases.map((bias) => (
          <div
            key={bias.id}
            className="p-4 rounded-lg bg-accent/50 border border-border"
          >
            <div className="flex items-start justify-between mb-2">
              <Badge variant={getBiasColor(bias.bias_type) as any}>
                {formatBiasType(bias.bias_type)}
              </Badge>
              {bias.confidence_score && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(bias.confidence_score * 100)}% confidence
                </span>
              )}
            </div>
            <p className="text-sm italic text-muted-foreground mb-2">
              "{bias.excerpt}"
            </p>
            <p className="text-sm">{bias.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiasesList;
