"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type SearchItem = {
  label: string;
  description: string;
  path: string;
};

const items: Record<Language, SearchItem[]> = {
  en: [
    [
      "Civic Learning",
      "Learn how India works and explore civic topics.",
      "/civic-learning",
    ],
    [
      "Know India",
      "Explore India's states, geography, culture and civic identity.",
      "/know-india",
    ],
    [
      "Constitution",
      "Learn about the Constitution and civic principles.",
      "/explore/constitution",
    ],
    [
      "Elections & Civic Participation",
      "Understand elections and ways citizens participate.",
      "/explore/elections",
    ],
    [
      "Community",
      "Explore civic issues raised by citizens.",
      "/community",
    ],
    [
      "Report an Issue",
      "Report a civic issue and track its progress.",
      "/report-issue",
    ],
    [
      "My Issues",
      "View the civic problems you have reported.",
      "/my-issues",
    ],
    [
      "Civic Passport",
      "View your verified civic record and participation history.",
      "/civic-passport",
    ],
    [
      "My Impact",
      "See your civic journey, learning and contributions.",
      "/my-impact",
    ],
    [
      "Civic Leagues",
      "Join team-based civic participation and missions.",
      "/leagues",
    ],
    [
      "Dashboard",
      "Open your KarmaFacie dashboard.",
      "/dashboard",
    ],
  ].map(([label, description, path]) => ({
    label,
    description,
    path,
  })),

  hi: [
    [
      "नागरिक शिक्षा",
      "भारत कैसे काम करता है और नागरिक विषयों को जानें।",
      "/civic-learning",
    ],
    [
      "भारत जानें",
      "भारत के राज्यों, भूगोल, संस्कृति और नागरिक पहचान को जानें।",
      "/know-india",
    ],
    [
      "संविधान",
      "संविधान और नागरिक सिद्धांतों को समझें।",
      "/explore/constitution",
    ],
    [
      "चुनाव और नागरिक भागीदारी",
      "चुनाव और नागरिक भागीदारी के तरीकों को समझें।",
      "/explore/elections",
    ],
    [
      "समुदाय",
      "नागरिकों द्वारा उठाए गए नागरिक मुद्दों को देखें।",
      "/community",
    ],
    [
      "समस्या रिपोर्ट करें",
      "नागरिक समस्या रिपोर्ट करें और उसकी प्रगति ट्रैक करें।",
      "/report-issue",
    ],
    [
      "मेरी समस्याएँ",
      "आपके द्वारा रिपोर्ट की गई नागरिक समस्याएँ देखें।",
      "/my-issues",
    ],
    [
      "सिविक पासपोर्ट",
      "अपना सत्यापित नागरिक रिकॉर्ड और भागीदारी इतिहास देखें।",
      "/civic-passport",
    ],
    [
      "मेरा प्रभाव",
      "अपनी नागरिक यात्रा, सीखने और योगदान को देखें।",
      "/my-impact",
    ],
    [
      "सिविक लीग्स",
      "टीम आधारित नागरिक भागीदारी और मिशन में शामिल हों।",
      "/leagues",
    ],
    [
      "डैशबोर्ड",
      "अपना KarmaFacie डैशबोर्ड खोलें।",
      "/dashboard",
    ],
  ].map(([label, description, path]) => ({
    label,
    description,
    path,
  })),

  mr: [
    [
      "नागरी शिक्षण",
      "भारत कसे कार्य करते आणि नागरी विषय जाणून घ्या.",
      "/civic-learning",
    ],
    [
      "भारत जाणून घ्या",
      "भारताची राज्ये, भूगोल, संस्कृती आणि नागरी ओळख जाणून घ्या.",
      "/know-india",
    ],
    [
      "संविधान",
      "संविधान आणि नागरी तत्त्वे समजून घ्या.",
      "/explore/constitution",
    ],
    [
      "निवडणुका आणि नागरी सहभाग",
      "निवडणुका आणि नागरिकांच्या सहभागाचे मार्ग समजून घ्या.",
      "/explore/elections",
    ],
    [
      "समुदाय",
      "नागरिकांनी नोंदवलेले नागरी मुद्दे पाहा.",
      "/community",
    ],
    [
      "समस्या नोंदवा",
      "नागरी समस्या नोंदवा आणि तिची प्रगती ट्रॅक करा.",
      "/report-issue",
    ],
    [
      "माझ्या समस्या",
      "तुम्ही नोंदवलेल्या नागरी समस्या पाहा.",
      "/my-issues",
    ],
    [
      "सिविक पासपोर्ट",
      "तुमचा सत्यापित नागरी रेकॉर्ड आणि सहभाग इतिहास पाहा.",
      "/civic-passport",
    ],
    [
      "माझा प्रभाव",
      "तुमचा नागरी प्रवास, शिक्षण आणि योगदान पाहा.",
      "/my-impact",
    ],
    [
      "सिविक लीग्स",
      "टीम-आधारित नागरी सहभाग आणि मिशन्समध्ये सहभागी व्हा.",
      "/leagues",
    ],
    [
      "डॅशबोर्ड",
      "तुमचा KarmaFacie डॅशबोर्ड उघडा.",
      "/dashboard",
    ],
  ].map(([label, description, path]) => ({
    label,
    description,
    path,
  })),
};

