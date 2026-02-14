import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/20 px-4 py-16">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-8 text-center">
          <Link to="/" className="text-2xl font-black">
            <span className="text-primary">Capvest</span> AI
          </Link>

          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Next-generation AI trading platform delivering consistent returns through
            institutional-grade automated strategies and risk management.
          </p>

          <div className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/30 px-4 py-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary/60" />
            Bank-Grade Security • 256-bit Encryption
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <Link to="/signup" className="hover:text-primary transition-colors">Get Started</Link>
            <Link to="/signin" className="hover:text-primary transition-colors">Sign In</Link>
          </div>

          <div className="h-px w-full max-w-xs bg-border/30" />

          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Capvest AI. All rights reserved. Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
