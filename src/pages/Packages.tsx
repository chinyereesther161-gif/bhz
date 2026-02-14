import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const packages = [
  { name: "Micro", amount: 50, weekly: "4-6%", risk: "Low", color: "text-muted-foreground" },
  { name: "Starter", amount: 100, weekly: "5-8%", risk: "Low", color: "text-muted-foreground" },
  { name: "Basic", amount: 200, weekly: "6-10%", risk: "Medium", color: "text-primary" },
  { name: "Standard", amount: 500, weekly: "7-11%", risk: "Medium", color: "text-primary" },
  { name: "Professional", amount: 1000, weekly: "8-13%", risk: "Medium", color: "text-primary" },
  { name: "Gold", amount: 2500, weekly: "10-15%", risk: "High", color: "text-primary" },
  { name: "Platinum", amount: 5000, weekly: "12-18%", risk: "High", color: "text-primary" },
];

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
    // Deduct balance
    const { error: balanceError } = await supabase
      .from("profiles")
      .update({
        balance: profile.balance - selectedPkg.amount,
        active_plan: selectedPkg.name,
      })
      .eq("user_id", user.id);

    if (balanceError) {
      toast({ title: "Error", description: balanceError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Create investment record
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
      toast({ title: "Investment successful!", description: `You've invested $${selectedPkg.amount} in the ${selectedPkg.name} plan.` });
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Investment Packages</h1>
          <p className="text-sm text-muted-foreground">
            Balance: <span className="text-primary font-semibold">${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        <div className="space-y-3">
          {packages.map(pkg => (
            <Card key={pkg.name} className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{pkg.name}</h3>
                    <Badge variant="outline" className="text-xs">{pkg.risk} Risk</Badge>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-primary">${pkg.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Weekly earnings: <span className="text-success">{pkg.weekly}</span></p>
                </div>
                <Button size="sm" onClick={() => setSelectedPkg(pkg)}>Invest</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={!!selectedPkg} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              You're about to invest <span className="text-primary font-bold">${selectedPkg?.amount.toLocaleString()}</span> in the{" "}
              <span className="font-bold">{selectedPkg?.name}</span> plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedPkg(null)}>Cancel</Button>
            <Button onClick={handleInvest} disabled={loading}>
              {loading ? "Processing..." : "Confirm Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Packages;
