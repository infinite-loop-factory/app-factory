# 개발 계획서 (Development Plan)

EasyTalking 앱 전체 개발 로드맵 및 작업 계획

## 📊 현재 상태 분석

### ✅ 완료된 작업
- [x] Expo 프로젝트 초기 설정
- [x] NativeWind (Tailwind CSS) 구성
- [x] i18n 다국어 지원 설정 (한국어/영어)
- [x] 기본 컴포넌트 구조 (ThemedText, ThemedView 등)
- [x] 120개 질문 데이터 구조화 (`data/questions.json`)
- [x] 상세 기획 문서 작성 (requirements, user-flow, wireframes)
- [x] 디자인 시스템 설계 (v0/Lovable 스타일 기반)

### ❌ 구현 필요 사항
- [ ] 6개 화면 구현 (현재 기본 탭 화면만 존재)
- [ ] 질문 데이터 로딩 및 필터링 시스템
- [ ] 상태 관리 구조 (Context API)
- [ ] 네비게이션 구조 변경 (탭 → 스택)
- [ ] UI 컴포넌트 구현
- [ ] 스와이프 제스처 및 인터랙션

## 🎯 기술적 요구사항 결정

### 상태 관리
- **선택**: Context API (최소한 전역 상태 사용)
- **이유**: 앱이 비교적 단순하고 복잡한 상태 로직이 불필요

### 네비게이션  
- **선택**: Stack Navigation (탭 구조 제거)
- **준수**: Expo 52 버전 호환성
- **이유**: 선형적 사용자 플로우에 적합

### 디자인 시스템
- **기술 스택**: Gluestack-ui v2 + NativeWind
- **스타일 철학**: v0/Lovable 패턴 기반 Clean & Modern
- **추가 패키지**: 불필요 (현재 설정으로 충분)

## 🚀 전체 개발 로드맵 (9-14일)

### **Phase 1: 기반 구조 구축 (Day 1-3)**

#### Day 1: 핵심 인프라
- [ ] TypeScript 인터페이스 정의 (`src/types/questions.ts`)
- [ ] 데이터 로딩 시스템 (`src/hooks/useQuestions.ts`)
- [ ] 디자인 시스템 토큰 설정 (`src/constants/designSystem.ts`)
- [ ] Gluestack-ui 기본 컴포넌트 설치

#### Day 2: 상태 관리 & 네비게이션
- [ ] Context API 전역 상태 설정 (`src/context/AppContext.tsx`)
- [ ] 네비게이션 구조 변경 (탭 → 스택)
- [ ] 질문 필터링 로직 구현
- [ ] 선택 상태 관리 및 검증

#### Day 3: 핵심 비즈니스 로직
- [ ] 4가지 질문 모드 알고리즘 구현
  - 전체 랜덤 진행
  - 카테고리별 랜덤 진행
  - 카테고리별 정렬 순서  
  - 개별 선택 모드
- [ ] 질문 진행 상태 관리
- [ ] 유효성 검사 로직

### **Phase 2: UI 컴포넌트 개발 (Day 4-7)** ✅ 완료 - 2024.09.06

#### Day 4: 기본 컴포넌트 ✅ 완료
- [x] QuestionCard 컴포넌트 (디자인 시스템 적용)
- [x] CheckboxItem 컴포넌트
- [x] HeaderBar 컴포넌트
- [x] NavigationButton 컴포넌트

#### Day 5-6: 화면별 구현 ✅ 완료
- [x] CategorySelectionScreen
- [x] DifficultySelectionScreen  
- [x] QuestionMainScreen
- [x] ContinuousCardScreen (모드 1,2,3)

#### Day 7: 리스트 모드 구현 ✅ 완료 - **Phase 3로 이관**
- [x] 화면 간 네비게이션 연결 - **완료**

### **✅ Phase 3: UI 디자인 개선 & 품질 완성 (Day 8-10)** 🎉 **100% 완료 - 2024.09.20**

