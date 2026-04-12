/**
 * App line name → KRIC line code mapping.
 * Single source of truth used by all timetable / transfer hooks.
 */
export const APP_LINE_TO_KRIC: Record<string, string> = {
  "1호선": "1",
  "2호선": "2",
  "3호선": "3",
  "4호선": "4",
  "5호선": "5",
  "6호선": "6",
  "7호선": "7",
  "8호선": "8",
  "9호선": "9",
  공항철도: "A1",
  경의중앙선: "K1",
  경춘선: "K4",
  수인분당선: "K2",
  신분당선: "D1",
};
