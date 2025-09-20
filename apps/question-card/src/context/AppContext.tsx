/**
 * EasyTalking 앱 전역 상태 관리 Context
 */

import type React from "react";
import type {
  AppAction,
  AppContextType,
  AppError,
  AppState,
  Category,
  Difficulty,
  DifficultyLevel,
  FilteredQuestionSet,
  Question,
  QuestionMode,
} from "@/types";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { categories, difficulties } from "@/constants/designSystem";
import { useQuestionData } from "@/hooks/useQuestions";
import { applyQuestionMode } from "@/utils/questionModes";

// 초기 상태
const initialState: AppState = {
  categories: [],
  difficulties: [],
  allQuestions: [],
  selection: {
    selectedCategories: [],
    selectedDifficulties: [],
    currentMode: null,
    hasValidSelection: false,
  },
  progress: {
    currentIndex: 0,
    totalQuestions: 0,
    currentQuestion: null,
    isCompleted: false,
    canGoBack: false,
    canGoForward: false,
  },
  filteredQuestions: {
    questions: [],
    totalCount: 0,
    categoryCount: 0,
    difficultyCount: 0,
  },
  isLoading: false,
  error: null,
  isInitialized: false,
};

// 리듀서 함수
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "INITIALIZE_APP": {
      const { categories, difficulties, questions } = action.payload;
      return {
        ...state,
        categories,
        difficulties,
        allQuestions: questions,
        isInitialized: true,
        isLoading: false,
        error: null,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }

    case "SELECT_CATEGORIES": {
      const selectedCategories = action.payload;
      const hasValidSelection =
        selectedCategories.length > 0 &&
        state.selection.selectedDifficulties.length > 0;

      return {
        ...state,
        selection: {
          ...state.selection,
          selectedCategories,
          hasValidSelection,
        },
      };
    }

    case "SELECT_DIFFICULTIES": {
      const selectedDifficulties = action.payload;
      const hasValidSelection =
        selectedDifficulties.length > 0 &&
        state.selection.selectedCategories.length > 0;

      return {
        ...state,
        selection: {
          ...state.selection,
          selectedDifficulties,
          hasValidSelection,
        },
      };
    }

    case "SET_QUESTION_MODE": {
      return {
        ...state,
        selection: {
          ...state.selection,
          currentMode: action.payload,
        },
      };
    }

    case "FILTER_QUESTIONS": {
      const filteredQuestions = action.payload;
      const currentQuestion =
        filteredQuestions.questions.length > 0
          ? filteredQuestions.questions[0]
          : null;

      return {
        ...state,
        filteredQuestions,
        progress: {
          currentIndex: 0,
          totalQuestions: filteredQuestions.totalCount,
          currentQuestion: currentQuestion || null,
          isCompleted: false,
          canGoBack: false,
          canGoForward: filteredQuestions.totalCount > 1,
        },
      };
    }

    case "SET_CURRENT_QUESTION_INDEX": {
      const currentIndex = action.payload;
      const { questions } = state.filteredQuestions;
      const totalQuestions = questions.length;

      if (currentIndex < 0 || currentIndex >= totalQuestions) {
        return state;
      }

      const currentQuestion = questions[currentIndex] || null;
      const isCompleted = currentIndex === totalQuestions - 1;
      const canGoBack = currentIndex > 0;
      const canGoForward = currentIndex < totalQuestions - 1;

      return {
        ...state,
        progress: {
          currentIndex,
          totalQuestions,
          currentQuestion,
          isCompleted,
          canGoBack,
          canGoForward,
        },
      };
    }

    case "RESET_SELECTIONS": {
      return {
        ...state,
        selection: {
          selectedCategories: [],
          selectedDifficulties: [],
          currentMode: null,
          hasValidSelection: false,
        },
        filteredQuestions: {
          questions: [],
          totalCount: 0,
          categoryCount: 0,
          difficultyCount: 0,
        },
      };
    }

    case "RESET_PROGRESS": {
      return {
        ...state,
        progress: {
          currentIndex: 0,
          totalQuestions: state.filteredQuestions.totalCount,
          currentQuestion: state.filteredQuestions.questions[0] || null,
          isCompleted: false,
          canGoBack: false,
          canGoForward: state.filteredQuestions.totalCount > 1,
        },
      };
    }

    default:
      return state;
  }
}

