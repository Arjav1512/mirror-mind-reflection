import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const TermsOfService = () => {
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
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using Mirror, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Use of Service
              </h2>
              <p>
                Mirror is a personal journaling and self-awareness tool. You agree to use the service for lawful purposes only. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                User Content
              </h2>
              <p>
                You retain ownership of all journal entries and content you create. By using Mirror, you grant us permission to process your content with AI to provide insights and analysis features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Limitations
              </h2>
              <p>
                Mirror is not a substitute for professional mental health services. The AI-generated insights are for self-reflection purposes only and should not be considered medical or therapeutic advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Service Modifications
              </h2>
              <p>
                We reserve the right to modify or discontinue the service at any time. We will provide reasonable notice of any significant changes to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Information
              </h2>
              <p>
                For questions about these Terms of Service, contact us at{" "}
                <a href="mailto:arjav.jain1512@icloud.com" className="text-primary hover:underline">
                  arjav.jain1512@icloud.com
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

export default TermsOfService;
