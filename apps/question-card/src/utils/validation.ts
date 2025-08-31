/**
 * 유효성 검사 및 필터링 로직
 */

import type {
  Category,
  Difficulty,
  DifficultyLevel,
  FilteredQuestionSet,
  Question,
  QuestionMode,
  SelectionState,
} from "../types";

// 선택 상태 유효성 검사
export interface SelectionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSelectionState(
  selection: SelectionState,
): SelectionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 카테고리 선택 검증
  if (selection.selectedCategories.length === 0) {
    errors.push("최소 1개 이상의 카테고리를 선택해야 합니다.");
  }

  // 난이도 선택 검증
  if (selection.selectedDifficulties.length === 0) {
    errors.push("최소 1개 이상의 난이도를 선택해야 합니다.");
  }

  // 질문 모드 검증
  if (selection.currentMode === null) {
    warnings.push("질문 모드를 선택해주세요.");
  } else if (![1, 2, 3, 4].includes(selection.currentMode)) {
    errors.push("올바른 질문 모드를 선택해주세요.");
  }

  // 경고 사항
  if (selection.selectedCategories.length === 1) {
    warnings.push(
      "단일 카테고리 선택 시 다양한 질문을 경험하기 어려울 수 있습니다.",
    );
  }

  if (
    selection.selectedDifficulties.length === 1 &&
    selection.selectedDifficulties[0] === "hard"
  ) {
    warnings.push("'어려움' 난이도만 선택하면 질문 수가 제한될 수 있습니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 질문 데이터 유효성 검사
export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
  validQuestions: Question[];
  invalidQuestions: Question[];
}

export function validateQuestions(
  questions: Question[],
): QuestionValidationResult {
  const errors: string[] = [];
  const validQuestions: Question[] = [];
  const invalidQuestions: Question[] = [];

  if (!Array.isArray(questions)) {
    errors.push("질문 데이터가 배열 형태가 아닙니다.");
    return { isValid: false, errors, validQuestions, invalidQuestions };
  }

  questions.forEach((question, index) => {
    const questionErrors = validateSingleQuestion(question, index);

    if (questionErrors.length === 0) {
      validQuestions.push(question);
    } else {
      invalidQuestions.push(question);
      errors.push(...questionErrors);
    }
  });

  return {
    isValid: errors.length === 0 && validQuestions.length > 0,
    errors,
    validQuestions,
    invalidQuestions,
  };
}

// 개별 질문 필수 필드 검사
function validateQuestionRequiredFields(
  question: unknown,
  index: number,
): string[] {
  const errors: string[] = [];
  const prefix = `질문 #${index + 1}:`;
  const q = question as Record<string, unknown>;

  // 필수 필드 검사
  if (typeof q.id === "undefined" || q.id === null) {
    errors.push(`${prefix} ID가 없습니다.`);
  } else if (typeof q.id !== "number" && typeof q.id !== "string") {
    errors.push(`${prefix} ID는 숫자 또는 문자열이어야 합니다.`);
  }

  if (!q.categoryId || typeof q.categoryId !== "string") {
    errors.push(`${prefix} 카테고리 ID가 올바르지 않습니다.`);
  }

  if (!q.categoryName || typeof q.categoryName !== "string") {
    errors.push(`${prefix} 카테고리명이 올바르지 않습니다.`);
  }

  if (!q.content || typeof q.content !== "string") {
    errors.push(`${prefix} 질문 내용이 올바르지 않습니다.`);
  }

  return errors;
}

// 개별 질문 추가 검증 (난이도, 순서, 내용 길이)
function validateQuestionProperties(
  question: unknown,
  index: number,
): string[] {
  const errors: string[] = [];
  const prefix = `질문 #${index + 1}:`;
  const q = question as Record<string, unknown>;

  // 난이도 검사
  if (
    !(
      q.difficulty &&
      ["easy", "medium", "hard"].includes(q.difficulty as string)
    )
  ) {
    errors.push(
      `${prefix} 난이도가 올바르지 않습니다. (easy, medium, hard 중 하나여야 함)`,
    );
  }

  // order 필드 검사
  if (typeof q.order !== "number" || q.order < 0) {
    errors.push(`${prefix} 순서(order)는 0 이상의 숫자여야 합니다.`);
  }

  // 내용 길이 검사
  if (q.content && typeof q.content === "string") {
    if (q.content.length < 5 || q.content.length > 500) {
      errors.push(`${prefix} 질문 내용은 5자 이상 500자 이하여야 합니다.`);
    }
  }

  return errors;
}

// 개별 질문 유효성 검사 (통합)
function validateSingleQuestion(question: unknown, index: number): string[] {
  const requiredFieldErrors = validateQuestionRequiredFields(question, index);
  const propertyErrors = validateQuestionProperties(question, index);
  return [...requiredFieldErrors, ...propertyErrors];
}

// 카테고리 데이터 유효성 검사
export function validateCategories(categories: Category[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(categories) || categories.length === 0) {
    errors.push("카테고리 데이터가 없거나 올바르지 않습니다.");
    return { isValid: false, errors };
  }

  categories.forEach((category, index) => {
    const prefix = `카테고리 #${index + 1}:`;

    if (!category.id || typeof category.id !== "string") {
      errors.push(`${prefix} ID가 올바르지 않습니다.`);
    }

    if (!category.name || typeof category.name !== "string") {
      errors.push(`${prefix} 이름이 올바르지 않습니다.`);
    }

    if (!category.icon || typeof category.icon !== "string") {
      errors.push(`${prefix} 아이콘이 올바르지 않습니다.`);
    }

    if (!category.color || typeof category.color !== "string") {
      errors.push(`${prefix} 색상이 올바르지 않습니다.`);
    }

    if (typeof category.orderIndex !== "number" || category.orderIndex < 0) {
      errors.push(`${prefix} 순서 인덱스가 올바르지 않습니다.`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

// 난이도 데이터 유효성 검사
export function validateDifficulties(difficulties: Difficulty[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(difficulties) || difficulties.length === 0) {
    errors.push("난이도 데이터가 없거나 올바르지 않습니다.");
    return { isValid: false, errors };
  }

  const expectedDifficulties: DifficultyLevel[] = ["easy", "medium", "hard"];

  expectedDifficulties.forEach((expectedId) => {
    const difficulty = difficulties.find((d) => d.id === expectedId);
    if (!difficulty) {
      errors.push(`'${expectedId}' 난이도가 없습니다.`);
    }
  });

  difficulties.forEach((difficulty, index) => {
    const prefix = `난이도 #${index + 1}:`;

    if (
      !(difficulty.id && ["easy", "medium", "hard"].includes(difficulty.id))
    ) {
      errors.push(
        `${prefix} ID가 올바르지 않습니다. (easy, medium, hard 중 하나여야 함)`,
      );
    }

    if (!difficulty.name || typeof difficulty.name !== "string") {
      errors.push(`${prefix} 이름이 올바르지 않습니다.`);
    }

    if (!difficulty.color || typeof difficulty.color !== "string") {
      errors.push(`${prefix} 색상이 올바르지 않습니다.`);
    }

    if (
      typeof difficulty.orderIndex !== "number" ||
      difficulty.orderIndex < 0
    ) {
      errors.push(`${prefix} 순서 인덱스가 올바르지 않습니다.`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

// 필터링 결과 유효성 검사
export function validateFilteredQuestions(
  filteredSet: FilteredQuestionSet,
  originalQuestions: Question[],
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 기본 구조 검증
  if (!(filteredSet.questions && Array.isArray(filteredSet.questions))) {
    errors.push("필터링된 질문 배열이 올바르지 않습니다.");
    return { isValid: false, errors, warnings };
  }

  // 개수 일치성 검증
  if (filteredSet.totalCount !== filteredSet.questions.length) {
    errors.push("필터링된 질문 개수가 일치하지 않습니다.");
  }

  // 원본 데이터와의 일치성 검증
  filteredSet.questions.forEach((question, index) => {
    const originalQuestion = originalQuestions.find(
      (q) => q.id === question.id,
    );
    if (!originalQuestion) {
      errors.push(
        `필터링된 질문 #${index + 1}이 원본 데이터에 존재하지 않습니다.`,
      );
    }
  });

  // 경고 사항
  if (filteredSet.totalCount === 0) {
    warnings.push("선택한 조건에 맞는 질문이 없습니다.");
  } else if (filteredSet.totalCount < 5) {
    warnings.push(
      "질문 수가 적습니다. 더 많은 카테고리나 난이도를 선택해보세요.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 질문 모드 유효성 검사
export function validateQuestionMode(
  mode: QuestionMode,
  questionCount: number,
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (![1, 2, 3, 4].includes(mode)) {
    errors.push("올바르지 않은 질문 모드입니다.");
    return { isValid: false, errors, warnings };
  }

  // 모드별 최소 질문 수 요구사항
  const minQuestions = mode === 4 ? 1 : 3; // 개별 선택 모드는 1개, 연속 모드는 최소 3개

  if (questionCount < minQuestions) {
    if (mode === 4) {
      errors.push("개별 선택 모드를 사용하려면 최소 1개의 질문이 필요합니다.");
    } else {
      errors.push(
        `연속 진행 모드를 사용하려면 최소 ${minQuestions}개의 질문이 필요합니다.`,
      );
    }
  }

  // 경고 사항
  if (questionCount > 50) {
    warnings.push("질문 수가 많습니다. 시간이 오래 걸릴 수 있습니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 종합 유효성 검사 (앱 시작 전 전체 검증)
export function validateAppData(
  categories: Category[],
  difficulties: Difficulty[],
  questions: Question[],
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 카테고리 검증
  const categoryResult = validateCategories(categories);
  if (!categoryResult.isValid) {
    errors.push(...categoryResult.errors);
  }

  // 난이도 검증
  const difficultyResult = validateDifficulties(difficulties);
  if (!difficultyResult.isValid) {
    errors.push(...difficultyResult.errors);
  }

  // 질문 검증
  const questionResult = validateQuestions(questions);
  if (!questionResult.isValid) {
    errors.push(...questionResult.errors);
  }

  // 데이터 무결성 검증
  if (categoryResult.isValid && questionResult.isValid) {
    const categoryIds = new Set(categories.map((c) => c.id));
    const questionCategoryIds = new Set(questions.map((q) => q.categoryId));

    questionCategoryIds.forEach((categoryId) => {
      if (!categoryIds.has(categoryId)) {
        errors.push(
          `질문에서 참조하는 카테고리 '${categoryId}'가 존재하지 않습니다.`,
        );
      }
    });
  }

  // 경고 사항
  if (questions.length < 50) {
    warnings.push(
      "질문 수가 적습니다. 더 풍부한 경험을 위해 더 많은 질문을 추가하는 것을 고려해보세요.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
