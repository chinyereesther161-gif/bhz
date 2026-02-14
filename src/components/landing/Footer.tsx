import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/20 bg-card/5 px-4 py-14">
    <div className="container mx-auto max-w-6xl">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground text-sm shadow-lg shadow-primary/20">C</div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Capvest</span>{" "}
              <span className="text-foreground/70">AI</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xs">
            Institutional-grade AI trading platform delivering consistent returns through automated strategies and advanced risk management.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">Platform</h4>
          <div className="flex flex-col gap-3">
            <a href="#features" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">Features</a>
            <a href="#plans" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">Investment Plans</a>
            <a href="#faq" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">Account</h4>
          <div className="flex flex-col gap-3">
            <Link to="/signup" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">Create Account</Link>
            <Link to="/signin" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border/10 pt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-xs text-muted-foreground/30">
          © {new Date().getFullYear()} Capvest AI. All rights reserved.
        </p>
        <p className="text-[10px] text-muted-foreground/20 max-w-md text-center md:text-right leading-relaxed">
          Trading involves significant risk. Past performance does not guarantee future results. Only invest capital you can afford to lose. This is not financial advice.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