#### Day 8: 모드 4 필수 화면 구현 ✅ **완료**
- [x] **QuestionListScreen** - 질문 목록 보기 화면 구현 완료
  - 질문 미리보기 (30글자), 카테고리 아이콘, 난이도 배지
  - 스크롤 가능한 리스트 UI, 총 질문 수 표시
  - "설정 다시하기", "질문 모드 선택으로 돌아가기" 네비게이션
- [x] **IndividualCardScreen** - 개별 질문 카드 화면 구현 완료
  - ContinuousCardScreen과 동일한 카드 디자인
  - 버튼 전용 네비게이션 (스와이프 제거)
  - "리스트 순서대로 이동합니다" 도움말 텍스트
  - "목록으로", "메인으로" 네비게이션 옵션

#### Day 9: 라우팅 완성 및 품질 개선 ✅ **완료**
- [x] **모드 4 라우팅 연결** - question-list.tsx, individual-card.tsx 생성
- [x] **QuestionMainScreen 업데이트** - 모드 4 선택시 올바른 라우팅
- [x] **완전한 사용자 플로우** - Category → Difficulty → Main → List → Card

#### Day 10: UI 디자인 시스템 완성 ✅ **완료 - 2024.09.20**
- [x] **Modern Refined Orange v2.0 적용** - 모든 6개 화면 통일된 디자인
- [x] **StyleSheet 완전 제거** - 100% NativeWind 변환 완료
- [x] **통일된 디자인 패턴** - Gray 기본 + Orange 포인트 색상 시스템
- [x] **모든 6개 화면 완성** - IndexScreen, CategorySelection, DifficultySelection, QuestionMain, ContinuousCard, QuestionList, IndividualCard
- [x] **4가지 모드 완전 구현** - 모드 1,2,3 (연속 카드), 모드 4 (리스트 → 개별 카드)
- [x] **에러 핸들링** - 질문 없음, 빈 선택 등 방어 코드
- [x] **사용자 경험** - 적절한 도움말, 알럿, 네비게이션 옵션

#### 🎯 Phase 3 주요 성과 (2024.09.20)
- [x] **Modern Refined Orange v2.0 완전 적용**: 모든 6개 화면 통일된 현대적 디자인
- [x] **StyleSheet 완전 제거**: 100% NativeWind 변환으로 스타일링 일관성 확보
- [x] **통일된 디자인 시스템**: Gray 기본 + Orange 포인트 색상으로 브랜드 정체성 강화
- [x] **완전한 사용자 플로우**: 모든 4가지 모드와 6개 화면 완성
- [x] **질문 네비게이션 이슈**: Context 상태 동기화 문제 해결 (Phase 2)
- [x] **텍스트 렌더링 이슈**: Flexbox `flex-1` → `flex` 변경으로 해결 (Phase 2)
- [x] **핵심 플로우 완성**: Category → Difficulty → Main → Card (6/6 화면)
- [x] **스와이프 제스처**: 고품질 사용자 인터랙션 구현

### **🚀 Phase 4: 성능 최적화 & 최종 배포 준비 (Day 11-14)**

#### Day 11-12: 성능 최적화 (우선순위 1)
- [ ] **React 최적화**: React.memo, useCallback, useMemo 적용
- [ ] **불필요한 리렌더링 방지**: 컴포넌트 메모이제이션
- [ ] **Context API 최적화**: 상태 분리 및 선택적 구독
- [ ] **이미지/아이콘 최적화**: 로딩 성능 개선
- [ ] **번들 크기 최적화**: 앱 다운로드 속도 개선

#### Day 13: 접근성 개선 & 테스트 작성 (우선순위 2-3)
- [ ] **접근성 개선**: 스크린 리더 지원, accessibilityLabel 추가
- [ ] **키보드 네비게이션**: 접근성 향상
- [ ] **색상 대비**: WCAG 가이드라인 준수 검증
- [ ] **핵심 로직 단위 테스트**: 질문 필터링, 모드 알고리즘
- [ ] **컴포넌트 테스트**: 주요 화면 컴포넌트 테스트
- [ ] **E2E 테스트**: 전체 사용자 플로우 테스트

