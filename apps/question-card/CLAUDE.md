# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EasyTalking (이지토킹) is a digital question card app built with React Native and Expo. The app helps users with self-reflection and meaningful conversations through 120 carefully curated questions across 6 categories and 3 difficulty levels.

## Development Commands

### Core Development
- `npm start` - Start Expo development server
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm run web` - Start web development server

### Testing & Quality
- `npm test` - Run Jest tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Lint and auto-fix code with Biome

### Build & Deployment
- `npm run clean` - Clean all build artifacts and node_modules
- `npm run web:publish` - Publish web version using tsx

## Architecture Overview

### Technology Stack
- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native) - 주요 스타일링 방법
- **UI Components**: Gluestack-ui v2 - 적합한 컴포넌트가 있을 때 사용
- **Fallback Styling**: React Native StyleSheet - NativeWind 한계가 있을 때만 사용
- **Localization**: i18n-js with Korean/English support
- **Design System**: Modern Refined Orange v2.0 - 현대적이고 세련된 디자인 시스템
- **Testing**: Jest with React Native Testing Library
- **Linting**: Biome for code formatting and linting

### Key Directories Structure
```
src/
├── app/                    # Expo Router (file-based routing only)
│   ├── _layout.tsx        # Root layout with theme provider
│   ├── index.tsx          # Re-export: screens/IndexScreen
│   ├── category-selection.tsx # Re-export: screens/CategorySelectionScreen
│   ├── +html.tsx          # Custom HTML template for web
│   └── +not-found.tsx     # 404 error screen
├── components/            # All UI components
│   ├── screens/           # Screen components (main UI logic)
│   │   ├── IndexScreen.tsx # Splash/loading screen
│   │   └── CategorySelectionScreen.tsx # Category selection
│   ├── ui/                # Reusable UI components (future)
│   │   ├── QuestionCard.tsx
│   │   ├── CheckboxItem.tsx
│   │   └── HeaderBar.tsx
│   ├── navigation/        # Navigation-specific components
│   │   └── TabBarIcon.tsx
│   └── __tests__/         # Component tests and snapshots
├── context/               # Context API state management
│   └── AppContext.tsx     # Global app state and actions
├── types/                 # TypeScript interfaces
│   ├── questions.ts       # Question, Category, Difficulty types
│   ├── app.ts             # App state and navigation types
│   └── index.ts           # Re-exports all types
├── constants/             # Design system and constants
│   └── designSystem.ts    # Design tokens and color system
├── utils/                 # Utility functions
│   ├── questionModes.ts   # 4-mode question algorithms
│   └── validation.ts      # Data validation logic
├── hooks/                 # Custom React hooks
│   └── useQuestions.ts    # Question data loading and filtering
├── i18n/                  # Internationalization setup
│   └── locales/          # Translation files (en.json, ko.json)
├── assets/               # Static assets (fonts, images)
└── global.css            # Global Tailwind CSS styles

data/
└── questions.json        # Static question data with 120 questions

