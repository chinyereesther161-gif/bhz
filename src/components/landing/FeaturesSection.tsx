import { Brain, Bot, ShieldCheck, BarChart3, Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Market Analysis",
    description: "Neural networks process millions of data points in real-time, identifying high-probability trade opportunities across crypto and forex markets.",
  },
  {
    icon: Bot,
    title: "Automated Execution",
    description: "Set your investment plan and our AI handles everything — entry, exit, risk management, and position sizing, operating 24 hours a day.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    description: "Advanced algorithms protect your capital with dynamic stop-losses, portfolio diversification, and real-time risk assessment protocols.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Monitor your portfolio in real-time with comprehensive dashboards showing P&L, trade history, and projected returns.",
  },
  {
    icon: Globe,
    title: "Multi-Market Coverage",
    description: "Trade across 500+ instruments spanning cryptocurrency, forex, and commodity markets with a single integrated platform.",
  },
  {
    icon: Clock,
    title: "Weekly Distributions",
    description: "Receive your earnings every Monday directly to your account. Withdraw anytime with fast processing and full transparency.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 px-4">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/3 blur-[150px]" />

      <div className="container relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Platform Features</p>
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
            Built for Serious Investors
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Enterprise-grade technology that was once reserved for institutional traders, now available to everyone.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
