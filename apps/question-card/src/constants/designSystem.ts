/**
 * EasyTalking 디자인 시스템 - Modern Refined Orange v2.0
 * NativeWind 기반 현대적이고 세련된 디자인 시스템
 *
 * 디자인 철학: 미니멀 + 포인트
 * - 그레이 톤 베이스 + 오렌지 포인트 컬러
 * - 현대적 우아함: 과도한 색상 사용 지양
 * - 계층적 시각화: 색상이 아닌 크기, 간격, 타이포그래피로 구조화
 *
 * 색상 사용 원칙:
 * - 오렌지: 브랜드 색상으로만 사용 (로고, 포인트 라인, 테두리)
 * - 그레이: 베이스 색상 (텍스트, 배경, 카드, 아이콘)
 * - 화이트: 청정함과 공간감을 위한 주요 배경색
 *
 * 스타일링 우선순위:
 * 1. NativeWind (Tailwind CSS for React Native) - 주요 스타일링
 * 2. Gluestack-ui 컴포넌트 - 적합한 경우 사용
 * 3. React Native StyleSheet - NativeWind 한계가 있을 때만 사용
 *
 * 참고 문서: docs/design-system-modern-refined.md
 */

import type {
  Category,
  CategoryGroup,
  Difficulty,
  DifficultyLevel,
} from "@/types";

// Vibrant Orange 테마 색상 (HSL → HEX 변환)
export const themeColors = {
  background: "#FFF5F0", // hsl(14, 100%, 95%)
  foreground: "#7A2E0E", // hsl(14, 80%, 25%)
  primary: "#FF6B35", // hsl(14, 100%, 60%) - 기본 색상
  primaryForeground: "#FFFFFF", // hsl(0, 0%, 100%)
  secondary: "#FFD1B8", // hsl(14, 90%, 85%)
  secondaryForeground: "#7A2E0E", // hsl(14, 80%, 25%)
  accent: "#FFA983", // hsl(14, 95%, 75%)
  accentForeground: "#7A2E0E", // hsl(14, 80%, 25%)
  muted: "#FFE6D6", // hsl(14, 60%, 90%)
  mutedForeground: "#B8652A", // hsl(14, 50%, 45%)
  card: "#FFFAF8", // hsl(14, 100%, 97%)
  cardForeground: "#7A2E0E", // hsl(14, 80%, 25%)
  popover: "#FFFAF8", // hsl(14, 100%, 97%)
  popoverForeground: "#7A2E0E", // hsl(14, 80%, 25%)
  border: "#FFCC99", // hsl(14, 80%, 80%)
  input: "#FFD1B8", // hsl(14, 90%, 85%)
  ring: "#FF6B35", // hsl(14, 100%, 60%)
  destructive: "#E53935", // hsl(0, 85%, 60%)
  destructiveForeground: "#FFFFFF", // hsl(0, 0%, 100%)

  // 사이드바 색상 (필요시 사용)
  sidebar: "#FFF7F3", // hsl(14, 100%, 96%)
  sidebarForeground: "#7A2E0E", // hsl(14, 80%, 25%)
  sidebarPrimary: "#FF6B35", // hsl(14, 100%, 60%)
  sidebarPrimaryForeground: "#FFFFFF", // hsl(0, 0%, 100%)
  sidebarAccent: "#FFA983", // hsl(14, 95%, 75%)
  sidebarAccentForeground: "#7A2E0E", // hsl(14, 80%, 25%)
  sidebarBorder: "#FFE0CC", // hsl(14, 90%, 88%)
  sidebarRing: "#FF6B35", // hsl(14, 100%, 60%)

  // 차트 색상
  chart1: "#FF6B35", // hsl(14, 100%, 60%)
  chart2: "#E6A65C", // hsl(14, 70%, 55%)
  chart3: "#D4A574", // hsl(30, 60%, 60%)
  chart4: "#C4B584", // hsl(45, 70%, 65%)
  chart5: "#B5C794", // hsl(60, 80%, 70%)
} as const;

