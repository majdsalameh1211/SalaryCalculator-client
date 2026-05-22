import { create } from 'zustand'

interface AuthState {
  userId: string | null
  username: string | null
  setUser: (userId: string, username: string) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  username: null,
  setUser: (userId, username) => set({ userId, username }),
  clearUser: () => set({ userId: null, username: null }),
}))