import { create } from "zustand";
import { 
  getKycStatus, 
  uploadKycDocumentFile, 
  submitKycForReview, 
  KycStatus, 
  KycRegion,
  KycUploadDocumentType
} from "@/services/kyc.service";
import axios from "axios";

interface UploadDocumentParams {
  file: File;
  docType: KycUploadDocumentType;
  region: KycRegion;
}

interface KycState {
  kycStatuses: KycStatus[];
  loading: boolean;
  error: string | null;
  fetchKycStatus: () => Promise<void>;
  uploadDocument: (params: UploadDocumentParams) => Promise<void>;
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
  uploadDocument: async ({ file, docType, region }: UploadDocumentParams) => {
    set({ loading: true, error: null });
    try {
      await uploadKycDocumentFile(file, docType, region);
      // Refresh the status after a successful upload
      await get().fetchKycStatus();
    } catch (error: unknown) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to upload document";
        set({ error: errorMessage });
        throw new Error(errorMessage);
      } else {
        const errorMessage = "An unexpected error occurred during upload";
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
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
