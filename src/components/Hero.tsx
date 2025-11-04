import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="gradient-hero min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb)/0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb)/0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-slow">
        {/* Main title with enhanced styling */}
        <div className="mb-8 relative">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-foreground tracking-tighter mb-4 relative">
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Mirror
            </span>
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </div>

        {/* Subtitle with better hierarchy */}
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground/90 mb-6 max-w-3xl mx-auto leading-relaxed font-light">
          An AI-powered self-awareness mirror that learns from your
        </p>
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-12 animate-fade-in" 
           style={{ animationDelay: '200ms' }}>
          emotional patterns, not just your words
        </p>

        {/* Enhanced CTA button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" 
             style={{ animationDelay: '400ms' }}>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-10 py-7 shadow-soft hover:shadow-lg transition-smooth group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Get Started with Self Reflection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </div>

        {/* Social proof or trust indicator */}
        <p className="text-sm text-muted-foreground/60 mt-12 animate-fade-in" 
           style={{ animationDelay: '600ms' }}>
          Join others on their journey to self-awareness
        </p>
      </div>
    </section>
  );
};

export default Hero;