#### Day 14: 최종 품질 보증 (우선순위 4)
- [ ] **다양한 디바이스 테스트**: iOS/Android 호환성
- [ ] **성능 프로파일링**: 메모리, CPU 사용량 최적화
- [ ] **최종 사용자 테스트**: 실제 사용 시나리오 검증
- [ ] **최종 버그 픽스 및 릴리즈 준비**

## 📋 세부 작업 목록

### 즉시 시작 가능한 작업들

#### 1순위 (Day 1)
```typescript
// src/types/questions.ts
interface Question {
  id: number;
  categoryId: string;
  categoryName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  order: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface Difficulty {
  id: 'easy' | 'medium' | 'hard';
  name: string;
  color: string;
  description: string;
}
```

#### 2순위 (Day 1-2)
```typescript
// src/hooks/useQuestions.ts - 데이터 로딩 및 필터링
// src/constants/designSystem.ts - 디자인 토큰
// src/context/AppContext.tsx - 전역 상태 관리
```

#### 3순위 (Day 2-3)
```bash
# Gluestack-ui 컴포넌트 설치
npx gluestack-ui add box text button checkbox hstack vstack
```

### 기술적 결정사항

#### 상태 구조
```typescript
interface AppState {
  selectedCategories: string[];
  selectedDifficulties: string[];
  currentMode: 1 | 2 | 3 | 4;
  filteredQuestions: Question[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}
```

#### 디렉토리 구조
```
src/
├── types/           # TypeScript 인터페이스
│   └── questions.ts
├── hooks/           # 커스텀 훅
│   ├── useQuestions.ts
│   ├── useNavigation.ts
│   └── useSelection.ts
├── context/         # Context API
│   └── AppContext.tsx
├── constants/       # 상수 및 설정
│   └── designSystem.ts
├── components/      # UI 컴포넌트
│   └── ui/
│       ├── QuestionCard.tsx
│       ├── CheckboxItem.tsx
│       ├── HeaderBar.tsx
│       └── NavigationButton.tsx
├── app/             # Expo Router 화면
│   ├── category-selection.tsx
│   ├── difficulty-selection.tsx
│   ├── question-main.tsx
│   ├── continuous-card.tsx
│   ├── question-list.tsx
│   └── individual-card.tsx
└── utils/           # 유틸리티 함수
    ├── questionFilters.ts
    └── shuffle.ts
```

## ⚠️ 리스크 요소 및 대응

### 기술적 리스크
1. **Expo 52 호환성 이슈**
   - 대응: 공식 문서 참조 및 최신 버전 사용

2. **Gluestack-ui v2 안정성**
   - 대응: 핵심 컴포넌트 우선 적용, 필요시 Native 컴포넌트 폴백

3. **스와이프 제스처 구현 복잡도**
   - 대응: react-native-gesture-handler 활용, 단계적 구현

### 일정 리스크
1. **디자인 시스템 구축 시간 과소평가**
   - 대응: MVP 중심으로 핵심 컴포넌트 우선 구현

2. **복잡한 상태 관리**
   - 대응: Context API로 단순하게 시작, 필요시 확장

## 🎯 성공 지표

### 기능적 목표
- [ ] 6개 화면 모두 정상 동작
- [ ] 4가지 질문 모드 완전 구현
- [ ] 120개 질문 데이터 오류 없이 표시
- [ ] 모든 선택 조합에서 정상 필터링

### 품질 목표
- [ ] 모바일에서 3초 이내 앱 시작
- [ ] 화면 전환 1초 이내
- [ ] 메모리 사용량 100MB 이하
- [ ] 접근성 점수 90% 이상

### 사용성 목표
- [ ] 직관적인 사용자 인터페이스
- [ ] 44px 이상 터치 영역 확보
- [ ] 한국어/영어 완전 지원
- [ ] 오프라인 동작 (Static JSON)

이 개발 계획을 따라 체계적으로 진행하면 성공적인 EasyTalking 앱을 구축할 수 있습니다.