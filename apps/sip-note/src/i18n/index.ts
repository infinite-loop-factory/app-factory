// ? https://docs.expo.dev/guides/localization/
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en,
  ko,
};
const i18n = new I18n(translations);

// ko = primary (PRD). 디바이스 locale 과 무관하게 ko 로 시작한다 —
// docs/design/context.md 의 "Supported languages" 정책.
i18n.locale = "ko";
i18n.defaultLocale = "ko";

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export default i18n;
