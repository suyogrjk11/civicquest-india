export type Language = "en" | "hi" | "mr";

export const languages: {
  code: Language;
  label: string;
  nativeLabel: string;
}[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिंदी",
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
  },
];

export const languageStorageKey = "civicquest-language";