import { create } from "zustand";
import { getTransactionByHash, TransactionDetails } from "@/services/explorer.service";
import axios from "axios";

interface ExplorerState {
  transactionDetails: TransactionDetails | null;
  loading: boolean;
  error: string | null;
  fetchTransaction: (hash: string) => Promise<void>;
  clearTransaction: () => void;
}

const useExplorerStore = create<ExplorerState>((set) => ({
  transactionDetails: null,
  loading: false,
  error: null,
  fetchTransaction: async (hash: string) => {
    set({ loading: true, error: null, transactionDetails: null });
    try {
      const details = await getTransactionByHash(hash);
      set({ transactionDetails: details, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message || "Failed to fetch transaction details", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  clearTransaction: () => {
    set({ transactionDetails: null, error: null });
  },
}));

export default useExplorerStore;
