import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container relative mx-auto max-w-3xl"
      >
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent p-12 text-center md:p-16">
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
            Ready to Start?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of investors who trust Capvest AI to grow their portfolios. 
            Create your free account in under 60 seconds.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-base font-bold shadow-lg shadow-primary/20">
              <Link to="/signup">
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
