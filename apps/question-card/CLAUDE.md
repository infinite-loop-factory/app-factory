# CLAUDE.md

EasyTalking (이지토킹) - 디지털 질문 카드 앱: React Native + Expo로 구축된 자기성찰 및 대화용 앱

## 🚀 **Project Status: Phase 4 완료 (2025.01.26)**
- ✅ **6개 화면 완전 구현**: 모든 필수 사용자 플로우 완성
- ✅ **4가지 모드 완전 동작**: 모드 1,2,3 (연속 카드) + 모드 4 (리스트 → 개별 카드)
- ✅ **Modern Refined Orange v2.0**: 현대적 디자인 시스템 완전 적용
- ✅ **플로팅 UI + OrangeHeader**: 헤더 제거 및 일관된 플로팅 UI 시스템
- ✅ **IBM Plex Sans KR 폰트**: 4가지 굵기 (400, 500, 600, 700) 완전 적용
- ✅ **통일된 화면 설정**: 모든 화면 headerShown: false로 일관성 유지
- ✅ **Google AdMob 통합**: Phase 4 완료 - 5개 화면 광고 배치 (Footer + Inline)

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
- **Typography**: IBM Plex Sans KR (400, 500, 600, 700)
- **Design**: Modern Refined Orange v2.0 (Gray 기본 + Orange 포인트)
- **State**: Context API
- **Monetization**: Google AdMob (react-native-google-mobile-ads v15.8.3)
- **Quality**: Biome lint, TypeScript strict

## 📁 **프로젝트 구조**
```
src/
├── app/                    # Expo Router (라우팅만)
├── components/
│   ├── screens/           # 6개 화면 컴포넌트
│   ├── ads/               # AdMob 광고 컴포넌트
│   └── ui/                # 재사용 UI (OrangeHeader, FloatingBackButton 등)
├── context/AppContext.tsx # 전역 상태 관리
├── types/                 # TypeScript 인터페이스
├── constants/
│   ├── designSystem.ts    # 디자인 토큰
│   └── admob.ts           # AdMob 설정 (환경변수 기반)
└── utils/questionModes.ts # 4가지 모드 알고리즘

data/questions.json        # 120개 질문 데이터
.env.development           # 개발 환경 (TestIds)
.env.production            # 프로덕션 환경 (실제 AdMob IDs)
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

---

## 📱 **AdMob 광고 (Phase 4 완료)**

**현재 상태**: Phase 4 완료 - 5개 화면 배치 (71% 노출률)
**예상 수익**: ~$104/월 (1,000 DAU 기준, +131% vs Phase 1)

**환경변수 기반 관리**:
- `.env.development` - 테스트 광고 (TestIds)
- `.env.production` - 실제 광고 (커밋 금지)

**상세 문서**: `docs/ADMOB_GUIDE.md`, `docs/ADMOB_PLACEMENT.md`, `docs/ADMOB_STATUS.md`

---

## 📚 **참고 문서**

### 프로젝트 관리
- `docs/PROJECT_STATUS.md` - 프로젝트 현황 종합 보고서 (완료 기능, 파일 구조, 최근 커밋, 남은 작업)
- `docs/requirements.md` - 프로젝트 요구사항 및 완료 현황 (체크리스트)

### 개발 가이드
- `docs/coding-standards.md` - 코드 품질 가이드라인 (Biome lint 트러블슈팅 포함)
- `docs/design-system-modern-refined.md` - Modern Refined Orange v2.0 디자인 가이드
- `docs/component-architecture.md` - 컴포넌트 구조 가이드
- `docs/troubleshooting.md` - 프로젝트 트러블슈팅 가이드

### 배포 & 광고
- `docs/eas-build-deployment-guide.md` - EAS Build Android 배포 가이드 (Expo 공식 문서 기준)
- `docs/ADMOB_GUIDE.md` - AdMob 통합 가이드 (설치, 설정, 구현, 트러블슈팅)
- `docs/ADMOB_PLACEMENT.md` - AdMob 배치 전략 (배너 크기, 화면별 배치, 수익 최적화)
- `docs/ADMOB_STATUS.md` - AdMob 구현 현황 (Phase별 진행 상태, 완료된 작업)

### 워크플로우
- `docs/pr-workflow-guide.md` - PR 작성 및 리뷰 프로세스

---

## 🎯 **남은 작업 (TODO)**

### 1️⃣ AdMob 후속 작업

**1.1 실기기 테스트** (즉시):
```bash
eas build -p android --profile preview
eas build:download -p android
```
- [ ] 5개 화면 광고 표시 확인
- [ ] 인라인 광고 동작 확인
- [ ] 네트워크 환경 테스트

**1.2 UX 모니터링** (14일):
- [ ] Day 1/7 리텐션 측정 (목표: ≥60%/≥30%)
- [ ] 평균 세션 길이 (목표: ≥3분)
- [ ] 광고 영향도 평가

**1.3 프로덕션 배포 준비**:
- [ ] AdMob 계정 생성 및 실제 ID 발급
- [ ] `.env.production` 실제 IDs 입력
- [ ] 프로덕션 빌드 및 Play Store 제출

**상세**: `docs/ADMOB_STATUS.md`

---

### 2️⃣ 테스트 및 품질 보증

**기능 테스트** (`docs/requirements.md` 기준):
- [ ] 모든 선택 조합 필터링 검증
- [ ] 랜덤 모드 중복 없는 진행 확인
- [ ] 네비게이션 경로 동작 확인
- [ ] 에러 상황 처리 검증

**UI 테스트**:
- [ ] 다양한 화면 크기 대응 확인
- [ ] 터치 인터랙션 정확성
- [ ] 애니메이션 부드러움 (60fps)
- [ ] 스와이프 제스처 반응성

**성능 테스트**:
- [ ] 앱 시작 시간 측정 (목표: <3초)
- [ ] 화면 전환 지연 측정 (목표: <1초)
- [ ] 메모리 사용량 최적화 확인

---

### 3️⃣ 코드 및 문서 정리

**코드 정리** (선택):
- [ ] `_layout.tsx` 주석 처리된 화면 활성화 또는 삭제
- [ ] Unused assets 정리

**문서 업데이트**:
- [ ] `requirements.md` 완료 항목 체크 반영
- [ ] `PROJECT_STATUS.md` 최신화 (날짜, AdMob, 커밋 히스토리)

---

### 4️⃣ Play Store 배포 준비

**계정 및 설정**:
- [ ] Google Play Console 계정 설정
- [ ] 앱 서명 키 생성
- [ ] 스토어 메타데이터 준비

**필수 준비물**:
- [ ] 앱 아이콘 (512x512)
- [ ] 스크린샷 (최소 2개)
- [ ] 앱 설명 및 소개
- [ ] 개인정보 처리방침 URL
ß
**참고**: `docs/eas-build-deployment-guide.md`
