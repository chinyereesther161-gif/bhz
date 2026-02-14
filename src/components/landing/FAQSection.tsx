import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "How does the AI trading system work?",
    a: "Our proprietary AI uses deep learning, natural language processing, and technical analysis to scan 500+ markets simultaneously. It identifies high-probability trade setups and executes them automatically with strict risk management rules — all operating 24/7 without human intervention.",
  },
  {
    q: "What is the minimum investment to get started?",
    a: "We offer multiple investment tiers starting from a low entry point, designed to accommodate both new and experienced investors. Create a free account to see all available plans and their details.",
  },
  {
    q: "How are deposits and withdrawals processed?",
    a: "We support deposits via USDT (TRC20), Bitcoin, Ethereum, and Solana. Deposits are verified by our team within 24 hours. Withdrawals are processed promptly with a minimum threshold to ensure network efficiency.",
  },
  {
    q: "How often are returns distributed?",
    a: "Earnings are calculated and distributed every Monday directly to your platform balance. You can track your P&L in real-time on your dashboard and withdraw your earnings at any time.",
  },
  {
    q: "Is my capital secure on the platform?",
    a: "Security is our top priority. We employ bank-grade encryption, two-factor authentication, and strict risk management protocols including dynamic stop-losses and position size limits. Our platform has maintained 99.9% uptime since launch.",
  },
  {
    q: "Can I withdraw my funds at any time?",
    a: "Yes. You have full control over your funds. Withdrawal requests are typically processed within 24 hours. There's a small minimum withdrawal amount to cover network fees.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
            Common Questions
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`faq-${i}`} className="rounded-xl border border-border/60 bg-card/30 px-6 backdrop-blur-sm">
                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
