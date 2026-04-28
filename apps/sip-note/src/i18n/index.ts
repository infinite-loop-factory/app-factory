// ? https://docs.expo.dev/guides/localization/
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en,
  ko,
};
const i18n = new I18n(translations);

// ko = primary (PRD), en = supported. 그 외 디바이스 locale (ja / zh / 미정 등)
// 도 ko 로 폴백한다 — .design-context.md 의 "Supported languages" 정책.
const SUPPORTED = ["ko", "en"] as const;
const deviceLang = getLocales()[0]?.languageCode;
i18n.locale =
  deviceLang && (SUPPORTED as readonly string[]).includes(deviceLang)
    ? deviceLang
    : "ko";
i18n.defaultLocale = "ko";

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export default i18n;
