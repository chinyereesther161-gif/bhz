import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, TrendingUp, TrendingDown, Zap, Activity, BarChart3, Clock, Target, Cpu, ArrowUpRight, ArrowDownRight, Crosshair, Gauge, Radio } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketData, formatPrice, formatVolume } from "@/hooks/useMarketData";

const Trading = () => {
  const { data: marketData, loading } = useMarketData(20);
  const [activities, setActivities] = useState<{ msg: string; time: string; type: string; pair: string; direction: string; entry: string; pnl: string }[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const generateActivity = useCallback(() => {
    if (marketData.length === 0) return null;
    const coin = marketData[Math.floor(Math.random() * marketData.length)];
    const sym = coin.symbol.toUpperCase();
    const pct = (Math.random() * 6 + 0.3).toFixed(2);
    const change = coin.price_change_percentage_24h ?? 0;
    const isLong = change >= 0 ? Math.random() > 0.3 : Math.random() > 0.7;
    const direction = isLong ? "LONG" : "SHORT";
    const templates = [
      { msg: `${direction} ${sym}/USDT executed at $${formatPrice(coin.current_price)}`, type: "execution" },
      { msg: `Take-profit triggered on ${sym}/USDT (+${pct}%)`, type: "profit" },
      { msg: `${sym}/USDT position scaled ${isLong ? "up" : "down"}`, type: "adjustment" },
      { msg: `Stop-loss moved to breakeven on ${sym}/USDT`, type: "risk" },
      { msg: `New ${direction} signal detected for ${sym}/USDT`, type: "signal" },
    ];
    const item = templates[Math.floor(Math.random() * templates.length)];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return { ...item, time, pair: `${sym}/USDT`, direction, entry: `$${formatPrice(coin.current_price)}`, pnl: `+${pct}%` };
  }, [marketData]);

  useEffect(() => {
    if (marketData.length === 0) return;
    const initial = Array.from({ length: 8 }, () => generateActivity()).filter(Boolean) as typeof activities;
    setActivities(initial);
    const interval = setInterval(() => {
      const item = generateActivity();
      if (item) setActivities(prev => [item, ...prev].slice(0, 20));
    }, 3000);
    return () => clearInterval(interval);
  }, [marketData, generateActivity]);

  const typeConfig: Record<string, { color: string; dot: string; label: string }> = {
    execution: { color: "text-primary", dot: "bg-primary", label: "EXEC" },
    profit: { color: "text-success", dot: "bg-success", label: "TP" },
    adjustment: { color: "text-foreground/70", dot: "bg-foreground/40", label: "ADJ" },
    risk: { color: "text-amber-400", dot: "bg-amber-400", label: "RISK" },
    signal: { color: "text-blue-400", dot: "bg-blue-400", label: "SIG" },
  };

  const totalVolume = marketData.reduce((s, c) => s + (c.total_volume || 0), 0);
  const avgChange = marketData.length > 0 ? marketData.reduce((s, c) => s + (c.price_change_percentage_24h ?? 0), 0) / marketData.length : 0;
  const positiveCount = marketData.filter(c => (c.price_change_percentage_24h ?? 0) >= 0).length;

  const topGainers = useMemo(() =>
    [...marketData].sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)).slice(0, 5),
    [marketData]
  );
  const topLosers = useMemo(() =>
    [...marketData].sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0)).slice(0, 5),
    [marketData]
  );

  const selectedCoin = selectedAsset ? marketData.find(c => c.id === selectedAsset) : null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2">
              AI Trading Terminal
            </h1>
            <p className="text-[10px] text-muted-foreground/40 mt-0.5">Real-time market intelligence and automated execution</p>
          </div>
          <Badge className="bg-success/10 text-success border border-success/15 gap-1.5 font-bold text-[10px] px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Engine Active
          </Badge>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { icon: BarChart3, label: "24h Volume", value: formatVolume(totalVolume), color: "text-primary" },
            { icon: Activity, label: "Markets Tracked", value: `${marketData.length}`, color: "text-foreground" },
            { icon: Gauge, label: "Market Sentiment", value: avgChange >= 0 ? "Bullish" : "Bearish", color: avgChange >= 0 ? "text-success" : "text-destructive" },
            { icon: Target, label: "Positive / Total", value: `${positiveCount}/${marketData.length}`, color: "text-primary" },
          ].map(s => (
            <Card key={s.label} className="bg-card/15 border-border/15">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <s.icon className={`h-3.5 w-3.5 ${s.color} opacity-60`} />
                  <span className="text-[8px] text-muted-foreground/30 font-semibold uppercase tracking-wider">{s.label}</span>
                </div>
                <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Left Column - Market Data */}
          <div className="lg:col-span-3 space-y-4">
            {/* Live Price Ticker */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <Card className="bg-card/10 border-border/15 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/10 bg-card/20">
                    <h3 className="text-[11px] font-bold flex items-center gap-1.5">
                      <Radio className="h-3 w-3 text-success" />
                      Live Markets
                    </h3>
                    <span className="text-[8px] text-muted-foreground/25 font-mono">REAL-TIME</span>
                  </div>
                  {loading ? (
                    <div className="p-4 space-y-2">
                      {[1,2,3,4,5].map(i => <div key={i} className="h-10 rounded-lg bg-card/20 animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="divide-y divide-border/8 max-h-[420px] overflow-y-auto">
                      {marketData.map(coin => {
                        const change = coin.price_change_percentage_24h ?? 0;
                        const isUp = change >= 0;
                        const isSelected = selectedAsset === coin.id;
                        return (
                          <button
                            key={coin.id}
                            onClick={() => setSelectedAsset(isSelected ? null : coin.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-card/20 transition-all text-left ${isSelected ? "bg-primary/[0.06] border-l-2 border-l-primary" : ""}`}
                          >
                            {coin.image && <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold uppercase">{coin.symbol}</span>
                                <span className="text-[8px] text-muted-foreground/25">/USDT</span>
                              </div>
                              <span className="text-[9px] text-muted-foreground/30 truncate block">{coin.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-bold font-mono">${formatPrice(coin.current_price)}</p>
                              <p className={`text-[9px] font-bold flex items-center justify-end gap-0.5 ${isUp ? "text-success" : "text-destructive"}`}>
                                {isUp ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                                {isUp ? "+" : ""}{change.toFixed(2)}%
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Gainers / Losers */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="grid grid-cols-2 gap-3">
              {/* Top Gainers */}
              <Card className="bg-card/10 border-border/15 overflow-hidden">
                <CardContent className="p-0">
                  <div className="px-4 py-2.5 border-b border-border/10 bg-success/[0.03]">
                    <h3 className="text-[10px] font-bold flex items-center gap-1.5 text-success">
                      <TrendingUp className="h-3 w-3" /> Top Gainers
                    </h3>
                  </div>
                  <div className="divide-y divide-border/8">
                    {topGainers.map(coin => (
                      <div key={coin.id} className="flex items-center gap-2 px-4 py-2">
                        {coin.image && <img src={coin.image} alt={coin.name} className="h-4 w-4 rounded-full" />}
                        <span className="text-[10px] font-bold uppercase flex-1">{coin.symbol}</span>
                        <span className="text-[10px] font-bold text-success">+{(coin.price_change_percentage_24h ?? 0).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Top Losers */}
              <Card className="bg-card/10 border-border/15 overflow-hidden">
                <CardContent className="p-0">
                  <div className="px-4 py-2.5 border-b border-border/10 bg-destructive/[0.03]">
                    <h3 className="text-[10px] font-bold flex items-center gap-1.5 text-destructive">
                      <TrendingDown className="h-3 w-3" /> Top Losers
                    </h3>
                  </div>
                  <div className="divide-y divide-border/8">
                    {topLosers.map(coin => (
                      <div key={coin.id} className="flex items-center gap-2 px-4 py-2">
                        {coin.image && <img src={coin.image} alt={coin.name} className="h-4 w-4 rounded-full" />}
                        <span className="text-[10px] font-bold uppercase flex-1">{coin.symbol}</span>
                        <span className="text-[10px] font-bold text-destructive">{(coin.price_change_percentage_24h ?? 0).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - AI Engine + Activity */}
          <div className="lg:col-span-2 space-y-4">
            {/* Asset Detail (when selected) */}
            <AnimatePresence>
              {selectedCoin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card className="bg-card/15 border-primary/15 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {selectedCoin.image && <img src={selectedCoin.image} alt={selectedCoin.name} className="h-8 w-8 rounded-full" />}
                        <div>
                          <p className="text-sm font-black uppercase">{selectedCoin.symbol}/USDT</p>
                          <p className="text-[9px] text-muted-foreground/40">{selectedCoin.name}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm font-black font-mono">${formatPrice(selectedCoin.current_price)}</p>
                          <p className={`text-[10px] font-bold ${(selectedCoin.price_change_percentage_24h ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
                            {(selectedCoin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}{(selectedCoin.price_change_percentage_24h ?? 0).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Market Cap", value: formatVolume(selectedCoin.market_cap || 0) },
                          { label: "24h Volume", value: formatVolume(selectedCoin.total_volume || 0) },
                          { label: "24h High", value: `$${formatPrice(selectedCoin.high_24h || 0)}` },
                          { label: "24h Low", value: `$${formatPrice(selectedCoin.low_24h || 0)}` },
                        ].map(d => (
                          <div key={d.label} className="rounded-lg bg-secondary/15 border border-border/10 px-3 py-2">
                            <p className="text-[8px] text-muted-foreground/30 font-semibold uppercase tracking-wider">{d.label}</p>
                            <p className="text-[11px] font-bold font-mono mt-0.5">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Engine Status */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glow-border overflow-hidden">
                <CardContent className="relative p-4">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[11px] font-bold">Capvest AI Engine</h3>
                          <Badge variant="outline" className="border-success/20 text-success text-[7px] py-0 px-1.5">
                            ACTIVE
                          </Badge>
                        </div>
                        <p className="text-[9px] text-muted-foreground/40 mt-0.5">Neural Network v4.2</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Strategy", value: "Multi-timeframe momentum", icon: Crosshair },
                        { label: "Risk Protocol", value: "Dynamic hedging active", icon: Shield },
                        { label: "Execution", value: "Sub-50ms latency", icon: Zap },
                        { label: "Coverage", value: "500+ markets 24/7", icon: Activity },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-secondary/10 border border-border/8 px-3 py-2">
                          <item.icon className="h-3 w-3 text-primary/50 shrink-0" />
                          <span className="text-[9px] text-muted-foreground/40 flex-1">{item.label}</span>
                          <span className="text-[9px] font-semibold text-foreground/70">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Trade Feed */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              <Card className="bg-card/10 border-border/15 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/10 bg-card/20">
                    <h3 className="text-[11px] font-bold flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-success" />
                      Live Trade Feed
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-success animate-pulse" />
                      <span className="text-[8px] text-muted-foreground/25 font-mono">STREAMING</span>
                    </div>
                  </div>
                  <div className="max-h-[340px] overflow-y-auto divide-y divide-border/6">
                    {activities.map((a, i) => {
                      const config = typeConfig[a.type] || typeConfig.signal;
                      return (
                        <motion.div
                          key={`${a.time}-${i}`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-card/15 transition-colors"
                        >
                          <div className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${config.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Badge variant="outline" className={`${config.color} border-current/20 text-[7px] py-0 px-1 font-bold`}>
                                {config.label}
                              </Badge>
                              <span className="text-[8px] text-muted-foreground/20 font-mono">{a.time}</span>
                            </div>
                            <p className={`text-[10px] leading-relaxed ${config.color}`}>{a.msg}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Trading;
