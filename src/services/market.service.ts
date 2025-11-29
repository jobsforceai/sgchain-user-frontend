import axios from "axios";
import { CandlestickData } from "lightweight-charts";
import { MARKET_API_BASE_URL } from "./apiConfig";

export type SgcCandle = Omit<CandlestickData, 'time'> & {
  time: number;
  volume: number;
};

// Create a separate axios instance specifically for the v1 market API
const marketApi = axios.create({
  baseURL: MARKET_API_BASE_URL,
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

export interface SgcPrice {
  symbol: string;
  priceUsd: number;
  lastUpdatedAt: string;
}

export const getSgcPrice = (): Promise<SgcPrice> => {
  return marketApi.get("/market/sgc-price").then(r => r.data);
};
