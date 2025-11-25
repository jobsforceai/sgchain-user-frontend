import api from './api';

export interface Emoji {
  char: string;
  name: string;
}

export interface EmojiCategory {
  name: string;
  emojis: Emoji[];
}

export interface EmojiGroup {
  name: string;
  categories: EmojiCategory[];
}

export interface EmojiData {
  categorized: EmojiGroup[];
  fullSet: string[];
}

export const fetchEmojis = async (): Promise<EmojiData> => {
  try {
    const response = await api.get<EmojiData>('/config/emojis');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch emojis:', error);
    // Return a default empty structure in case of an error
    return { categorized: [], fullSet: [] };
  }
};
