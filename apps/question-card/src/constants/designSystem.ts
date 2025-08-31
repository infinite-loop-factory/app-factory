/**
 * EasyTalking 디자인 시스템 토큰
 * v0/Lovable 스타일 기반 Clean & Modern 디자인
 */

import type { Category, Difficulty, DifficultyLevel } from "@/types";

// 카테고리 색상 팔레트 (v0/Lovable 스타일)
export const categoryColors = {
  hobby: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  talent: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
  },
  values: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  experience: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  daily: {
    50: "#fefce8",
    100: "#fef3c7",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
  },
  direction: {
    50: "#faf5ff",
    100: "#f3e8ff",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
  },
} as const;

// 난이도 색상
export const difficultyColors: Record<DifficultyLevel, string> = {
  easy: "#22c55e", // 초록
  medium: "#f59e0b", // 주황
  hard: "#ef4444", // 빨강
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

// 카테고리 정보 (아이콘, 색상 매핑)
export const categories: Category[] = [
  {
    id: "hobby",
    name: "나의 취향",
    icon: "📝",
    color: categoryColors.hobby[500],
    description: "좋아하는 것들에 대한 질문",
    orderIndex: 0,
  },
  {
    id: "talent",
    name: "나의 재능",
    icon: "🎯",
    color: categoryColors.talent[500],
    description: "능력과 소질에 대한 질문",
    orderIndex: 1,
  },
  {
    id: "values",
    name: "나의 가치관",
    icon: "⚖️",
    color: categoryColors.values[500],
    description: "신념과 가치관에 대한 질문",
    orderIndex: 2,
  },
  {
    id: "experience",
    name: "나의 경험",
    icon: "🌟",
    color: categoryColors.experience[500],
    description: "과거 경험에 대한 질문",
    orderIndex: 3,
  },
  {
    id: "daily",
    name: "나의 일상",
    icon: "🏠",
    color: categoryColors.daily[500],
    description: "일상생활에 대한 질문",
    orderIndex: 4,
  },
  {
    id: "direction",
    name: "나의 방향성",
    icon: "🧭",
    color: categoryColors.direction[500],
    description: "미래와 목표에 대한 질문",
    orderIndex: 5,
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
