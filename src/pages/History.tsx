import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownToLine, ArrowUpFromLine, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";

type Transaction = {
  id: string;
  type: "deposit" | "withdrawal" | "investment";
  amount: number;
  status: string;
  detail: string;
  created_at: string;
};

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal" | "investment">("all");

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [deposits, withdrawals, investments] = await Promise.all([
        supabase.from("deposits").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("withdrawals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("investments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      const all: Transaction[] = [
        ...(deposits.data || []).map(d => ({ id: d.id, type: "deposit" as const, amount: d.amount, status: d.status, detail: d.network, created_at: d.created_at })),
        ...(withdrawals.data || []).map(w => ({ id: w.id, type: "withdrawal" as const, amount: w.amount, status: w.status, detail: w.network, created_at: w.created_at })),
        ...(investments.data || []).map(inv => ({ id: inv.id, type: "investment" as const, amount: inv.amount, status: inv.status, detail: inv.plan_name, created_at: inv.created_at })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTransactions(all);
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  const typeIcon = (type: string) => {
    if (type === "deposit") return <ArrowDownToLine className="h-4 w-4 text-success" />;
    if (type === "withdrawal") return <ArrowUpFromLine className="h-4 w-4 text-destructive" />;
    return <Package className="h-4 w-4 text-primary" />;
  };

  const statusColor = (s: string) => {
    if (s === "approved" || s === "active") return "bg-success/[0.06] text-success border-success/15";
    if (s === "rejected") return "bg-destructive/[0.06] text-destructive border-destructive/15";
    return "bg-primary/[0.06] text-primary border-primary/15";
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-black">Transaction History</h1>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 overflow-x-auto">
          {(["all", "deposit", "withdrawal", "investment"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                filter === f ? "bg-primary/[0.08] text-primary border border-primary/15" : "bg-card/10 text-muted-foreground border border-border/10 hover:border-primary/10 hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-2xl bg-card/15 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-card/15 border-border/15">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <div className="rounded-2xl bg-secondary/30 p-5">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">No transactions yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="bg-card/10 border-border/10 hover:bg-card/20 transition-colors duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-secondary/20 p-2.5 border border-border/10">
                        {typeIcon(t.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold capitalize">{t.type}</p>
                          <p className={`text-sm font-black ${t.type === "deposit" ? "text-success" : t.type === "withdrawal" ? "text-destructive" : "text-primary"}`}>
                            {t.type === "deposit" ? "+" : "-"}${t.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-[10px] text-muted-foreground">{t.detail} • {new Date(t.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                          <Badge variant="outline" className={`text-[9px] py-0 ${statusColor(t.status)}`}>{t.status}</Badge>
                        </div>
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

export default History;
