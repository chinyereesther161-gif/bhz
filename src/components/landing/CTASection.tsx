import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="relative py-28 px-4 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[250px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container relative mx-auto max-w-3xl"
    >
      <div className="glow-border rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl p-12 text-center md:p-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl leading-tight">
              Ready to Let AI{" "}
              <span className="text-gradient-gold">Grow Your Wealth?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted-foreground/80 leading-relaxed">
              Join 12,400+ investors earning consistent weekly returns. 
              Create your free account and start in under 60 seconds.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-14 gap-2.5 rounded-xl px-12 text-sm font-bold shadow-[0_8px_32px_hsl(43_100%_50%/0.25)] hover:shadow-[0_12px_48px_hsl(43_100%_50%/0.4)] transition-all duration-300 hover:scale-[1.02]">
                <Link to="/signup">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 gap-2.5 rounded-xl px-10 text-sm font-bold border-primary/20 bg-primary/[0.06] text-primary hover:bg-primary/[0.12] hover:border-primary/30 hover:scale-[1.02] transition-all duration-300">
                <Link to="/signin">
                  Sign In
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-xs text-muted-foreground/50">
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> No hidden fees</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Setup in 60s</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Instant access</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
