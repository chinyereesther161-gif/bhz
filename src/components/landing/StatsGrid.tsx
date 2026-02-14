import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Clock, Shield, Zap } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Win Rate", value: "94.7%", sub: "Verified" },
  { icon: DollarSign, label: "Distributed", value: "$48M+", sub: "To investors" },
  { icon: Users, label: "Traders", value: "12,400+", sub: "Worldwide" },
  { icon: Clock, label: "Uptime", value: "99.9%", sub: "Since launch" },
  { icon: Shield, label: "Protected", value: "100%", sub: "Capital safety" },
  { icon: Zap, label: "Speed", value: "<50ms", sub: "Execution" },
];

const StatsGrid = () => (
  <section className="relative py-16 px-4 section-glow">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="group relative rounded-2xl border border-border/30 bg-card/20 p-5 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/25 hover:bg-card/50 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.04] to-transparent" />
            <div className="relative">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] group-hover:bg-primary/[0.15] transition-colors duration-300">
                <s.icon className="h-4.5 w-4.5 text-primary/80 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xl font-black tracking-tight">{s.value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground/60 mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsGrid;
