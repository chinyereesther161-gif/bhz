import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/15 bg-card/5 px-4 py-12">
    <div className="container mx-auto max-w-5xl">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/80" />
              <span className="relative font-black text-primary-foreground text-xs">CV</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-black tracking-tight">CAPVEST</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-primary/70">AI Trading</span>
            </div>
          </Link>
          <p className="text-sm text-muted-foreground/50 leading-relaxed max-w-xs">
            Institutional-grade AI trading delivering consistent returns through automated strategies and risk management.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/35">Platform</h4>
          <div className="flex flex-col gap-2">
            <a href="#features" className="text-sm text-muted-foreground/50 hover:text-foreground transition-colors">Features</a>
            <a href="#plans" className="text-sm text-muted-foreground/50 hover:text-foreground transition-colors">Plans</a>
            <a href="#faq" className="text-sm text-muted-foreground/50 hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/35">Account</h4>
          <div className="flex flex-col gap-2">
            <Link to="/signup" className="text-sm text-muted-foreground/50 hover:text-foreground transition-colors">Create Account</Link>
            <Link to="/signin" className="text-sm text-muted-foreground/50 hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-border/10 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="text-[11px] text-muted-foreground/25">© {new Date().getFullYear()} Capvest AI. All rights reserved.</p>
        <p className="text-[9px] text-muted-foreground/20 max-w-md text-center md:text-right leading-relaxed">
          Trading involves significant risk. Past performance does not guarantee future results. Only invest capital you can afford to lose.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