docs/                     # Project documentation
├── requirements.md       # Detailed feature requirements
├── user-flow.md         # App flow and navigation
├── wireframes.md        # UI/UX design specifications
├── design-system.md     # Legacy design system specification
├── design-system-modern-refined.md # 🆕 Modern Refined Orange v2.0 디자인 가이드
├── development-plan.md  # Complete development roadmap
├── coding-standards.md  # Code quality and style guidelines
├── biome-lint-guide.md  # Biome lint troubleshooting guide
├── component-architecture.md # Component structure guide
└── pr-workflow-guide.md # Pull Request creation and workflow guide
```

### Data Structure (`data/questions.json`)
The app uses a static JSON structure containing:

**Categories (6 total)**:
- `hobby` - 나의 취향 (📝, #FF6B6B) - 좋아하는 것들에 대한 질문
- `talent` - 나의 재능 (🎯, #4ECDC4) - 능력과 소질에 대한 질문
- `values` - 나의 가치관 (⚖️, #45B7D1) - 신념과 가치관에 대한 질문
- `experience` - 나의 경험 (🌟, #96CEB4) - 과거 경험에 대한 질문
- `daily` - 나의 일상 (🏠, #FFEAA7) - 일상생활에 대한 질문
- `direction` - 나의 방향성 (🧭, #DDA0DD) - 미래와 목표에 대한 질문

**Difficulty Levels (3 total)**:
- `easy` - 쉬움 (#2ECC71) - 가벼운 대화용 (8개 per category)
- `medium` - 보통 (#F39C12) - 일반적인 대화용 (8개 per category)
- `hard` - 어려움 (#E74C3C) - 깊은 대화용 (4개 per category)

**Questions (120 total)**: Each question has id, categoryId, categoryName, difficulty, content, order

### Key Features to Implement
Based on requirements.md, the app needs:

**1. Selection System**:
- Category multi-selection with checkboxes (minimum 1 required)
- Difficulty multi-selection with checkboxes (minimum 1 required)
- "Select All" toggle buttons for both screens
- Validation alerts when no selections made

**2. Four Question Modes**:
- **Mode 1**: 전체 랜덤 진행 - Complete random from selected conditions
- **Mode 2**: 카테고리별 랜덤 진행 - Category order fixed, questions random within each
- **Mode 3**: 카테고리별 정렬 순서 - Both category and question order preserved
- **Mode 4**: 전체 목록에서 개별 확인 - Browse question list, select individual questions

**3. Screen Architecture (6 screens)**:
- `CategorySelectionScreen` - 6 category checkboxes with validation
- `DifficultySelectionScreen` - 3 difficulty checkboxes with validation  
- `QuestionMainScreen` - Mode selection with condition summary
- `ContinuousCardScreen` - Card display for modes 1,2,3 with swipe/button navigation
- `QuestionListScreen` - List view for mode 4 with question previews
- `IndividualCardScreen` - Single card view from list selection (mode 4)

**4. Card UI System**:
- Question display with category icon, name, difficulty badge
- Category-specific colors and styling
- Navigation: Previous/Next buttons + swipe gestures (modes 1,2,3)
- Progress tracking: "3/15" format
- Return to main options from all screens

**5. State Management Requirements**:
```javascript
AppState {
  selectedCategories: string[],    // Selected category IDs
  selectedDifficulties: string[],  // Selected difficulty levels
  currentMode: number,             // 1,2,3,4 selected mode
  filteredQuestions: Question[],   // Questions matching selections
  currentIndex: number             // Current question position
}
```

### Design System Implementation

**Design Philosophy**: v0/Lovable inspired Clean & Modern design system

**Technology Stack**:
- **UI Framework**: Gluestack-ui v2 (NativeWind-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Design Tokens**: Custom design system with category-specific colors

**Installation Commands**:
```bash
npx gluestack-ui add box text button checkbox hstack vstack
```

**Design Tokens Structure**:
```typescript
// Category Colors (6 categories)
categoryColors: {
  hobby: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626' },
  talent: { 50: '#f0fdfa', 500: '#14b8a6', 600: '#0d9488' },
  values: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb' },
  // ... etc
}

// Difficulty Colors
difficultyColors: {
  easy: '#22c55e',
  medium: '#f59e0b', 
  hard: '#ef4444'
}

// Typography Scale
fontSize: {
  xs: '12px', sm: '14px', base: '16px',
  lg: '18px', xl: '20px', '2xl': '24px'
}

