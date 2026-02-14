import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  { name: "Micro", highlight: false },
  { name: "Starter", highlight: false },
  { name: "Basic", highlight: false },
  { name: "Standard", highlight: true },
  { name: "Professional", highlight: false },
  { name: "Gold", highlight: false },
  { name: "Platinum", highlight: false },
];

const benefits = [
  "AI-powered automated trading",
  "Weekly profit distributions",
  "Real-time dashboard access",
  "24/7 market monitoring",
  "Risk management built-in",
  "Withdraw anytime",
];

const PackagesPreview = () => (
  <section id="plans" className="relative py-24 px-4">
    <div className="pointer-events-none absolute left-1/2 bottom-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/4 blur-[150px]" />

    <div className="container relative mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Investment Plans</p>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Choose Your Path
        </h2>
        <p className="mx-auto mt-4 mb-10 max-w-xl text-muted-foreground">
          7 carefully designed tiers for every level of investor. All plans include full AI trading access, 
          weekly payouts, and real-time portfolio monitoring.
        </p>

        {/* Tier pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tiers.map((t, i) => (
            <motion.span
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                t.highlight
                  ? "border border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/10"
                  : "border border-border/40 bg-card/30 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              {t.name}
            </motion.span>
          ))}
        </div>

        {/* Benefits grid */}
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 mb-10 text-left">
          {benefits.map(b => (
            <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-success shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <Button asChild size="lg" className="h-13 gap-2 rounded-xl px-10 text-sm font-bold shadow-lg shadow-primary/25">
          <Link to="/signup">
            View All Plans <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default PackagesPreview;
