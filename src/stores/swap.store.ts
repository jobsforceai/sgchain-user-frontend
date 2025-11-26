import { create } from "zustand";
import { getQuote, executeSwap, QuotePayload, ExecuteSwapPayload, QuoteResponse, ExecuteSwapResponse } from "@/services/swap.service";
import axios from "axios";

interface SwapState {
  quote: QuoteResponse | null;
  swapResult: ExecuteSwapResponse | null;
  loading: boolean;
  error: string | null;
  fetchQuote: (payload: QuotePayload) => Promise<void>;
  performSwap: (payload: ExecuteSwapPayload) => Promise<void>;
  clearResult: () => void;
}

const useSwapStore = create<SwapState>((set) => ({
  quote: null,
  swapResult: null,
  loading: false,
  error: null,
  fetchQuote: async (payload: QuotePayload) => {
    set({ loading: true, error: null, quote: null });
    try {
      const quote = await getQuote(payload);
      set({ quote, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch quote", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  performSwap: async (payload: ExecuteSwapPayload) => {
    set({ loading: true, error: null, swapResult: null });
    try {
      const result = await executeSwap(payload);
      set({ swapResult: result, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Swap failed", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error; // Re-throw to be caught in the component
    }
  },
  clearResult: () => {
    set({ swapResult: null, error: null });
  }
}));

export default useSwapStore;
