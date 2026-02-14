import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How does the AI trading engine work?",
    a: "Our proprietary AI uses deep learning neural networks, NLP sentiment analysis, and 200+ technical indicators to scan 500+ markets simultaneously. It identifies high-probability setups and executes trades with institutional-grade risk management, fully automated, 24/7, with no human intervention.",
  },
  {
    q: "What kind of returns can I expect?",
    a: "Returns vary by market conditions and investment tier. Our AI has maintained a 94.7% win rate with average weekly returns between 4-18% depending on the selected plan. Past performance doesn't guarantee future results, but our track record is transparently verifiable.",
  },
  {
    q: "How do deposits and withdrawals work?",
    a: "We support USDT (TRC20), Bitcoin, Ethereum, and Solana for both deposits and withdrawals. Deposits are verified within 24 hours. Withdrawals have a $50 minimum and are processed promptly to your designated wallet address.",
  },
  {
    q: "When are profits distributed?",
    a: "Earnings are calculated and distributed every Monday to your platform balance automatically. You can track real-time P&L on your dashboard and withdraw earnings at any time with no lock-up period.",
  },
  {
    q: "Is my capital secure?",
    a: "We employ 256-bit AES encryption, dynamic stop-losses, strict position limits, cross-asset hedging, and multi-layer portfolio diversification. Our platform maintains 99.9% uptime and your funds are protected at every level.",
  },
  {
    q: "Can I withdraw at any time?",
    a: "Absolutely. You have full control over your funds at all times. Submit a withdrawal request through your dashboard and it will be processed within 24 hours with a minimum of $50.",
  },
];

const FAQSection = () => (
  <section id="faq" className="py-28 px-4 section-glow">
    <div className="container mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <div className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
          <HelpCircle className="h-3 w-3" /> FAQ
        </div>
        <h2 className="text-3xl font-black sm:text-4xl">
          Common <span className="text-gradient-gold">Questions</span>
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <AccordionItem value={`faq-${i}`} className="rounded-xl border border-border/30 bg-card/15 px-6 hover:border-primary/15 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-card/30">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-5 [&[data-state=open]]:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground/80 leading-relaxed pb-5">
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
