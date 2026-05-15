import { create } from "zustand";
import { persist } from "zustand/middleware";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("doctor-near-me-storage");
  if (savedTheme) {
    const { state } = JSON.parse(savedTheme);
    if (state.theme) return state.theme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

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
      theme: getInitialTheme(),
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
