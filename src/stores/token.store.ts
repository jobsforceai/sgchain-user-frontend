import { create } from "zustand";
import {
  listMyTokens,
  createToken,
  updateToken,
  getTokenDetails,
  deployToken,
  TokenLaunch,
  CreateTokenPayload,
} from "@/services/token.service";
import axios from "axios";

interface TokenState {
  tokens: TokenLaunch[];
  currentToken: TokenLaunch | null;
  loading: boolean;
  error: string | null;
  fetchTokens: () => Promise<void>;
  getToken: (id: string) => Promise<void>;
  createDraft: (payload: CreateTokenPayload) => Promise<TokenLaunch>;
  updateDraft: (id: string, payload: Partial<CreateTokenPayload>) => Promise<void>;
  deploy: (id: string) => Promise<void>;
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
        set({ error: error.response?.data?.error || "Failed to fetch tokens", loading: false });
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
          set({ error: error.response?.data?.error || "Failed to fetch token details", loading: false });
        } else {
          set({ error: "An unexpected error occurred", loading: false });
        }
      }
  },
  createDraft: async (payload: CreateTokenPayload) => {
    set({ loading: true, error: null });
    try {
      const newDraft = await createToken(payload);
      set({ loading: false });
      await get().fetchTokens(); // Refresh the list
      return newDraft;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            set({ error: error.response?.data?.error || "Failed to create draft", loading: false });
        } else {
            set({ error: "An unexpected error occurred", loading: false });
        }
      throw error;
    }
  },
  updateDraft: async (id: string, payload: Partial<CreateTokenPayload>) => {
    set({ loading: true, error: null });
    try {
      const updatedToken = await updateToken(id, payload);
      set({ currentToken: updatedToken, loading: false });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            set({ error: error.response?.data?.error || "Failed to update draft", loading: false });
        } else {
            set({ error: "An unexpected error occurred", loading: false });
        }
      throw error;
    }
  },
  deploy: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const deployedToken = await deployToken(id);
      set({ currentToken: deployedToken, loading: false });
      await get().fetchTokens(); // Refresh list to show deployed status
    } catch (error) {
        if (axios.isAxiosError(error)) {
            set({ error: error.response?.data?.error || "Failed to deploy token", loading: false });
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
