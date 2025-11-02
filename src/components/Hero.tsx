import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToSignup = () => {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="gradient-hero min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-slow">
        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
          Mirror
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          An AI-powered self-awareness mirror that learns from your emotional patterns, not just your words.
        </p>
        <Button 
          size="lg"
          onClick={scrollToSignup}
          className="text-lg px-8 py-6 shadow-soft hover:shadow-lg transition-smooth group"
        >
          Get Started with Self Reflection
          <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-smooth" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
