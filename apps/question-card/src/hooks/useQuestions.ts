/**
 * 질문 데이터 로딩 및 필터링 관련 커스텀 훅
 */

import type { Question } from "@/types";

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