// Vibrant Orange 테마 NativeWind 클래스 매핑
export const themeTailwindClasses = {
  // 배경색
  background: "bg-orange-50", // 가장 밝은 배경
  foreground: "text-orange-900", // 주요 텍스트

  // 기본 색상
  primary: "bg-orange-500", // #FF6B35 에 가까운 orange-500
  primaryText: "text-orange-500",
  primaryBorder: "border-orange-500",

  // 보조 색상
  secondary: "bg-orange-200", // 부드러운 배경
  secondaryText: "text-orange-800",

  // 강조 색상
  accent: "bg-orange-300", // 강조 배경
  accentText: "text-orange-800",

  // 뮤트/비활성 색상
  muted: "bg-orange-100", // 비활성 배경
  mutedText: "text-orange-600", // 부가 텍스트

  // 카드 및 팝오버
  card: "bg-white", // 카드 배경 (흰색으로 유지)
  cardBorder: "border-orange-200", // 카드 테두리

  // 입력 및 테두리
  border: "border-orange-300", // 일반 테두리
  input: "bg-orange-100", // 입력 배경
  inputBorder: "border-orange-400", // 입력 테두리

  // 포커스 및 링
  ring: "ring-orange-500", // 포커스 링
  focus: "focus:ring-orange-500 focus:border-orange-500",

  // 위험/삭제 색상
  destructive: "bg-red-500", // 삭제/위험 배경
  destructiveText: "text-red-500", // 삭제/위험 텍스트

  // 상태별 색상
  success: "bg-green-500", // 성공
  warning: "bg-amber-500", // 경고
  error: "bg-red-500", // 오류
  info: "bg-blue-500", // 정보
} as const;

// 카테고리 색상 팔레트 (Vibrant Orange 테마와 조화로운 색상)
export const categoryColors = {
  hobby: {
    50: "#fff7ed", // orange-50 - 취향 (기본 테마 색상)
    100: "#ffedd5", // orange-100
    500: "#FF6B35", // 기본 테마 색상 사용
    600: "#ea580c", // orange-600
    700: "#c2410c", // orange-700
  },
  talent: {
    50: "#ecfdf5", // green-50 - 재능 (성장을 의미하는 그린)
    100: "#d1fae5", // green-100
    500: "#10b981", // emerald-500
    600: "#059669", // emerald-600
    700: "#047857", // emerald-700
  },
  values: {
    50: "#eff6ff", // blue-50 - 가치관 (신뢰를 의미하는 블루)
    100: "#dbeafe", // blue-100
    500: "#3b82f6", // blue-500
    600: "#2563eb", // blue-600
    700: "#1d4ed8", // blue-700
  },
  experience: {
    50: "#fef3c7", // amber-50 - 경험 (따뜻한 황금색)
    100: "#fde68a", // amber-100
    500: "#f59e0b", // amber-500
    600: "#d97706", // amber-600
    700: "#b45309", // amber-700
  },
  daily: {
    50: "#fdf4ff", // fuchsia-50 - 일상 (생동감 있는 핑크)
    100: "#fae8ff", // fuchsia-100
    500: "#d946ef", // fuchsia-500
    600: "#c026d3", // fuchsia-600
    700: "#a21caf", // fuchsia-700
  },
  direction: {
    50: "#f0f9ff", // sky-50 - 방향성 (미래를 의미하는 스카이 블루)
    100: "#e0f2fe", // sky-100
    500: "#0ea5e9", // sky-500
    600: "#0284c7", // sky-600
    700: "#0369a1", // sky-700
  },
  "deep-question": {
    50: "#f5f3ff", // violet-50 - 깊은 질문
    100: "#ede9fe", // violet-100
    500: "#8b5cf6", // violet-500
    600: "#7c3aed", // violet-600
    700: "#6d28d9", // violet-700
  },
  "love-relationship": {
    50: "#fff1f2", // rose-50 - 연애와 관계
    100: "#ffe4e6", // rose-100
    500: "#f43f5e", // rose-500
    600: "#e11d48", // rose-600
    700: "#be123c", // rose-700
  },
  "fun-question": {
    50: "#f7fee7", // lime-50 - 재미있는 질문
    100: "#ecfccb", // lime-100
    500: "#84cc16", // lime-500
    600: "#65a30d", // lime-600
    700: "#4d7c0f", // lime-700
  },
  hypothetical: {
    50: "#f0fdfa", // teal-50 - 가정 질문
    100: "#ccfbf1", // teal-100
    500: "#14b8a6", // teal-500
    600: "#0d9488", // teal-600
    700: "#0f766e", // teal-700
  },
  "self-reflection": {
    50: "#eef2ff", // indigo-50 - 자기 성찰
    100: "#e0e7ff", // indigo-100
    500: "#6366f1", // indigo-500
    600: "#4f46e5", // indigo-600
    700: "#4338ca", // indigo-700
  },
  controversial: {
    50: "#fef2f2", // red-50 - 논쟁적 주제
    100: "#fee2e2", // red-100
    500: "#ef4444", // red-500
    600: "#dc2626", // red-600
    700: "#b91c1c", // red-700
  },
} as const;

