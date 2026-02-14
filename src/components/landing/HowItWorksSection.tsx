import { motion } from "framer-motion";
import { UserPlus, Wallet, Brain, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Sign up in under 60 seconds with just your email. Instant access to your dashboard." },
  { icon: Wallet, title: "Fund & Choose Plan", desc: "Deposit via crypto, select an investment tier that matches your goals." },
  { icon: Brain, title: "AI Trades For You", desc: "Our engine scans 500+ markets, executing high-probability trades 24/7." },
  { icon: TrendingUp, title: "Earn Weekly", desc: "Profits distributed every Monday. Withdraw to your wallet anytime." },
];

const HowItWorksSection = () => (
  <section className="relative py-24 px-4">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">How It Works</p>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          4 Steps to Start Earning
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl border border-border/40 bg-card/20 p-6 text-center"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div className="mx-auto mt-2 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-sm font-bold">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
