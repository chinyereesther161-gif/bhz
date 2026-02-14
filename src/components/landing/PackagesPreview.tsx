import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const PackagesPreview = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="pointer-events-none absolute left-1/2 bottom-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Investment Plans</p>
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
            Flexible Plans for Every Level
          </h2>
          <p className="mx-auto mt-4 mb-10 max-w-xl text-muted-foreground">
            From beginners to experienced investors, we offer 7 carefully designed tiers with competitive
            weekly returns and built-in risk management. Start with any amount you're comfortable with.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {["Micro", "Starter", "Basic", "Standard", "Professional", "Gold", "Platinum"].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-full border border-border/60 bg-card/50 px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {name}
              </motion.span>
            ))}
          </div>

          <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-base font-bold shadow-lg shadow-primary/20">
            <Link to="/signup">
              Explore All Plans <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PackagesPreview;
