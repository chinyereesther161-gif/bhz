import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "How does the AI trading engine work?",
    a: "Our AI uses deep learning neural networks, sentiment analysis, and 200+ technical indicators to scan 500+ markets simultaneously. It identifies high-probability setups and executes trades with strict risk management — all fully automated, 24/7.",
  },
  {
    q: "What returns can I expect?",
    a: "Returns vary by market conditions and plan tier. Our AI has maintained a 94.7% win rate with average weekly returns between 4-18% depending on the investment tier. Past performance doesn't guarantee future results, but our track record speaks for itself.",
  },
  {
    q: "How do deposits and withdrawals work?",
    a: "We support USDT (TRC20), Bitcoin, Ethereum, and Solana for both deposits and withdrawals. Deposits are verified within 24 hours. Withdrawals have a $50 minimum and are processed promptly to your wallet.",
  },
  {
    q: "When are profits distributed?",
    a: "Earnings are calculated and distributed every Monday to your platform balance. You can track real-time P&L on your dashboard and withdraw earnings anytime.",
  },
  {
    q: "Is my investment secure?",
    a: "We employ 256-bit encryption, advanced risk protocols with dynamic stop-losses, position size limits, and portfolio diversification. Our platform has 99.9% uptime since launch.",
  },
  {
    q: "Can I withdraw at any time?",
    a: "Yes, you have full control over your funds. Submit a withdrawal request anytime through your dashboard. Requests are processed within 24 hours with a minimum of $50.",
  },
];

const FAQSection = () => (
  <section id="faq" className="py-24 px-4">
    <div className="container mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</p>
        <h2 className="text-3xl font-black sm:text-4xl">Common Questions</h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <AccordionItem value={`faq-${i}`} className="rounded-xl border border-border/40 bg-card/20 px-5">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
