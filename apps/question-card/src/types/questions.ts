/**
 * EasyTalking 앱의 핵심 데이터 타입 정의
 */

// 기본 질문 데이터 구조
export interface Question {
  id: number;
  categoryId: string;
  categoryName: string;
  difficulty: DifficultyLevel;
  content: string;
  order: number;
}

// 카테고리 정보
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  orderIndex: number;
}

// 난이도 레벨
export type DifficultyLevel = "easy" | "medium" | "hard";

// 난이도 정보
export interface Difficulty {
  id: DifficultyLevel;
  name: string;
  color: string;
  description: string;
  orderIndex: number;
}

// 질문 진행 모드
export type QuestionMode = 1 | 2 | 3 | 4;

// 질문 모드 정보
export interface QuestionModeInfo {
  id: QuestionMode;
  name: string;
  description: string;
  icon?: string;
}

// 필터링된 질문 집합
export interface FilteredQuestionSet {
  questions: Question[];
  totalCount: number;
  categoryCount: number;
  difficultyCount: number;
}

// 질문 진행 상태
export interface QuestionProgress {
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  isCompleted: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

// 사용자 선택 상태
export interface SelectionState {
  selectedCategories: string[];
  selectedDifficulties: DifficultyLevel[];
  currentMode: QuestionMode | null;
  hasValidSelection: boolean;
}

// 앱 에러 상태
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}
