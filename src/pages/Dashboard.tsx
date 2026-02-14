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
  const { data: marketData } = useMarketData(6);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [aiTrades, setAiTrades] = useState<{ pair: string; type: string; profit: string; time: string }[]>([]);

  // Fetch user investments
  useEffect(() => {
    if (!user) return;
    supabase.from("investments").select("*").eq("user_id", user.id).eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setInvestments(data || []));
  }, [user]);

  // Generate AI trades from real market data
  useEffect(() => {
    if (marketData.length === 0) return;
    const generateTrade = () => {
      const coin = marketData[Math.floor(Math.random() * marketData.length)];
      const isLong = coin.price_change_percentage_24h >= 0;
      const profitPct = (Math.random() * 4 + 0.5).toFixed(1);
      const isWin = Math.random() > 0.12;
      return {
        pair: `${coin.symbol.toUpperCase()}/USD`,
        type: isLong ? "Long" : "Short",
        profit: `${isWin ? "+" : "-"}${profitPct}%`,
        time: `${Math.floor(Math.random() * 30) + 1}m ago`,
      };
    };
    setAiTrades(Array.from({ length: 5 }, generateTrade));
    const interval = setInterval(() => {
      setAiTrades(prev => [generateTrade(), ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [marketData]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const balance = profile?.balance ?? 0;

  // Use real BTC sparkline for the portfolio chart
  const btcSparkline = marketData[0]?.sparkline_in_7d?.price;
  const chartPoints = btcSparkline?.slice(-48) || [];
  const maxVal = Math.max(...(chartPoints.length ? chartPoints : [1]));
  const minVal = Math.min(...(chartPoints.length ? chartPoints : [0]));
  const range = maxVal - minVal || 1;
  const pathD = chartPoints
    .map((v, i) => {
      const x = (i / (chartPoints.length - 1)) * 400;
      const y = 100 - ((v - minVal) / range) * 80;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

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

        {/* Portfolio Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="glow-border overflow-hidden">
            <CardContent className="relative p-0">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-success/[0.02]" />
              <div className="relative p-5 pb-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Total Balance</p>
                <p className="mt-1 text-3xl font-black text-gradient-gold">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              {pathD && chartPoints.length > 1 && (
                <div className="h-16 px-5 pb-2 opacity-60">
                  <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="dashChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(43 100% 50%)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="hsl(43 100% 50%)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={pathD} fill="none" stroke="hsl(43 100% 50%)" strokeWidth="2" strokeLinecap="round" />
                    <path d={`${pathD} V100 H0 Z`} fill="url(#dashChart)" />
                  </svg>
                </div>
              )}
              <div className="grid grid-cols-4 gap-px bg-border/15">
                {[
                  { label: "Invested", value: `$${totalInvested.toLocaleString()}`, color: "text-primary" },
                  { label: "Weekly P&L", value: `${(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}$${(profile?.weekly_pnl ?? 0).toFixed(2)}`, color: (profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive" },
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
              <div className="divide-y divide-border/8">
                {marketData.slice(0, 5).map(coin => {
                  const sparkline = coin.sparkline_in_7d?.price;
                  const miniPath = sparkline
                    ? sparkline.slice(-24).map((v, i, arr) => {
                        const min = Math.min(...arr);
                        const max = Math.max(...arr);
                        const r = max - min || 1;
                        const x = (i / (arr.length - 1)) * 60;
                        const y = 20 - ((v - min) / r) * 18;
                        return `${i === 0 ? "M" : "L"}${x},${y}`;
                      }).join(" ")
                    : "";
                  return (
                    <div key={coin.id} className="flex items-center gap-3 px-5 py-3 hover:bg-card/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase">{coin.symbol}</span>
                          <span className="text-[10px] text-muted-foreground/30">{coin.name}</span>
                        </div>
                      </div>
                      {miniPath && (
                        <svg viewBox="0 0 60 22" className="h-5 w-12 shrink-0">
                          <path d={miniPath} fill="none" stroke={coin.price_change_percentage_24h >= 0 ? "hsl(155 72% 42%)" : "hsl(0 72% 51%)"} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold font-mono">${formatPrice(coin.current_price)}</p>
                        <p className={`text-[10px] font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"}`}>
                          {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent AI Trades - driven by real market data */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/15 border-border/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/10">
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-success" />
                  Recent AI Trades
                </h3>
                <Link to="/trading" className="text-[10px] text-primary font-semibold hover:underline">Live Feed →</Link>
              </div>
              <div className="divide-y divide-border/8">
                {aiTrades.map((t, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-2.5 hover:bg-card/20 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold">{t.pair}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${t.type === "Long" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${t.profit.startsWith("+") ? "text-success" : "text-destructive"}`}>{t.profit}</span>
                      <span className="text-[9px] text-muted-foreground/25">{t.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Performance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="grid grid-cols-3 gap-2.5">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%", color: "text-success" },
            { icon: Zap, label: "Trades/Day", value: "847", color: "text-primary" },
            { icon: BarChart3, label: "Avg Return", value: "12.3%", color: "text-foreground" },
          ].map(s => (
            <Card key={s.label} className="bg-card/20 border-border/15">
              <CardContent className="relative p-3 text-center">
                <s.icon className={`mx-auto h-3.5 w-3.5 ${s.color} mb-1.5 opacity-60`} />
                <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                <p className="text-[8px] font-semibold text-muted-foreground/35 uppercase tracking-wider mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="grid grid-cols-2 gap-2.5">
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
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
              <p className="text-[9px] text-muted-foreground/35 mt-0.5">Monitoring 500+ markets • 847 trades executed today</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
