import AppLayout from "@/components/AppLayout";
import MarketTicker from "@/components/landing/MarketTicker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, TrendingUp, Zap, Activity, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

const institutions = ["Goldman Sachs", "JP Morgan", "BlackRock", "Citadel", "Two Sigma"];

const activityMessages = [
  "BTC/USD Long +2.4% executed",
  "ETH/USD Short closed +1.8%",
  "SOL/USD Entry signal detected",
  "Risk management: Position reduced",
  "XRP/USD Take profit hit +3.1%",
  "Market scan: 12 opportunities found",
  "Portfolio rebalanced automatically",
  "BNB/USD Breakout confirmed",
];

const Trading = () => {
  const [activities, setActivities] = useState<{ msg: string; time: string }[]>([]);

  useEffect(() => {
    const addActivity = () => {
      const msg = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      const time = new Date().toLocaleTimeString();
      setActivities(prev => [{ msg, time }, ...prev].slice(0, 8));
    };
    addActivity();
    const interval = setInterval(addActivity, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trading</h1>
          <Badge className="bg-success/20 text-success border-success/30">
            <Activity className="mr-1 h-3 w-3" /> Live
          </Badge>
        </div>

        <MarketTicker />

        {/* Platform Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Capvest AI Trading Engine</h3>
                <p className="text-xs text-muted-foreground">Certified & Audited Platform</p>
              </div>
              <Badge variant="outline" className="ml-auto border-primary/30 text-primary">
                <Shield className="mr-1 h-3 w-3" /> Verified
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our proprietary AI analyzes crypto and forex markets using deep learning, sentiment analysis,
              and technical indicators to execute high-probability trades 24/7.
            </p>
          </CardContent>
        </Card>

        {/* Trusted By */}
        <div className="flex flex-wrap gap-2 justify-center">
          {institutions.map(name => (
            <Badge key={name} variant="outline" className="text-xs text-muted-foreground">
              {name}
            </Badge>
          ))}
        </div>

        {/* Performance */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%" },
            { icon: BarChart3, label: "Avg Return", value: "12.3%" },
            { icon: Zap, label: "Trades/Day", value: "847" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <s.icon className="mx-auto h-5 w-5 text-primary mb-1" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-bold">How Our AI Works</h3>
            <div className="space-y-3">
              {[
                "Scans 500+ markets in real-time",
                "Identifies high-probability patterns",
                "Executes trades with strict risk management",
                "Distributes profits weekly to investors",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              Live System Activity
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">{a.msg}</span>
                  <span className="text-muted-foreground/60 shrink-0 ml-2">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Trading;
