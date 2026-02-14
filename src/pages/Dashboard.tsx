import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, TrendingDown, Package, Activity, Brain, Shield, BarChart3, Globe, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketData, formatPrice } from "@/hooks/useMarketData";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Investment = Tables<"investments">;

const Dashboard = () => {
  const { profile, user } = useAuth();
  const { data: marketData, loading: marketLoading } = useMarketData(6);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("investments").select("*").eq("user_id", user.id).eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setInvestments(data || []));
  }, [user]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const balance = profile?.balance ?? 0;

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-4">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-medium text-muted-foreground/50">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
          </p>
          <h1 className="text-xl font-black">{profile?.name || "Trader"}</h1>
          <p className="text-[10px] text-muted-foreground/30 font-mono tracking-wide">{profile?.capvest_id}</p>
        </motion.div>

        {/* Portfolio Card - Redesigned without chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="glow-border overflow-hidden">
            <CardContent className="relative p-0">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-success/[0.02]" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Total Balance</p>
                  <div className="flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    <span className="text-[9px] font-bold text-success">Active</span>
                  </div>
                </div>
                <p className="text-3xl font-black text-gradient-gold">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`flex items-center gap-1 text-xs font-bold ${(profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
                    {(profile?.weekly_pnl ?? 0) >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}${Math.abs(profile?.weekly_pnl ?? 0).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/30">this week</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-px bg-border/15">
                {[
                  { label: "Invested", value: `$${totalInvested.toLocaleString()}`, color: "text-primary" },
                  { label: "Plans", value: `${investments.length}`, color: "text-foreground" },
                  { label: "Payout", value: "Monday", color: "text-primary" },
                ].map(item => (
                  <div key={item.label} className="bg-card/50 p-3 text-center">
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/35">{item.label}</p>
                    <p className={`text-xs font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Investments */}
        {investments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card/15 border-border/15 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/10">
                  <h3 className="text-xs font-bold flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-primary/70" />
                    Active Investments
                  </h3>
                  <span className="text-[10px] text-muted-foreground/30">{investments.length} plan{investments.length > 1 ? "s" : ""}</span>
                </div>
                <div className="divide-y divide-border/8">
                  {investments.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-xs font-bold">{inv.plan_name}</p>
                        <p className="text-[10px] text-muted-foreground/30">{new Date(inv.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">${inv.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-success font-semibold">Active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="grid grid-cols-2 gap-2.5">
          <Button asChild className="h-12 gap-2 rounded-xl bg-success/[0.06] text-success border border-success/15 hover:bg-success/[0.12]" variant="ghost">
            <Link to="/deposit">
              <ArrowDownToLine className="h-4 w-4" />
              <span className="font-bold text-xs">Deposit</span>
            </Link>
          </Button>
          <Button asChild className="h-12 gap-2 rounded-xl bg-primary/[0.06] text-primary border border-primary/15 hover:bg-primary/[0.12]" variant="ghost">
            <Link to="/withdraw">
              <ArrowUpFromLine className="h-4 w-4" />
              <span className="font-bold text-xs">Withdraw</span>
            </Link>
          </Button>
        </motion.div>

        {/* Live Market Overview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Card className="bg-card/15 border-border/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/10">
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary/70" />
                  Live Markets
                </h3>
                <Link to="/markets" className="text-[10px] text-primary font-semibold hover:underline">View All →</Link>
              </div>
              {marketLoading ? (
                <div className="p-5 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-card/20 rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="divide-y divide-border/8">
                  {marketData.slice(0, 5).map(coin => {
                    const isUp = coin.price_change_percentage_24h >= 0;
                    return (
                      <div key={coin.id} className="flex items-center gap-3 px-5 py-3 hover:bg-card/20 transition-colors">
                        {coin.image && <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold uppercase">{coin.symbol}</span>
                          <span className="text-[10px] text-muted-foreground/30 ml-1.5">{coin.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold font-mono">${formatPrice(coin.current_price)}</p>
                          <p className={`text-[10px] font-semibold ${isUp ? "text-success" : "text-destructive"}`}>
                            {isUp ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-2.5">
          <Link to="/trading" className="group rounded-2xl border border-border/15 bg-card/10 p-4 transition-all hover:border-primary/15 hover:bg-card/30">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/[0.08] group-hover:bg-primary/[0.15] transition-colors">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold">Live Trading</p>
            <p className="text-[9px] text-muted-foreground/40 mt-0.5">AI activity feed</p>
          </Link>
          <Link to="/packages" className="group rounded-2xl border border-border/15 bg-card/10 p-4 transition-all hover:border-primary/15 hover:bg-card/30">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/[0.08] group-hover:bg-primary/[0.15] transition-colors">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold">Investment Plans</p>
            <p className="text-[9px] text-muted-foreground/40 mt-0.5">View & activate</p>
          </Link>
        </motion.div>

        {/* AI Engine Status */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <div className="flex items-center gap-3 rounded-2xl border border-success/15 bg-success/[0.03] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <Shield className="h-4 w-4 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold">AI Engine Active</p>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground/35 mt-0.5">Monitoring 500+ markets • Trading 24/7</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
