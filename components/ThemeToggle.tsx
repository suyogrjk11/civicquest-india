"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "karmafacie-theme";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;

    const initial: Theme =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="kf-global-theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