// 8px-based Spacing System
spacing: {
  xs: '4px', sm: '8px', md: '16px',
  lg: '24px', xl: '32px', '2xl': '48px'
}
```

### Design System Specifications (Legacy)

**Color System**:
- Category Colors: hobby(#FF6B6B), talent(#4ECDC4), values(#45B7D1), experience(#96CEB4), daily(#FFEAA7), direction(#DDA0DD)
- Difficulty Colors: easy(#2ECC71), medium(#F39C12), hard(#E74C3C)
- Dark/Light mode support via NativeWind

**Typography Scale**:
- Screen titles: 20px Bold
- Question content: 18px Medium
- Category names: 16px Medium
- Descriptions/subtitles: 14px Regular
- Button text: 16px Medium

**Layout Standards**:
- Screen margins: 20px left/right
- Card internal padding: 24px
- Button height: 48px (minimum touch target)
- Checkbox item spacing: 16px
- Card spacing: 16px

**UI Components Needed**:
- `CheckboxItem`: label, isChecked, onToggle, icon?, color?
- `QuestionCard`: category, question, difficulty, categoryColor, categoryIcon
- `NavigationButton`: direction (prev|next), onPress, disabled?
- `HeaderBar`: title, leftButton?, rightButton?, progress?{current, total}

### Internationalization
- Uses i18n-js with locale detection via expo-localization
- Supports Korean (primary) and English fallback
- Locale files in `src/i18n/locales/`

### Testing Strategy
- Jest with jest-expo preset for React Native compatibility
- Component testing with React Native Testing Library
- Snapshot testing for UI consistency
- Transform ignore patterns configured for Expo and React Native modules

## Development Status & Plan

### Current Implementation Status
**✅ Completed - Phase 1 Foundation**:
- Expo + React Native basic setup
- NativeWind (Tailwind CSS) configuration
- i18n multilingual support (Korean/English)
- 120 question data structure (`data/questions.json`)
- Detailed planning documents (requirements, user-flow, wireframes)
- TypeScript interfaces for all data structures
- Context API global state management system
- Navigation structure (tabs → stack with 6 screens)
- Question data loading and filtering hooks
- 4-mode question algorithms (random, category-based, sorted, list)
- Comprehensive validation and error handling
- Design system tokens and constants
- Biome lint compliance and coding standards

**🎉 Phase 2 UI Components - 완료!** ✅ 2024.09.06

**✅ Core Screens Completed (5/6)** - 모든 핵심 플로우 구현됨:
- ✅ **IndexScreen** (133줄): Splash/loading screen - 완전 구현
- ✅ **CategorySelectionScreen** (301줄): 6개 카테고리 선택, 검증, 전체선택/해제 - 완전 구현
- ✅ **DifficultySelectionScreen** (311줄): 3개 난이도 선택, 검증 - 완전 구현
- ✅ **QuestionMainScreen** (282줄): 모드 선택, 조건 요약, `filterQuestions()` 호출 - 완전 구현
- ✅ **ContinuousCardScreen** (351줄): 스와이프 제스처, 애니메이션, 네비게이션 - 완전 구현 (고품질)

**🎉 Phase 3 완성! (모드4 전용, 6/6)** ✅ 2024.09.06:
- ✅ **QuestionListScreen**: 목록 보기 화면 - **완료**
  - 질문 미리보기 (30자), 카테고리 아이콘, 난이도 배지
  - 스크롤 가능한 리스트, 총 질문 수 표시, 네비게이션 옵션
- ✅ **IndividualCardScreen**: 개별 카드 화면 - **완료**
  - ContinuousCardScreen과 동일한 고품질 디자인
  - 버튼 전용 네비게이션, 진행률 표시, 완료 알럿

**🎯 Phase 3 주요 성과** (2024.09.06):
- ✅ **6개 화면 완전 구현**: 모든 필수 사용자 플로우 완성
- ✅ **4가지 모드 완전 동작**: 모드 1,2,3 (연속 카드) + 모드 4 (리스트 → 개별 카드)
- ✅ **완전한 모드 4 플로우**: Category → Difficulty → Main → List → Individual Card
- ✅ **라우팅 완성**: question-list.tsx, individual-card.tsx 생성
- ✅ **사용자 경험 완성**: 도움말 텍스트, 에러 핸들링, 네비게이션 옵션

**🚀 Phase 4 계획** - 성능 최적화 & 최종 배포 준비:
1. **성능 최적화**: React.memo, useCallback, useMemo 적용
2. **접근성 개선**: 스크린 리더 지원, 키보드 네비게이션
3. **테스트 작성**: 단위 테스트, 컴포넌트 테스트, E2E 테스트
4. **최종 품질 보증**: 다양한 디바이스 테스트, 성능 프로파일링

### Development Roadmap (9-14 days) - **업데이트: 2024.09.06**

**Phase 1: Foundation (Day 1-3)** ✅ **완료**
- TypeScript interfaces definition
- Data loading system (`src/hooks/useQuestions.ts`)
- Context API global state setup
- Navigation structure change (tabs → stack)
- Question filtering and 4-mode algorithms

**Phase 2: UI Components (Day 4-7)** ✅ **완료 - 2024.09.06**
- Design system token setup
- Core components (QuestionCard, CheckboxItem, HeaderBar)
- 5 핵심 screens 완전 구현 (IndexScreen, CategorySelectionScreen, DifficultySelectionScreen, QuestionMainScreen, ContinuousCardScreen)
- Category/difficulty selection screens with validation
- Swipe gestures and high-quality animations

**Phase 3: 미완성 화면 구현 & 품질 개선 (Day 8-10)** ✅ **완료 - 2024.09.06**
- QuestionListScreen 구현 완료 (모드 4 전용)
- IndividualCardScreen 구현 완료 (모드 4 전용) 
- 라우팅 완성 (question-list.tsx, individual-card.tsx)
- 모든 6개 화면 및 4가지 모드 완전 동작
- 완전한 사용자 플로우 및 에러 핸들링

**✅ Phase 3 완성! UI 디자인 개선 - 2024.09.20** 🎉
- ✅ **Modern Refined Orange v2.0 완전 적용**: 모든 6개 화면 현대적 디자인 통일
- ✅ **StyleSheet 완전 제거**: 100% NativeWind로 변환 완료
- ✅ **통일된 디자인 시스템**:
  - 스타일링 방식: NativeWind (주요) > Gluestack-ui (적합한 컴포넌트) > StyleSheet (제거됨)
  - 색상 시스템: Gray 기본 + Orange 포인트 컬러
  - Modern Refined 스타일: 깔끔하고 세련된 UI/UX
  - 모든 화면 일관된 디자인 패턴 적용

**🔄 Phase 3.5: 플로팅 UI 전환 - 2024.09.21** (현재 진행 중)
- ✅ **플로팅 UI 컴포넌트 생성**: FloatingBackButton, ProgressIndicator, FloatingMenuButton, FloatingActionButton
- 🔄 **헤더 제거 작업**: 기존 헤더 완전 제거하고 플로팅 UI로 대체
  - ⚠️ **현재 이슈**: CategorySelectionScreen, DifficultySelectionScreen에서 헤더가 여전히 표시됨
  - **해결 필요**: 상단 하얀 배경 헤더 완전 제거 (SafeAreaView, StatusBar 설정 조정 필요)
- 📋 **작업 계획**: 6개 화면 모두 헤더 제거 + 플로팅 UI 적용
- 📚 **가이드 추가**: `docs/header-removal-guide.md` 생성으로 작업 연속성 확보

**🚀 Phase 4: 성능 최적화 & 최종 배포 준비 (다음 단계)**
1. **성능 최적화**: React.memo, useCallback, useMemo 적용
2. **접근성 개선**: 스크린 리더 지원, 키보드 네비게이션
3. **테스트 작성**: 단위 테스트, 컴포넌트 테스트, E2E 테스트
4. **최종 품질 보증**: 다양한 디바이스 테스트, 성능 프로파일링

### Technical Decisions Made
- **State Management**: Context API (minimal global state)
- **Navigation**: Stack Navigation (remove tabs), Expo 52 compliant
- **Design System**: Gluestack-ui v2 + NativeWind + custom v0/Lovable inspired tokens
- **Additional Packages**: None needed (current setup sufficient)

## User Flow Implementation

### App Flow Sequence
```
App Start → Category Selection → Difficulty Selection → Question Main → 
├── Modes 1,2,3 → Continuous Card Screen
└── Mode 4 → Question List Screen → Individual Card Screen
```

### Navigation Patterns
- **Back Navigation**: All screens reset to initial state (no selection persistence)
- **Main Return**: Available from all card screens
- **Mode Switching**: Return to Question Main to change modes
- **Settings Reset**: "설정 다시하기" returns to category selection

### Key Interactions
- **Swipe Gestures**: Only in continuous card screens (modes 1,2,3)
- **List Navigation**: Individual cards use button-only navigation in list order
- **Validation**: Both selection screens require minimum 1 selection
- **Progress Display**: "current/total" format on all card screens

### Question Filtering Logic
1. Filter questions by selected categories and difficulties
2. Apply mode-specific sorting:
   - Mode 1: Complete randomization
   - Mode 2: Category order preserved, questions randomized within category
   - Mode 3: Preserve both category and question order
   - Mode 4: Present as filterable list
3. Navigate through filtered results with currentIndex

### Screen-Specific Requirements

**CategorySelectionScreen**:
- 6 checkboxes with category icons and colors
- "전체선택" toggle functionality
- Validation: alert if none selected

**DifficultySelectionScreen**:
- 3 checkboxes with difficulty colors
- "전체선택" toggle functionality  
- Validation: alert if none selected

**QuestionMainScreen**:
- Display selection summary: "카테고리: 취향, 재능 (2개)"
- Display difficulty summary: "난이도: 쉬움, 보통 (2개)"
- Show expected question count: "총 16개 질문"
- 4 mode selection buttons with descriptions

**ContinuousCardScreen (Modes 1,2,3)**:
- Swipe left/right + Previous/Next buttons
- Progress display header
- Category-colored card design
- "스와이프로도 넘길 수 있어요" help text

**QuestionListScreen (Mode 4)**:
- Scrollable list with question previews (30 chars)
- Category icon + difficulty badge per item
- Total question count display
- Tap to navigate to IndividualCardScreen

**IndividualCardScreen (Mode 4)**:
- Same card design as continuous mode
- Button-only navigation (no swipes)
- "리스트 순서대로 이동합니다" help text
- Return to list button

## Implementation Guidelines

### Component Architecture (Updated)

**Separation of Concerns**:
- **App Directory**: Expo Router routing logic only (re-exports)
- **Components Directory**: All UI logic, state management, and rendering
- **Clean Separation**: Route files contain no JSX or business logic

**Directory Structure**:
```
src/
├── app/                    # Expo Router (routing only)
│   ├── index.tsx          # Re-export: screens/IndexScreen
│   ├── category-selection.tsx # Re-export: screens/CategorySelectionScreen
│   └── [other-routes.tsx] # Re-export pattern for all routes
├── components/            # All UI components
│   ├── screens/           # Screen components (full UI logic)
│   │   ├── IndexScreen.tsx
│   │   ├── CategorySelectionScreen.tsx
│   │   └── [other screens...]
│   └── ui/                # Reusable UI components
│       ├── QuestionCard.tsx
│       ├── CheckboxItem.tsx
│       └── HeaderBar.tsx
├── types/                 # TypeScript interfaces
├── context/               # Context API state management
├── constants/             # Design system tokens
├── utils/                 # Utility functions
└── hooks/                 # Custom React hooks
```

**Re-export Pattern**:
```typescript
// src/app/example.tsx (Route files)
export { default } from "../components/screens/ExampleScreen";

