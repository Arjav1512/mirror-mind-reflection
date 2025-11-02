import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
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
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
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
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="h-8 w-32 bg-accent rounded animate-pulse" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-card rounded-2xl animate-pulse" />
              <div className="h-80 bg-card rounded-2xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-card rounded-2xl animate-pulse" />
              <div className="h-64 bg-card rounded-2xl animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mirror</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Journal Entry */}
          <div className="lg:col-span-2 space-y-6">
            <JournalEntry userId={user.id} />
            <EmotionalTimeline userId={user.id} />
            <BiasTracker userId={user.id} />
          </div>

          {/* Right Column: Insights & Analysis */}
          <div className="space-y-6">
            <EmotionalInsights userId={user.id} />
            <WeeklySummary userId={user.id} />
            <BiasesList userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
