import { create } from "zustand";

type AuthStore = {
  user: any;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  loadUserFromStorage: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: (userData, token) => {
    set({ user: userData, token });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
  loadUserFromStorage: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      set({ user: JSON.parse(user), token });
    }
  },
}));