// Context 생성
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 질문 데이터 로딩 훅 사용
  const { questions, isLoading, error } = useQuestionData();

  // 앱 초기화
  const initializeApp = useCallback(
    async (data: {
      categories: Category[];
      difficulties: Difficulty[];
      questions: Question[];
    }) => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // 시뮬레이션을 위한 짧은 지연
        await new Promise((resolve) => setTimeout(resolve, 100));
        dispatch({ type: "INITIALIZE_APP", payload: data });
      } catch (error) {
        const appError: AppError = {
          code: "INITIALIZATION_FAILED",
          message: "앱 초기화에 실패했습니다.",
          details: error,
        };
        dispatch({ type: "SET_ERROR", payload: appError });
      }
    },
    [],
  );

  // 로딩 상태 설정
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  // 에러 상태 설정
  const setError = useCallback((error: AppError | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  // 카테고리 선택
  const selectCategories = useCallback((categoryIds: string[]) => {
    dispatch({ type: "SELECT_CATEGORIES", payload: categoryIds });
  }, []);

  // 난이도 선택
  const selectDifficulties = useCallback((difficulties: DifficultyLevel[]) => {
    dispatch({ type: "SELECT_DIFFICULTIES", payload: difficulties });
  }, []);

  // 질문 모드 설정
  const setQuestionMode = useCallback((mode: QuestionMode) => {
    dispatch({ type: "SET_QUESTION_MODE", payload: mode });
  }, []);

  // 질문 필터링 및 모드별 정렬/랜덤화 적용
  const filterQuestions = useCallback(() => {
    const { selectedCategories, selectedDifficulties, currentMode } =
      state.selection;

    if (selectedCategories.length === 0 || selectedDifficulties.length === 0) {
      return;
    }

    // 선택된 조건에 맞는 질문들 필터링
    let filtered = state.allQuestions.filter(
      (question) =>
        selectedCategories.includes(question.categoryId) &&
        selectedDifficulties.includes(question.difficulty),
    );

    // 모드가 선택되었으면 모드별 정렬/랜덤화 적용
    if (currentMode) {
      filtered = applyQuestionMode(filtered, currentMode);
    }

    const filteredQuestionSet: FilteredQuestionSet = {
      questions: filtered,
      totalCount: filtered.length,
      categoryCount: selectedCategories.length,
      difficultyCount: selectedDifficulties.length,
    };

    dispatch({ type: "FILTER_QUESTIONS", payload: filteredQuestionSet });
  }, [state.selection, state.allQuestions]);

  // 질문 인덱스 설정
  const setCurrentQuestionIndex = useCallback((index: number) => {
    dispatch({ type: "SET_CURRENT_QUESTION_INDEX", payload: index });
  }, []);

  // 다음 질문으로 이동
  const goToNextQuestion = useCallback(() => {
    if (state.progress.canGoForward) {
      const nextIndex = state.progress.currentIndex + 1;
      dispatch({ type: "SET_CURRENT_QUESTION_INDEX", payload: nextIndex });
    }
  }, [state.progress]);

  // 이전 질문으로 이동
  const goToPreviousQuestion = useCallback(() => {
    if (state.progress.canGoBack) {
      const prevIndex = state.progress.currentIndex - 1;
      dispatch({ type: "SET_CURRENT_QUESTION_INDEX", payload: prevIndex });
    }
  }, [state.progress]);

  // 선택 초기화
  const resetSelections = useCallback(() => {
    dispatch({ type: "RESET_SELECTIONS" });
  }, []);

  // 진행 상태 초기화
  const resetProgress = useCallback(() => {
    dispatch({ type: "RESET_PROGRESS" });
  }, []);

  // Context 값
  const contextValue: AppContextType = {
    state,
    actions: {
      initializeApp,
      setLoading,
      setError,
      selectCategories,
      selectDifficulties,
      setQuestionMode,
      filterQuestions,
      setCurrentQuestionIndex,
      goToNextQuestion,
      goToPreviousQuestion,
      resetSelections,
      resetProgress,
    },
  };

  // 데이터 로딩 상태 관리
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  }, [isLoading]);

  // 에러 상태 관리
  useEffect(() => {
    if (error) {
      const appError: AppError = {
        code: "DATA_LOADING_FAILED",
        message: "질문 데이터 로딩에 실패했습니다.",
        details: error,
      };
      dispatch({ type: "SET_ERROR", payload: appError });
    }
  }, [error]);

  // 앱 초기화 (질문 데이터 로딩 완료 후)
  useEffect(() => {
    if (!state.isInitialized && questions.length > 0) {
      initializeApp({
        categories,
        difficulties,
        questions,
      });
    }
  }, [state.isInitialized, questions, initializeApp]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Context 사용 훅
export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}

// 개별 상태 선택 훅들
export function useAppState() {
  return useAppContext().state;
}

export function useAppActions() {
  return useAppContext().actions;
}
