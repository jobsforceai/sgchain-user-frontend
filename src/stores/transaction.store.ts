import { create } from "zustand";
import socketService from "@/services/socket.service";

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: string;
}

interface TransactionState {
  transactions: Transaction[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isConnected: false,
  connect: () => {
    if (get().isConnected) return;

    socketService.connect();
    set({ isConnected: true });

    socketService.on("NEW_TRANSACTIONS", (newTransactions: Transaction[]) => {
      console.log("[TransactionStore] New Transactions Received:", newTransactions);
      set((state) => ({
        // Prepend new transactions and keep a max of 50 for performance
        transactions: [...newTransactions, ...state.transactions].slice(0, 50),
      }));
    });

    socketService.on("disconnect", () => {
        set({ isConnected: false });
    });
  },
  disconnect: () => {
    socketService.disconnect();
    set({ isConnected: false, transactions: [] });
  },
}));

export default useTransactionStore;
