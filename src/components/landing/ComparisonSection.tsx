import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const withAI = [
  "AI executes trades 24/7 with zero emotion",
  "94.7% verified win rate across all strategies",
  "Consistent weekly passive income distributions",
  "Institutional-grade risk management protocols",
  "500+ markets monitored simultaneously",
  "Real-time portfolio analytics & reporting",
];

const without = [
  "Hours of manual analysis & screen time",
  "Emotional decisions cause catastrophic losses",
  "Inconsistent, unpredictable returns",
  "No systematic risk management framework",
  "Limited to tracking a few markets at once",
  "Poor visibility into true performance metrics",
];

const ComparisonSection = () => (
  <section className="relative py-28 px-4 section-glow">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.025] blur-[200px]" />

    <div className="container relative mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          <Sparkles className="h-3 w-3" /> The Difference
        </div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem]">
          The <span className="text-gradient-gold">Intelligent Advantage</span>
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-primary/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] to-transparent" />
          <div className="relative p-8">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary">
              <Check className="h-3 w-3" /> WITH CAPVEST AI
            </div>
            <ul className="space-y-4">
              {withAI.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 border border-success/20">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/20 bg-card/10 p-8"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-secondary/80 border border-border/30 px-4 py-1.5 text-xs font-bold text-muted-foreground">
            <X className="h-3 w-3" /> MANUAL TRADING
          </div>
          <ul className="space-y-4">
            {without.map(item => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground/70">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 border border-destructive/15">
                  <X className="h-3 w-3 text-destructive/50" />
                </div>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
