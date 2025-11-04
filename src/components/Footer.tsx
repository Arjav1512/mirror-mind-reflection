import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Mirror. Built for self reflection.
          </p>
          <div className="flex gap-6 text-sm">
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              Terms of Service
            </Link>
            <span className="text-border">|</span>
            <Link 
              to="/contact" 
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
