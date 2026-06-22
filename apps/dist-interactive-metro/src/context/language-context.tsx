import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import i18n from "@/i18n";

type Locale = "ko" | "en";

const STORAGE_KEY = "@app/locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    (i18n.locale as Locale) ?? "ko",
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "ko" || saved === "en") {
        i18n.locale = saved;
        setLocaleState(saved);
      }
    });
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    i18n.locale = next;
    setLocaleState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