// src/components/screens/ExampleScreen.tsx (Actual components)
export default function ExampleScreen() {
  return <View>...</View>;
}
```

### State Management Architecture
```typescript
interface AppState {
  selectedCategories: string[];    // Selected category IDs
  selectedDifficulties: string[];  // Selected difficulty levels
  currentMode: 1 | 2 | 3 | 4;     // Selected question mode
  filteredQuestions: Question[];   // Questions matching selections
  currentIndex: number;            // Current question position
  isLoading: boolean;
  error: string | null;
}
```

### Component Implementation Pattern
```jsx
// Example: QuestionCard with design system
import { Box, Text, HStack } from '@/components/ui/...';  

const QuestionCard = ({ question, category, difficulty }) => {
  const categoryColor = colors.categories[category.id];
  
  return (
    <Box className="bg-white rounded-xl shadow-lg border border-neutral-100 p-6 mx-4">
      <HStack className="justify-between items-center mb-4">
        {/* Category badge */}
        <Text style={{ color: categoryColor[600] }}>{category.name}</Text>
        {/* Difficulty badge */}
        <Box style={{ backgroundColor: difficultyColor + '20' }}>
          <Text style={{ color: difficultyColor }}>{difficulty}</Text>
        </Box>
      </HStack>
      <Text className="text-lg leading-relaxed">{question.content}</Text>
    </Box>
  );
};
```

### Development Priority
1. Data loading and filtering system
2. Basic screen navigation structure
3. Selection screens with validation
4. Question card component
5. Mode-specific question ordering
6. Swipe gestures and animations

### State Architecture
- Use React Context for global app state
- Implement question filtering hooks
- Manage navigation state separately from question state
- Consider React Query for data fetching (even for static JSON)

### Component Patterns
- Reusable CheckboxList component for both selection screens
- QuestionCard component shared between continuous and individual modes
- HeaderBar component with consistent navigation patterns
- Modal/Alert component for validation messages

### Testing Strategy
- Test all selection combinations filter correctly
- Verify random modes produce non-duplicate sequences
- Test navigation flows between all screens
- Validate touch interactions and swipe gestures
- Test Korean text rendering and layout

### File Organization
- Question data utilities in `src/hooks/useQuestions.ts`
- Navigation logic in `src/hooks/useNavigation.ts`
- Selection state in `src/hooks/useSelection.ts`
- Screen components in `src/app/` following Expo Router structure
- Shared UI components in `src/components/ui/`
- Type definitions in `src/types/questions.ts`

### Next Steps to Start Development

**Immediate Tasks (Day 1)**:
1. Install Gluestack-ui components: `npx gluestack-ui add box text button checkbox hstack vstack`
2. Define TypeScript interfaces in `src/types/questions.ts`
3. Set up design system tokens in `src/constants/designSystem.ts`
4. Create data loading hook in `src/hooks/useQuestions.ts`

**Week 1 Goals**:
- Complete foundation infrastructure (Phase 1)
- Implement first 2-3 screens
- Establish design system workflow

**Success Metrics**:
- All 6 screens functional
- 4 question modes working correctly
- 120 questions display without errors
- Mobile performance < 3 seconds app start
- Accessibility score > 90%

### Quality Standards
- TypeScript strict mode with complete interface definitions
- Component props interfaces for all reusable components
- Korean screen reader accessibility support
- Performance optimization with memoization
- Comprehensive error handling and user feedback
- 44px minimum touch targets for mobile usability
- Offline functionality (static JSON data)

## Code Quality & Standards

### Biome Lint Compliance
This project uses Biome for code formatting and linting. All code must pass `npm run lint` without errors.

**Critical Rules to Follow**:
- ❌ **Never use `any` type** - Use `unknown` or specific interfaces
- ❌ **Never use non-null assertion (`!`)** - Use proper null checking
- ❌ **Avoid excessive complexity** - Keep functions under 15 cognitive complexity
- ❌ **Don't create async functions without await** - Remove async or add await
- ✅ **Sort imports/exports** - Follow alphabetical order pattern
- ✅ **Use proper TypeScript types** - Explicit typing for all functions and variables

### Pre-commit Checklist
Before any commit, ensure:
```bash
npm run lint        # Must pass without errors
npm run type-check  # Must pass without TypeScript errors  
```

### Common Patterns to Follow

**Safe null handling**:
```typescript
// ❌ Dangerous
const item = map.get(key)!;

