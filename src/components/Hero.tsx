import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="gradient-hero min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated gradient orbs - deeper in background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Top-left corner: Neural network / Mirror reflection */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none animate-float" style={{ animationDuration: '6s' }}>
        <svg viewBox="0 0 300 300" className="w-full h-full opacity-60">
          <defs>
            <linearGradient id="mirror-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(270, 70%, 65%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(210, 80%, 75%)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Mirror shape with reflection */}
          <ellipse cx="120" cy="80" rx="60" ry="70" fill="url(#mirror-gradient)" opacity="0.5" />
          <ellipse cx="115" cy="75" rx="55" ry="65" fill="none" stroke="hsl(270, 70%, 70%)" strokeWidth="2" opacity="0.7" />
          {/* Neural nodes */}
          <circle cx="80" cy="120" r="8" fill="hsl(270, 70%, 65%)" opacity="0.6" />
          <circle cx="150" cy="140" r="6" fill="hsl(210, 80%, 70%)" opacity="0.6" />
          <circle cx="100" cy="160" r="5" fill="hsl(270, 70%, 60%)" opacity="0.5" />
          {/* Connecting lines */}
          <line x1="80" y1="120" x2="100" y2="160" stroke="hsl(270, 70%, 65%)" strokeWidth="1.5" opacity="0.3" />
          <line x1="100" y1="160" x2="150" y2="140" stroke="hsl(270, 70%, 65%)" strokeWidth="1.5" opacity="0.3" />
        </svg>
      </div>

      {/* Top-right corner: Emotional waves */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}>
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-50">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(210, 80%, 70%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(270, 70%, 65%)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Ripple circles */}
          <circle cx="320" cy="80" r="40" fill="none" stroke="url(#wave-gradient)" strokeWidth="2" opacity="0.7" />
          <circle cx="320" cy="80" r="60" fill="none" stroke="url(#wave-gradient)" strokeWidth="1.5" opacity="0.5" />
          <circle cx="320" cy="80" r="80" fill="none" stroke="url(#wave-gradient)" strokeWidth="1" opacity="0.3" />
          {/* Abstract emotional particles */}
          <circle cx="280" cy="120" r="4" fill="hsl(270, 70%, 65%)" opacity="0.7" />
          <circle cx="340" cy="140" r="6" fill="hsl(210, 80%, 70%)" opacity="0.6" />
          <circle cx="300" cy="160" r="3" fill="hsl(270, 70%, 60%)" opacity="0.5" />
        </svg>
      </div>

      {/* Bottom-left corner: Glass gradient shapes */}
      <div className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }}>
        <svg viewBox="0 0 300 300" className="w-full h-full opacity-50">
          <defs>
            <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(270, 70%, 70%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(210, 80%, 75%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Abstract glass shapes */}
          <path d="M 50 220 Q 80 200 110 220 T 170 220" fill="none" stroke="url(#glass-gradient)" strokeWidth="3" opacity="0.6" />
          <polygon points="60,240 90,260 80,280" fill="url(#glass-gradient)" opacity="0.4" />
          <polygon points="120,250 150,235 145,270" fill="url(#glass-gradient)" opacity="0.5" />
          <circle cx="100" cy="230" r="8" fill="hsl(270, 70%, 65%)" opacity="0.4" />
        </svg>
      </div>

      {/* Bottom-right corner: Floating orbs and particles */}
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none animate-float" style={{ animationDuration: '7s', animationDelay: '3s' }}>
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-40">
          <defs>
            <radialGradient id="orb-gradient">
              <stop offset="0%" stopColor="hsl(270, 70%, 70%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(270, 70%, 50%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Glowing orbs */}
          <circle cx="320" cy="320" r="50" fill="url(#orb-gradient)" opacity="0.6" />
          <circle cx="280" cy="280" r="30" fill="url(#orb-gradient)" opacity="0.5" />
          <circle cx="340" cy="270" r="20" fill="url(#orb-gradient)" opacity="0.4" />
          {/* Small particles */}
          <circle cx="300" cy="320" r="4" fill="hsl(210, 80%, 70%)" opacity="0.7" />
          <circle cx="330" cy="290" r="3" fill="hsl(270, 70%, 65%)" opacity="0.6" />
          <circle cx="310" cy="260" r="5" fill="hsl(210, 80%, 65%)" opacity="0.5" />
        </svg>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb)/0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb)/0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      
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

        {/* Enhanced CTA button with glow effect */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" 
             style={{ animationDelay: '400ms' }}>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-10 py-7 relative overflow-hidden group transition-all duration-300 hover:scale-105"
            style={{ 
              boxShadow: '0 0 40px rgba(149, 83, 224, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span className="relative z-10 flex items-center">
              Get Started with Self Reflection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </span>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {/* Glow pulse effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
