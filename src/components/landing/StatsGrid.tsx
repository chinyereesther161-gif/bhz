import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Clock, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { icon: TrendingUp, label: "Win Rate", value: 94.7, suffix: "%", decimals: 1 },
  { icon: DollarSign, label: "Distributed", value: 48, suffix: "M+", prefix: "$", decimals: 0 },
  { icon: Users, label: "Active Traders", value: 12400, suffix: "+", decimals: 0 },
  { icon: Clock, label: "Uptime", value: 99.9, suffix: "%", decimals: 1 },
  { icon: Shield, label: "Capital Protected", value: 100, suffix: "%", decimals: 0 },
  { icon: Zap, label: "Execution Speed", value: 50, suffix: "ms", prefix: "<", decimals: 0 },
];

const CountUp = ({ target, suffix = "", prefix = "", decimals = 0 }: { target: number; suffix?: string; prefix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, started]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
    </motion.span>
  );
};

const StatsGrid = () => (
  <section className="relative py-16 px-4">
    <div className="container mx-auto max-w-5xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group rounded-2xl border border-border/20 bg-card/20 p-4 text-center transition-all duration-500 hover:border-primary/20 hover:bg-card/40"
          >
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/[0.08] group-hover:bg-primary/[0.15] transition-colors">
              <s.icon className="h-4 w-4 text-primary/80" />
            </div>
            <p className="text-lg font-black tracking-tight">
              <CountUp target={s.value} suffix={s.suffix} prefix={s.prefix} decimals={s.decimals} />
            </p>
            <p className="text-[9px] font-semibold text-muted-foreground/50 mt-0.5 uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsGrid;
