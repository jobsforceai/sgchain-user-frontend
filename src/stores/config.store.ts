import { create } from "zustand";
import { getEmojiConfig, EmojiConfig } from "@/services/config.service";

interface ConfigState {
  emojis: EmojiConfig | null;
  fetchEmojiConfig: () => Promise<void>;
}

const useConfigStore = create<ConfigState>((set) => ({
  emojis: null,
  fetchEmojiConfig: async () => {
    try {
      const emojis = await getEmojiConfig();
      set({ emojis });
    } catch (error) {
      console.error("Failed to fetch emoji config:", error);
    }
  },
}));

export default useConfigStore;
