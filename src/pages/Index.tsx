import { useState } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SignupForm from "@/components/SignupForm";
import OnboardingForm from "@/components/OnboardingForm";
import Footer from "@/components/Footer";

const Index = () => {
  const [step, setStep] = useState<"signup" | "onboarding">("signup");

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      
      <section id="signup" className="py-24 px-6 gradient-subtle">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {step === "signup" ? "Start Your Journey" : "Almost There"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {step === "signup" 
                ? "Create your account to begin your self-awareness journey with Mirror."
                : "Help us personalize your experience by sharing a bit about yourself."
              }
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft border border-border animate-fade-in">
            {step === "signup" ? (
              <SignupForm onSuccess={() => setStep("onboarding")} />
            ) : (
              <OnboardingForm />
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