export default function GlobalSearch() {
  const router = useRouter();
  const { language } = useLanguage();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchItems = items[language] ?? items.en;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return searchItems;
    }

    return searchItems.filter((item) =>
      `${item.label} ${item.description}`.toLowerCase().includes(q)
    );
  }, [query, searchItems]);

  useEffect(() => {
    const openSearch = () => {
      setOpen(true);
      setQuery("");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      const button = target?.closest(
        'button[aria-label="Search"], button[data-karmafacie-search="true"]'
      );

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      openSearch();
    };

    window.addEventListener("karmafacie:open-search", openSearch);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick, true);

    return () => {
      window.removeEventListener("karmafacie:open-search", openSearch);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, []);

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    router.push(path);
  };

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Global Search Button */}
      <button
        type="button"
        aria-label="Search"
        data-karmafacie-search="true"
        title={
          language === "hi"
            ? "KarmaFacie खोजें"
            : language === "mr"
              ? "KarmaFacie शोधा"
              : "Search KarmaFacie"
        }
        onClick={() => {
          setOpen(true);
          setQuery("");
        }}
        className="kf-global-search-trigger"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </button>

      {/* Search Modal */}
      {open && (
        <div className="kf-global-search-modal">
          <div
            className="kf-global-search-backdrop fixed inset-0 z-[200] flex items-start justify-center px-4 pt-24 backdrop-blur-md sm:pt-28"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeSearch();
              }
            }}
          >
            <div
              className="kf-global-search-panel w-full max-w-2xl overflow-hidden rounded-[28px]"
              role="dialog"
              aria-modal="true"
              aria-label="KarmaFacie Search"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b px-5 py-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 shrink-0 opacity-70"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>

                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    language === "hi"
                      ? "KarmaFacie खोजें..."
                      : language === "mr"
                        ? "KarmaFacie शोधा..."
                        : "Search KarmaFacie..."
                  }
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  className="grid h-8 w-8 place-items-center rounded-full"
                  aria-label="Close search"
                  title="Close"
                >
                  ×
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[62vh] overflow-y-auto p-3">
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => go(item.path)}
                      className="kf-global-search-result flex w-full items-start gap-4 rounded-[18px] px-4 py-3.5 text-left"
                    >
                      <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F97316]/12 text-[#F97316]">
                        →
                      </span>

                      <span>
                        <span className="block text-[14px] font-bold">
                          {item.label}
                        </span>

                        <span className="mt-1 block text-[12px] leading-5 opacity-70">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center text-sm opacity-70">
                    {language === "hi"
                      ? "कोई परिणाम नहीं मिला"
                      : language === "mr"
                        ? "कोणतेही परिणाम सापडले नाहीत"
                        : "No results found"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}