import { create } from "zustand";
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  user: { id: string; fullName: string; email: string } | null;
  isAuthInitialized: boolean;
  setToken: (t: string | null) => void;
  setUser: (u: { id: string; fullName: string; email: string } | null) => void;
  setAuthInitialized: (isInitialized: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthInitialized: false,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setAuthInitialized: (isInitialized) => set({ isAuthInitialized: isInitialized }),
  logout: () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('sgchain_access_token');
      // Redirect to login page after clearing credentials
      window.location.href = '/login';
    }
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
