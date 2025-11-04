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
    <section className="py-24 px-6 bg-background relative">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
            How It Works
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 mb-6" />
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Mirror uses advanced AI to analyze your journal entries and provide insights that traditional journaling can't offer.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-border bg-card shadow-card hover:shadow-soft transition-smooth animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth shadow-soft">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
