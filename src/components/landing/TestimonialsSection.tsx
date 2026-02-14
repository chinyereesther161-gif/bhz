import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "James K.",
    role: "Gold Plan Investor",
    text: "I was skeptical at first, but after 3 months of consistent weekly returns, I'm fully convinced. The AI handles everything while I focus on my day job.",
    avatar: "JK",
  },
  {
    name: "Sarah M.",
    role: "Professional Plan",
    text: "The transparency is what sold me. I can see every trade the AI makes in real-time. The weekly payouts have been like clockwork — never missed one.",
    avatar: "SM",
  },
  {
    name: "David R.",
    role: "Platinum Investor",
    text: "After losing money with manual trading for years, switching to Capvest AI was a game-changer. The risk management alone is worth it.",
    avatar: "DR",
  },
];

const TestimonialsSection = () => (
  <section className="py-24 px-4">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Testimonials</p>
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Trusted by Thousands
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border/40 bg-card/20 p-6"
          >
            <div className="mb-4 flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
              ))}
            </div>
            <p className="mb-5 text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
