import { create } from "zustand";
import { LANGUAGE_ENUM, type Language } from "@/constants/language";
import i18n, { type TranslationKey } from "@/i18n";

export { LANGUAGE_ENUM, type Language, type TranslationKey };

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
      const newLanguage =
        state.language === LANGUAGE_ENUM.EN
          ? LANGUAGE_ENUM.KO
          : LANGUAGE_ENUM.EN;
      i18n.locale = newLanguage;
      return { language: newLanguage };
    }),
}));

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);

  return {
    t: (key: TranslationKey) => i18n.t(key),
    language,
  };
}
