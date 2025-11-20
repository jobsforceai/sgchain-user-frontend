import { create } from "zustand";
import { getWithdrawalHistory, requestWithdrawal, Withdrawal, WithdrawalRequestPayload } from "@/services/withdrawal.service";
import axios from "axios";

interface WithdrawalState {
  withdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
  fetchWithdrawals: () => Promise<void>;
  requestWithdrawal: (payload: WithdrawalRequestPayload) => Promise<void>;
}

const useWithdrawalStore = create<WithdrawalState>((set) => ({
  withdrawals: [],
  loading: false,
  error: null,
  fetchWithdrawals: async () => {
    set({ loading: true, error: null });
    try {
      const { items } = await getWithdrawalHistory();
      set({ withdrawals: items, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch withdrawal history", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  requestWithdrawal: async (payload: WithdrawalRequestPayload) => {
    set({ loading: true, error: null });
    try {
      await requestWithdrawal(payload);
      set({ loading: false });
      // After submission, refresh the history
      await useWithdrawalStore.getState().fetchWithdrawals();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to submit withdrawal request", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
      throw error;
    }
  },
}));

export default useWithdrawalStore;
