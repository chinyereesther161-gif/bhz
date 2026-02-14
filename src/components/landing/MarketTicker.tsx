import { TrendingUp, TrendingDown } from "lucide-react";
import { useMarketData, formatPrice } from "@/hooks/useMarketData";

const MarketTicker = () => {
  const { data } = useMarketData(10);
  const items = [...data, ...data];

  return (
    <div className="w-full overflow-hidden border-y border-border/20 bg-card/30 backdrop-blur-sm py-3">
      <div className="animate-ticker flex whitespace-nowrap">
        {items.map((coin, i) => (
          <div key={`${coin.id}-${i}`} className="mx-6 inline-flex items-center gap-2.5 text-xs">
            <span className="font-bold text-foreground/90 uppercase">{coin.symbol}/USD</span>
            <span className="text-foreground/70 font-mono tracking-tight">${formatPrice(coin.current_price)}</span>
            <span className={`inline-flex items-center gap-0.5 font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"}`}>
              {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
