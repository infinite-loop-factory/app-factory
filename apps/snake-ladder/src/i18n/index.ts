// ? https://docs.expo.dev/guides/localization/
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "@/i18n/locales/en.generated";
import ko from "@/i18n/locales/ko.generated";

const SUPPORTED_LOCALES = ["en", "ko"] as const;

function resolveLocale(): (typeof SUPPORTED_LOCALES)[number] {
  const code = getLocales()[0]?.languageCode ?? "en";
  return SUPPORTED_LOCALES.includes(code as (typeof SUPPORTED_LOCALES)[number])
    ? (code as (typeof SUPPORTED_LOCALES)[number])
    : "en";
}

const i18n = new I18n({ en, ko });

i18n.defaultLocale = "en";
i18n.locale = resolveLocale();
i18n.enableFallback = true;

// Locale files use "{name}" placeholders (not i18n-js default "%{name}").
i18n.placeholder = /\{(\w+)\}/g;

export default i18n;
