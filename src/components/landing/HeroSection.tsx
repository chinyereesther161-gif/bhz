import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp, Lock, BarChart3, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketData, formatPrice } from "@/hooks/useMarketData";

const HeroSection = () => {
  const { data } = useMarketData(5);

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-24 md:pt-32 lg:pt-40 md:pb-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[200px]" />
        <div className="absolute right-[-100px] top-[100px] h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[180px]" />
        <div className="absolute left-[-100px] bottom-[0px] h-[400px] w-[400px] rounded-full bg-success/[0.03] blur-[150px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-30" />

      <div className="container relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/[0.08] px-4 py-1.5 text-[11px] font-semibold text-success"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              AI Engine Active · Monitoring 500+ Markets Live
            </motion.div>

            <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Trade Smarter{" "}
              <br className="hidden sm:block" />
              with{" "}
              <span className="text-gradient-gold">Capvest AI</span>
            </h1>

            <p className="mx-auto mb-8 max-w-lg text-base text-muted-foreground/80 leading-relaxed lg:mx-0 sm:text-lg">
              Our institutional-grade AI monitors global crypto, forex and commodities 24/7, executing precision trades with a verified{" "}
              <span className="font-semibold text-success">94.7% win rate</span>. 
              Start earning consistent weekly returns today.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-sm font-bold shadow-[0_8px_32px_hsl(43_100%_50%/0.3)] hover:shadow-[0_14px_48px_hsl(43_100%_50%/0.4)] hover:scale-[1.02] transition-all duration-300">
                <Link to="/signup">
                  Start Trading Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-sm font-bold border-primary/20 bg-primary/[0.06] text-primary hover:bg-primary/[0.12] hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm">
                <Link to="/signin">
                  <BarChart3 className="h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              {[
                { icon: Lock, text: "Bank-Grade Security" },
                { icon: Zap, text: "<50ms Execution" },
                { icon: Users, text: "12,400+ Active Users" },
              ].map(item => (
                <span key={item.text} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 font-medium">
                  <item.icon className="h-3.5 w-3.5 text-primary/50" />
                  {item.text}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right - Live trading terminal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="glass-card glow-border rounded-2xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-border/20 px-5 py-3 bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground/50 ml-1">Capvest AI Trading</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
                  <span className="text-[10px] font-bold text-success">LIVE</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
              {/* AI Trading Status */}
                <div className="relative h-36 overflow-hidden rounded-xl bg-secondary/20 border border-border/15 flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
                    <span className="text-sm font-bold text-success">AI Engine Active</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 text-center px-6">Monitoring 500+ markets across crypto, forex & commodities in real-time</p>
                  <div className="flex items-center gap-1 rounded-lg bg-success/10 border border-success/20 px-2.5 py-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-[11px] font-bold text-success">94.7% Win Rate</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Total Distributed", value: "$48M+", color: "text-primary" },
                    { label: "Win Rate", value: "94.7%", color: "text-success" },
                    { label: "Avg. Weekly", value: "8-15%", color: "text-foreground" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-secondary/25 border border-border/15 p-3 text-center">
                      <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-muted-foreground/40 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Live market prices */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">Live Markets</span>
                    <span className="text-[9px] text-muted-foreground/25">Real-time data</span>
                  </div>
                  <div className="space-y-1.5">
                    {data.slice(0, 4).map(coin => (
                      <div key={coin.id} className="flex items-center justify-between rounded-xl bg-secondary/15 border border-border/10 px-4 py-2.5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-foreground uppercase">{coin.symbol}/USD</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-foreground/80">${formatPrice(coin.current_price)}</span>
                          <span className={`font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"}`}>
                            {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}{(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
