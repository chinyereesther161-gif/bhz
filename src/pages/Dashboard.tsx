import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Package, Activity, Eye } from "lucide-react";

const Dashboard = () => {
  const { profile } = useAuth();

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        {/* Welcome */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},</p>
          <h1 className="text-xl font-black">{profile?.name || "Trader"}</h1>
          <p className="text-[10px] text-muted-foreground font-mono">{profile?.capvest_id}</p>
        </div>

        {/* Portfolio Card */}
        <Card className="glow-border overflow-hidden">
          <CardContent className="relative p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-success/5" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Balance</p>
              <p className="mt-1 text-4xl font-black text-gradient-gold">
                ${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-secondary/40 p-2.5">
                  <p className="text-[10px] text-muted-foreground">Weekly P&L</p>
                  <p className={`text-sm font-bold ${(profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
                    {(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}${(profile?.weekly_pnl ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/40 p-2.5">
                  <p className="text-[10px] text-muted-foreground">Active Plan</p>
                  <p className="text-sm font-bold">{profile?.active_plan || "None"}</p>
                </div>
                <div className="rounded-lg bg-secondary/40 p-2.5">
                  <p className="text-[10px] text-muted-foreground">Next Payout</p>
                  <p className="text-sm font-bold text-primary">Monday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-14 gap-2 bg-success/10 text-success border border-success/20 hover:bg-success/20" variant="ghost">
            <Link to="/deposit">
              <ArrowDownToLine className="h-5 w-5" />
              <span className="font-semibold">Deposit</span>
            </Link>
          </Button>
          <Button asChild className="h-14 gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" variant="ghost">
            <Link to="/withdraw">
              <ArrowUpFromLine className="h-5 w-5" />
              <span className="font-semibold">Withdraw</span>
            </Link>
          </Button>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%", color: "text-success" },
            { icon: Activity, label: "Avg Return", value: "12.3%", color: "text-primary" },
            { icon: Eye, label: "Markets", value: "500+", color: "text-foreground" },
          ].map(s => (
            <Card key={s.label} className="bg-card/50">
              <CardContent className="p-3.5 text-center">
                <s.icon className={`mx-auto h-4 w-4 ${s.color} mb-1.5`} />
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/trading" className="rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:border-primary/20">
            <Activity className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-bold">Live Trading</p>
            <p className="text-[10px] text-muted-foreground">View AI activity</p>
          </Link>
          <Link to="/packages" className="rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:border-primary/20">
            <Package className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-bold">Invest</p>
            <p className="text-[10px] text-muted-foreground">View plans</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
