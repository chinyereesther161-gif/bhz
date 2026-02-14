import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:pt-40 md:pb-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[900px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/6 blur-[200px]" />
        <div className="absolute right-[-300px] top-[100px] h-[500px] w-[500px] rounded-full bg-primary/4 blur-[150px]" />
        <div className="absolute left-[-200px] bottom-[-100px] h-[400px] w-[400px] rounded-full bg-success/3 blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              AI Trading Engine v4.2 — Live Now
            </motion.div>

            <h1 className="mb-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Trade Smarter{" "}
              <br className="hidden sm:block" />
              with{" "}
              <span className="text-gradient-gold">Capvest AI</span>
            </h1>

            <p className="mb-8 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
              Our AI monitors global crypto & forex markets 24/7, executing precision trades with a verified 94.7% win rate.
              Start earning consistent weekly returns — no experience needed.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 gap-2 rounded-xl px-8 text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all">
                <Link to="/signup">
                  Start Trading Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-13 gap-2 rounded-xl px-8 text-sm font-semibold border-border/60 hover:bg-secondary/50">
                <Link to="/signin">
                  <Play className="h-4 w-4" /> View Dashboard
                </Link>
              </Button>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary/50" /> 256-bit Encryption
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary/50" /> Instant Execution
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-success/50" /> 94.7% Win Rate
              </span>
            </div>
          </motion.div>

          {/* Right — live stats card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass-card glow-border rounded-2xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                  <span className="text-xs font-semibold text-success">LIVE TRADING</span>
                </div>
                <span className="text-xs text-muted-foreground">Updated just now</span>
              </div>

              {/* Mini chart visual */}
              <div className="relative h-40 overflow-hidden rounded-xl bg-secondary/30">
                <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(45 100% 51%)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(45 100% 51%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,120 Q50,100 80,90 T160,70 T240,85 T320,40 T400,50" fill="none" stroke="hsl(45 100% 51%)" strokeWidth="2" />
                  <path d="M0,120 Q50,100 80,90 T160,70 T240,85 T320,40 T400,50 V160 H0 Z" fill="url(#chartGrad)" />
                </svg>
                <div className="absolute bottom-3 left-3">
                  <p className="text-2xl font-bold text-foreground">$97,842.50</p>
                  <p className="text-xs text-success font-medium">+2.34% today</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Distributed", value: "$48M+", color: "text-primary" },
                  { label: "Active Traders", value: "12,400+", color: "text-foreground" },
                  { label: "Avg. Weekly", value: "8-15%", color: "text-success" },
                ].map(s => (
                  <div key={s.label} className="rounded-lg bg-secondary/40 p-3 text-center">
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent trades */}
              <div className="space-y-2">
                {[
                  { pair: "BTC/USD", type: "Long", profit: "+2.4%", time: "2m ago" },
                  { pair: "ETH/USD", type: "Short", profit: "+1.8%", time: "5m ago" },
                  { pair: "SOL/USD", type: "Long", profit: "+3.1%", time: "8m ago" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/20 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{t.pair}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${t.type === "Long" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-success font-semibold">{t.profit}</span>
                      <span className="text-muted-foreground/50">{t.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
