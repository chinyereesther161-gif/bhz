import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp, Play, Lock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const liveTrades = [
  { pair: "BTC/USD", type: "Long", entry: "97,842", profit: "+2.4%", time: "2m ago" },
  { pair: "ETH/USD", type: "Short", entry: "3,415", profit: "+1.8%", time: "4m ago" },
  { pair: "SOL/USD", type: "Long", entry: "187.50", profit: "+3.1%", time: "6m ago" },
  { pair: "XRP/USD", type: "Long", entry: "2.34", profit: "+1.2%", time: "9m ago" },
  { pair: "GOLD", type: "Long", entry: "2,648", profit: "+0.8%", time: "11m ago" },
];

const CountUp = ({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

const HeroSection = () => {
  const [activeTradeIndex, setActiveTradeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTradeIndex(prev => (prev + 1) % liveTrades.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-28 md:pt-36 lg:pt-44 md:pb-36">
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-400px] h-[1000px] w-[1400px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[250px]" />
        <div className="absolute right-[-200px] top-[200px] h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-[200px]" />
        <div className="absolute left-[-200px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-success/[0.03] blur-[180px]" />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] top-[15%] h-3 w-3 rounded-full bg-primary/30 blur-[2px]"
      />
      <motion.div
        animate={{ y: [10, -15, 10], x: [5, -5, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[15%] top-[60%] h-2 w-2 rounded-full bg-success/30 blur-[1px]"
      />

      <div className="container relative mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.06] px-5 py-2 text-xs font-semibold text-primary backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              AI Engine v4.2 — Processing 847 trades/day
            </motion.div>

            <h1 className="mb-7 text-[2.75rem] font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]">
              Trade Smarter{" "}
              <br />
              with{" "}
              <span className="text-gradient-gold">Capvest AI</span>
            </h1>

            <p className="mb-10 max-w-lg text-base text-muted-foreground/90 leading-relaxed sm:text-lg">
              Our institutional-grade AI monitors global crypto, forex & commodities 24/7 — executing precision trades with a verified{" "}
              <span className="font-semibold text-success">94.7% win rate</span>. 
              Start earning consistent weekly returns today.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-sm font-bold shadow-[0_8px_32px_hsl(43_100%_50%/0.25)] hover:shadow-[0_12px_48px_hsl(43_100%_50%/0.35)] transition-all duration-300 hover:scale-[1.02]">
                <Link to="/signup">
                  Start Trading Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-sm font-semibold border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300">
                <Link to="/signin">
                  <Play className="h-4 w-4" /> View Dashboard
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { icon: Lock, text: "Bank-Grade Security", color: "text-primary/60" },
                { icon: Zap, text: "<50ms Execution", color: "text-primary/60" },
                { icon: TrendingUp, text: "94.7% Win Rate", color: "text-success/60" },
              ].map(item => (
                <span key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground/60 font-medium">
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                  {item.text}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — Live trading terminal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="glass-card glow-border rounded-2xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-border/30 px-6 py-3.5 bg-card/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground ml-1">Capvest Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
                  <span className="text-[10px] font-semibold text-success">LIVE</span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Chart */}
                <div className="relative h-44 overflow-hidden rounded-xl bg-secondary/20 border border-border/20">
                  <svg viewBox="0 0 500 180" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="heroChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(43 100% 50%)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="hsl(43 100% 50%)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,140 C30,135 60,125 90,110 C120,95 140,105 170,85 C200,65 220,75 250,60 C280,45 310,55 340,35 C370,20 400,30 430,25 C460,20 480,15 500,18" fill="none" stroke="hsl(43 100% 50%)" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M0,140 C30,135 60,125 90,110 C120,95 140,105 170,85 C200,65 220,75 250,60 C280,45 310,55 340,35 C370,20 400,30 430,25 C460,20 480,15 500,18 V180 H0 Z" fill="url(#heroChart)" />
                  </svg>
                  <div className="absolute top-4 left-4">
                    <p className="text-[10px] text-muted-foreground/60 font-medium">PORTFOLIO VALUE</p>
                    <p className="text-2xl font-black">$<CountUp target={97842} /></p>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-success/10 border border-success/20 px-2.5 py-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs font-bold text-success">+2.34%</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Distributed", value: "$48M+", color: "text-primary" },
                    { label: "Active Traders", value: "12,400+", color: "text-foreground" },
                    { label: "Avg. Weekly", value: "8-15%", color: "text-success" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-secondary/30 border border-border/20 p-3.5 text-center">
                      <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Live trades */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Recent Trades</span>
                    <span className="text-[10px] text-muted-foreground/30">Auto-executed by AI</span>
                  </div>
                  {liveTrades.slice(0, 4).map((t, i) => (
                    <motion.div
                      key={t.pair}
                      initial={false}
                      animate={{ opacity: i === activeTradeIndex ? 1 : 0.6, scale: i === activeTradeIndex ? 1.01 : 1 }}
                      className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs transition-all ${i === activeTradeIndex ? "bg-primary/[0.06] border border-primary/15" : "bg-secondary/15 border border-transparent"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">{t.pair}</span>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${t.type === "Long" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{t.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-success font-bold">{t.profit}</span>
                        <span className="text-muted-foreground/30 text-[10px]">{t.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
