import { create } from "zustand";
import { getHistory, Transaction } from "@/services/history.service";
import axios from "axios";

interface HistoryState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
}

const useHistoryStore = create<HistoryState>((set) => ({
  transactions: [],
  loading: false,
  error: null,
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const { items } = await getHistory();
      set({ transactions: items, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch history", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
}));

export default useHistoryStore;
