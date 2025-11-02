import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const OnboardingForm = () => {
  const [aboutYou, setAboutYou] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aboutYou.trim() || aboutYou.trim().length < 20) {
      toast({
        title: "Tell us more",
        description: "Please share at least a few sentences about yourself.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast({
        title: "All set!",
        description: "Your Mirror is ready. Start journaling to begin your self-awareness journey.",
      });
    }, 1500);
  };

  if (success) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent mx-auto flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground">
          You're All Set!
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Mirror is now configured for you. Start your first journal entry to begin understanding your emotional patterns.
        </p>
        <Button size="lg" className="mt-4 transition-smooth">
          Start Journaling
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <Label htmlFor="about" className="text-foreground text-lg">
          Tell us about yourself
        </Label>
        <p className="text-sm text-muted-foreground">
          Share what brings you to Mirror, what you hope to understand about yourself, or any patterns you've noticed in your emotions or thoughts.
        </p>
        <Textarea
          id="about"
          placeholder="I'm looking to understand my emotional patterns better. I often feel..."
          value={aboutYou}
          onChange={(e) => setAboutYou(e.target.value)}
          className="min-h-[200px] resize-none"
          required
        />
        <p className="text-xs text-muted-foreground">
          Minimum 20 characters
        </p>
      </div>
      
      <Button
        type="submit"
        size="lg"
        className="w-full text-lg transition-smooth"
        disabled={loading}
      >
        {loading ? "Setting up your Mirror..." : "Complete Setup"}
      </Button>
    </form>
  );
};

export default OnboardingForm;
