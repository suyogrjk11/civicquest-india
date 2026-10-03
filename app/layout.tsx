import type { Metadata } from "next";
import { Rubik, Manrope, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import ThemeToggle from "@/components/ThemeToggle";
import GlobalSearch from "@/components/GlobalSearch";

const displayFont = Rubik({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const serifFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KrutBharat",
  description:
    "Learn, understand and participate in civic life with KrutBharat.",
};

// This runs before React so every route starts with the same persisted theme.
// It intentionally avoids next/script inside <head>, which caused the
// "Encountered a script tag while rendering React component" error.
const themeScript = `
(function () {
  try {
    var canonical = localStorage.getItem("KrutBharat-theme");
    var legacy = localStorage.getItem("karmafacie-theme");
    var saved =
      canonical === "dark" || canonical === "light"
        ? canonical
        : legacy === "dark" || legacy === "light"
          ? legacy
          : null;

    var theme =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("KrutBharat-theme", theme);
    localStorage.setItem("karmafacie-theme", theme);
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${serifFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className="min-h-full">
        <LanguageProvider>
          {children}

          {/* Desktop/global controls. On mobile/tablet they are hidden by CSS
              because the shared app shell owns the visible controls. */}
          <ThemeToggle />
          <GlobalSearch />
        </LanguageProvider>
      </body>
    </html>
  );
}
