import type { Metadata } from "next";
import Script from "next/script";
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

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("KrutBharat-theme");
    var theme =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = theme;
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
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>

      <body className="min-h-full">
        <LanguageProvider>
          {children}

          {/* These are global: available on every KrutBharat route. */}
          <ThemeToggle />
          <GlobalSearch />
        </LanguageProvider>
      </body>
    </html>
  );
}
