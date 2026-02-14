import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const withAI = [
  "AI executes trades 24/7 with zero emotion",
  "94.7% verified win rate across strategies",
  "Consistent weekly passive income",
  "Institutional risk management protocols",
  "500+ markets monitored simultaneously",
  "Real-time portfolio analytics",
];

const without = [
  "Hours of screen time and manual analysis",
  "Emotional decisions cause major losses",
  "Inconsistent, unpredictable results",
  "No systematic risk framework",
  "Limited to a few markets at once",
  "Poor visibility into true performance",
];

const ComparisonSection = () => (
  <section className="relative py-24 px-4">
    <div className="container relative mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Why Capvest AI</p>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          The Intelligent Advantage
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/6 to-transparent p-8"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Check className="h-3 w-3" /> WITH CAPVEST AI
          </div>
          <ul className="space-y-4">
            {withAI.map(item => (
              <li key={item} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/30 bg-card/20 p-8"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
            <X className="h-3 w-3" /> MANUAL TRADING
          </div>
          <ul className="space-y-4">
            {without.map(item => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-3 w-3 text-destructive/60" />
                </div>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ComparisonSection;
