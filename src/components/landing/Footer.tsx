import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/10 px-4 py-12">
    <div className="container mx-auto max-w-6xl">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground text-xs">C</div>
            <span className="text-lg font-bold"><span className="text-primary">Capvest</span> AI</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            AI-powered trading platform delivering consistent returns through automated strategies and institutional-grade risk management.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform</h4>
          <div className="flex flex-col gap-2">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investment Plans</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Account</h4>
          <div className="flex flex-col gap-2">
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Account</Link>
            <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-border/20 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Capvest AI. All rights reserved.
        </p>
        <p className="text-[10px] text-muted-foreground/30 max-w-md text-center md:text-right">
          Trading involves risk. Past performance does not guarantee future results. Only invest what you can afford to lose.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
