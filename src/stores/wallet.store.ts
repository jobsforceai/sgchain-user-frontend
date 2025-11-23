import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  setWalletPin,
  verifyWalletPin,
  getWalletDetails,
  fetchWallet,
} from "@/services/wallet.service";
import { redeemSagenexTransfer } from "@/services/redeem.service";
import { instantBuySgc } from "@/services/buy.service";
import { sellSgc } from "@/services/sell.service";
import Cookies from "js-cookie";
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
  pinVerifiedForDetails: boolean;
  isWalletUnlocked: boolean;
  unlockTimestamp: number | null;
  loading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  fetchWallet: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<void>;
  fetchWalletDetails: () => Promise<void>;
  redeemTransfer: (transferCode: string) => Promise<void>;
  instantBuySgc: (sgcAmount: number) => Promise<void>;
  sellSgc: (sgcAmount: number) => Promise<void>;
  clearWalletDetails: () => void;
  lockWallet: () => void;
  unlockWallet: () => void;
  resetUnlockTimer: (duration?: number) => void;
}

let lockTimeout: NodeJS.Timeout | null = null;

const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallet: null,
      walletDetails: null,
      pinVerifiedForDetails: false,
      isWalletUnlocked: false,
      unlockTimestamp: null,
      loading: false,
      error: null,
      _hasHydrated: false,
      fetchWallet: async () => {
        set({ loading: true, error: null });
        try {
          const walletData = await fetchWallet();
          set({ wallet: walletData, loading: false });
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            set({
              error: error.response?.data?.error || "Failed to fetch wallet",
              loading: false,
            });
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
            set({
              error: error.response?.data?.error || "Failed to set PIN",
              loading: false,
            });
          } else {
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
          Cookies.set("wallet_access_token", walletAccessToken, { expires });
          const unlockTimestamp = Date.now();
          console.log(`[WalletStore] verifyPin: Success. Setting unlockTimestamp: ${unlockTimestamp}`);
          set({
            pinVerifiedForDetails: true,
            isWalletUnlocked: true,
            loading: false,
            unlockTimestamp: unlockTimestamp,
          });
          get().resetUnlockTimer();
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            set({
              error: error.response?.data?.error || "Failed to verify PIN",
              pinVerifiedForDetails: false,
              loading: false,
            });
          } else {
            set({
              error: "An unexpected error occurred",
              pinVerifiedForDetails: false,
              loading: false,
            });
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
            set({
              error:
                error.response?.data?.error || "Failed to fetch wallet details",
              loading: false,
            });
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
            set({
              error:
                error.response?.data?.error || "Failed to redeem transfer",
              loading: false,
            });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
          throw error;
        }
      },
      instantBuySgc: async (sgcAmount: number) => {
        set({ loading: true, error: null });
        try {
          const { sgcBalanceAfter, usdBalanceAfter } = await instantBuySgc(
            sgcAmount
          );
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
            set({
              error: error.response?.data?.error || "Failed to buy SGC",
              loading: false,
            });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
          throw error;
        }
      },
      sellSgc: async (sgcAmount: number) => {
        set({ loading: true, error: null });
        try {
          const { sgcBalanceAfter, usdBalanceAfter } = await sellSgc(
            sgcAmount
          );
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
            set({
              error: error.response?.data?.error || "Failed to sell SGC",
              loading: false,
            });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
          throw error;
        }
      },
      clearWalletDetails: () => {
        Cookies.remove("wallet_access_token");
        set({ walletDetails: null, pinVerifiedForDetails: false });
      },
      lockWallet: () => {
        console.log("[WalletStore] lockWallet: Locking wallet.");
        if (lockTimeout) {
          clearTimeout(lockTimeout);
          lockTimeout = null;
        }
        get().clearWalletDetails();
        set({ isWalletUnlocked: false, unlockTimestamp: null });
      },
      unlockWallet: () => {
        const unlockTimestamp = Date.now();
        console.log(`[WalletStore] unlockWallet: Unlocking wallet. Setting unlockTimestamp: ${unlockTimestamp}`);
        set({ isWalletUnlocked: true, unlockTimestamp: unlockTimestamp });
        get().resetUnlockTimer();
      },
      resetUnlockTimer: (duration = 5 * 60 * 1000) => {
        console.log(`[WalletStore] Setting auto-lock timer for ${duration}ms.`);
        if (lockTimeout) {
          clearTimeout(lockTimeout);
        }
        lockTimeout = setTimeout(() => {
          const state = get();
          if (state.isWalletUnlocked) {
            console.log("[WalletStore] setTimeout: Wallet auto-locking due to session timeout.");
            state.lockWallet();
          }
        }, duration); // Use the provided or default duration
      },
    }),
    {
      name: "wallet-unlock-storage",
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => {
        console.log("[WalletStore] partialize: Saving state to localStorage", {
            isWalletUnlocked: state.isWalletUnlocked,
            unlockTimestamp: state.unlockTimestamp,
        });
        return {
            isWalletUnlocked: state.isWalletUnlocked,
            unlockTimestamp: state.unlockTimestamp,
        };
      },
    }
  )
);

useWalletStore.persist?.onFinishHydration?.(() => {
    console.log("[WalletStore] onFinishHydration: Hydration finished. Setting _hasHydrated to true.");
    useWalletStore.setState({ _hasHydrated: true });
});

export default useWalletStore;