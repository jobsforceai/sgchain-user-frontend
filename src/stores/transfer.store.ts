import { create } from "zustand";
import { createExternalTransfer, ExternalTransferPayload, ExternalTransferResponse } from "@/services/transfer.service";
import useWalletStore from "./wallet.store";
import axios from "axios";

interface TransferState {
  loading: boolean;
  error: string | null;
  transferResult: ExternalTransferResponse | null;
  submitExternalTransfer: (payload: ExternalTransferPayload) => Promise<void>;
  clearResult: () => void;
}

const useTransferStore = create<TransferState>((set) => ({
  loading: false,
  error: null,
  transferResult: null,
  submitExternalTransfer: async (payload: ExternalTransferPayload) => {
    set({ loading: true, error: null, transferResult: null });
    try {
      const result = await createExternalTransfer(payload);
      set({ transferResult: result, loading: false });
      // Refresh wallet balance after transfer
      await useWalletStore.getState().fetchWallet();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error:
            error.response?.data?.error || "Failed to create external transfer",
          loading: false,
        });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error;
    }
  },
  clearResult: () => {
    set({ transferResult: null, error: null });
  }
}));

export default useTransferStore;
