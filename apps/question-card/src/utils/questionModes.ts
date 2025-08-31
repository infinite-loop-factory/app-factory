/**
 * 4가지 질문 모드 알고리즘 구현
 */

import type { Question, QuestionMode } from "@/types";

// 배열 셔플 유틸리티 함수 (Fisher-Yates 알고리즘)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

// 카테고리별로 질문 그룹화
export function groupQuestionsByCategory(
  questions: Question[],
): Map<string, Question[]> {
  const groupedQuestions = new Map<string, Question[]>();

  questions.forEach((question) => {
    const categoryId = question.categoryId;
    if (!groupedQuestions.has(categoryId)) {
      groupedQuestions.set(categoryId, []);
    }
    groupedQuestions.get(categoryId)?.push(question);
  });

  return groupedQuestions;
}

// 카테고리 내 질문들을 order 기준으로 정렬
export function sortQuestionsByOrder(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => a.order - b.order);
}

// 모드 1: 전체 랜덤 진행
export function applyMode1(questions: Question[]): Question[] {
  return shuffleArray(questions);
}

// 모드 2: 카테고리별 랜덤 진행
export function applyMode2(questions: Question[]): Question[] {
  const grouped = groupQuestionsByCategory(questions);
  const result: Question[] = [];

  // 카테고리를 orderIndex 기준으로 정렬
  const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
    // 카테고리의 첫 번째 질문의 카테고리 정보를 사용해서 정렬
    const _questionA = grouped.get(a)?.[0];
    const _questionB = grouped.get(b)?.[0];

    // 카테고리 순서는 설계된 순서대로 (hobby, talent, values, experience, daily, direction)
    const categoryOrder = [
      "hobby",
      "talent",
      "values",
      "experience",
      "daily",
      "direction",
    ];
    return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
  });

  // 각 카테고리별로 질문들을 랜덤하게 섞어서 추가
  sortedCategories.forEach((categoryId) => {
    const categoryQuestions = grouped.get(categoryId);
    if (categoryQuestions) {
      const shuffledQuestions = shuffleArray(categoryQuestions);
      result.push(...shuffledQuestions);
    }
  });

  return result;
}

// 모드 3: 카테고리별 정렬 순서
export function applyMode3(questions: Question[]): Question[] {
  const grouped = groupQuestionsByCategory(questions);
  const result: Question[] = [];

  // 카테고리를 orderIndex 기준으로 정렬 (모드 2와 동일)
  const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
    const categoryOrder = [
      "hobby",
      "talent",
      "values",
      "experience",
      "daily",
      "direction",
    ];
    return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
  });

  // 각 카테고리별로 질문들을 order 기준으로 정렬해서 추가
  sortedCategories.forEach((categoryId) => {
    const categoryQuestions = grouped.get(categoryId);
    if (categoryQuestions) {
      const sortedQuestions = sortQuestionsByOrder(categoryQuestions);
      result.push(...sortedQuestions);
    }
  });

  return result;
}

// 모드 4: 전체 목록에서 개별 확인 (정렬된 상태로 제공)
export function applyMode4(questions: Question[]): Question[] {
  // 카테고리별로 그룹화 후 각 카테고리 내에서 order 기준 정렬
  const grouped = groupQuestionsByCategory(questions);
  const result: Question[] = [];

  // 카테고리 순서대로 정렬
  const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
    const categoryOrder = [
      "hobby",
      "talent",
      "values",
      "experience",
      "daily",
      "direction",
    ];
    return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
  });

  // 각 카테고리별로 정렬된 질문들 추가
  sortedCategories.forEach((categoryId) => {
    const categoryQuestions = grouped.get(categoryId);
    if (categoryQuestions) {
      const sortedQuestions = sortQuestionsByOrder(categoryQuestions);
      result.push(...sortedQuestions);
    }
  });

  return result;
}

// 질문 모드 적용 메인 함수
export function applyQuestionMode(
  questions: Question[],
  mode: QuestionMode,
): Question[] {
  switch (mode) {
    case 1:
      return applyMode1(questions);
    case 2:
      return applyMode2(questions);
    case 3:
      return applyMode3(questions);
    case 4:
      return applyMode4(questions);
    default:
      throw new Error(`Unknown question mode: ${mode}`);
  }
}

// 질문 모드 설명 생성
export function getQuestionModeDescription(mode: QuestionMode): string {
  switch (mode) {
    case 1:
      return "선택된 조건의 질문들을 완전 랜덤 순서로 진행합니다.";
    case 2:
      return "카테고리 순서는 고정하되, 각 카테고리 내 질문들은 랜덤 순서로 진행합니다.";
    case 3:
      return "카테고리와 질문 모두 정해진 순서대로 진행합니다.";
    case 4:
      return "전체 질문 목록을 확인하고 원하는 질문을 선택해서 진행합니다.";
    default:
      return "알 수 없는 모드입니다.";
  }
}

// 질문 모드별 특징 정보
export interface QuestionModeFeatures {
  allowsRandomization: boolean;
  preservesCategoryOrder: boolean;
  preservesQuestionOrder: boolean;
  allowsIndividualSelection: boolean;
  supportsContinuousNavigation: boolean;
}

export function getQuestionModeFeatures(
  mode: QuestionMode,
): QuestionModeFeatures {
  switch (mode) {
    case 1:
      return {
        allowsRandomization: true,
        preservesCategoryOrder: false,
        preservesQuestionOrder: false,
        allowsIndividualSelection: false,
        supportsContinuousNavigation: true,
      };
    case 2:
      return {
        allowsRandomization: true,
        preservesCategoryOrder: true,
        preservesQuestionOrder: false,
        allowsIndividualSelection: false,
        supportsContinuousNavigation: true,
      };
    case 3:
      return {
        allowsRandomization: false,
        preservesCategoryOrder: true,
        preservesQuestionOrder: true,
        allowsIndividualSelection: false,
        supportsContinuousNavigation: true,
      };
    case 4:
      return {
        allowsRandomization: false,
        preservesCategoryOrder: true,
        preservesQuestionOrder: true,
        allowsIndividualSelection: true,
        supportsContinuousNavigation: false,
      };
    default:
      throw new Error(`Unknown question mode: ${mode}`);
  }
}

// 질문 순서 미리보기 (디버깅 및 테스트용)
export function previewQuestionOrder(
  questions: Question[],
  mode: QuestionMode,
): string[] {
  const processedQuestions = applyQuestionMode(questions, mode);
  return processedQuestions.map(
    (q) =>
      `${q.categoryName} - ${q.difficulty} - ${q.content.substring(0, 30)}...`,
  );
}
