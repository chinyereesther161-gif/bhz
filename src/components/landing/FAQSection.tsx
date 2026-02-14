import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does Capvest AI generate returns?",
    a: "Our proprietary AI algorithms analyze crypto and forex markets 24/7, executing trades based on patterns, sentiment analysis, and technical indicators. The AI has been trained on years of market data to identify high-probability opportunities.",
  },
  {
    q: "What is the minimum investment?",
    a: "You can start with as little as $50 on our Micro plan. We offer 7 tiers from $50 to $5,000 to accommodate different investment levels.",
  },
  {
    q: "How do I deposit and withdraw funds?",
    a: "We support deposits via USDT (TRC20), Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). Withdrawals are processed within 24 hours after admin verification.",
  },
  {
    q: "Is my investment safe?",
    a: "While all trading carries risk, our AI employs strict risk management protocols including stop-losses and position sizing. Our 94.7% win rate demonstrates the system's reliability.",
  },
  {
    q: "When do I receive my weekly earnings?",
    a: "Weekly earnings are distributed every Monday. You can track your P&L in real-time from your dashboard.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-6">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
