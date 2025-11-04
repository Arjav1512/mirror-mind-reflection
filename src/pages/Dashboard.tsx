import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, PenLine, TrendingUp, Brain, Sparkles } from "lucide-react";
import JournalEntry from "@/components/journal/JournalEntry";
import EmotionalTimeline from "@/components/journal/EmotionalTimeline";
import EmotionalInsights from "@/components/journal/EmotionalInsights";
import WeeklySummary from "@/components/journal/WeeklySummary";
import BiasesList from "@/components/journal/BiasesList";
import BiasTracker from "@/components/journal/BiasTracker";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        // Check if onboarding is completed
        setTimeout(() => {
          supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => {
              if (!data?.onboarding_completed) {
                navigate("/onboarding");
              }
            });
        }, 0);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        // Check if onboarding is completed
        supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (!data?.onboarding_completed) {
              navigate("/onboarding");
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "See you next time!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/50 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-24 bg-accent/50 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-accent/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl h-14 bg-card rounded-lg animate-pulse" />
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="h-[500px] bg-card rounded-2xl animate-pulse shadow-soft" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-soft">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Mirror
                </h1>
                <p className="text-xs text-muted-foreground">Your Self-Awareness Journal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="write" className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 h-auto p-1 bg-card border border-border shadow-card">
              <TabsTrigger 
                value="write" 
                className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <PenLine className="h-4 w-4" />
                <span className="hidden sm:inline">Write</span>
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger 
                value="patterns" 
                className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Patterns</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Write Tab - Journal Entry */}
          <TabsContent value="write" className="mt-8 space-y-0">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Today's Reflection
                </h2>
                <p className="text-muted-foreground">
                  Share what's on your mind and let AI help you understand your emotional patterns
                </p>
              </div>
              <JournalEntry userId={user.id} />
            </div>
          </TabsContent>

          {/* Insights Tab - Emotional Analysis */}
          <TabsContent value="insights" className="mt-8 space-y-6">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Emotional Insights
              </h2>
              <p className="text-muted-foreground">
                Track your emotional journey and understand your mood patterns over time
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main insights card - takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <EmotionalTimeline userId={user.id} />
              </div>
              
              {/* Side insights */}
              <div className="space-y-6">
                <EmotionalInsights userId={user.id} />
              </div>
            </div>
          </TabsContent>

          {/* Patterns Tab - Biases & Summaries */}
          <TabsContent value="patterns" className="mt-8 space-y-6">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Cognitive Patterns
              </h2>
              <p className="text-muted-foreground">
                Discover recurring themes, biases, and behavioral patterns in your thinking
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main pattern visualization */}
              <div className="lg:col-span-2 space-y-6">
                <BiasTracker userId={user.id} />
                <BiasesList userId={user.id} />
              </div>
              
              {/* Weekly summary sidebar */}
              <div className="space-y-6">
                <WeeklySummary userId={user.id} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
