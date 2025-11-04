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
      const { error, data } = await supabase.functions.invoke("generate-weekly-summary", {
        body: {
          weekStart: lastWeekStart.toISOString(),
          weekEnd: lastWeekEnd.toISOString(),
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        // Check if it's a "no entries" message (status 200 with error in body)
        toast({
          title: "Not enough data yet",
          description: data.error,
        });
      } else {
        toast({
          title: "Summary generated!",
          description: "Your 'You in 7 Days' summary is ready.",
        });
        await fetchLatestSummary();
      }
    } catch (error: any) {
      console.error("Summary generation error:", error);
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
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-primary" />
          <div className="h-6 w-32 bg-accent/50 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-accent/30 rounded-lg animate-pulse" />
          <div className="h-32 bg-accent/30 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-card transition-smooth">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">You in 7 Days</h3>
      </div>

      {!summary ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Generate your weekly summary to see AI-powered insights
            </p>
            <Button
              onClick={generateSummary}
              disabled={generating}
              className="gap-2 shadow-soft"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70 text-center italic border-t border-border/50 pt-4">
            Requires journal entries from this week
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(summary.week_start), "MMM dd")} - {format(new Date(summary.week_end), "MMM dd")}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={generateSummary}
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>Refresh</>
              )}
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-border/50">
            <p className="text-sm leading-relaxed whitespace-pre-line text-card-foreground">
              {summary.summary}
            </p>
          </div>

          {summary.dominant_emotions && summary.dominant_emotions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-card-foreground">Dominant Emotions:</p>
              <div className="flex flex-wrap gap-2">
                {summary.dominant_emotions.map((emotion: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {summary.recurring_themes && summary.recurring_themes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-card-foreground">Recurring Themes:</p>
              <ul className="list-disc list-inside text-sm space-y-1 pl-2">
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
