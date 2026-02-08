/**
 * 난이도 스타일 유틸리티
 * 난이도별 뱃지 스타일, 텍스트 스타일, 라벨을 반환하는 함수들
 */

/**
 * 난이도별 뱃지 배경 스타일 반환 (border 포함)
 */
export function getDifficultyBadgeStyle(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-50 border border-green-200";
    case "medium":
      return "bg-amber-50 border border-amber-200";
    case "hard":
      return "bg-red-50 border border-red-200";
    default:
      return "bg-gray-50 border border-gray-200";
  }
}

/**
 * 난이도별 뱃지 배경 스타일 반환 (solid 색상)
 */
export function getDifficultyBadgeSolidStyle(difficulty?: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-500 border border-green-200";
    case "medium":
      return "bg-amber-500 border border-amber-200";
    case "hard":
      return "bg-red-500 border border-red-200";
    default:
      return "bg-gray-400 border border-gray-200";
  }
}

/**
 * 난이도별 텍스트 색상 스타일 반환
 */
export function getDifficultyTextStyle(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "text-green-700";
    case "medium":
      return "text-amber-700";
    case "hard":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

/**
 * 난이도별 라벨 반환
 */
export function getDifficultyLabel(difficulty?: string): string {
  switch (difficulty) {
    case "easy":
      return "쉬움";
    case "medium":
      return "보통";
    case "hard":
      return "어려움";
    default:
      return "기본";
  }
}
