import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James K.",
    role: "Gold Plan Investor",
    text: "After 6 months of consistent weekly returns, I can confidently say Capvest AI changed my financial trajectory. The AI handles everything while I focus on my career.",
    avatar: "JK",
    profit: "+$12,400",
  },
  {
    name: "Sarah M.",
    role: "Professional Plan",
    text: "What sold me was the transparency. Every trade visible in real-time. Weekly payouts have been like clockwork, never missed a single one in 8 months.",
    avatar: "SM",
    profit: "+$8,200",
  },
  {
    name: "David R.",
    role: "Platinum Investor",
    text: "I lost thousands with manual trading over the years. Switching to Capvest AI was a game-changer. The risk management alone is worth every dollar.",
    avatar: "DR",
    profit: "+$34,800",
  },
];

const TestimonialsSection = () => (
  <section className="py-28 px-4 section-glow">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          Testimonials
        </div>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem]">
          Trusted by <span className="text-gradient-gold">Thousands</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground/70">
          Real stories from real investors who have experienced the power of AI-driven trading.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl border border-border/30 bg-card/15 p-7 transition-all duration-500 hover:border-primary/15 hover:bg-card/30 overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
              <Quote className="h-16 w-16 text-primary" />
            </div>
            <div className="relative">
              <div className="mb-5 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-sm text-muted-foreground/80 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 text-xs font-black text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground/60">{t.role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-success">{t.profit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
