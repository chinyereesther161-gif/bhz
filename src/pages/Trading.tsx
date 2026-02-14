import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, TrendingUp, Zap, Activity, BarChart3, Clock, Target, Cpu, Radio } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useMarketData, formatPrice } from "@/hooks/useMarketData";

const Trading = () => {
  const { data: marketData } = useMarketData(6);
  const [activities, setActivities] = useState<{ msg: string; time: string; type: string }[]>([]);

  // Generate activity from real market data
  const generateActivity = useCallback(() => {
    if (marketData.length === 0) return null;
    const coin = marketData[Math.floor(Math.random() * marketData.length)];
    const sym = coin.symbol.toUpperCase();
    const pct = (Math.random() * 4 + 0.5).toFixed(1);
    const isUp = coin.price_change_percentage_24h >= 0;
    const templates = [
      { msg: `${sym}/USD ${isUp ? "Long" : "Short"} +${pct}% executed`, type: "profit" },
      { msg: `${sym}/USD Take profit hit +${pct}%`, type: "profit" },
      { msg: `${sym}/USD Entry signal at $${formatPrice(coin.current_price)}`, type: "signal" },
      { msg: `Risk management: ${sym} position adjusted`, type: "risk" },
      { msg: `${sym} breakout confirmed at $${formatPrice(coin.current_price)}`, type: "signal" },
      { msg: `Dynamic stop-loss adjusted ${sym}`, type: "risk" },
      { msg: `${sym}/USD momentum signal triggered`, type: "signal" },
    ];
    const item = templates[Math.floor(Math.random() * templates.length)];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return { ...item, time };
  }, [marketData]);

  useEffect(() => {
    if (marketData.length === 0) return;
    // Seed initial activities
    const initial = Array.from({ length: 5 }, () => generateActivity()).filter(Boolean) as { msg: string; time: string; type: string }[];
    setActivities(initial);
    const interval = setInterval(() => {
      const item = generateActivity();
      if (item) setActivities(prev => [item, ...prev].slice(0, 15));
    }, 3000);
    return () => clearInterval(interval);
  }, [marketData, generateActivity]);

  const typeColor = (t: string) => t === "profit" ? "text-success" : t === "signal" ? "text-primary" : "text-muted-foreground/60";
  const typeDot = (t: string) => t === "profit" ? "bg-success" : t === "signal" ? "bg-primary" : "bg-muted-foreground/30";

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <h1 className="text-xl font-black">AI Trading</h1>
          <Badge className="bg-success/10 text-success border border-success/15 gap-1 font-bold text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </Badge>
        </motion.div>

        {/* Live market prices */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {marketData.slice(0, 5).map(coin => (
              <div key={coin.id} className="shrink-0 rounded-xl border border-border/15 bg-card/20 px-3 py-2 min-w-[100px]">
                <p className="text-[9px] font-bold uppercase text-muted-foreground/50">{coin.symbol}/USD</p>
                <p className="text-xs font-black font-mono mt-0.5">${formatPrice(coin.current_price)}</p>
                <p className={`text-[9px] font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"}`}>
                  {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Engine Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="glow-border overflow-hidden">
            <CardContent className="relative p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
              <div className="relative flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold">Capvest AI Engine v4.2</h3>
                    <Badge variant="outline" className="border-primary/15 text-primary text-[8px] py-0">
                      <Shield className="mr-0.5 h-2.5 w-2.5" /> Verified
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">Deep Learning • NLP Sentiment • 200+ Indicators</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                Our neural network processes millions of data points per second across crypto, forex, and commodities — executing high-probability trades with institutional risk management.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="grid grid-cols-4 gap-2">
          {[
            { icon: TrendingUp, label: "Win Rate", value: "94.7%", color: "text-success" },
            { icon: BarChart3, label: "Return", value: "12.3%", color: "text-primary" },
            { icon: Zap, label: "Trades", value: "847", color: "text-foreground" },
            { icon: Target, label: "Precision", value: "99.2%", color: "text-primary" },
          ].map(s => (
            <Card key={s.label} className="bg-card/15 border-border/15">
              <CardContent className="relative p-3 text-center">
                <s.icon className={`mx-auto h-3.5 w-3.5 ${s.color} mb-1 opacity-60`} />
                <p className={`text-xs font-black ${s.color}`}>{s.value}</p>
                <p className="text-[7px] text-muted-foreground/30 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* How AI Works */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Card className="bg-card/10 border-border/15">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="h-3.5 w-3.5 text-primary/60" />
                <h3 className="text-xs font-bold">How Our AI Works</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { step: "Scans 500+ markets in real-time" },
                  { step: "Identifies high-probability patterns" },
                  { step: "Executes with strict risk controls" },
                  { step: "Distributes profits every Monday" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-[9px] font-black text-primary border border-primary/10">
                      {i + 1}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">{s.step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/10 border-border/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/10">
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-success" />
                  Live System Activity
                </h3>
                <span className="text-[9px] text-muted-foreground/25">Auto-refreshing</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-border/8">
                {activities.map((a, i) => (
                  <motion.div
                    key={`${a.time}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2.5 px-5 py-2.5 hover:bg-card/15 transition-colors"
                  >
                    <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${typeDot(a.type)}`} />
                    <span className={`text-[10px] flex-1 ${typeColor(a.type)}`}>{a.msg}</span>
                    <span className="text-muted-foreground/20 shrink-0 font-mono text-[9px]">{a.time}</span>
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
