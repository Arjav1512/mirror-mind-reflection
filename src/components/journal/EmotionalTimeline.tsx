import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface EmotionalTimelineProps {
  userId: string;
}

const EmotionalTimeline = ({ userId }: EmotionalTimelineProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmotionalData();

    // Set up realtime subscription
    const channel = supabase
      .channel('emotional-analysis-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emotional_analysis',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchEmotionalData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchEmotionalData = async () => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    const { data: emotions, error } = await supabase
      .from("emotional_analysis")
      .select("sentiment_score, created_at, dominant_emotion")
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (!error && emotions) {
      const chartData = emotions.map((e) => ({
        date: format(new Date(e.created_at), "MMM dd"),
        sentiment: Number(e.sentiment_score),
        emotion: e.dominant_emotion,
      }));
      setData(chartData);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="text-xl font-semibold mb-4">Emotional Timeline</h3>
        <div className="h-[300px] bg-accent/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="text-xl font-semibold mb-4">Emotional Timeline</h3>
        <p className="text-sm text-muted-foreground">
          Start journaling to see your emotional patterns over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <h3 className="text-xl font-semibold mb-4">Emotional Timeline</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Your sentiment scores over the past 30 days
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[-1, 1]} 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionalTimeline;
