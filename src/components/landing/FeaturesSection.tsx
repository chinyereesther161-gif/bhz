import { Brain, Bot, ShieldCheck, LineChart, Globe, Wallet, Cpu, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Neural Network Engine",
    description: "Proprietary deep learning models process millions of market signals per second — identifying patterns invisible to human analysis.",
    highlight: true,
  },
  {
    icon: Bot,
    title: "Fully Autonomous",
    description: "Zero manual intervention. AI handles entry, exit, sizing, hedging, and portfolio rebalancing around the clock.",
  },
  {
    icon: ShieldCheck,
    title: "Institutional Risk Control",
    description: "Dynamic stop-losses, portfolio-wide hedging, and position limits keep your capital protected in all conditions.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytics",
    description: "Live P&L tracking, per-trade breakdowns, and detailed performance metrics accessible from your dashboard.",
  },
  {
    icon: Globe,
    title: "500+ Global Markets",
    description: "Crypto, forex, commodities, and indices traded simultaneously across every major exchange worldwide.",
  },
  {
    icon: Wallet,
    title: "Weekly Distributions",
    description: "Profits calculated and distributed every Monday. Withdraw to your crypto wallet anytime — no lock-ups.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="relative py-28 px-4 section-glow">
    <div className="pointer-events-none absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-[200px]" />
    <div className="pointer-events-none absolute left-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-success/[0.02] blur-[150px]" />

    <div className="container relative mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 max-w-2xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          <Cpu className="h-3 w-3" /> Platform Capabilities
        </div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem] leading-tight">
          Institutional-Grade Intelligence,{" "}
          <span className="text-gradient-gold">Available to Everyone</span>
        </h2>
        <p className="mt-4 text-muted-foreground/80 leading-relaxed max-w-lg">
          The same AI technology used by hedge funds and prop desks — now accessible from a single dashboard.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`group relative rounded-2xl border p-8 transition-all duration-500 overflow-hidden ${
              f.highlight
                ? "border-primary/25 bg-gradient-to-b from-primary/[0.06] to-card/30"
                : "border-border/30 bg-card/15 hover:border-primary/15 hover:bg-card/35"
            }`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
            <div className="relative">
              <div className={`mb-5 inline-flex rounded-2xl p-3 transition-colors duration-300 ${
                f.highlight ? "bg-primary/15" : "bg-primary/[0.06] group-hover:bg-primary/[0.12]"
              }`}>
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-base font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