// ✅ Safe
const item = map.get(key);
if (item) {
  // use item
}
```

**Proper error types**:
```typescript
// ❌ Too broad
catch (error: any) { }

// ✅ Proper handling
catch (err) {
  const error = err instanceof Error ? err : new Error('Unknown error');
}
```

**Function complexity management**:
```typescript
// ❌ Too complex (>15 complexity)
function validateEverything(data: unknown) {
  if (!data) return false;
  if (typeof data !== 'object') return false;
  // ... many nested conditions
}

// ✅ Split into smaller functions
function validateStructure(data: unknown): boolean { ... }
function validateFields(data: Record<string, unknown>): boolean { ... }
function validateEverything(data: unknown): boolean {
  return validateStructure(data) && validateFields(data as Record<string, unknown>);
}
```

### NativeWind + Flexbox Best Practices

**React Native Flexbox Layout Rules** - 2024.09.06 업데이트:

**❌ 피해야 할 패턴 - 텍스트 콘텐츠 영역**:
```tsx
// flex-1 사용시 텍스트 렌더링 문제 발생 가능
<Box className="flex-1">
  <Text>질문 내용</Text>  // 표시되지 않을 수 있음
</Box>
```

**✅ 권장 패턴 - 텍스트 콘텐츠 영역**:
```tsx
// flex 사용으로 콘텐츠 기반 크기 계산
<Box className="flex">
  <Text>질문 내용</Text>  // 정상 표시됨
