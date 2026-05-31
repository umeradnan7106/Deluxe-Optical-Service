import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user, accessToken, refreshToken) => {
        if (typeof document !== "undefined") {
          document.cookie = `auth-token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `is-admin=${user.is_admin}; path=/; max-age=2592000; SameSite=Lax`;
        }
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isAdmin: user.is_admin,
        });
      },

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "auth-token=; path=/; max-age=0";
          document.cookie = "is-admin=; path=/; max-age=0";
        }
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("wishlist-storage");
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        if (typeof document !== "undefined") {
          document.cookie = `auth-token=${accessToken}; path=/; max-age=2592000; SameSite=Lax`;
        }
        set({ accessToken, refreshToken });
      },

      setUser: (user) => set({ user, isAdmin: user.is_admin }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
