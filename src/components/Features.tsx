import { Brain, TrendingUp, Lightbulb, Calendar } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Emotional Timeline",
    description: "Track your emotional patterns over time with deep insights that reveal how you truly feel, not just what you write.",
  },
  {
    icon: Calendar,
    title: "Weekly Summaries",
    description: "Get AI-generated 'You in 7 Days' summaries that capture your week's dominant emotions, themes, and behavioral patterns.",
  },
  {
    icon: Brain,
    title: "Cognitive Bias Detection",
    description: "Identify when you're catastrophizing, engaging in black-and-white thinking, or falling into other common cognitive traps.",
  },
  {
    icon: Lightbulb,
    title: "Self-Awareness Growth",
    description: "Watch your self-awareness develop as the system tracks your progress in recognizing and addressing cognitive patterns.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
          How It Works
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          Mirror uses advanced AI to analyze your journal entries and provide insights that traditional journaling can't offer.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl border border-border bg-card shadow-card hover:shadow-soft transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