</Box>
```

**Flex 속성 차이점**:
- `flex-1` = `flex: 1 1 0%` (flex-basis: 0% - 초기 크기를 0으로 설정)
- `flex` = `flex: 1 1 auto` (flex-basis: auto - 콘텐츠 크기 기준)

**사용 가이드라인**:
- **텍스트/콘텐츠 영역**: `flex`, `flex items-center justify-center` 사용
- **빈 공간 채우기**: `flex-1` 사용 (spacer 역할)
- **고정 크기 필요시**: 명시적 width/height 지정

### Context API State Management Patterns

**❌ 피해야 할 패턴**:
```tsx
// 로컬 state와 Context state 혼재
const [localIndex, setLocalIndex] = useState(0);
const { progress } = useAppState();
// 동기화 문제 발생 가능
```

**✅ 권장 패턴**:
```tsx
// Context state 일관성 있게 사용  
const { progress } = useAppState();
const { goToNextQuestion, goToPreviousQuestion } = useAppActions();
const currentIndex = progress.currentIndex;  // 단일 진실 공급원
const currentQuestion = progress.currentQuestion;
```

**Reference Documentation**:
- `docs/coding-standards.md` - Comprehensive code quality and TypeScript guidelines
- `docs/biome-lint-guide.md` - Practical lint error troubleshooting and solutions
- `docs/design-system.md` - Legacy design system specifications (Vibrant Orange v1.0)
- `docs/design-system-modern-refined.md` - **🆕 Modern Refined Orange v2.0 디자인 가이드** - 현대적이고 세련된 UI 스타일
- `docs/header-removal-guide.md` - **🆕 헤더 제거 및 플로팅 UI 구현 가이드** - 현재 작업 진행 상황 및 해결 방법
- `docs/development-plan.md` - Complete development roadmap and implementation strategy
- `docs/component-architecture.md` - Component structure and organization guide
- `docs/troubleshooting.md` - 주요 이슈 해결 방법 및 예방 가이드

**Quick lint fix command**: `npm run lint` (must pass before any commit)

## Component Architecture Updates

### Recent Changes (Phase 1 Complete)
**✅ Completed - Component Restructuring**:
- Removed unnecessary `(tabs)` directory structure
- Moved all screen components to `src/components/screens/`
- Updated app router files to use clean re-export pattern
- Maintained proper TypeScript interfaces and import paths
- All changes pass Biome lint compliance

**Architecture Benefits**:
- **Clear Separation**: Routes handle navigation only, components handle UI logic
- **Reusability**: Screen components can be imported anywhere for testing
- **Scalability**: Easy to add new screens with consistent patterns  
- **Maintainability**: Component logic separated from routing concerns

**Current Structure**:
```
src/app/                     # Routing only (1-line re-exports)
src/components/screens/      # Full screen components with logic
src/components/ui/           # Future reusable UI components
```

For detailed component architecture guidelines, see `docs/component-architecture.md`.

## Pull Request Workflow

### PR 생성 가이드
이 프로젝트는 체계적인 PR 작성 및 리뷰 프로세스를 따릅니다.

**참고 문서**: `docs/pr-workflow-guide.md`에서 상세한 가이드 확인

### PR 제목 패턴
```
{type}(question-card): {description} - {details}
```

**예시**:
- `feat(question-card): Phase 1 Foundation - 핵심 아키텍처 및 기초 화면 구현`
- `refactor(question-card): 🔧 컴포넌트 구조 개선 및 import 경로 최적화`
- `fix(question-card): 🐛 navigation 타입 오류 수정`

### PR 생성 명령어
```bash
# GitHub CLI 사용 (권장)
gh pr create --title "제목" --body "$(cat <<'EOF'
## 설명 (Description)
작업 내용 요약

