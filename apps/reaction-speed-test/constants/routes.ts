/**
 * 애플리케이션의 모든 라우트 경로를 중앙에서 관리하는 상수 파일
 */
export const ROUTES = {
  // 메인 페이지들
  HOME: "/",
  MEASUREMENT: "/measurement",

  // 인증 관련
  LOGIN: "/login",
  SIGNUP: "/signup",

  // 메뉴 페이지들 (인증 상태별)
  MENU: "/menu",
  GUEST_MENU: "/guest-menu",

  // 결과 페이지들 (인증 상태별)
  RESULTS: "/results",
  GUEST_RESULTS: "/guest-results",

  // 설정
  SETTINGS: "/settings",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
