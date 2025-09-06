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

#### Day 7: 리스트 모드 구현 ⏳ Phase 4로 연기
- [ ] QuestionListScreen (모드 4) - 선택 사항
- [ ] IndividualCardScreen (모드 4) - 선택 사항
- [x] 화면 간 네비게이션 연결 - **완료**

### **Phase 3: 인터랙션 & 제스처 (Day 8-10)** ✅ 완료 - 2024.09.06

#### Day 8: 기본 인터랙션 ✅ 완료
- [x] 버튼 네비게이션 구현
- [x] 선택 상태 시각적 피드백
- [x] 유효성 검사 알럿 구현

#### Day 9: 고급 인터랙션 ✅ 완료
- [x] 스와이프 제스처 구현 (연속 카드용)
- [x] 카드 전환 애니메이션
- [x] 진행 상황 표시

#### Day 10: UX 개선 ✅ 완료
- [x] 로딩 상태 처리
- [x] 에러 상태 처리
- [x] 접근성 개선

#### 🎯 주요 이슈 해결 (2024.09.06)
- [x] **질문 네비게이션 이슈**: Context 상태 동기화 문제 해결
- [x] **텍스트 렌더링 이슈**: Flexbox `flex-1` → `flex` 변경으로 해결
- [x] **완전한 사용자 플로우 검증**: Category → Difficulty → Main → Card 완료

### **Phase 4: 폴리싱 & 최적화 (Day 11-14)**

#### Day 11-12: 성능 최적화
- [ ] 메모이제이션 적용
- [ ] 불필요한 리렌더링 방지
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화

#### Day 13: 테스트 작성
- [ ] 핵심 로직 단위 테스트
- [ ] 컴포넌트 테스트
- [ ] E2E 테스트 (주요 플로우)

#### Day 14: 최종 품질 보증
- [ ] 다양한 디바이스 테스트
- [ ] 성능 프로파일링
- [ ] 접근성 검증
- [ ] 최종 버그 픽스

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