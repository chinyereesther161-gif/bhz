import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarketData, formatPrice, formatMarketCap, formatVolume } from "@/hooks/useMarketData";
import { TrendingUp, TrendingDown, Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

const Markets = () => {
  const { data, loading } = useMarketData(10);
  const [search, setSearch] = useState("");

  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalVolume = data.reduce((s, c) => s + (c.total_volume || 0), 0);

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black">Markets</h1>
            <Badge className="bg-success/10 text-success border border-success/15 gap-1 text-[10px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Live
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground/40">Real-time cryptocurrency prices via CoinGecko</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
          <Input placeholder="Search markets..." value={search} onChange={e => setSearch(e.target.value)} className="h-11 pl-10 bg-card/20 border-border/15 rounded-xl text-sm" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Volume", value: formatVolume(totalVolume), icon: Globe },
            { label: "Assets", value: `${data.length}`, icon: TrendingUp },
            { label: "Status", value: loading ? "Loading..." : "Live", icon: Search },
          ].map(s => (
            <Card key={s.label} className="bg-card/20 border-border/15">
              <CardContent className="p-3 text-center">
                <s.icon className="mx-auto h-3.5 w-3.5 text-primary/60 mb-1" />
                <p className="text-xs font-black">{s.value}</p>
                <p className="text-[8px] text-muted-foreground/30 uppercase tracking-wider font-semibold mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="bg-card/10 border-border/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/10 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/30">
                <span className="flex-1">Asset</span>
                <span className="w-20 text-center">7D Chart</span>
                <span className="w-20 text-right">Price</span>
                <span className="w-14 text-right">24h</span>
              </div>

              <div className="divide-y divide-border/8">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse bg-card/10" />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="px-5 py-8 text-center text-xs text-muted-foreground/40">No results found</div>
                ) : (
                  filtered.map((c, i) => {
                    const sparkline = c.sparkline_in_7d?.price;
                    const miniPath = sparkline
                      ? sparkline.slice(-48).map((v, j, arr) => {
                          const min = Math.min(...arr);
                          const max = Math.max(...arr);
                          const range = max - min || 1;
                          const x = (j / (arr.length - 1)) * 70;
                          const y = 22 - ((v - min) / range) * 20;
                          return `${j === 0 ? "M" : "L"}${x},${y}`;
                        }).join(" ")
                      : "";
                    const isUp = c.price_change_percentage_24h >= 0;

                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between px-5 py-3 hover:bg-card/20 transition-colors"
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-2.5">
                          <span className="text-[10px] font-mono text-muted-foreground/20 w-4">{i + 1}</span>
                          {c.image && <img src={c.image} alt={c.name} className="h-6 w-6 rounded-full" />}
                          <div>
                            <p className="text-xs font-bold uppercase">{c.symbol}</p>
                            <p className="text-[9px] text-muted-foreground/30">{c.name}</p>
                          </div>
                        </div>
                        <div className="w-20 flex justify-center">
                          {miniPath && (
                            <svg viewBox="0 0 70 24" className="h-6 w-16">
                              <path d={miniPath} fill="none" stroke={isUp ? "hsl(155 72% 42%)" : "hsl(0 72% 51%)"} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                        <div className="w-20 text-right">
                          <p className="text-xs font-bold font-mono">${formatPrice(c.current_price)}</p>
                          <p className="text-[9px] text-muted-foreground/25">{formatMarketCap(c.market_cap)}</p>
                        </div>
                        <div className="w-14 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${isUp ? "text-success" : "text-destructive"}`}>
                            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {isUp ? "+" : ""}{c.price_change_percentage_24h.toFixed(1)}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Markets;
