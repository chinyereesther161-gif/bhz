import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Package, Activity, Eye, BarChart3, Brain, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { profile } = useAuth();
  const [chartData] = useState(() => {
    const pts: number[] = [];
    let val = 100;
    for (let i = 0; i < 30; i++) {
      val += (Math.random() - 0.35) * 8;
      pts.push(Math.max(val, 60));
    }
    return pts;
  });

  const maxVal = Math.max(...chartData);
  const minVal = Math.min(...chartData);
  const range = maxVal - minVal || 1;

  const pathD = chartData
    .map((v, i) => {
      const x = (i / (chartData.length - 1)) * 400;
      const y = 100 - ((v - minVal) / range) * 80;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-muted-foreground/60">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
          </p>
          <h1 className="text-xl font-black">{profile?.name || "Trader"}</h1>
          <p className="text-[10px] text-muted-foreground/40 font-mono tracking-wide">{profile?.capvest_id}</p>
        </motion.div>

        {/* Portfolio Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glow-border overflow-hidden">
            <CardContent className="relative p-0">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-success/[0.03]" />
              <div className="relative p-6 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Total Balance</p>
                <p className="mt-1 text-4xl font-black text-gradient-gold">
                  ${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              {/* Mini chart */}
              <div className="h-20 px-6 pb-3 opacity-60">
                <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dashChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(43 100% 50%)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(43 100% 50%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={pathD} fill="none" stroke="hsl(43 100% 50%)" strokeWidth="2" strokeLinecap="round" />
                  <path d={`${pathD} V100 H0 Z`} fill="url(#dashChart)" />
                </svg>
              </div>

              <div className="relative grid grid-cols-3 gap-px bg-border/20">
                {[
                  { label: "Weekly P&L", value: `${(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}$${(profile?.weekly_pnl ?? 0).toFixed(2)}`, color: (profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive" },
                  { label: "Active Plan", value: profile?.active_plan || "None", color: "text-foreground" },
                  { label: "Next Payout", value: "Monday", color: "text-primary" },
                ].map(item => (
                  <div key={item.label} className="bg-card/60 p-4 text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">{item.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3">
          <Button asChild className="h-14 gap-2.5 rounded-xl bg-success/[0.06] text-success border border-success/15 hover:bg-success/[0.12] hover:border-success/25 transition-all duration-300" variant="ghost">
            <Link to="/deposit">
              <ArrowDownToLine className="h-5 w-5" />
              <span className="font-bold text-sm">Deposit</span>
            </Link>
          </Button>
          <Button asChild className="h-14 gap-2.5 rounded-xl bg-primary/[0.06] text-primary border border-primary/15 hover:bg-primary/[0.12] hover:border-primary/25 transition-all duration-300" variant="ghost">
            <Link to="/withdraw">
              <ArrowUpFromLine className="h-5 w-5" />
              <span className="font-bold text-sm">Withdraw</span>
            </Link>
          </Button>
        </motion.div>

        {/* AI Performance Stats */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%", color: "text-success" },
            { icon: Activity, label: "Avg Return", value: "12.3%", color: "text-primary" },
            { icon: Eye, label: "Markets", value: "500+", color: "text-foreground" },
          ].map(s => (
            <Card key={s.label} className="bg-card/30 border-border/20 overflow-hidden">
              <CardContent className="relative p-4 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
                <div className="relative">
                  <s.icon className={`mx-auto h-4 w-4 ${s.color} mb-2 opacity-70`} />
                  <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] font-semibold text-muted-foreground/40 mt-0.5 uppercase tracking-wider">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
          <Link to="/trading" className="group rounded-2xl border border-border/20 bg-card/15 p-5 transition-all duration-500 hover:border-primary/15 hover:bg-card/35 overflow-hidden relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/[0.03] to-transparent" />
            <div className="relative">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] group-hover:bg-primary/[0.15] transition-colors">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-bold">Live Trading</p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">AI activity feed</p>
            </div>
          </Link>
          <Link to="/packages" className="group rounded-2xl border border-border/20 bg-card/15 p-5 transition-all duration-500 hover:border-primary/15 hover:bg-card/35 overflow-hidden relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/[0.03] to-transparent" />
            <div className="relative">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] group-hover:bg-primary/[0.15] transition-colors">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-bold">Invest</p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">View plans</p>
            </div>
          </Link>
        </motion.div>

        {/* AI Status bar */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-3 rounded-2xl border border-border/20 bg-card/15 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 border border-success/15">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold">AI Engine Active</p>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">Monitoring 500+ markets • 847 trades/day</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
