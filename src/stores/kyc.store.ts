import { create } from "zustand";
import { getKycStatus, uploadKycDocument, submitKycForReview, KycStatus, UploadDocumentPayload, KycRegion } from "@/services/kyc.service";
import axios from "axios";

interface KycState {
  kycStatuses: KycStatus[];
  loading: boolean;
  error: string | null;
  fetchKycStatus: () => Promise<void>;
  uploadDocument: (payload: UploadDocumentPayload) => Promise<void>;
  submitForReview: (region: KycRegion) => Promise<void>;
}

const useKycStore = create<KycState>((set, get) => ({
  kycStatuses: [],
  loading: false,
  error: null,
  fetchKycStatus: async () => {
    set({ loading: true, error: null });
    try {
      const { items } = await getKycStatus();
      set({ kycStatuses: items, loading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to fetch KYC status", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  uploadDocument: async (payload: UploadDocumentPayload) => {
    set({ loading: true, error: null });
    try {
      await uploadKycDocument(payload);
      await get().fetchKycStatus();
    } catch (error: unknown) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to upload document" });
      } else {
        set({ error: "An unexpected error occurred" });
      }
      throw error;
    }
  },
  submitForReview: async (region: KycRegion) => {
    set({ loading: true, error: null });
    try {
      await submitKycForReview(region);
      await get().fetchKycStatus();
    } catch (error: unknown) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.error || "Failed to submit for review" });
      } else {
        set({ error: "An unexpected error occurred" });
      }
      throw error;
    }
  }
}));

export default useKycStore;
