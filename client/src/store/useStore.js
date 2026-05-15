import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      // Auth Slice
      user: null,
      token: localStorage.getItem("token") || null,
      isLoggedIn: !!localStorage.getItem("token"),
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setToken: (token) => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
        set({ token, isLoggedIn: !!token });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isLoggedIn: false });
      },

      // UI Slice
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      // Language Slice
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "doctor-near-me-storage",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
