import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import Footer from "@/components/Footer";

const ContactUs = () => {
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
            Contact Us
          </h1>

          <div className="space-y-8">
            <section className="p-8 rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                    Get in Touch
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We'd love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out.
                  </p>
                  <a 
                    href="mailto:arjav.jain1512@icloud.com"
                    className="inline-flex items-center text-primary hover:underline text-lg font-medium"
                  >
                    arjav.jain1512@icloud.com
                  </a>
                </div>
              </div>
            </section>

            <section className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Support Hours
                </h3>
                <p>
                  We typically respond to inquiries within 24-48 hours during business days.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  What We Can Help With
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Technical issues or bugs</li>
                  <li>Account and billing questions</li>
                  <li>Feature requests and suggestions</li>
                  <li>General feedback about Mirror</li>
                  <li>Privacy and data concerns</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm">
                  <strong className="text-foreground">Note:</strong> Mirror is a self-awareness journaling tool and not a mental health service. If you are experiencing a mental health crisis, please contact a professional therapist or call your local emergency services.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
