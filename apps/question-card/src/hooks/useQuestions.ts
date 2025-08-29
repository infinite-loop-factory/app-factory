/**
 * 질문 데이터 로딩 및 필터링 관련 커스텀 훅
 */

import type { DifficultyLevel, FilteredQuestionSet, Question } from "@/types";

import { useCallback, useEffect, useState } from "react";

// 질문 데이터 로딩 훅
export function useQuestionData() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadQuestions = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      // JSON 파일에서 질문 데이터 로드
      const questionsData = require("../../data/questions.json");

      if (!(questionsData && Array.isArray(questionsData.questions))) {
        throw new Error("질문 데이터 형식이 올바르지 않습니다.");
      }

      setQuestions(questionsData.questions);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("질문 데이터 로딩 실패");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return { questions, isLoading, error, reload: loadQuestions };
}

// 질문 필터링 훅
export function useQuestionFiltering(questions: Question[]) {
  const [filteredQuestions, setFilteredQuestions] =
    useState<FilteredQuestionSet>({
      questions: [],
      totalCount: 0,
      categoryCount: 0,
      difficultyCount: 0,
    });

  // 조건에 따른 질문 필터링
  const filterQuestions = useCallback(
    (
      selectedCategories: string[],
      selectedDifficulties: DifficultyLevel[],
    ): FilteredQuestionSet => {
      if (
        selectedCategories.length === 0 ||
        selectedDifficulties.length === 0
      ) {
        return {
          questions: [],
          totalCount: 0,
          categoryCount: selectedCategories.length,
          difficultyCount: selectedDifficulties.length,
        };
      }

      const filtered = questions.filter(
        (question) =>
          selectedCategories.includes(question.categoryId) &&
          selectedDifficulties.includes(question.difficulty),
      );

      const result: FilteredQuestionSet = {
        questions: filtered,
        totalCount: filtered.length,
        categoryCount: selectedCategories.length,
        difficultyCount: selectedDifficulties.length,
      };

      setFilteredQuestions(result);
      return result;
    },
    [questions],
  );

  return { filteredQuestions, filterQuestions };
}

// 질문 검색 훅
export function useQuestionSearch(questions: Question[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Question[]>([]);

  const searchQuestions = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setSearchResults([]);
        return [];
      }

      const results = questions.filter(
        (question) =>
          question.content.toLowerCase().includes(query.toLowerCase()) ||
          question.categoryName.toLowerCase().includes(query.toLowerCase()),
      );

      setSearchResults(results);
      return results;
    },
    [questions],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    searchResults,
    searchQuestions,
    clearSearch,
  };
}

// 질문 통계 정보 훅
export function useQuestionStats(questions: Question[]) {
  const getStatsByCategory = useCallback(() => {
    const stats = new Map<
      string,
      { total: number; byDifficulty: Record<DifficultyLevel, number> }
    >();

    questions.forEach((question) => {
      const categoryId = question.categoryId;
      const difficulty = question.difficulty;

      if (!stats.has(categoryId)) {
        stats.set(categoryId, {
          total: 0,
          byDifficulty: { easy: 0, medium: 0, hard: 0 },
        });
      }

      const categoryStat = stats.get(categoryId);
      if (!categoryStat) {
        return;
      }
      categoryStat.total++;
      categoryStat.byDifficulty[difficulty]++;
    });

    return stats;
  }, [questions]);

  const getStatsByDifficulty = useCallback(() => {
    const stats: Record<DifficultyLevel, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    questions.forEach((question) => {
      stats[question.difficulty]++;
    });

    return stats;
  }, [questions]);

  const getTotalStats = useCallback(() => {
    const categoryStats = getStatsByCategory();
    const difficultyStats = getStatsByDifficulty();

    return {
      totalQuestions: questions.length,
      totalCategories: categoryStats.size,
      categoryStats,
      difficultyStats,
    };
  }, [questions, getStatsByCategory, getStatsByDifficulty]);

  return {
    getStatsByCategory,
    getStatsByDifficulty,
    getTotalStats,
  };
}

// 질문 유효성 검증 훅
export function useQuestionValidation() {
  const validateQuestion = useCallback((question: Question): boolean => {
    // 필수 필드 검증
    if (!(question.id && question.categoryId && question.content)) {
      return false;
    }

    // 난이도 검증
    if (!["easy", "medium", "hard"].includes(question.difficulty)) {
      return false;
    }

    // 내용 길이 검증
    if (question.content.length < 5 || question.content.length > 500) {
      return false;
    }

    return true;
  }, []);

  const validateQuestions = useCallback(
    (questions: Question[]): { valid: Question[]; invalid: Question[] } => {
      const valid: Question[] = [];
      const invalid: Question[] = [];

      questions.forEach((question) => {
        if (validateQuestion(question)) {
          valid.push(question);
        } else {
          invalid.push(question);
        }
      });

      return { valid, invalid };
    },
    [validateQuestion],
  );

  return {
    validateQuestion,
    validateQuestions,
  };
}