## 주요 작업 내용
- 📋 **카테고리**: 구체적 작업
- 🏗️ **카테고리**: 구체적 작업

## 변경 사항 (Changes)
변경 내용 상세 설명

## 체크리스트 (Checklist)
- [x] TypeScript 컴파일 오류 없음
- [x] Biome lint 통과
- [x] 기존 기능 정상 작동 확인
- [ ] 관련 문서 업데이트 완료

## 리뷰 가이드라인 (Review Guidelines)
- **P1**: 반드시 바로 수정해야 할 항목
- **P2**: 수정하면 코드가 더 개선될 수 있는 사항  
- **P3**: 당장 수정하지 않아도 괜찮은 개선 사항
EOF
)" --base main

# PR 수정
gh pr edit {PR번호} --title "새로운 제목"
gh pr edit {PR번호} --body "새로운 본문"
```

### 작업 단위별 PR 전략
- **Single Commit PR**: 1-2시간 작업량 (단일 화면, 버그 수정)
- **Feature Phase PR** (추천): 관련 커밋들을 묶어 완전한 기능 완성
- **Multiple Feature PR**: 긴급 배포시에만 신중히 사용

### 커밋 히스토리 기반 PR 작성
```bash
# 커밋 히스토리 확인
git log --oneline -10

# 전체 커밋을 반영한 PR 본문 작성
# - 모든 커밋의 기여도 명시
# - 시간순으로 작업 진행 과정 설명
# - 누적된 최종 결과물 강조
```

### PR 리뷰 가이드라인
- **P1**: 기능 동작, 보안, 성능 이슈 (필수 수정)
- **P2**: 코드 품질, 가독성 개선 (권장 수정)
- **P3**: 스타일, 네이밍, 문서화 (선택적 수정)

### 자주 사용하는 작업 이모지
- ✨ 새로운 기능, 🔧 설정/리팩토링, 🐛 버그 수정
- 📚 문서화, 🎨 디자인/UI, ⚡ 성능 개선
- 🧹 코드 정리, 🏗️ 아키텍처 변경

**상세 가이드**: `docs/pr-workflow-guide.md` 참조