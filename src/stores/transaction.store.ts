import { create } from "zustand";
import socketService from "@/services/socket.service";
import explorerService, { Transaction } from "@/services/explorer.service";

// --- Module-level variables to manage the singleton socket connection ---
let connectionCounter = 0;
let disconnectTimeout: NodeJS.Timeout | null = null;
let listenersInitialized = false;

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

interface TransactionState {
  recentTransactions: Transaction[];
  recentBlocks: BlockHeader[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  fetchRecentTransactions: () => void;
}

const useTransactionStore = create<TransactionState>((set, get) => ({
  recentTransactions: [],
  recentBlocks: [],
  isConnected: false,
  fetchRecentTransactions: async () => {
    try {
      const transactions = await explorerService.fetchRecentTransactions();
      set({ recentTransactions: transactions });
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
    }
  },
  connect: () => {
    // If a disconnect is scheduled, cancel it
    if (disconnectTimeout) {
      console.log("[TransactionStore] Cancelling scheduled disconnect due to new connect call.");
      clearTimeout(disconnectTimeout);
      disconnectTimeout = null;
    }

    connectionCounter++;
    console.log(`[TransactionStore] Connect called. Counter: ${connectionCounter}`);

    // If this is the first component mounting, connect the socket
    if (connectionCounter === 1) {
      console.log("[TransactionStore] First component mounted. Connecting socket...");
      socketService.connect();
      get().fetchRecentTransactions();
    }

    // Ensure listeners are set up only once
    if (!listenersInitialized && socketService.socket) {
      console.log("[TransactionStore] Initializing WebSocket event listeners.");
      listenersInitialized = true;

      socketService.on("connect", () => {
        console.log("[TransactionStore] WebSocket connected.");
        set({ isConnected: true });
      });

      socketService.on("disconnect", () => {
        console.log("[TransactionStore] WebSocket disconnected.");
        set({ isConnected: false });
      });

      socketService.on("NEW_BLOCK", (newBlock: BlockHeader) => {
        console.log("[TransactionStore] New Block Received:", newBlock);
        get().fetchRecentTransactions();
        set((state) => ({
          recentBlocks: [newBlock, ...state.recentBlocks].slice(0, 6),
        }));
      });
    }
  },
  disconnect: () => {
    console.log(`[TransactionStore] Disconnect called. Scheduling disconnect. Counter: ${connectionCounter}`);
    
    // Schedule the actual disconnection
    disconnectTimeout = setTimeout(() => {
      connectionCounter--;
      console.log(`[TransactionStore] Executing scheduled disconnect. Counter: ${connectionCounter}`);

      if (connectionCounter === 0) {
        console.log("[TransactionStore] Last component unmounted. Disconnecting socket.");
        socketService.disconnect();
        // Clean up listeners and state
        listenersInitialized = false; 
        set({ isConnected: false, recentTransactions: [], recentBlocks: [] });
      }
    }, 100); // 100ms delay to bridge the Strict Mode mount/unmount gap
  },
}));

export default useTransactionStore;
