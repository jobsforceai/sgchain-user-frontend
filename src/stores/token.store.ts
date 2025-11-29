import { create } from "zustand";
import {
  listMyTokens,
  createTokenDraft,
  updateTokenDraft,
  getTokenDetails,
  deployToken as deployTokenService, // alias to avoid name clash
  Token,
  CreateTokenPayload,
} from "@/services/token.service";
import axios from "axios";

interface TokenState {
  tokens: Token[];
  currentToken: Token | null;
  loading: boolean;
  error: string | null;
  fetchTokens: () => Promise<void>;
  getToken: (id: string) => Promise<void>;
  createDraft: (payload: CreateTokenPayload) => Promise<Token>;
  updateDraft: (id: string, payload: Partial<CreateTokenPayload>) => Promise<void>;
  deployToken: (id: string) => Promise<void>;
  clearCurrentToken: () => void;
}

const useTokenStore = create<TokenState>((set, get) => ({
  tokens: [],
  currentToken: null,
  loading: false,
  error: null,
  fetchTokens: async () => {
    set({ loading: true, error: null });
    try {
      const { items } = await listMyTokens();
      set({ tokens: items, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message || "Failed to fetch tokens", loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
  getToken: async (id: string) => {
    set({ loading: true, error: null });
    try {
        const token = await getTokenDetails(id);
        set({ currentToken: token, loading: false });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          set({ error: error.response?.data?.message || "Failed to fetch token details", loading: false });
        } else {
          set({ error: "An unexpected error occurred", loading: false });
        }
      }
  },
  createDraft: async (payload: CreateTokenPayload) => {
    set({ loading: true, error: null });
    try {
      const newDraft = await createTokenDraft(payload);
      set({ loading: false });
      await get().fetchTokens(); // Refresh the list
      return newDraft;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            set({ error: error.response?.data?.message || "Failed to create draft", loading: false });
        } else {
            set({ error: "An unexpected error occurred", loading: false });
        }
      throw error;
    }
  },
  updateDraft: async (id: string, payload: Partial<CreateTokenPayload>) => {
    set({ loading: true, error: null });
    try {
      const updatedToken = await updateTokenDraft(id, payload);
      set({ currentToken: updatedToken, loading: false });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            set({ error: error.response?.data?.message || "Failed to update draft", loading: false });
        } else {
            set({ error: "An unexpected error occurred", loading: false });
        }
      throw error;
    }
  },
  deployToken: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deployTokenService(id);
      // After deploying, fetch the updated token details to reflect the new status
      await get().getToken(id);
      await get().fetchTokens(); // Refresh list to show deployed status
    } catch (error) {
        if (axios.isAxiosError(error)) {
            set({ error: error.response?.data?.message || "Failed to deploy token", loading: false });
        } else {
            set({ error: "An unexpected error occurred", loading: false });
        }
      throw error;
    }
  },
  clearCurrentToken: () => {
    set({ currentToken: null });
  }
}));

export default useTokenStore;
