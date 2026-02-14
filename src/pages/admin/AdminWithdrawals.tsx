import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Check, X } from "lucide-react";

type Withdrawal = Tables<"withdrawals">;

const AdminWithdrawals = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    const { data } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
    setWithdrawals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const updateStatus = async (withdrawal: Withdrawal, status: string) => {
    const { error } = await supabase.from("withdrawals").update({ status }).eq("id", withdrawal.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // If approved, deduct from balance
    if (status === "approved") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", withdrawal.user_id)
        .single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ balance: Math.max(0, profile.balance - withdrawal.amount) })
          .eq("user_id", withdrawal.user_id);
      }
    }

    toast({ title: `Withdrawal ${status}` });
    fetchWithdrawals();
  };

  const statusColor = (s: string) => {
    if (s === "approved") return "bg-success/20 text-success";
    if (s === "rejected") return "bg-destructive/20 text-destructive";
    return "bg-primary/20 text-primary";
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">Withdrawal Processing</h1>

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <div className="space-y-2">
            {withdrawals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No withdrawals</p>
            ) : withdrawals.map(w => (
              <Card key={w.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">${w.amount}</p>
                      <p className="text-xs text-muted-foreground">{w.network}</p>
                      <p className="text-xs text-muted-foreground break-all">{w.wallet_address}</p>
                      <p className="text-xs text-muted-foreground mt-1">{w.email} • {new Date(w.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusColor(w.status)}>{w.status}</Badge>
                      {w.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(w, "approved")}>
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(w, "rejected")}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminWithdrawals;