// 카테고리별 NativeWind Tailwind 클래스 매핑 (새 테마 반영)
export const categoryTailwindClasses = {
  hobby: {
    bg: {
      50: "bg-orange-50", // 취향 - 메인 테마 색상
      100: "bg-orange-100",
      500: "bg-orange-500",
      600: "bg-orange-600",
      700: "bg-orange-700",
    },
    text: {
      500: "text-orange-500",
      600: "text-orange-600",
      700: "text-orange-700",
    },
    border: {
      500: "border-orange-500",
      600: "border-orange-600",
    },
  },
  talent: {
    bg: {
      50: "bg-emerald-50", // 재능 - 성장의 그린
      100: "bg-emerald-100",
      500: "bg-emerald-500",
      600: "bg-emerald-600",
      700: "bg-emerald-700",
    },
    text: {
      500: "text-emerald-500",
      600: "text-emerald-600",
      700: "text-emerald-700",
    },
    border: {
      500: "border-emerald-500",
      600: "border-emerald-600",
    },
  },
  values: {
    bg: {
      50: "bg-blue-50", // 가치관 - 신뢰의 블루
      100: "bg-blue-100",
      500: "bg-blue-500",
      600: "bg-blue-600",
      700: "bg-blue-700",
    },
    text: {
      500: "text-blue-500",
      600: "text-blue-600",
      700: "text-blue-700",
    },
    border: {
      500: "border-blue-500",
      600: "border-blue-600",
    },
  },
  experience: {
    bg: {
      50: "bg-amber-50", // 경험 - 따뜻한 황금색
      100: "bg-amber-100",
      500: "bg-amber-500",
      600: "bg-amber-600",
      700: "bg-amber-700",
    },
    text: {
      500: "text-amber-500",
      600: "text-amber-600",
      700: "text-amber-700",
    },
    border: {
      500: "border-amber-500",
      600: "border-amber-600",
    },
  },
  daily: {
    bg: {
      50: "bg-fuchsia-50", // 일상 - 생동감 있는 핑크
      100: "bg-fuchsia-100",
      500: "bg-fuchsia-500",
      600: "bg-fuchsia-600",
      700: "bg-fuchsia-700",
    },
    text: {
      500: "text-fuchsia-500",
      600: "text-fuchsia-600",
      700: "text-fuchsia-700",
    },
    border: {
      500: "border-fuchsia-500",
      600: "border-fuchsia-600",
    },
  },
  direction: {
    bg: {
      50: "bg-sky-50", // 방향성 - 미래의 스카이 블루
      100: "bg-sky-100",
      500: "bg-sky-500",
      600: "bg-sky-600",
      700: "bg-sky-700",
    },
    text: {
      500: "text-sky-500",
      600: "text-sky-600",
      700: "text-sky-700",
    },
    border: {
      500: "border-sky-500",
      600: "border-sky-600",
    },
  },
  "deep-question": {
    bg: {
      50: "bg-violet-50",
      100: "bg-violet-100",
      500: "bg-violet-500",
      600: "bg-violet-600",
      700: "bg-violet-700",
    },
    text: {
      500: "text-violet-500",
      600: "text-violet-600",
      700: "text-violet-700",
    },
    border: {
      500: "border-violet-500",
      600: "border-violet-600",
    },
  },
  "love-relationship": {
    bg: {
      50: "bg-rose-50",
      100: "bg-rose-100",
      500: "bg-rose-500",
      600: "bg-rose-600",
      700: "bg-rose-700",
    },
    text: {
      500: "text-rose-500",
      600: "text-rose-600",
      700: "text-rose-700",
    },
    border: {
      500: "border-rose-500",
      600: "border-rose-600",
    },
  },
  "fun-question": {
    bg: {
      50: "bg-lime-50",
      100: "bg-lime-100",
      500: "bg-lime-500",
      600: "bg-lime-600",
      700: "bg-lime-700",
    },
    text: {
      500: "text-lime-500",
      600: "text-lime-600",
      700: "text-lime-700",
    },
    border: {
      500: "border-lime-500",
      600: "border-lime-600",
    },
  },
  hypothetical: {
    bg: {
      50: "bg-teal-50",
      100: "bg-teal-100",
      500: "bg-teal-500",
      600: "bg-teal-600",
      700: "bg-teal-700",
    },
    text: {
      500: "text-teal-500",
      600: "text-teal-600",
      700: "text-teal-700",
    },
    border: {
      500: "border-teal-500",
      600: "border-teal-600",
    },
  },
  "self-reflection": {
    bg: {
      50: "bg-indigo-50",
      100: "bg-indigo-100",
      500: "bg-indigo-500",
      600: "bg-indigo-600",
      700: "bg-indigo-700",
    },
    text: {
      500: "text-indigo-500",
      600: "text-indigo-600",
      700: "text-indigo-700",
    },
    border: {
      500: "border-indigo-500",
      600: "border-indigo-600",
    },
  },
  controversial: {
    bg: {
      50: "bg-red-50",
      100: "bg-red-100",
      500: "bg-red-500",
      600: "bg-red-600",
      700: "bg-red-700",
    },
    text: {
      500: "text-red-500",
      600: "text-red-600",
      700: "text-red-700",
    },
    border: {
      500: "border-red-500",
      600: "border-red-600",
    },
  },
} as const;

