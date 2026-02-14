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
import { TrendingUp, Shield, Zap, Check } from "lucide-react";

const packages = [
  { name: "Micro", amount: 50, weekly: "4-6%", risk: "Low" },
  { name: "Starter", amount: 100, weekly: "5-8%", risk: "Low" },
  { name: "Basic", amount: 200, weekly: "6-10%", risk: "Medium" },
  { name: "Standard", amount: 500, weekly: "7-11%", risk: "Medium" },
  { name: "Professional", amount: 1000, weekly: "8-13%", risk: "Medium" },
  { name: "Gold", amount: 2500, weekly: "10-15%", risk: "High" },
  { name: "Platinum", amount: 5000, weekly: "12-18%", risk: "High" },
];

const riskColor = (r: string) => r === "Low" ? "text-success border-success/20 bg-success/10" : r === "Medium" ? "text-primary border-primary/20 bg-primary/10" : "text-destructive border-destructive/20 bg-destructive/10";

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

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <div>
          <h1 className="text-xl font-black">Investment Plans</h1>
          <p className="text-xs text-muted-foreground">
            Balance: <span className="text-primary font-bold">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: TrendingUp, label: "Weekly Returns" },
            { icon: Shield, label: "Capital Protected" },
            { icon: Zap, label: "Auto Trading" },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-1.5 rounded-lg bg-card/50 border border-border/30 p-2.5 text-[10px] text-muted-foreground">
              <f.icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          {packages.map(pkg => {
            const isActive = profile?.active_plan === pkg.name;
            return (
              <Card key={pkg.name} className={`transition-all ${isActive ? "border-primary/40 glow-border" : "hover:border-primary/20"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold">{pkg.name}</h3>
                        <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${riskColor(pkg.risk)}`}>{pkg.risk}</Badge>
                        {isActive && <Badge className="bg-primary/15 text-primary text-[10px] py-0">Active</Badge>}
                      </div>
                      <p className="text-2xl font-black text-primary">${pkg.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-[11px] text-success font-medium">{pkg.weekly} weekly</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setSelectedPkg(pkg)} disabled={isActive} className="font-bold px-5">
                      {isActive ? "Active" : "Invest"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All plans include */}
        <Card className="bg-card/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold mb-3">All Plans Include</p>
            <div className="grid grid-cols-2 gap-2">
              {["24/7 AI Trading", "Weekly Payouts", "Risk Management", "Real-time Dashboard", "Withdraw Anytime", "Priority Support"].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Check className="h-3 w-3 text-success shrink-0" /> {f}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedPkg} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              Activate the <span className="text-primary font-bold">{selectedPkg?.name}</span> plan for{" "}
              <span className="text-primary font-bold">${selectedPkg?.amount.toLocaleString()}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedPkg(null)}>Cancel</Button>
            <Button onClick={handleInvest} disabled={loading} className="font-bold">
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Packages;
