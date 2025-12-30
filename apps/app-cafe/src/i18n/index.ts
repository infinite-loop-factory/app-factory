// ? https://docs.expo.dev/guides/localization/
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

// Set key-value pairs for different languages you want to support.
const translations = {
  en,
  ko,
};
const i18n = new I18n(translations);

// Set locale once at the beginning of your app.
i18n.locale = getLocales()[0]?.languageCode ?? "ko";

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;
i18n.defaultLocale = "ko";

export const setLocale = (language: "en" | "ko") => {
  i18n.locale = language;
  i18n.defaultLocale = language;
};

export default i18n;
