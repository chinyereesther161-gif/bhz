import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TrendingUp, Shield, Zap, Check, Sparkles, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const packages = [
  { name: "Micro", amount: 50, weeklyMin: 4, weeklyMax: 6, risk: "Low" },
  { name: "Starter", amount: 100, weeklyMin: 5, weeklyMax: 8, risk: "Low" },
  { name: "Basic", amount: 200, weeklyMin: 6, weeklyMax: 10, risk: "Medium" },
  { name: "Standard", amount: 500, weeklyMin: 7, weeklyMax: 11, risk: "Medium" },
  { name: "Professional", amount: 1000, weeklyMin: 8, weeklyMax: 13, risk: "Medium" },
  { name: "Gold", amount: 2500, weeklyMin: 10, weeklyMax: 15, risk: "High" },
  { name: "Platinum", amount: 5000, weeklyMin: 12, weeklyMax: 18, risk: "High" },
  { name: "Diamond", amount: 10000, weeklyMin: 14, weeklyMax: 20, risk: "High" },
  { name: "Elite", amount: 25000, weeklyMin: 15, weeklyMax: 22, risk: "Very High" },
  { name: "Institutional", amount: 50000, weeklyMin: 16, weeklyMax: 25, risk: "Very High" },
];

const riskColor = (r: string) =>
  r === "Low" ? "text-success border-success/20 bg-success/[0.08]" :
  r === "Medium" ? "text-primary border-primary/20 bg-primary/[0.08]" :
  r === "High" ? "text-destructive border-destructive/20 bg-destructive/[0.08]" :
  "text-red-400 border-red-400/20 bg-red-400/[0.08]";

const Packages = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPkg, setSelectedPkg] = useState<typeof packages[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInvest = async () => {
    if (!selectedPkg || !user || !profile) return;
    if (profile.balance < selectedPkg.amount) {
      toast({ title: "Insufficient funds", description: "Please deposit funds first.", variant: "destructive" });
      setSelectedPkg(null);
      navigate("/deposit");
      return;
    }
    setLoading(true);
    const { error: balanceError } = await supabase
      .from("profiles")
      .update({ balance: profile.balance - selectedPkg.amount, active_plan: selectedPkg.name })
      .eq("user_id", user.id);
    if (balanceError) {
      toast({ title: "Error", description: balanceError.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("investments").insert({
      user_id: user.id,
      plan_name: selectedPkg.name,
      amount: selectedPkg.amount,
    });
    setLoading(false);
    setSelectedPkg(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Investment successful!", description: `You've activated the ${selectedPkg.name} plan.` });
    }
  };

  const calcEarnings = (amount: number, min: number, max: number) => ({
    minWeekly: (amount * min / 100),
    maxWeekly: (amount * max / 100),
    minMonthly: (amount * min / 100) * 4,
    maxMonthly: (amount * max / 100) * 4,
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-black">Investment Plans</h1>
          <p className="text-xs text-muted-foreground">
            Balance: <span className="text-primary font-bold">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </motion.div>

        {/* Features row */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-2.5">
          {[
            { icon: TrendingUp, label: "Weekly Returns" },
            { icon: Shield, label: "Capital Protected" },
            { icon: Zap, label: "Auto Trading" },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-2 rounded-xl bg-card/40 border border-border/30 p-3 text-[10px] text-muted-foreground">
              <f.icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-semibold">{f.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="space-y-2.5">
          {packages.map((pkg, i) => {
            const isActive = profile?.active_plan === pkg.name;
            const earnings = calcEarnings(pkg.amount, pkg.weeklyMin, pkg.weeklyMax);
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <Card className={`overflow-hidden transition-all duration-500 ${isActive ? "border-primary/40 glow-border" : "border-border/25 bg-card/30 hover:border-primary/25 hover:bg-card/50"}`}>
                  <CardContent className="relative p-5">
                    {isActive && <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.06] to-transparent" />}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold">{pkg.name}</h3>
                            <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${riskColor(pkg.risk)}`}>{pkg.risk}</Badge>
                            {isActive && (
                              <Badge className="bg-primary/15 text-primary border border-primary/20 text-[9px] py-0">
                                <Sparkles className="mr-0.5 h-2.5 w-2.5" /> Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-black text-primary">${pkg.amount.toLocaleString()}</p>
                        </div>
                        <Button size="sm" onClick={() => setSelectedPkg(pkg)} disabled={isActive} className="font-bold px-6 rounded-xl shadow-lg shadow-primary/20">
                          {isActive ? "Active" : "Invest"}
                        </Button>
                      </div>
                      
                      {/* Estimated Earnings */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/20">
                        <div className="rounded-lg bg-success/[0.06] border border-success/15 p-2.5">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="h-3 w-3 text-success" />
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Weekly</span>
                          </div>
                          <p className="text-xs font-black text-success">
                            ${earnings.minWeekly.toFixed(0)} – ${earnings.maxWeekly.toFixed(0)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">{pkg.weeklyMin}–{pkg.weeklyMax}%</p>
                        </div>
                        <div className="rounded-lg bg-primary/[0.06] border border-primary/15 p-2.5">
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="h-3 w-3 text-primary" />
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Monthly</span>
                          </div>
                          <p className="text-xs font-black text-primary">
                            ${earnings.minMonthly.toFixed(0)} – ${earnings.maxMonthly.toFixed(0)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">{pkg.weeklyMin * 4}–{pkg.weeklyMax * 4}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* All plans include */}
        <Card className="bg-card/30 border-border/25">
          <CardContent className="p-5">
            <p className="text-xs font-bold mb-3">All Plans Include</p>
            <div className="grid grid-cols-2 gap-2.5">
              {["24/7 AI Trading", "Weekly Payouts", "Risk Management", "Real-time Dashboard", "Withdraw Anytime", "Priority Support"].map(f => (
                <div key={f} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Check className="h-3 w-3 text-success shrink-0" /> {f}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedPkg} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="bg-card border-border/40">
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              Activate the <span className="text-primary font-bold">{selectedPkg?.name}</span> plan for{" "}
              <span className="text-primary font-bold">${selectedPkg?.amount.toLocaleString()}</span>
              {selectedPkg && (
                <span className="block mt-2 text-success font-semibold">
                  Est. weekly earnings: ${calcEarnings(selectedPkg.amount, selectedPkg.weeklyMin, selectedPkg.weeklyMax).minWeekly.toFixed(0)} – ${calcEarnings(selectedPkg.amount, selectedPkg.weeklyMin, selectedPkg.weeklyMax).maxWeekly.toFixed(0)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedPkg(null)} className="border-border/40">Cancel</Button>
            <Button onClick={handleInvest} disabled={loading} className="font-bold shadow-lg shadow-primary/20">
              {loading ? "Processing..." : "Confirm Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Packages;
