"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// One canonical key for the entire KrutBharat application.
// The legacy key is only read once so existing user preferences migrate safely.
const STORAGE_KEY = "KrutBharat-theme";
const LEGACY_STORAGE_KEY = "karmafacie-theme";

function readTheme(): Theme {
  const rootTheme = document.documentElement.dataset.theme;
  if (rootTheme === "dark" || rootTheme === "light") return rootTheme;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === "dark" || legacy === "light") return legacy;
  } catch {
    // Ignore storage failures and fall back to the system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
    // Keep the legacy key synchronized during the migration period so any
    // older component still using it cannot pull the app back to a different mode.
    window.localStorage.setItem(LEGACY_STORAGE_KEY, theme);
  } catch {
    // The DOM theme still works for the active session.
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const initial = readTheme();

    root.dataset.theme = initial;
    persistTheme(initial);
    setTheme(initial);

    const sync = () => {
      const current = root.dataset.theme;
      if (current === "dark" || current === "light") {
        setTheme(current);
        persistTheme(current);
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    persistTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="kf-theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
