import { create } from "zustand";
import { setWalletPin, verifyWalletPin, getWalletDetails, fetchWallet } from "@/services/wallet.service";
import { redeemSagenexTransfer } from "@/services/redeem.service";
import { instantBuySgc } from "@/services/buy.service";
import { sellSgc } from "@/services/sell.service";
import Cookies from 'js-cookie';
import axios from "axios";

interface WalletDetails {
  onchainAddress: string;
  privateKey: string;
}

interface Wallet {
  userId: string;
  walletId: string;
  sgcBalance: number;
  fiatBalanceUsd: number;
  sgcOfficialPriceUsd: number;
  sgcValueUsd: number;
  totalAccountValueUsd: number;
  status: string;
  isPinSet: boolean;
}

interface WalletState {
  wallet: Wallet | null;
  walletDetails: WalletDetails | null;
  pinVerified: boolean;
  loading: boolean;
  error: string | null;
  fetchWallet: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<void>;
  fetchWalletDetails: () => Promise<void>;
  redeemTransfer: (transferCode: string) => Promise<void>;
  instantBuySgc: (sgcAmount: number) => Promise<void>;
  sellSgc: (sgcAmount: number) => Promise<void>;
  clearWalletDetails: () => void;
}

const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  walletDetails: null,
  pinVerified: false,
  loading: false,
  error: null,
  fetchWallet: async () => {
    set({ loading: true, error: null });
    try {
      const walletData = await fetchWallet();
      set({ wallet: walletData, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch wallet", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  setPin: async (pin: string) => {
    set({ loading: true, error: null });
    try {
      await setWalletPin(pin);
      set({ loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to set PIN", loading: false });
      }
      else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error;
    }
  },
  verifyPin: async (pin: string) => {
    set({ loading: true, error: null });
    try {
      const { walletAccessToken, expiresIn } = await verifyWalletPin(pin);
      const expires = new Date(new Date().getTime() + expiresIn * 1000);
      Cookies.set('wallet_access_token', walletAccessToken, { expires });
      set({ pinVerified: true, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to verify PIN", pinVerified: false, loading: false });
      } else {
        set({ error: "An unexpected error occurred", pinVerified: false, loading: false });
      }
      throw error;
    }
  },
  fetchWalletDetails: async () => {
    set({ loading: true, error: null });
    try {
      const details = await getWalletDetails();
      set({ walletDetails: details, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch wallet details", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  redeemTransfer: async (transferCode: string) => {
    set({ loading: true, error: null });
    try {
      const { usdBalanceAfter } = await redeemSagenexTransfer(transferCode);
      const currentWallet = get().wallet;
      if (currentWallet) {
        set({
          wallet: { ...currentWallet, fiatBalanceUsd: usdBalanceAfter },
          loading: false,
        });
      } else {
        await get().fetchWallet();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to redeem transfer", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error;
    }
  },
  instantBuySgc: async (sgcAmount: number) => {
    set({ loading: true, error: null });
    try {
      const { sgcBalanceAfter, usdBalanceAfter } = await instantBuySgc(sgcAmount);
      const currentWallet = get().wallet;
      if (currentWallet) {
        set({
          wallet: {
            ...currentWallet,
            sgcBalance: sgcBalanceAfter,
            fiatBalanceUsd: usdBalanceAfter,
          },
          loading: false,
        });
      } else {
        await get().fetchWallet();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to buy SGC", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error;
    }
  },
  sellSgc: async (sgcAmount: number) => {
    set({ loading: true, error: null });
    try {
      const { sgcBalanceAfter, usdBalanceAfter } = await sellSgc(sgcAmount);
      const currentWallet = get().wallet;
      if (currentWallet) {
        set({
          wallet: {
            ...currentWallet,
            sgcBalance: sgcBalanceAfter,
            fiatBalanceUsd: usdBalanceAfter,
          },
          loading: false,
        });
      } else {
        await get().fetchWallet();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to sell SGC", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error;
    }
  },
  clearWalletDetails: () => {
    Cookies.remove('wallet_access_token');
    set({ walletDetails: null, pinVerified: false });
  },
}));

export default useWalletStore;
