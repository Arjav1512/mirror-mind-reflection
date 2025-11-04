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
    <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-card transition-smooth">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Textarea
            placeholder="How are you feeling today? What's on your mind?&#10;&#10;Share your thoughts, emotions, and experiences. The more you write, the better I can understand your emotional patterns and help you develop self-awareness..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none text-base leading-relaxed border-border/50 focus:border-primary transition-colors"
            disabled={analyzing}
          />
          {analyzing && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Analyzing your entry...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {content.length} characters
            </p>
            <p className="text-xs text-muted-foreground/70">
              {content.length < 50 ? 'Write at least 50 characters for better insights' : 'Great! Ready to analyze'}
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={analyzing || content.length < 10} 
            size="lg"
            className="gap-2 shadow-soft hover:shadow-lg transition-all w-full sm:w-auto"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Save & Analyze Entry
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JournalEntry;
