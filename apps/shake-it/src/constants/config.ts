export const APP_CONFIG = {
  // 흔들기 감지 기본 임계값
  DEFAULT_SHAKE_THRESHOLD: 1.5,
  // 흔들기 감지 간격 (ms)
  SHAKE_DETECTION_INTERVAL: 100,
  // 흔들기 쿨다운 (ms) - 연속 감지 방지
  SHAKE_COOLDOWN: 1000,
  // 기본 최소 별점
  DEFAULT_MIN_RATING: 3.5,
  // 검색 반경 (미터)
  SEARCH_RADIUS: 1000,
  // 네이버 API 검색 결과 개수
  SEARCH_DISPLAY_COUNT: 20,
} as const;

export const STORAGE_KEYS = {
  USER_SETTINGS: "@user_settings",
  VISIT_HISTORY: "@visit_history",
} as const;
