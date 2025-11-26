import { create } from "zustand";
import socketService from "@/services/socket.service";

interface BlockHeader {
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  stateRoot: string;
  timestamp: string;
  transactionsRoot: string;
}

interface NewTransactionEvent {
  hash: string;
}

interface TransactionState {
  pendingTransactions: NewTransactionEvent[];
  recentBlocks: BlockHeader[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const useTransactionStore = create<TransactionState>((set, get) => ({
  pendingTransactions: [],
  recentBlocks: [],
  isConnected: false,
  connect: () => {
    if (get().isConnected) return;

    socketService.connect();
    set({ isConnected: true });

    socketService.on("NEW_TRANSACTION", (newTransaction: NewTransactionEvent) => {
      console.log("[TransactionStore] New Transaction Received:", newTransaction);
      set((state) => ({
        pendingTransactions: [newTransaction, ...state.pendingTransactions].slice(0, 50),
      }));
    });

    socketService.on("NEW_BLOCK", (newBlock: BlockHeader) => {
      console.log("[TransactionStore] New Block Received:", newBlock);
      set((state) => ({
        recentBlocks: [newBlock, ...state.recentBlocks].slice(0, 6),
      }));
    });

    socketService.on("disconnect", () => {
        set({ isConnected: false });
    });
  },
  disconnect: () => {
    socketService.disconnect();
    set({ isConnected: false, pendingTransactions: [], recentBlocks: [] });
  },
}));

export default useTransactionStore;
