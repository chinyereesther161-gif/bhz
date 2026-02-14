import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const withCapvest = [
  "AI-powered 24/7 market analysis and execution",
  "Verified 94.7% win rate across all strategies",
  "Consistent weekly passive income distribution",
  "Institutional-grade risk management protocols",
  "Multi-market diversification across 500+ assets",
  "Real-time portfolio monitoring and transparency",
];

const withoutCapvest = [
  "Manual trading consuming hours of daily effort",
  "Emotional decisions leading to significant losses",
  "Inconsistent and unpredictable trading results",
  "No systematic risk management framework",
  "Limited market coverage and opportunity loss",
  "Lack of visibility into portfolio performance",
];

const ComparisonSection = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-success/3 blur-[120px]" />

      <div className="container relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Why Capvest</p>
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
            The Intelligent Advantage
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/8 to-primary/2 p-8"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-primary/5" />
            <h3 className="mb-8 text-xl font-bold text-primary">With Capvest AI</h3>
            <ul className="space-y-5">
              {withCapvest.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/40 bg-card/30 p-8"
          >
            <h3 className="mb-8 text-xl font-bold text-muted-foreground">Traditional Trading</h3>
            <ul className="space-y-5">
              {withoutCapvest.map(item => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <X className="h-3 w-3 text-destructive/70" />
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
};

export default ComparisonSection;
