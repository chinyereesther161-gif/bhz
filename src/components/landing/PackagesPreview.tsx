import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  { name: "Micro", desc: "Start small" },
  { name: "Starter", desc: "Begin investing" },
  { name: "Basic", desc: "Steady growth" },
  { name: "Standard", desc: "Most popular", highlight: true },
  { name: "Professional", desc: "Serious traders" },
  { name: "Gold", desc: "Premium access" },
  { name: "Platinum", desc: "Maximum returns" },
  { name: "Diamond", desc: "High-net-worth" },
  { name: "Elite", desc: "Exclusive tier" },
  { name: "Institutional", desc: "Top-tier access", highlight: true },
];

const benefits = [
  { icon: TrendingUp, text: "AI-powered automated trading" },
  { icon: Shield, text: "Capital protection & risk controls" },
  { icon: Zap, text: "Weekly profit distributions" },
  { icon: BarChart3, text: "Real-time analytics dashboard" },
];

const PackagesPreview = () => (
  <section id="plans" className="relative py-28 px-4 section-glow">
    <div className="pointer-events-none absolute left-1/2 bottom-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[200px]" />

    <div className="container relative mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          Investment Plans
        </div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem]">
          Choose Your <span className="text-gradient-gold">Investment Tier</span>
        </h2>
        <p className="mx-auto mt-4 mb-12 max-w-xl text-muted-foreground leading-relaxed">
          10 professionally crafted tiers for every investor — from beginners to institutions. 
          All plans include the same institutional AI engine.
        </p>

        {/* Tier pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-xl px-5 py-3 text-center transition-all duration-300 ${
                t.highlight
                  ? "border border-primary/30 bg-primary/[0.1] shadow-lg shadow-primary/10"
                  : "border border-border/40 bg-card/30 hover:border-primary/20 hover:bg-card/50"
              }`}
            >
              <p className={`text-sm font-bold ${t.highlight ? "text-primary" : "text-foreground"}`}>{t.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 mb-12">
          {benefits.map(b => (
            <div key={b.text} className="flex items-center gap-3 text-left rounded-xl bg-card/30 border border-border/30 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <b.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{b.text}</span>
            </div>
          ))}
        </div>

        <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-12 text-sm font-bold shadow-[0_8px_32px_hsl(43_100%_50%/0.2)] hover:shadow-[0_12px_48px_hsl(43_100%_50%/0.3)] transition-all duration-300 hover:scale-[1.02]">
          <Link to="/signup">
            View All Plans & Invest <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default PackagesPreview;
