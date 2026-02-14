import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Clock, Shield, Zap } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Win Rate", value: "94.7%", sub: "Verified performance" },
  { icon: DollarSign, label: "Distributed", value: "$48M+", sub: "To our investors" },
  { icon: Users, label: "Active Traders", value: "12,400+", sub: "Global community" },
  { icon: Clock, label: "Uptime", value: "99.9%", sub: "Continuous trading" },
  { icon: Shield, label: "Insured", value: "100%", sub: "Capital protection" },
  { icon: Zap, label: "Execution", value: "<50ms", sub: "Lightning speed" },
];

const StatsGrid = () => (
  <section className="relative py-16 px-4">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-xl border border-border/40 bg-card/30 p-4 text-center backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/60"
          >
            <s.icon className="mx-auto mb-2 h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsGrid;
