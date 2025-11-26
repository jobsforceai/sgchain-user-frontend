import api from "./api";
import axios from "axios";
import { CandlestickData } from "lightweight-charts";

export type SgcCandle = Omit<CandlestickData, 'time'> & {
  time: number;
  volume: number;
};

// Create a separate axios instance specifically for the v1 market API
const marketApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000') + '/api/v1',
});

export const getMarketCandles = (
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<SgcCandle[]> => {
  const params = { symbol, resolution, from, to };
  
  console.log('[MarketService] Fetching candles with params:', params);
  return marketApi.get("/market/candles", { params }).then(r => {
    console.log('[MarketService] Received raw candle data:', r.data);
    return r.data;
  });
};
