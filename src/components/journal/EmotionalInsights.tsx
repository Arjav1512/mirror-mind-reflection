import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmotionalInsightsProps {
  userId: string;
}

const EmotionalInsights = ({ userId }: EmotionalInsightsProps) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();

    const channel = supabase
      .channel('emotional-insights-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emotional_analysis',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchInsights();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchInsights = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: emotions, error } = await supabase
        .from("emotional_analysis")
        .select("sentiment_score, created_at")
        .eq("user_id", userId)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching insights:", error);
        setLoading(false);
        return;
      }

      if (!emotions || emotions.length < 2) {
        setLoading(false);
        return;
      }

      const scores = emotions.map(e => Number(e.sentiment_score));
      
      // Calculate rolling average (7-day window)
      const rollingAvg = scores.length >= 7 
        ? scores.slice(-7).reduce((a, b) => a + b, 0) / 7
        : scores.reduce((a, b) => a + b, 0) / scores.length;
      
      // Calculate volatility (standard deviation)
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
      const volatility = Math.sqrt(variance);
      
      // Detect significant mood shifts (change > 0.4)
      const recentShifts = [];
      for (let i = 1; i < scores.length; i++) {
        const change = scores[i] - scores[i - 1];
        if (Math.abs(change) > 0.4) {
          recentShifts.push({
            date: new Date(emotions[i].created_at).toLocaleDateString(),
            change: change,
            type: change > 0 ? 'improvement' : 'decline'
          });
        }
      }
      
      // Trend detection
      const recentScores = scores.slice(-7);
      const trend = recentScores.length >= 2
        ? recentScores[recentScores.length - 1] - recentScores[0]
        : 0;
      
      setInsights({
        rollingAvg: rollingAvg.toFixed(2),
        volatility: volatility.toFixed(2),
        trend: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable',
        trendValue: trend.toFixed(2),
        recentShifts: recentShifts.slice(-3),
        totalEntries: emotions.length
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Emotional Insights
        </h3>
        <div className="space-y-4">
          <div className="h-24 bg-accent/30 rounded-xl animate-pulse" />
          <div className="h-24 bg-accent/30 rounded-xl animate-pulse" />
          <div className="h-24 bg-accent/30 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Emotional Insights
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            Need at least 2 entries to generate insights
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Keep journaling to unlock emotional patterns
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-card transition-smooth">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        Emotional Insights
      </h3>
      
      <div className="space-y-4">
        {/* Rolling Average */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-card-foreground">7-Day Average</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{insights.rollingAvg}</p>
          <p className="text-xs text-muted-foreground">
            {Number(insights.rollingAvg) > 0 ? '✨ Positive' : Number(insights.rollingAvg) < 0 ? '🌧️ Negative' : '😐 Neutral'} overall mood
          </p>
        </div>

        {/* Trend */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-card-foreground">Recent Trend</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {insights.trend === 'improving' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : insights.trend === 'declining' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Activity className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          <Badge 
            variant={
              insights.trend === 'improving' ? 'default' : 
              insights.trend === 'declining' ? 'destructive' : 
              'secondary'
            }
            className="text-sm"
          >
            {insights.trend.charAt(0).toUpperCase() + insights.trend.slice(1)}
          </Badge>
        </div>

        {/* Volatility */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 border border-border/50 hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-card-foreground">Volatility</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {Number(insights.volatility) < 0.3 ? '🟢 Stable' : 
               Number(insights.volatility) < 0.6 ? '🟡 Moderate' : '🔴 High'}
            </span> emotional variation
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">σ = {insights.volatility}</p>
        </div>

        {/* Significant Mood Shifts */}
        {insights.recentShifts.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm font-semibold mb-3 text-card-foreground">Recent Shifts:</p>
            <div className="space-y-2">
              {insights.recentShifts.map((shift: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-accent/20">
                  <Badge variant={shift.type === 'improvement' ? 'default' : 'outline'} className="text-xs">
                    {shift.date}
                  </Badge>
                  <span className="text-muted-foreground flex-1">
                    {shift.type === 'improvement' ? '📈' : '📉'} {Math.abs(shift.change).toFixed(2)} change
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionalInsights;
