import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const withCapvest = [
  "AI-powered 24/7 trading",
  "94.7% win rate on verified trades",
  "Weekly passive income 8-15%",
  "Real-time portfolio monitoring",
  "Diversified crypto & forex strategies",
];

const withoutCapvest = [
  "Manual trading requires hours daily",
  "Emotional decisions cause losses",
  "Inconsistent and unpredictable returns",
  "No AI-driven market analysis",
  "High risk without diversification",
];

const ComparisonSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
          The <span className="text-primary">Capvest</span> Advantage
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-primary/40 bg-primary/5 p-8"
          >
            <h3 className="mb-6 text-xl font-bold text-primary">With Capvest AI</h3>
            <ul className="space-y-4">
              {withCapvest.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 text-xl font-bold text-muted-foreground">Without Capvest AI</h3>
            <ul className="space-y-4">
              {withoutCapvest.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{item}</span>
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
