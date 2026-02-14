import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Plans", href: "#plans" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full transition-all duration-700 ${scrolled ? "border-b border-border/30 bg-background/85 backdrop-blur-2xl shadow-2xl shadow-background/80" : "bg-transparent"}`}>
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground text-sm shadow-lg shadow-primary/20">
              C
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Capvest</span>{" "}
              <span className="text-foreground/70">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-[13px] font-medium text-muted-foreground/70 transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground/70 hover:text-foreground font-medium h-9 px-4">
              <Link to="/signin">Log In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl font-bold px-6 h-9 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border/20 bg-background/98 backdrop-blur-2xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground/70 hover:text-foreground py-2">
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/20">
                <Button asChild variant="outline" className="w-full border-border/30">
                  <Link to="/signin" onClick={() => setMobileOpen(false)}>Log In</Link>
                </Button>
                <Button asChild className="w-full font-bold shadow-lg shadow-primary/20">
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
