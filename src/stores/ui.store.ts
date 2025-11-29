import { create } from "zustand";
import toast from "react-hot-toast";

interface UiState {
  showConfetti: boolean;
  triggerConfetti: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const useUiStore = create<UiState>((set) => ({
  showConfetti: false,
  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 4000); // Confetti lasts 4 seconds
  },
  showToast: (message, type) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  },
}));

export default useUiStore;
