/**
 * EasyTalking 앱의 전역 상태 및 네비게이션 타입 정의
 */

import type {
  AppError,
  Category,
  Difficulty,
  DifficultyLevel,
  FilteredQuestionSet,
  Question,
  QuestionMode,
  QuestionProgress,
  SelectionState,
} from "./questions";

// 앱의 전역 상태
export interface AppState {
  // 데이터 상태
  categories: Category[];
  difficulties: Difficulty[];
  allQuestions: Question[];

  // 사용자 선택 상태
  selection: SelectionState;

  // 질문 진행 상태
  progress: QuestionProgress;

  // 필터링된 질문들
  filteredQuestions: FilteredQuestionSet;

  // 앱 상태
  isLoading: boolean;
  error: AppError | null;
  isInitialized: boolean;
}

// 앱 상태 액션 타입
export type AppAction =
  | {
      type: "INITIALIZE_APP";
      payload: {
        categories: Category[];
        difficulties: Difficulty[];
        questions: Question[];
      };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: AppError | null }
  | { type: "SELECT_CATEGORIES"; payload: string[] }
  | { type: "SELECT_DIFFICULTIES"; payload: DifficultyLevel[] }
  | { type: "SET_QUESTION_MODE"; payload: QuestionMode }
  | { type: "FILTER_QUESTIONS"; payload: FilteredQuestionSet }
  | { type: "SET_CURRENT_QUESTION_INDEX"; payload: number }
  | { type: "RESET_SELECTIONS" }
  | { type: "RESET_PROGRESS" };

// Context API용 타입
export interface AppContextType {
  state: AppState;
  actions: {
    initializeApp: (data: {
      categories: Category[];
      difficulties: Difficulty[];
      questions: Question[];
    }) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: AppError | null) => void;
    selectCategories: (categoryIds: string[]) => void;
    selectDifficulties: (difficulties: DifficultyLevel[]) => void;
    setQuestionMode: (mode: QuestionMode) => void;
    filterQuestions: (modeOverride?: QuestionMode) => void;
    setCurrentQuestionIndex: (index: number) => void;
    goToNextQuestion: () => void;
    goToPreviousQuestion: () => void;
    resetSelections: () => void;
    resetProgress: () => void;
  };
}

// 화면별 파라미터 타입
export type RootStackParamList = {
  CategorySelection: undefined;
  DifficultySelection: undefined;
  QuestionMain: undefined;
  ContinuousCard: { mode: 1 | 2 | 3 };
  QuestionList: undefined;
  IndividualCard: { questionIndex: number; fromList: boolean };
};

