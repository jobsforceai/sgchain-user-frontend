import { create } from "zustand";
import { getMarketCandles, getSgcPrice, SgcCandle } from "@/services/market.service";
import socketService from "@/services/socket.service";
import { CandlestickData } from "lightweight-charts";

interface MarketTick {
  symbol: 'sgc';
  last: number;
  ts: number;
}

interface MarketState {
  candles: CandlestickData[];
  livePrice: number | null;
  loading: boolean;
  error: string | null;
  fetchInitialPrice: () => Promise<void>;
  fetchHistoricalData: (symbol: string) => Promise<void>;
  subscribeToLiveUpdates: (symbol: string) => void;
  unsubscribeFromLiveUpdates: (symbol: string) => void;
}

const useMarketStore = create<MarketState>((set, get) => ({
  candles: [],
  livePrice: null,
  loading: false,
  error: null,
  fetchInitialPrice: async () => {
    try {
      const data = await getSgcPrice();
      set({ livePrice: data.priceUsd });
    } catch (err) {
      console.error("[MarketStore] Failed to fetch initial SGC price:", err);
      // Don't set an error here, as the WebSocket might still work
    }
  },
  fetchHistoricalData: async (symbol: string) => {
    set({ loading: true, error: null });
    try {
      const to = Math.floor(Date.now() / 1000);
      const from = to - (24 * 60 * 60); // 24 hours ago
      const resolution = '1';
      const rawCandles = await getMarketCandles(symbol, resolution, from, to);
      
      const formattedCandles = rawCandles.map(candle => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      set({ candles: formattedCandles as CandlestickData[], loading: false });
    } catch (err) {
      console.error("[MarketStore] Failed to fetch market candles:", err);
      set({ error: "Failed to load chart data.", loading: false });
    }
  },
  subscribeToLiveUpdates: (symbol: string) => {
    socketService.connect();
    socketService.emit("market:subscribe", symbol);

    socketService.on("market:tick", (data: MarketTick) => {
      if (data.symbol === symbol) {
        set({ livePrice: data.last });
        
        const { candles } = get();
        if (candles.length > 0) {
          const lastCandle = candles[candles.length - 1] as CandlestickData;
          const newCandle: CandlestickData = {
            ...lastCandle,
            close: data.last,
            high: Math.max(lastCandle.high, data.last),
            low: Math.min(lastCandle.low, data.last),
          };
          
          set({ candles: [...candles.slice(0, -1), newCandle] });
        }
      }
    });
  },
  unsubscribeFromLiveUpdates: (symbol: string) => {
    socketService.emit("market:unsubscribe", symbol);
  }
}));

export default useMarketStore;
