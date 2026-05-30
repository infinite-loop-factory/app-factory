export type WidgetRecentCountry = {
  code: string; // ISO 3166-1 alpha-2 uppercase
  flag: string; // 이모지
  name: string; // 표시명 (호출측에서 결정)
  days: number;
};

export type WidgetSnapshot = {
  totalCountries: number;
  totalDays: number;
  recent: WidgetRecentCountry[]; // 최대 3개, latestVisit DESC
  updatedAt: string; // ISO 8601
};

export const EMPTY_SNAPSHOT: WidgetSnapshot = {
  totalCountries: 0,
  totalDays: 0,
  recent: [],
  updatedAt: "1970-01-01T00:00:00.000Z",
};
