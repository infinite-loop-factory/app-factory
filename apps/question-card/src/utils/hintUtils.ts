/**
 * 힌트 관련 유틸리티 함수
 */

import type { HintType } from "@/types";

/** 힌트 유형 라벨 반환 */
export function getHintTypeLabel(type: HintType): string {
  switch (type) {
    case "keyword":
      return "키워드";
    case "example":
      return "예시 답변";
    case "thinking":
      return "생각 포인트";
    case "related":
      return "관련 질문";
    case "situation":
      return "상황 예시";
    default:
      return "힌트";
  }
}
