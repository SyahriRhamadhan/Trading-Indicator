import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Context & Provider
const ThemeContext = createContext({
  theme: "dark",
  toggle: () => {},
});

// 2. ThemeProvider Component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Ambil theme dari localStorage, default ke 'dark' atau sesuai preferensi sistem
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("theme") as "light" | "dark") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    }
    return "dark";
  });

  // INI dia useEffect yang kamu tanya!
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook
export function useTheme() {
  return useContext(ThemeContext);
}
