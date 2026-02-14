import AppLayout from "@/components/AppLayout";
import MarketTicker from "@/components/landing/MarketTicker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, TrendingUp, Zap, Activity, BarChart3, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";

const activityMessages = [
  "BTC/USD Long +2.4% executed",
  "ETH/USD Short closed +1.8%",
  "SOL/USD Entry signal detected",
  "Risk management: Position reduced",
  "XRP/USD Take profit hit +3.1%",
  "Market scan: 12 opportunities found",
  "Portfolio rebalanced automatically",
  "BNB/USD Breakout confirmed",
  "GOLD Hedge position opened",
  "EUR/USD Momentum signal triggered",
];

const Trading = () => {
  const [activities, setActivities] = useState<{ msg: string; time: string; isProfit: boolean }[]>([]);

  useEffect(() => {
    const addActivity = () => {
      const msg = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      const time = new Date().toLocaleTimeString();
      const isProfit = msg.includes("+") || msg.includes("confirmed") || msg.includes("hit");
      setActivities(prev => [{ msg, time, isProfit }, ...prev].slice(0, 10));
    };
    addActivity();
    const interval = setInterval(addActivity, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black">AI Trading</h1>
          <Badge className="bg-success/15 text-success border border-success/20 gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </Badge>
        </div>

        <MarketTicker />

        {/* AI Engine Card */}
        <Card className="glow-border overflow-hidden">
          <CardContent className="relative p-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="relative flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">Capvest AI Engine v4.2</h3>
                <p className="text-[10px] text-muted-foreground">Deep Learning • NLP • Technical Analysis</p>
              </div>
              <Badge variant="outline" className="border-primary/20 text-primary text-[10px]">
                <Shield className="mr-1 h-3 w-3" /> Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our proprietary neural network processes millions of data points per second across crypto, forex, and commodity markets to identify and execute high-probability trades with institutional-grade risk management.
            </p>
          </CardContent>
        </Card>

        {/* Performance Grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%" },
            { icon: BarChart3, label: "Avg Return", value: "12.3%" },
            { icon: Zap, label: "Trades/Day", value: "847" },
            { icon: Target, label: "Precision", value: "99.2%" },
          ].map(s => (
            <Card key={s.label} className="bg-card/50">
              <CardContent className="p-3 text-center">
                <s.icon className="mx-auto h-4 w-4 text-primary mb-1" />
                <p className="text-sm font-bold">{s.value}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How AI Works */}
        <Card className="bg-card/30">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-bold">How Our AI Works</h3>
            <div className="space-y-2.5">
              {[
                { icon: Activity, step: "Scans 500+ markets in real-time" },
                { icon: Brain, step: "Identifies high-probability patterns" },
                { icon: Shield, step: "Executes with strict risk controls" },
                { icon: Clock, step: "Distributes profits weekly" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="bg-card/30">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              Live System Activity
            </h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/20 px-3 py-2 text-[11px]">
                  <span className="text-muted-foreground">{a.msg}</span>
                  <span className="text-muted-foreground/40 shrink-0 ml-2 font-mono text-[10px]">{a.time}</span>
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
