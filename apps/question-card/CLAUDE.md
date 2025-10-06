# CLAUDE.md

EasyTalking (이지토킹) - 디지털 질문 카드 앱: React Native + Expo로 구축된 자기성찰 및 대화용 앱

## 🚀 **Project Status: Phase 3.5 완료 (2024.09.21)**
- ✅ **6개 화면 완전 구현**: 모든 필수 사용자 플로우 완성
- ✅ **4가지 모드 완전 동작**: 모드 1,2,3 (연속 카드) + 모드 4 (리스트 → 개별 카드)
- ✅ **Modern Refined Orange v2.0**: 현대적 디자인 시스템 완전 적용
- ✅ **플로팅 UI + OrangeHeader**: 헤더 제거 및 일관된 플로팅 UI 시스템

## ⚡ **핵심 명령어**
```bash
npm start              # Expo 개발 서버 시작
npm run lint           # Biome 린트 (커밋 전 필수)
npm run type-check     # TypeScript 타입 체크

# EAS Build (Android APK 배포)
eas login              # EAS CLI 로그인
eas build:configure    # EAS 초기 설정
eas build -p android --profile preview  # Android APK 빌드
eas build:download -p android           # APK 다운로드
```

## 🏗️ **기술 스택**
- **Framework**: React Native + Expo SDK 52
- **Styling**: NativeWind (주요) > Gluestack-ui v2 (적합시) > StyleSheet (제거됨)
- **Navigation**: Expo Router (file-based routing)
- **Design**: Modern Refined Orange v2.0 (Gray 기본 + Orange 포인트)
- **State**: Context API
- **Quality**: Biome lint, TypeScript strict

## 📁 **프로젝트 구조**
```
src/
├── app/                    # Expo Router (라우팅만)
├── components/
│   ├── screens/           # 6개 화면 컴포넌트
│   └── ui/                # 재사용 UI (OrangeHeader, FloatingBackButton 등)
├── context/AppContext.tsx # 전역 상태 관리
├── types/                 # TypeScript 인터페이스
├── constants/designSystem.ts # 디자인 토큰
└── utils/questionModes.ts # 4가지 모드 알고리즘

data/questions.json        # 120개 질문 데이터
```

## 📊 **데이터 구조 (120개 질문)**
**6개 카테고리**: 취향📝, 재능🎯, 가치관⚖️, 경험🌟, 일상🏠, 방향성🧭
**3개 난이도**: 쉬움(8개), 보통(8개), 어려움(4개) per category
**4가지 모드**: 전체랜덤, 카테고리별랜덤, 정렬순서, 개별선택

## 🎯 **앱 플로우 (완료)**
```
Category Selection → Difficulty Selection → Question Main →
├── 모드 1,2,3 → Continuous Card (스와이프)
└── 모드 4 → Question List → Individual Card (버튼)
```

**6개 화면**: Category/Difficulty Selection, Question Main, Continuous Card, Question List, Individual Card
**핵심 UI**: OrangeHeader + FloatingBackButton 통일, 스와이프 제스처, 진행률 표시

## 🎨 **디자인 시스템**
**Modern Refined Orange v2.0**: Gray 기본 + Orange 포인트
```typescript
// 카테고리 색상: hobby(#FF6B6B), talent(#4ECDC4), values(#45B7D1)
// 난이도 색상: easy(#2ECC71), medium(#F39C12), hard(#E74C3C)
// UI 컴포넌트: OrangeHeader, FloatingBackButton, FloatingActionButton
```



## 🏛️ **컴포넌트 아키텍처**
```typescript
// Expo Router 패턴: app/ (라우팅만) → components/screens/ (UI 로직)
export { default } from "../components/screens/ExampleScreen";

// 상태 관리: Context API
interface AppState {
  selectedCategories: string[];
  selectedDifficulties: string[];
  currentMode: 1 | 2 | 3 | 4;
  filteredQuestions: Question[];
  currentIndex: number;
}
```

## ✅ **코드 품질 규칙 (Biome)**
```bash
npm run lint        # 커밋 전 필수
npm run type-check  # TypeScript 검증
```

**핵심 규칙**:
- ❌ `any` 타입 금지 → `unknown` 또는 구체적 인터페이스 사용
- ❌ Non-null assertion(`!`) 금지 → 안전한 null 체크
- ✅ NativeWind 우선 → Flexbox 패턴: `flex` (콘텐츠), `flex-1` (공간 채우기)
- ✅ Context API 일관성 → 로컬 state와 혼재 금지

## 📦 **EAS Build 배포**
**Android APK 빌드 및 배포**: `docs/eas-build-deployment-guide.md`

**빠른 시작**:
1. EAS 로그인: `eas login`
2. EAS 설정: `eas build:configure`
3. APK 빌드: `eas build -p android --profile preview`
4. APK 다운로드 및 설치

**상세 가이드**: Expo 공식 문서 기준 단계별 배포 프로세스 문서화

## 📚 **참고 문서**
- `docs/eas-build-deployment-guide.md` - EAS Build Android 배포 가이드 (Expo 공식 문서 기준)
- `docs/coding-standards.md` - 코드 품질 가이드라인
- `docs/design-system-modern-refined.md` - Modern Refined Orange v2.0 디자인 가이드
- `docs/component-architecture.md` - 컴포넌트 구조 가이드
- `docs/pr-workflow-guide.md` - PR 작성 및 리뷰 프로세스