// 난이도 색상 (NativeWind/Tailwind 기반)
export const difficultyColors: Record<DifficultyLevel, string> = {
  easy: "#22c55e", // green-500
  medium: "#f59e0b", // amber-500
  hard: "#ef4444", // red-500
} as const;

// 난이도 NativeWind 클래스 매핑
export const difficultyTailwindClasses: Record<
  DifficultyLevel,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  easy: {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500",
  },
  medium: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    border: "border-amber-500",
  },
  hard: {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
  },
} as const;

// 중성 색상 (Tailwind CSS 기반)
export const neutralColors = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
} as const;

// 타이포그래피 스케일
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// 간격 시스템 (8px 기반)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,
} as const;

// 반경 (Radius)
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

// 그림자 (Shadow)
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
} as const;

// 카테고리 그룹 정보
export const categoryGroups: CategoryGroup[] = [
  {
    id: "self-discovery",
    name: "나를 알아가기",
    icon: "🌱",
    description: "나 자신을 탐구하는 질문들",
    order: 0,
  },
  {
    id: "conversation",
    name: "함께 이야기하기",
    icon: "💬",
    description: "함께 대화를 나누는 질문들",
    order: 1,
  },
];

// 카테고리 정보 (아이콘, 색상 매핑)
export const categories: Category[] = [
  // 그룹: 나를 알아가기
  {
    id: "hobby",
    name: "나의 취향",
    icon: "📝",
    color: categoryColors.hobby[500],
    description: "좋아하는 것들에 대한 질문",
    orderIndex: 0,
    groupId: "self-discovery",
  },
  {
    id: "talent",
    name: "나의 재능",
    icon: "🎯",
    color: categoryColors.talent[500],
    description: "능력과 소질에 대한 질문",
    orderIndex: 1,
    groupId: "self-discovery",
  },
  {
    id: "values",
    name: "나의 가치관",
    icon: "⚖️",
    color: categoryColors.values[500],
    description: "신념과 가치관에 대한 질문",
    orderIndex: 2,
    groupId: "self-discovery",
  },
  {
    id: "experience",
    name: "나의 경험",
    icon: "🌟",
    color: categoryColors.experience[500],
    description: "과거 경험에 대한 질문",
    orderIndex: 3,
    groupId: "self-discovery",
  },
  {
    id: "daily",
    name: "나의 일상",
    icon: "🏠",
    color: categoryColors.daily[500],
    description: "일상생활에 대한 질문",
    orderIndex: 4,
    groupId: "self-discovery",
  },
  {
    id: "direction",
    name: "나의 방향성",
    icon: "🧭",
    color: categoryColors.direction[500],
    description: "미래와 목표에 대한 질문",
    orderIndex: 5,
    groupId: "self-discovery",
  },
  // 그룹: 함께 이야기하기
  {
    id: "deep-question",
    name: "깊은 질문",
    icon: "🔮",
    color: categoryColors["deep-question"][500],
    description: "삶의 본질에 대한 깊은 질문",
    orderIndex: 6,
    groupId: "conversation",
  },
  {
    id: "love-relationship",
    name: "연애와 관계",
    icon: "💕",
    color: categoryColors["love-relationship"][500],
    description: "사랑과 인간관계에 대한 질문",
    orderIndex: 7,
    groupId: "conversation",
  },
  {
    id: "fun-question",
    name: "재미있는 질문",
    icon: "🎉",
    color: categoryColors["fun-question"][500],
    description: "가볍고 재미있는 질문",
    orderIndex: 8,
    groupId: "conversation",
  },
  {
    id: "hypothetical",
    name: "가정 질문",
    icon: "🤔",
    color: categoryColors.hypothetical[500],
    description: "만약에... 상상력을 자극하는 질문",
    orderIndex: 9,
    groupId: "conversation",
  },
  {
    id: "self-reflection",
    name: "자기 성찰",
    icon: "🪞",
    color: categoryColors["self-reflection"][500],
    description: "자신을 돌아보는 성찰 질문",
    orderIndex: 10,
    groupId: "conversation",
  },
  {
    id: "controversial",
    name: "논쟁적 주제",
    icon: "⚡",
    color: categoryColors.controversial[500],
    description: "다양한 관점의 토론 질문",
    orderIndex: 11,
    groupId: "conversation",
  },
];

