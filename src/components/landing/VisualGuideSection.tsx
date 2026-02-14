import { motion } from "framer-motion";
import { UserPlus, Wallet, BarChart3, TrendingUp, ArrowDown, DollarSign, Shield, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Your Account",
    subtitle: "30 seconds to get started",
    details: [
      "Enter your name and email",
      "Set a secure password",
      "Receive $10 welcome bonus instantly",
      "No documents required",
    ],
    visual: "signup",
  },
  {
    step: 2,
    icon: Wallet,
    title: "Deposit Funds",
    subtitle: "Multiple crypto options",
    details: [
      "Select your preferred cryptocurrency",
      "Copy the unique deposit wallet address",
      "Send crypto from your external wallet",
      "Funds appear once confirmed on-chain",
    ],
    visual: "deposit",
  },
  {
    step: 3,
    icon: BarChart3,
    title: "Choose an Investment Plan",
    subtitle: "10 tiers from $50 to $50,000",
    details: [
      "Browse all available plans & estimated earnings",
      "Click 'Invest' on your chosen tier",
      "Confirm the investment from your balance",
      "AI engine starts trading for you immediately",
    ],
    visual: "invest",
  },
  {
    step: 4,
    icon: TrendingUp,
    title: "Earn Weekly Profits",
    subtitle: "Automated payouts every Monday",
    details: [
      "AI trades 500+ markets 24/7 on your behalf",
      "Track performance on your live dashboard",
      "Profits deposited to your balance each week",
      "Withdraw anytime — no lock-up period",
    ],
    visual: "earn",
  },
];

const visualIcons: Record<string, { icon: typeof UserPlus; accent: string }> = {
  signup: { icon: Shield, accent: "from-primary/20 to-primary/5" },
  deposit: { icon: DollarSign, accent: "from-success/20 to-success/5" },
  invest: { icon: BarChart3, accent: "from-primary/20 to-primary/5" },
  earn: { icon: CheckCircle2, accent: "from-success/20 to-success/5" },
};

const VisualGuideSection = () => (
  <section className="relative py-28 px-4 section-glow">
    <div className="pointer-events-none absolute right-0 top-1/4 h-[600px] w-[400px] rounded-full bg-primary/[0.03] blur-[180px]" />

    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          Step-by-Step Guide
        </div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem]">
          How to <span className="text-gradient-gold">Start Earning</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
          Follow these simple steps to deposit, invest, and start receiving weekly profits from our AI trading engine.
        </p>
      </motion.div>

      <div className="space-y-6">
        {steps.map((s, i) => {
          const vis = visualIcons[s.visual];
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="rounded-2xl border border-border/30 bg-card/25 p-6 sm:p-8 transition-all duration-500 hover:border-primary/20 hover:bg-card/40 overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Left: step number + icon */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-3 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-lg shadow-primary/25">
                      {s.step}
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b ${vis.accent}`}>
                      <vis.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                    <p className="text-xs text-primary font-semibold mb-4">{s.subtitle}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {s.details.map((d, j) => (
                        <div key={j} className="flex items-start gap-2.5 rounded-xl bg-background/50 border border-border/20 p-3">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {j + 1}
                          </div>
                          <span className="text-xs text-muted-foreground leading-relaxed">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-5 w-5 text-primary/30" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default VisualGuideSection;
