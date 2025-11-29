import { create } from "zustand";

interface NotificationState {
  message: string | null;
  type: 'error' | 'success';
  setMessage: (message: string, type: 'error' | 'success') => void;
  clearMessage: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: 'error',
  setMessage: (message, type) => set({ message, type }),
  clearMessage: () => set({ message: null }),
}));

export default useNotificationStore;