// 난이도 정보
export const difficulties: Difficulty[] = [
  {
    id: "easy",
    name: "쉬움",
    color: difficultyColors.easy,
    description: "가벼운 대화용",
    orderIndex: 0,
  },
  {
    id: "medium",
    name: "보통",
    color: difficultyColors.medium,
    description: "일반적인 대화용",
    orderIndex: 1,
  },
  {
    id: "hard",
    name: "어려움",
    color: difficultyColors.hard,
    description: "깊은 대화용",
    orderIndex: 2,
  },
];

// 질문 진행 모드 정보
export const questionModes = [
  {
    id: 1 as const,
    name: "전체 랜덤 진행",
    description: "질문을 완전 랜덤으로",
    icon: "🎲",
  },
  {
    id: 2 as const,
    name: "카테고리별 랜덤 진행",
    description: "카테고리 순서대로, 내부는 랜덤",
    icon: "📚",
  },
  {
    id: 3 as const,
    name: "카테고리별 정렬 순서",
    description: "카테고리와 질문 모두 순서대로",
    icon: "📋",
  },
  {
    id: 4 as const,
    name: "전체 목록에서 개별 확인",
    description: "질문 리스트에서 선택하여 확인",
    icon: "📄",
  },
];

// 레이아웃 상수
export const layout = {
  // 최소 터치 영역 (접근성)
  minTouchTarget: 44,

  // 화면 패딩
  screenPadding: spacing.lg,

  // 카드 패딩
  cardPadding: spacing.lg,

  // 아이템 간격
  itemSpacing: spacing.md,

  // 버튼 높이
  buttonHeight: 48,

  // 체크박스 크기
  checkboxSize: 24,

  // 아이콘 크기
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
} as const;

