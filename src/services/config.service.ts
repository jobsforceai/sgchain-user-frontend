import api from "./api";

export interface EmojiConfig {
  spiritual: string[];
  mudra: string[];
  fullSet: string[];
}

export const getEmojiConfig = (): Promise<EmojiConfig> =>
  api.get("/config/emojis").then(r => r.data);
