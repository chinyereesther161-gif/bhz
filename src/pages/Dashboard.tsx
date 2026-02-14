import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Calendar, Package } from "lucide-react";

const Dashboard = () => {
  const { profile } = useAuth();

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">{profile?.name || "Trader"} • {profile?.capvest_id}</p>
        </div>

        {/* Portfolio Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-secondary/30">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Balance</p>
            <p className="mt-1 text-4xl font-bold text-primary">
              ${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Weekly P&L</p>
                <p className={`text-sm font-bold ${(profile?.weekly_pnl ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
                  {(profile?.weekly_pnl ?? 0) >= 0 ? "+" : ""}${(profile?.weekly_pnl ?? 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Plan</p>
                <p className="text-sm font-bold">{profile?.active_plan || "None"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Payout</p>
                <p className="text-sm font-bold text-primary">Monday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-14 gap-2" variant="outline">
            <Link to="/deposit">
              <ArrowDownToLine className="h-5 w-5 text-success" />
              Fund Account
            </Link>
          </Button>
          <Button asChild className="h-14 gap-2" variant="outline">
            <Link to="/withdraw">
              <ArrowUpFromLine className="h-5 w-5 text-primary" />
              Withdraw
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="text-lg font-bold">94.7%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-success/10 p-2">
                <Wallet className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Return</p>
                <p className="text-lg font-bold">12.3%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
