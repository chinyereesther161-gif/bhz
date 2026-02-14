import { Brain, Bot, ShieldCheck, BarChart3, Globe, Clock, Wallet, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Deep Learning Engine",
    description: "Neural networks process millions of data points per second, identifying micro-patterns invisible to human traders.",
  },
  {
    icon: Bot,
    title: "Fully Automated",
    description: "Set your plan and let AI handle everything — entries, exits, risk sizing, and rebalancing. No manual work required.",
  },
  {
    icon: ShieldCheck,
    title: "Advanced Risk Control",
    description: "Dynamic stop-losses, position limits, and portfolio hedging protect your capital in all market conditions.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytics",
    description: "Track every trade, monitor P&L, and view detailed performance metrics through your live dashboard.",
  },
  {
    icon: Globe,
    title: "500+ Markets",
    description: "Trade crypto, forex, and commodities simultaneously across global exchanges from one unified platform.",
  },
  {
    icon: Wallet,
    title: "Weekly Payouts",
    description: "Profits distributed every Monday. Withdraw anytime to your crypto wallet with fast processing.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="relative py-24 px-4">
    <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/3 blur-[180px]" />

    <div className="container relative mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 max-w-2xl"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Platform Features</p>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Institutional-Grade AI,<br />
          <span className="text-muted-foreground">Available to Everyone</span>
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl border border-border/40 bg-card/20 p-7 transition-all duration-300 hover:border-primary/20 hover:bg-card/50"
          >
            <div className="mb-4 inline-flex rounded-xl bg-primary/8 p-2.5 transition-colors group-hover:bg-primary/15">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-base font-bold">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
