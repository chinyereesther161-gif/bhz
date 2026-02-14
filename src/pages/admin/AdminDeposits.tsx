import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Mail, Wallet, Clock, DollarSign, User } from "lucide-react";
import { motion } from "framer-motion";

interface DepositWithProfile {
  id: string;
  amount: number;
  network: string;
  wallet_address: string | null;
  status: string;
  created_at: string;
  user_id: string;
  user_email: string;
  user_name: string;
}

const AdminDeposits = () => {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<DepositWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    // Fetch deposits
    const { data: depositsData } = await supabase
      .from("deposits")
      .select("*")
      .order("created_at", { ascending: false });

    if (!depositsData) {
      setDeposits([]);
      setLoading(false);
      return;
    }

    // Fetch profiles for all unique user_ids
    const userIds = [...new Set(depositsData.map(d => d.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, email, name")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    const enriched: DepositWithProfile[] = depositsData.map(d => ({
      id: d.id,
      amount: d.amount,
      network: d.network,
      wallet_address: d.wallet_address,
      status: d.status,
      created_at: d.created_at,
      user_id: d.user_id,
      user_email: profileMap.get(d.user_id)?.email || "Unknown",
      user_name: profileMap.get(d.user_id)?.name || "Unknown",
    }));

    setDeposits(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchDeposits(); }, []);

  const updateStatus = async (deposit: DepositWithProfile, status: string) => {
    const { error } = await supabase.from("deposits").update({ status }).eq("id", deposit.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

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
          <div className="space-y-3">
            {deposits.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No deposits</p>
            ) : deposits.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="bg-card/15 border-border/15 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-2xl font-black text-primary">${d.amount.toLocaleString()}</p>
                        <Badge className={`mt-1 ${statusColor(d.status)}`}>{d.status}</Badge>
                      </div>
                      {d.status === "pending" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-success/20 hover:bg-success/10" onClick={() => updateStatus(d, "approved")}>
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-destructive/20 hover:bg-destructive/10" onClick={() => updateStatus(d, "rejected")}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <User className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                        <span className="font-semibold text-foreground/80">{d.user_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Mail className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                        <span>{d.user_email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <DollarSign className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                        <span>{d.network}</span>
                      </div>
                      {d.wallet_address && (
                        <div className="flex items-start gap-2 text-muted-foreground/60">
                          <Wallet className="h-3.5 w-3.5 text-primary/50 shrink-0 mt-0.5" />
                          <span className="font-mono text-[10px] break-all">{d.wallet_address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Clock className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                        <span>{new Date(d.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminDeposits;
