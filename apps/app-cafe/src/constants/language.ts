export const LANGUAGE_ENUM = {
  EN: "en",
  KO: "ko",
} as const;

export type Language = (typeof LANGUAGE_ENUM)[keyof typeof LANGUAGE_ENUM];
