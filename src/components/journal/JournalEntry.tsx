import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

interface JournalEntryProps {
  userId: string;
}

const JournalEntry = ({ userId }: JournalEntryProps) => {
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something first",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      // Insert journal entry
      const { data: entry, error: entryError } = await supabase
        .from("journal_entries")
        .insert({ user_id: userId, content })
        .select()
        .single();

      if (entryError) throw entryError;

      // Trigger AI analysis
      const { error: analysisError } = await supabase.functions.invoke("analyze-entry", {
        body: { entryId: entry.id, content },
      });

      if (analysisError) {
        console.error("Analysis error:", analysisError);
        toast({
          title: "Entry saved",
          description: "Entry saved, but analysis failed. Try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Entry analyzed!",
          description: "Your emotional patterns and insights have been updated.",
        });
        setContent("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <h2 className="text-2xl font-semibold mb-4">Today's Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="How are you feeling today? What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] resize-none"
          disabled={analyzing}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {content.length} characters
          </p>
          <Button type="submit" disabled={analyzing} className="gap-2">
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Save & Analyze
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JournalEntry;
