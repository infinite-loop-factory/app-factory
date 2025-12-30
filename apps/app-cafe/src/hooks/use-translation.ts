import { useEffect, useState } from "react";
import { useLanguageStore } from "@/hooks/use-language";
import i18n from "@/i18n";

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  return {
    t: (key: string) => i18n.t(key),
    language,
  };
}
