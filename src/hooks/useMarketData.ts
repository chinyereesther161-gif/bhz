import { useState, useEffect, useCallback, useRef } from "react";

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
  image: string;
}

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const useMarketData = (count = 10) => {
  const [data, setData] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=true&price_change_percentage=24h`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: MarketCoin[] = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        setData(json);
        setError(null);
        retryCount.current = 0;
      }
    } catch (err: any) {
      setError(err.message);
      retryCount.current++;
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchData();
    // Refresh every 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error };
};

export const formatPrice = (price: number): string => {
  if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
};

export const formatMarketCap = (cap: number): string => {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toLocaleString()}`;
};

export const formatVolume = (vol: number): string => {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
  return `$${vol.toLocaleString()}`;
};
