import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

interface Entry {
  id: string;
  content: string;
  location: string | null;
  created_at: string;
}

interface PastEntriesProps {
  userId: string;
}

const PastEntries = ({ userId }: PastEntriesProps) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();

    // Subscribe to new entries
    const channel = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, content, location, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setEntries(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border border-border/50 shadow-soft">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Past Entries
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-accent/30 rounded w-1/4 mb-2" />
              <div className="h-16 bg-accent/20 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-6 bg-card border border-border/50 shadow-soft">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Past Entries
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No entries yet. Start journaling to see your history here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border border-border/50 shadow-soft">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Past Entries ({entries.length})
      </h3>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg bg-accent/20 border border-border/30 hover:border-primary/30 transition-smooth"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(entry.created_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
                {entry.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {entry.location}
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default PastEntries;
