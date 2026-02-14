import { motion } from "framer-motion";
import { UserPlus, Wallet, Brain, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Sign up in seconds. Verified and ready instantly, no documents, no waiting.", color: "from-primary/20 to-primary/5" },
  { icon: Wallet, title: "Fund Your Account", desc: "Deposit via USDT, BTC, ETH, or SOL. Select the investment tier that fits your goals.", color: "from-success/20 to-success/5" },
  { icon: Brain, title: "AI Trades 24/7", desc: "Our neural engine scans 500+ markets, executing high-probability trades automatically.", color: "from-primary/20 to-primary/5" },
  { icon: TrendingUp, title: "Earn Weekly", desc: "Profits distributed every Monday. Withdraw to your wallet anytime with no lock-up.", color: "from-success/20 to-success/5" },
];

const HowItWorksSection = () => (
  <section id="how" className="relative py-28 px-4 section-glow">
    <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[200px]" />

    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          Getting Started
        </div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem]">
          Start Earning in <span className="text-gradient-gold">4 Simple Steps</span>
        </h2>
      </motion.div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden lg:block" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group relative"
            >
              <div className="rounded-2xl border border-border/30 bg-card/20 p-7 text-center transition-all duration-500 hover:border-primary/20 hover:bg-card/40 overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to bottom, hsl(43 100% 50% / 0.03), transparent)` }} />
                
                <div className="relative">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <div className={`mx-auto mt-4 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b ${s.color}`}>
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold">{s.title}</h3>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
