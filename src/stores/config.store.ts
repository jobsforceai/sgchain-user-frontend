import { create } from "zustand";
import { getEmojiConfig, EmojiConfig } from "@/services/config.service";

interface ConfigState {
  emojis: EmojiConfig | null;
  isEmojiConfigFetched: boolean;
  fetchEmojiConfig: () => Promise<void>;
}

const useConfigStore = create<ConfigState>((set, get) => ({
  emojis: null,
  isEmojiConfigFetched: false,
  fetchEmojiConfig: async () => {
    if (get().isEmojiConfigFetched) {
      return; // Emojis already fetched
    }
    try {
      const emojis = await getEmojiConfig();
      set({ emojis, isEmojiConfigFetched: true });
    } catch (error) {
      console.error("Failed to fetch emoji config:", error);
    }
  },
}));

export default useConfigStore;
