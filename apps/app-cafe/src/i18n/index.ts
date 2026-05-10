import type { Paths } from "type-fest";
import type { Translations } from "./types/translations";

import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./locales/en.ts";
import ko from "./locales/ko.ts";

export type TranslationKey = Paths<Translations>;

const translations = {
  en,
  ko,
};

const i18n = new I18n(translations);

i18n.locale = getLocales()[0]?.languageCode ?? "ko";

i18n.enableFallback = true;
i18n.defaultLocale = "ko";

export const setLocale = (language: "en" | "ko") => {
  i18n.locale = language;
  i18n.defaultLocale = language;
};

export default i18n;
