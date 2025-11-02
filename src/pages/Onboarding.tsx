import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [occupation, setOccupation] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if onboarding is already completed
      supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.onboarding_completed) {
            navigate("/dashboard");
          }
        });
    });
  }, [navigate]);

  const goalOptions = [
    { id: "emotional-awareness", label: "Better understand my emotions" },
    { id: "reduce-stress", label: "Reduce stress and anxiety" },
    { id: "self-improvement", label: "Personal growth and self-improvement" },
    { id: "decision-making", label: "Improve decision-making" },
    { id: "relationship-insights", label: "Understand relationships better" },
    { id: "mindfulness", label: "Increase mindfulness" },
  ];

  const handleGoalToggle = (goalId: string) => {
    setGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!ageGroup) {
      toast({
        title: "Please select your age group",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!occupation.trim()) {
      toast({
        title: "Please enter your occupation",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (goals.length === 0) {
      toast({
        title: "Please select at least one goal",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        age_group: ageGroup,
        occupation: occupation.trim(),
        goals: goals,
        onboarding_completed: true,
      })
      .eq("id", session.user.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Failed to save profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Mirror!",
        description: "Your profile has been set up. Let's begin your journey.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us personalize your self-awareness journey
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Age Group */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">What's your age group?</Label>
              <RadioGroup value={ageGroup} onValueChange={setAgeGroup}>
                <div className="grid grid-cols-2 gap-3">
                  {["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].map((age) => (
                    <div key={age} className="flex items-center space-x-2">
                      <RadioGroupItem value={age} id={age} />
                      <Label htmlFor={age} className="font-normal cursor-pointer">
                        {age}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Occupation */}
            <div className="space-y-4">
              <Label htmlFor="occupation" className="text-base font-semibold">
                What's your occupation or role?
              </Label>
              <Input
                id="occupation"
                placeholder="e.g., Software Engineer, Student, Teacher"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                This helps us provide relevant insights for your context
              </p>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                What are your goals with Mirror? (Select all that apply)
              </Label>
              <div className="space-y-3">
                {goalOptions.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={goal.id}
                      checked={goals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                    />
                    <Label
                      htmlFor={goal.id}
                      className="font-normal cursor-pointer leading-tight"
                    >
                      {goal.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
