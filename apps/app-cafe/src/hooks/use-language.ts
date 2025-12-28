import { create } from "zustand";

import i18n from "@/i18n";

type Language = "en" | "ko";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: i18n.locale as Language,
  setLanguage: (language) => {
    i18n.locale = language;
    set({ language });
  },
  toggleLanguage: () =>
    set((state) => {
      const newLanguage = state.language === "en" ? "ko" : "en";
      i18n.locale = newLanguage;
      return { language: newLanguage };
    }),
}));