// 헬퍼 함수들
export const getCategoryById = (id: string): Category | undefined =>
  categories.find((cat) => cat.id === id);

export const getDifficultyById = (
  id: DifficultyLevel,
): Difficulty | undefined => difficulties.find((diff) => diff.id === id);

export const getCategoryColor = (
  categoryId: string,
  shade: keyof typeof categoryColors.hobby = 500,
): string => {
  const colorMap = categoryColors[categoryId as keyof typeof categoryColors];
  return colorMap ? colorMap[shade] : neutralColors[500];
};

export const getDifficultyColor = (difficulty: DifficultyLevel): string =>
  difficultyColors[difficulty];

// NativeWind 헬퍼 함수들
export const getCategoryTailwindClass = (
  categoryId: string,
  type: "bg" | "text" | "border" = "bg",
  shade: 50 | 100 | 500 | 600 | 700 = 500,
): string => {
  const categoryClasses =
    categoryTailwindClasses[categoryId as keyof typeof categoryTailwindClasses];
  if (!categoryClasses) return `${type}-gray-${shade}`;

  if (type === "text" || type === "border") {
    return (
      categoryClasses[type][
        shade as keyof (typeof categoryClasses)[typeof type]
      ] || categoryClasses[type][500]
    );
  }

  return categoryClasses.bg[shade] || categoryClasses.bg[500];
};

export const getDifficultyTailwindClass = (
  difficulty: DifficultyLevel,
  type: "bg" | "text" | "border" = "bg",
): string => {
  return difficultyTailwindClasses[difficulty][type];
};

