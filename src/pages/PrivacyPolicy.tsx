import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Information We Collect
              </h2>
              <p>
                Mirror collects information you provide when creating an account and writing journal entries. This includes your email address, profile information, and journal content. We use this data solely to provide and improve our AI-powered self-awareness features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How We Use Your Data
              </h2>
              <p>
                Your journal entries are analyzed by our AI to identify emotional patterns and cognitive biases. This analysis helps you develop self-awareness. Your data is never sold to third parties or used for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your personal information. Your journal entries are encrypted and stored securely. Only you have access to your journal content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Your Rights
              </h2>
              <p>
                You have the right to access, modify, or delete your personal data at any time. You can export your journal entries or permanently delete your account from your dashboard settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:mirror2025@gmail.com" className="text-primary hover:underline">
                  mirror2025@gmail.com
                </a>
              </p>
            </section>

            <p className="text-sm mt-8">
              Last updated: November 2025
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
