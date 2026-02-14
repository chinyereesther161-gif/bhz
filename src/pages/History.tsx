import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownToLine, ArrowUpFromLine, Package, Clock } from "lucide-react";

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
    if (s === "approved" || s === "active") return "bg-success/10 text-success border-success/20";
    if (s === "rejected") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <h1 className="text-xl font-black">Transaction History</h1>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {(["all", "deposit", "withdrawal", "investment"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                filter === f ? "bg-primary/10 text-primary border border-primary/20" : "bg-card/30 text-muted-foreground border border-border/30 hover:border-primary/20"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}s{f === "all" ? "" : ""}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl bg-card/30 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-card/30">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="rounded-full bg-secondary p-4">
                <Clock className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map(t => (
              <Card key={t.id} className="bg-card/30">
                <CardContent className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary/50 p-2">
                      {typeIcon(t.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold capitalize">{t.type}</p>
                        <p className={`text-sm font-bold ${t.type === "deposit" ? "text-success" : t.type === "withdrawal" ? "text-destructive" : "text-primary"}`}>
                          {t.type === "deposit" ? "+" : "-"}${t.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-muted-foreground">{t.detail} • {new Date(t.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                        <Badge variant="outline" className={`text-[9px] py-0 ${statusColor(t.status)}`}>{t.status}</Badge>
                      </div>
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

export default History;