// 컴포넌트 스타일링 예제 (Modern Refined Orange v2.0 적용)
export const styleExamples = {
  // 🆕 Modern Refined 스타일 (v2.0)
  modern: {
    // 태그 (Tag) - Pill 스타일
    tag: "text-sm text-gray-700 rounded-full border border-orange-200 bg-white px-3 py-1.5",

    // 카드 - 미니멀 디자인
    card: "flex-row items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow",

    // 아이콘 컨테이너 - 중성적 배경
    iconContainer:
      "h-10 w-10 items-center justify-center rounded-full bg-gray-50",

    // 화살표 - 미니멀 스타일
    arrow: "h-6 w-6 items-center justify-center",
    arrowText: "text-lg text-gray-400 opacity-60",

    // 숫자 강조 - 세련된 디스플레이
    numberDisplay: {
      container: "items-center",
      label: "text-sm text-gray-400 mb-1",
      numberContainer: "flex-row items-end",
      number: "text-3xl font-bold text-gray-900",
      unit: "text-lg font-medium text-gray-400 ml-1 mb-1",
      accent: "h-1 w-12 rounded-full bg-orange-500 mt-2 opacity-60",
    },

    // 텍스트 색상
    text: {
      primary: "text-gray-900", // 주요 텍스트
      secondary: "text-gray-700", // 일반 텍스트
      muted: "text-gray-400", // 보조 텍스트
      brand: "text-orange-500", // 브랜드 컬러
    },

    // 버튼 - 현대적 스타일
    button: {
      primary:
        "bg-orange-500 text-white px-6 py-4 rounded-lg font-medium shadow-sm",
      secondary: "bg-orange-100 text-gray-700 px-6 py-4 rounded-lg font-medium",
      ghost: "text-gray-700 px-6 py-4 rounded-lg font-medium hover:bg-gray-50",
    },
  },
  // 테마 기반 기본 스타일
  theme: {
    // 화면 배경
    screenBackground: `${themeTailwindClasses.background}`, // bg-orange-50

    // 메인 텍스트
    primaryText: `${themeTailwindClasses.foreground}`, // text-orange-900

    // 카드 스타일
    card: `${themeTailwindClasses.card} rounded-xl shadow-lg ${themeTailwindClasses.cardBorder} p-6`,

    // 기본 버튼
    primaryButton: `${themeTailwindClasses.primary} text-white px-6 py-3 rounded-lg font-medium shadow-md`,
    secondaryButton: `${themeTailwindClasses.secondary} ${themeTailwindClasses.secondaryText} px-6 py-3 rounded-lg font-medium`,

    // 입력 필드
    input: `${themeTailwindClasses.input} ${themeTailwindClasses.inputBorder} rounded-lg px-4 py-3 ${themeTailwindClasses.focus}`,

    // 강조 배지
    accentBadge: `${themeTailwindClasses.accent} ${themeTailwindClasses.accentText} px-3 py-1 rounded-full text-sm font-medium`,
  },

  // 카테고리 카드 스타일링 예제 (업데이트)
  categoryCard: {
    base: "bg-white rounded-xl shadow-lg border border-orange-200 p-6 m-4",
    categoryBadge: (categoryId: string) =>
      `px-3 py-1 rounded-full ${getCategoryTailwindClass(categoryId, "bg", 100)} ${getCategoryTailwindClass(categoryId, "text", 600)}`,
  },

  // 난이도 배지 스타일링 예제 (유지)
  difficultyBadge: {
    base: "px-3 py-1 rounded-xl",
    easy: `${difficultyTailwindClasses.easy.bg} text-white`,
    medium: `${difficultyTailwindClasses.medium.bg} text-white`,
    hard: `${difficultyTailwindClasses.hard.bg} text-white`,
  },

  // 버튼 스타일링 예제 (새 테마 적용)
  buttons: {
    // 오렌지 테마 메인 버튼
    primary: `${themeTailwindClasses.primary} text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-orange-600 transition-colors`,

    // 보조 버튼 (연한 오렌지)
    secondary: `${themeTailwindClasses.secondary} ${themeTailwindClasses.secondaryText} px-6 py-3 rounded-lg font-medium hover:bg-orange-300 transition-colors`,

    // 강조 버튼
    accent: `${themeTailwindClasses.accent} ${themeTailwindClasses.accentText} px-6 py-3 rounded-lg font-medium hover:bg-orange-400 transition-colors`,

    // 비활성 버튼
    disabled:
      "bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium opacity-50",

    // 위험 버튼
    destructive: `${themeTailwindClasses.destructive} text-white px-6 py-3 rounded-lg font-medium`,

    // 텍스트 버튼
    ghost: `${themeTailwindClasses.primaryText} px-6 py-3 rounded-lg font-medium hover:bg-orange-100 transition-colors`,
  },

  // 레이아웃 스타일링 예제 (새 테마 적용)
  layouts: {
    // 화면 기본 배경
    screen: `flex-1 ${themeTailwindClasses.background}`,

    // 컨테이너
    container: "px-6 py-4",

    // 카드
    card: `${themeTailwindClasses.card} rounded-xl shadow-md p-6 ${themeTailwindClasses.cardBorder}`,

    // 헤더
    header: `flex-row justify-between items-center py-4 px-6 ${themeTailwindClasses.card} border-b ${themeTailwindClasses.border}`,

    // 네비게이션 바
    navbar: `${themeTailwindClasses.card} border-t ${themeTailwindClasses.border} px-6 py-3`,

    // 모달 오버레이
    modalOverlay: "flex-1 bg-black/50 justify-center items-center p-6",

    // 모달 콘텐츠
    modalContent: `${themeTailwindClasses.card} rounded-2xl shadow-2xl p-6 max-w-sm w-full`,

    // 구분선
    separator: `h-px ${themeTailwindClasses.border}`,
  },

  // 상태별 스타일
  states: {
    // 성공
    success: `${themeTailwindClasses.success} text-white`,
    successText: "text-green-600",
    successBg: "bg-green-50",
    successBorder: "border-green-200",

    // 경고
    warning: `${themeTailwindClasses.warning} text-white`,
    warningText: "text-amber-600",
    warningBg: "bg-amber-50",
    warningBorder: "border-amber-200",

    // 오류
    error: `${themeTailwindClasses.error} text-white`,
    errorText: `${themeTailwindClasses.destructiveText}`,
    errorBg: "bg-red-50",
    errorBorder: "border-red-200",

    // 정보
    info: `${themeTailwindClasses.info} text-white`,
    infoText: "text-blue-600",
    infoBg: "bg-blue-50",
    infoBorder: "border-blue-200",
  },
} as const;
