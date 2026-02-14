import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-28 pt-36 md:pt-44 md:pb-36">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-200px] h-[800px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/8 blur-[150px]" />
        <div className="absolute right-[-200px] top-[200px] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute left-[-100px] bottom-[0px] h-[300px] w-[300px] rounded-full bg-success/5 blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            AI-Powered Trading Platform
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.div>

          {/* Headline */}
          <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">The Future of</span>
            <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Intelligent Trading
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
            Powered by advanced artificial intelligence that monitors global markets around the clock,
            delivering consistent returns through precision-driven automated strategies.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
              <Link to="/signup">
                Start Investing <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-xl px-10 text-base font-semibold border-border/60 hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300">
              <Link to="/signin">Sign In to Dashboard</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/60"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary/60" /> Bank-Grade Security
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary/60" /> Real-Time Execution
            </span>
            <span>12,400+ Active Investors</span>
            <span>$48M+ Distributed</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
