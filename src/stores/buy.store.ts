import { create } from "zustand";
import { fetchBankAccounts, submitBuyRequest, getBuySgcRequests, instantBuySgc, BankAccountRegion, SubmitBuyRequestPayload } from "@/services/buy.service";
import axios from "axios";
import useWalletStore from "./wallet.store";

interface BuySgcRequest {
  _id: string;
  userId: string;
  bankRegion: string;
  fiatCurrency: string;
  fiatAmount: number;
  lockedSgcAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  lockedAt: string;
  approvedAt?: string;
  onchainTxHash?: string;
  onchainTo?: string;
}

interface BuyState {
  bankAccounts: BankAccountRegion[];
  requests: BuySgcRequest[];
  loading: boolean;
  error: string | null;
  fetchBankAccounts: () => Promise<void>;
  submitRequest: (payload: SubmitBuyRequestPayload) => Promise<void>;
  instantBuy: (sgcAmount: number) => Promise<any>;
  fetchRequests: (status?: 'PENDING' | 'APPROVED' | 'REJECTED') => Promise<void>;
}

const useBuyStore = create<BuyState>((set) => ({
  bankAccounts: [],
  requests: [],
  loading: false,
  error: null,
  fetchBankAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const { regions } = await fetchBankAccounts();
      set({ bankAccounts: regions, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch bank accounts", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  submitRequest: async (payload: SubmitBuyRequestPayload) => {
    set({ loading: true, error: null });
    try {
      await submitBuyRequest(payload);
      set({ loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to submit request", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error; // Re-throw to be caught in the component
    }
  },
  instantBuy: async (sgcAmount: number) => {
    set({ loading: true, error: null });
    try {
      const result = await instantBuySgc(sgcAmount);
      set({ loading: false });
      // Refetch wallet balances after successful purchase
      useWalletStore.getState().fetchWallet();
      return result;
    } catch (error: unknown) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to buy SGC");
      }
      throw new Error("An unexpected error occurred");
    }
  },
  fetchRequests: async (status?: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    set({ loading: true, error: null });
    try {
      const { items } = await getBuySgcRequests(status);
      set({ requests: items, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch requests", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
}));

export default useBuyStore;
