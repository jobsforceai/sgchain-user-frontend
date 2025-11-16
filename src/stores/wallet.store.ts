import { create } from "zustand";

interface WalletState {
  wallet: {
    userId: string;
    walletId: string;
    sgcBalance: number;
    sgcOfficialPriceUsd: number;
    sgcValueUsd: number;
    totalAccountValueUsd: number;
    status: string;
  } | null;
  setWallet: (wallet: any) => void;
  clearWallet: () => void;
}

const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  setWallet: (wallet) => set({ wallet }),
  clearWallet: () => set({ wallet: null }),
}));

export default useWalletStore;
