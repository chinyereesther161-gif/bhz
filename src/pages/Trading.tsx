import AppLayout from "@/components/AppLayout";
import MarketTicker from "@/components/landing/MarketTicker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, TrendingUp, Zap, Activity, BarChart3, Clock, Target, Cpu, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const activityMessages = [
  { msg: "BTC/USD Long +2.4% executed", type: "profit" },
  { msg: "ETH/USD Short closed +1.8%", type: "profit" },
  { msg: "SOL/USD Entry signal detected", type: "signal" },
  { msg: "Risk management: Position reduced", type: "risk" },
  { msg: "XRP/USD Take profit hit +3.1%", type: "profit" },
  { msg: "Market scan: 12 opportunities found", type: "signal" },
  { msg: "Portfolio rebalanced automatically", type: "risk" },
  { msg: "BNB/USD Breakout confirmed", type: "signal" },
  { msg: "GOLD Hedge position opened", type: "risk" },
  { msg: "EUR/USD Momentum signal triggered", type: "signal" },
  { msg: "AVAX/USD Long +4.2% closed", type: "profit" },
  { msg: "Dynamic stop-loss adjusted BTC", type: "risk" },
];

const Trading = () => {
  const [activities, setActivities] = useState<{ msg: string; time: string; type: string }[]>([]);

  useEffect(() => {
    const addActivity = () => {
      const item = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setActivities(prev => [{ ...item, time }, ...prev].slice(0, 15));
    };
    addActivity();
    addActivity();
    addActivity();
    const interval = setInterval(addActivity, 2500);
    return () => clearInterval(interval);
  }, []);

  const typeColor = (t: string) => {
    if (t === "profit") return "text-success";
    if (t === "signal") return "text-primary";
    return "text-muted-foreground";
  };

  const typeDot = (t: string) => {
    if (t === "profit") return "bg-success";
    if (t === "signal") return "bg-primary";
    return "bg-muted-foreground/50";
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <h1 className="text-xl font-black">AI Trading</h1>
          <Badge className="bg-success/10 text-success border border-success/15 gap-1.5 font-bold text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </Badge>
        </motion.div>

        <MarketTicker />

        {/* AI Engine Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glow-border overflow-hidden">
            <CardContent className="relative p-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
              <div className="relative flex items-start gap-4 mb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">Capvest AI Engine v4.2</h3>
                    <Badge variant="outline" className="border-primary/15 text-primary text-[9px] py-0">
                      <Shield className="mr-1 h-2.5 w-2.5" /> Verified
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">Deep Learning • NLP Sentiment • 200+ Technical Indicators</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                Our proprietary neural network processes millions of data points per second across crypto, forex, and commodity markets — identifying and executing high-probability trades with institutional-grade risk management.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Grid */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-4 gap-2.5">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%", color: "text-success" },
            { icon: BarChart3, label: "Avg Return", value: "12.3%", color: "text-primary" },
            { icon: Zap, label: "Trades/Day", value: "847", color: "text-foreground" },
            { icon: Target, label: "Precision", value: "99.2%", color: "text-primary" },
          ].map(s => (
            <Card key={s.label} className="bg-card/20 border-border/20 overflow-hidden">
              <CardContent className="relative p-3.5 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
                <div className="relative">
                  <s.icon className={`mx-auto h-4 w-4 ${s.color} mb-1.5 opacity-70`} />
                  <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[8px] text-muted-foreground/40 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* How AI Works */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/15 border-border/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-primary/70" />
                <h3 className="text-sm font-bold">How Our AI Works</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Radio, step: "Scans 500+ markets in real-time" },
                  { icon: Brain, step: "Identifies high-probability patterns" },
                  { icon: Shield, step: "Executes with strict risk controls" },
                  { icon: Clock, step: "Distributes profits every Monday" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-[10px] font-black text-primary border border-primary/10">
                      {i + 1}
                    </span>
                    <span className="text-xs text-muted-foreground/70">{s.step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card/15 border-border/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/15">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success" />
                  Live System Activity
                </h3>
                <span className="text-[10px] text-muted-foreground/30">Auto-refreshing</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border/10">
                {activities.map((a, i) => (
                  <motion.div
                    key={`${a.time}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-card/20 transition-colors"
                  >
                    <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${typeDot(a.type)}`} />
                    <span className={`text-[11px] flex-1 ${typeColor(a.type)}`}>{a.msg}</span>
                    <span className="text-muted-foreground/25 shrink-0 font-mono text-[10px]">{a.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Trading;
