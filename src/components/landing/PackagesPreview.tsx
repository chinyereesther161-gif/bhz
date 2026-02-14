import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const packages = [
  { name: "Micro", amount: 50, weekly: "4-6%", risk: "Low" },
  { name: "Starter", amount: 100, weekly: "5-8%", risk: "Low" },
  { name: "Basic", amount: 200, weekly: "6-10%", risk: "Medium" },
  { name: "Standard", amount: 500, weekly: "7-11%", risk: "Medium" },
  { name: "Professional", amount: 1000, weekly: "8-13%", risk: "Medium" },
  { name: "Gold", amount: 2500, weekly: "10-15%", risk: "High" },
  { name: "Platinum", amount: 5000, weekly: "12-18%", risk: "High" },
];

const PackagesPreview = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
          Investment <span className="text-primary">Plans</span>
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
          Choose a plan that fits your investment goals
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.slice(0, 4).map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{pkg.name}</p>
              <p className="mt-2 text-3xl font-bold">${pkg.amount.toLocaleString()}</p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Weekly: <span className="text-success font-medium">{pkg.weekly}</span></p>
                <p>Risk: <span className="font-medium text-foreground">{pkg.risk}</span></p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
            <Link to="/signup">
              View All Plans <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PackagesPreview;
