import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="relative py-24 px-4">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[200px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container relative mx-auto max-w-3xl"
    >
      <div className="glow-border rounded-3xl bg-gradient-to-b from-card/80 to-card/40 p-10 text-center backdrop-blur-sm md:p-16">
        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Start Growing Your <span className="text-gradient-gold">Portfolio</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Join 12,400+ investors earning consistent weekly returns with Capvest AI. 
          Create your free account in under 60 seconds.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-13 gap-2 rounded-xl px-10 text-sm font-bold shadow-lg shadow-primary/25">
            <Link to="/signup">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> No hidden fees</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Setup in 60s</span>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
