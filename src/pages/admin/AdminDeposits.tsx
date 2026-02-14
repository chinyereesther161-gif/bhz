import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Check, X } from "lucide-react";

type Deposit = Tables<"deposits">;

const AdminDeposits = () => {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    const { data } = await supabase.from("deposits").select("*").order("created_at", { ascending: false });
    setDeposits(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDeposits(); }, []);

  const updateStatus = async (deposit: Deposit, status: string) => {
    const { error } = await supabase.from("deposits").update({ status }).eq("id", deposit.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // If approved, add to user balance
    if (status === "approved") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", deposit.user_id)
        .single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ balance: profile.balance + deposit.amount })
          .eq("user_id", deposit.user_id);
      }
    }

    toast({ title: `Deposit ${status}` });
    fetchDeposits();
  };

  const statusColor = (s: string) => {
    if (s === "approved") return "bg-success/20 text-success";
    if (s === "rejected") return "bg-destructive/20 text-destructive";
    return "bg-primary/20 text-primary";
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">Deposit Verification</h1>

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <div className="space-y-2">
            {deposits.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No deposits</p>
            ) : deposits.map(d => (
              <Card key={d.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">${d.amount}</p>
                      <p className="text-xs text-muted-foreground">{d.network}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusColor(d.status)}>{d.status}</Badge>
                      {d.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(d, "approved")}>
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(d, "rejected")}>
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

export default AdminDeposits;
