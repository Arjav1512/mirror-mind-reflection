import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";

interface WeeklySummaryProps {
  userId: string;
}

const WeeklySummary = ({ userId }: WeeklySummaryProps) => {
  const [summary, setSummary] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestSummary();
  }, [userId]);

  const fetchLatestSummary = async () => {
    const { data, error } = await supabase
      .from("weekly_summaries")
      .select("*")
      .eq("user_id", userId)
      .order("week_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setSummary(data);
    }
    setLoading(false);
  };

  const generateSummary = async () => {
    setGenerating(true);

    const lastWeekStart = startOfWeek(subWeeks(new Date(), 1));
    const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1));

    try {
      const { error } = await supabase.functions.invoke("generate-weekly-summary", {
        body: {
          weekStart: lastWeekStart.toISOString(),
          weekEnd: lastWeekEnd.toISOString(),
        },
      });

      if (error) throw error;

      toast({
        title: "Summary generated!",
        description: "Your 'You in 7 Days' summary is ready.",
      });

      await fetchLatestSummary();
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="text-xl font-semibold mb-4">You in 7 Days</h3>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">You in 7 Days</h3>
        <Button
          size="sm"
          onClick={generateSummary}
          disabled={generating}
          className="gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              Generate Weekly Summary
            </>
          )}
        </Button>
      </div>

      {!summary ? (
        <p className="text-sm text-muted-foreground">
          Generate your first weekly summary to see AI-powered insights about your emotional patterns.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(summary.week_start), "MMM dd")} - {format(new Date(summary.week_end), "MMM dd")}
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-line">
            {summary.summary}
          </p>

          {summary.dominant_emotions && summary.dominant_emotions.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Dominant Emotions:</p>
              <div className="flex flex-wrap gap-2">
                {summary.dominant_emotions.map((emotion: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {summary.recurring_themes && summary.recurring_themes.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Recurring Themes:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {summary.recurring_themes.map((theme: string, i: number) => (
                  <li key={i} className="text-muted-foreground">{theme}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklySummary;
