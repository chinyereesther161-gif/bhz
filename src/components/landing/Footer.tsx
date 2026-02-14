import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/20 px-4 py-12">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link to="/" className="text-2xl font-extrabold">
            <span className="text-primary">Capvest</span> AI
          </Link>
          <p className="max-w-md text-sm text-muted-foreground">
            AI-powered trading platform delivering consistent returns through advanced market analysis and automated execution.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/signup" className="hover:text-primary transition-colors">Get Started</Link>
            <Link to="/signin" className="hover:text-primary transition-colors">Sign In</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Capvest AI. All rights reserved. Trading involves risk.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
