import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingDown } from "lucide-react";

interface BiasTrackerProps {
  userId: string;
}

const BiasTracker = ({ userId }: BiasTrackerProps) => {
  const [biasData, setData] = useState<any[]>([]);
  const [improvement, setImprovement] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBiasFrequency();

    const channel = supabase
      .channel('bias-tracker-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cognitive_biases',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchBiasFrequency();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchBiasFrequency = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: biases, error } = await supabase
      .from("cognitive_biases")
      .select("bias_type, created_at")
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (!error && biases) {
      // Count frequency by type
      const frequency: Record<string, number> = {};
      biases.forEach(b => {
        frequency[b.bias_type] = (frequency[b.bias_type] || 0) + 1;
      });

      const chartData = Object.entries(frequency).map(([type, count]) => ({
        name: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count: count
      })).sort((a, b) => b.count - a.count);

      setData(chartData);

      // Calculate improvement (comparing first half vs second half of entries)
      if (biases.length >= 4) {
        const midpoint = Math.floor(biases.length / 2);
        const firstHalfCount = midpoint;
        const secondHalfCount = biases.length - midpoint;
        const improvementPercent = ((firstHalfCount - secondHalfCount) / firstHalfCount) * 100;
        setImprovement(improvementPercent);
      }
    }
    
    setLoading(false);
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="text-xl font-semibold mb-4">Bias Frequency Tracker</h3>
        <div className="h-64 bg-accent/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (biasData.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h3 className="text-xl font-semibold mb-4">Bias Frequency Tracker</h3>
        <p className="text-sm text-muted-foreground">
          No biases detected yet. Keep journaling and Mirror will track patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Bias Frequency Tracker</h3>
        {improvement !== null && improvement > 0 && (
          <div className="flex items-center gap-2 text-green-600">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">{improvement.toFixed(0)}% improvement</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Tracking your cognitive bias patterns over the past 30 days
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={biasData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {biasData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-accent/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Self-Awareness Progress:</strong> Recognizing these patterns is the first step toward change. 
          {improvement !== null && improvement > 0 && " You're showing improvement over time!"}
        </p>
      </div>
    </div>
  );
};

export default BiasTracker;
