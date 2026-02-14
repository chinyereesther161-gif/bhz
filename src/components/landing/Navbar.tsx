import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-black tracking-tight">
          <span className="text-primary">Capvest</span> AI
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="rounded-lg font-bold shadow-md shadow-primary/10">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
