import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: { id: string; fullName: string; email: string } | null;
  setToken: (t: string | null) => void;
  setUser: (u: { id: string; fullName: string; email: string } | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sgchain_access_token');
    }
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
