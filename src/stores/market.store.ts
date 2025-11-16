import { create } from "zustand";

interface MarketState {
  sgcPrice: {
    symbol: string;
    priceUsd: number;
    lastUpdatedAt: string;
  } | null;
  setSgcPrice: (price: any) => void;
}

const useMarketStore = create<MarketState>((set) => ({
  sgcPrice: null,
  setSgcPrice: (price) => set({ sgcPrice: price }),
}));

export default useMarketStore;
