/**
 * IconText 컴포넌트에서 사용되는 아이콘 타입
 */
export const IconTextType = {
  MAP: "MAP",
  CLOCK: "CLOCK",
  STAR: "STAR",
} as const;

/**
 * 상세 화면의 탭에서 사용되는 key 타입
 */
export const TabKeyType = {
  /** 정보 탭 */
  INFO: "INFO",
  /** 지도 탭 */
  MAP: "MAP",
  /** 리뷰 탭 */
  REVIEW: "REVIEW",
} as const;

export type IconTextType = keyof typeof IconTextType;
export type TabKeyType = keyof typeof TabKeyType;
