import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const INITIAL_PRICES = [
  { symbol: "BTC/USD", price: 97842.50, change: 2.34 },
  { symbol: "ETH/USD", price: 3421.80, change: -0.87 },
  { symbol: "SOL/USD", price: 187.45, change: 5.12 },
  { symbol: "BNB/USD", price: 612.30, change: 1.45 },
  { symbol: "XRP/USD", price: 2.41, change: -1.23 },
  { symbol: "ADA/USD", price: 0.89, change: 3.67 },
  { symbol: "DOGE/USD", price: 0.324, change: -2.11 },
  { symbol: "EUR/USD", price: 1.0842, change: 0.12 },
  { symbol: "GBP/USD", price: 1.2634, change: -0.08 },
  { symbol: "GOLD", price: 2891.40, change: 0.45 },
];

const MarketTicker = () => {
  const [prices, setPrices] = useState(INITIAL_PRICES);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev =>
        prev.map(p => ({
          ...p,
          price: p.price * (1 + (Math.random() - 0.5) * 0.002),
          change: p.change + (Math.random() - 0.5) * 0.3,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const items = [...prices, ...prices];

  return (
    <div className="w-full overflow-hidden border-y border-border bg-secondary/30 py-3">
      <div className="animate-ticker flex whitespace-nowrap">
        {items.map((item, i) => (
          <div key={i} className="mx-6 inline-flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{item.symbol}</span>
            <span className="text-muted-foreground">
              ${item.price < 10 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={`inline-flex items-center gap-0.5 ${item.change >= 0 ? "text-success" : "text-destructive"}`}>
              {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
