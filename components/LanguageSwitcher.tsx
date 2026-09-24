"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { languages, type Language } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        aria-label="Select language"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
