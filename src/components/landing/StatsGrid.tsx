import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Win Rate", value: "94.7%", description: "Verified across all trades" },
  { icon: DollarSign, label: "Total Distributed", value: "$48M+", description: "Earnings to investors" },
  { icon: Users, label: "Active Investors", value: "12,400+", description: "Worldwide community" },
  { icon: Award, label: "Platform Uptime", value: "99.9%", description: "Continuous operation" },
];

const StatsGrid = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-foreground/80">{stat.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
