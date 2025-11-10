import { create } from "zustand";

interface UserState {
  id: string | null;
  email: string | null;
  setUser: (id: string, email: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  email: null,

  setUser: (id, email) => set({ id, email }),

  clearUser: () => set({ id: null, email: null }),
}));
