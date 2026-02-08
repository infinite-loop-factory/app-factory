# 기술 아키텍처 (Architecture)

이 문서는 Dist Interactive Metro 앱의 기술 스택, 아키텍처 패턴, 그리고 코드 구조를 정의합니다.

## 🛠 기술 스택

### Core
- **Framework**: Expo SDK ~54
- **Runtime**: React Native 0.81.5
- **Language**: TypeScript 5.9+
- **Package Manager**: pnpm 10.12.1

### Routing & Navigation
- **Router**: Expo Router 6.0.21
- **Navigation**: React Navigation 7.1.14

### Styling
- **CSS Framework**: NativeWind 4.2.1 (Tailwind CSS)
- **UI Components**: Gluestack UI 3.0.12
- **Icons**: Lucide React Native

### State Management
- **기본**: Context API (프로젝트 공유 패턴 활용)
- **필요 시**: 프로젝트 내 다른 앱에서 사용하는 패턴 참고

### Data Management
- **API**: 공공포탈 API 연동
- **캐싱**: AsyncStorage 또는 SQLite (프로젝트 패턴 참고)
- **오프라인**: 캐시된 데이터 활용

### Internationalization
- **i18n**: i18n-js 4.5.1
- **Languages**: 한국어, 영어

### Development Tools
- **Linter/Formatter**: Biome 2.3.10
- **Testing**: Jest 29.7.0, React Native Testing Library
- **Type Checking**: TypeScript

### Shared Packages
- **@infinite-loop-factory/common**: 공유 유틸리티 (`cn` 함수 등)

### Location Services
- **GPS**: expo-location (현재 위치 기반 경로 최적화)
- **권한 관리**: 위치 권한 요청 및 처리

---

## 🎯 개발 기준: 모바일 우선 (Mobile-first)

이 프로젝트는 **TypeScript 기반으로 Android / iOS / Web**을 한 번에 만드는 크로스플랫폼 앱입니다. 구현 시 **어느 플랫폼을 기준으로 할지**는 아래와 같이 정합니다.

### 웹 vs 모바일, 누구를 기준으로 할까?

- **웹**은 흔히 **단일 씬(single scene)** 으로, 스크롤·탭·모달 등으로 **유동적으로** 콘텐츠를 전환합니다. URL은 바뀌어도 “화면 전환”보다는 “같은 페이지 안에서 영역 전환”에 가깝게 설계할 수 있습니다.
- **모바일(Android/iOS)** 은 **여러 씬(화면)** 을 **시나리오**로 나누고, Stack·Tab·Modal 등으로 **화면 단위** 이동을 하는 구조가 일반적입니다.

이 프로젝트는 **Expo + React Native + Expo Router** 를 쓰므로, 라우팅과 UI 모델이 **처음부터 스크린(화면) 단위**입니다. 따라서:

- **개발 기준은 모바일(Android/iOS)로 두는 것이 맞습니다.**
- 화면(씬) 단위로 설계하고, Stack/Tabs 기반 네비게이션으로 시나리오를 구성합니다.
- **웹**은 같은 스크린·네비게이션 구조를 **그대로** 사용하고, `react-native-web`으로 렌더링하며, 필요 시 반응형(폭·터치 영역 등)만 보정합니다.

즉, “웹을 기준으로 한 단일 씬 유동 UI”가 아니라 **“모바일을 기준으로 한 멀티 스크린 시나리오”** 로 구현하고, 웹은 그 결과물을 동일하게 보여주는 형태가 자연스럽습니다.  
웹 전용으로 단일 페이지/유동 레이아웃을 강하게 만들고 싶다면, 별도 웹 전용 라우트나 컴포넌트 분기를 두는 방식으로만 확장하는 것을 권장합니다.

### 모바일 플로우 원칙

- **첫 화면(홈) 제외**, 모든 씬에는 **뒤로가기 버튼**을 둡니다. (`ScreenHeader` 사용)
- 씬 단위로 Stack 네비게이션을 사용하며, 불필요한 전환 애니메이션/효과는 두지 않습니다.
- 플로우: 홈 → 출발/도착/경유 선택(각각 별도 씬, 뒤로가기로 복귀) → 경로 찾기 → 경로 결과(뒤로가기로 홈 복귀).

---

## 📁 프로젝트 구조

```
src/
├── app/                    # Expo Router (파일 기반 라우팅)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # 홈 화면
│   ├── station-selection.tsx  # 역 선택 화면
│   ├── route-result.tsx    # 경로 결과 화면
│   └── route-detail.tsx    # 경로 상세 화면
│
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── station/           # 역 관련 컴포넌트
│   │   ├── StationCard.tsx
│   │   ├── StationList.tsx
│   │   └── StationSearch.tsx
│   ├── route/             # 경로 관련 컴포넌트
│   │   ├── RouteSummary.tsx
│   │   ├── RouteDetail.tsx
│   │   └── RouteMap.tsx
│   └── layout/            # 레이아웃 컴포넌트
│
├── features/              # 기능별 모듈 (선택사항)
│   ├── station-selection/
│   └── route-search/
│
├── hooks/                 # 커스텀 React 훅
│   ├── useStation.ts
│   ├── useRouteSearch.ts
│   ├── useSubwayData.ts
│   └── useLocation.ts      # GPS 위치 훅
│
├── services/              # 비즈니스 로직
│   ├── route-calculator.ts  # 경로 탐색 알고리즘
│   ├── distance-calculator.ts
│   ├── subway-api-client.ts # 공공포탈 API 클라이언트
│   ├── subway-data-loader.ts # 데이터 로딩 및 캐싱
│   ├── location-service.ts  # GPS 위치 서비스
│   └── subway-cache.ts       # 로컬 캐시 관리
│
├── utils/                 # 유틸리티 함수
│   ├── graph.ts           # 그래프 구조 및 알고리즘
│   ├── distance.ts        # 거리 계산 유틸
│   └── format.ts          # 포맷팅 함수
│
├── types/                 # TypeScript 타입 정의
│   ├── station.ts
│   ├── line.ts
│   ├── route.ts
│   └── subway.ts
│
├── constants/             # 상수 정의
│   ├── routes.ts          # 라우트 경로
│   └── subway.ts          # 지하철 관련 상수
│
├── cache/                  # 로컬 캐시 (런타임 생성)
│   └── (AsyncStorage 또는 SQLite로 관리)
│
├── i18n/                  # 국제화
│   ├── index.ts
│   └── locales/
│       ├── ko.json
│       └── en.json
│
└── assets/                # 정적 자산
    ├── images/
    └── fonts/
```

---

## 🏗️ 아키텍처 패턴

### 1. 계층 구조 (Layered Architecture)

```
┌─────────────────────────────────────┐
│   Presentation Layer (UI)           │
│   - Components, Screens            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Business Logic Layer              │
│   - Services, Hooks                 │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Data Layer                        │
│   - Data Loaders, Graph Structure   │
└─────────────────────────────────────┘
```

### 2. 컴포넌트 구조

#### Screen Components
- `app/` 디렉토리의 라우트 파일들은 최소한의 로직만 포함
- 실제 UI 로직은 `components/screens/` 또는 직접 구현

#### Reusable Components
- `components/ui/`: 기본 UI 컴포넌트
- `components/station/`: 역 관련 컴포넌트
- `components/route/`: 경로 관련 컴포넌트

### 3. 상태 관리 전략

#### 전역 상태
- 선택된 출발역/도착역
- 최근 검색 경로
- (상태 관리 라이브러리 선택 후 결정)

#### 로컬 상태
- 화면별 UI 상태 (검색어, 필터 등)
- `useState` 사용

---

## 🔍 핵심 알고리즘

### 1. 경로 탐색 알고리즘

#### 그래프 구조
```typescript
// 그래프 노드: 역 (Station)
// 그래프 엣지: 역 간 연결 (거리 가중치)
// 다중 그래프: 환승을 별도 엣지로 표현
```

#### 알고리즘 선택
- **다익스트라 알고리즘**: 최단 거리 경로
- **BFS**: 최소 환승 경로
- **A\* 알고리즘**: (향후 최적화 고려)

#### 구현 위치
- `services/route-calculator.ts`
- `utils/graph.ts`

### 2. 거리 계산

#### 계산 방식
1. 인접 역 간 거리 누적
2. 환승 거리 추가
3. 총 거리 반환

#### 구현 위치
- `services/distance-calculator.ts`
- `utils/distance.ts`

---

## 📦 주요 모듈

### 1. 역 선택 모듈
```
components/station/
  - StationCard.tsx        # 역 카드 UI
  - StationList.tsx       # 역 목록
  - StationSearch.tsx      # 역 검색
hooks/
  - useStation.ts          # 역 선택 로직
services/
  - station-filter.ts      # 역 필터링
```

### 2. 경로 탐색 모듈
```
components/route/
  - RouteSummary.tsx       # 경로 요약
  - RouteDetail.tsx        # 경로 상세
  - RouteMap.tsx           # 경로 시각화
hooks/
  - useRouteSearch.ts      # 경로 탐색 로직
services/
  - route-calculator.ts    # 경로 계산 알고리즘
```

### 3. 데이터 관리 모듈
```
services/
  - subway-data-loader.ts  # 데이터 로딩
hooks/
  - useSubwayData.ts       # 데이터 훅
types/
  - subway.ts              # 타입 정의
```

---

## 🔄 데이터 흐름

### 경로 탐색 플로우
```
1. 사용자 입력 (출발역, 도착역) 또는 GPS 기반 자동 선택
   ↓
2. 데이터 로딩 (API 또는 캐시)
   ↓
3. 현재 위치 기반 최적화 (GPS 사용 시)
   ↓
4. 그래프 구조 생성
   ↓
5. 경로 탐색 알고리즘 실행 (다중 경로)
   ↓
6. 위치 기반 경로 최적화
   ↓
7. 결과 포맷팅 (거리, 시간 포함)
   ↓
8. UI 표시 (여러 옵션 제공)
```

### 상태 업데이트 플로우
```
User Action
  ↓
Component Event Handler
  ↓
Hook/Service
  ↓
State Update
  ↓
Component Re-render
```

---

## 🎨 스타일링 전략

### NativeWind 사용
- Tailwind CSS 클래스명으로 스타일링
- `cn()` 함수로 조건부 클래스 병합

### 컴포넌트 스타일
- 기본: NativeWind 클래스
- 복잡한 컴포넌트: Gluestack UI 활용

### 테마
- 다크 모드 지원 (NativeWind)
- 노선별 색상 시스템

---

## 🧪 테스트 전략

### 단위 테스트
- 유틸리티 함수
- 서비스 함수 (경로 계산 등)
- 훅 로직

### 통합 테스트
- 컴포넌트 통합
- 화면 플로우

### E2E 테스트
- (추후 고려)

---

## 📈 성능 최적화

### 1. 데이터 로딩
- API 기반 데이터 로딩
- 로컬 캐시 우선 사용
- 필요한 데이터만 로드
- 오프라인 시 캐시 활용

### 2. 경로 계산
- 알고리즘 최적화
- 메모이제이션
- 웹 워커 고려 (복잡한 계산)

### 3. 렌더링
- React.memo 활용
- 불필요한 리렌더링 방지
- 가상화 (긴 리스트)

---

## 🔐 보안 및 권한 고려사항

### 데이터
- 공공포탈 API 사용 (인증 필요 시 처리)
- 로컬 캐시 데이터 암호화 (민감 정보 시)

### 권한
- **위치 권한**: GPS 기반 기능을 위한 필수 권한
- 권한 거부 시 기본 기능만 제공
- 권한 요청 UX 고려

---

## 📱 플랫폼별 고려사항

### iOS
- Safe Area 처리
- 네이티브 네비게이션 스타일

### Android
- Material Design 가이드라인
- 뒤로가기 버튼 처리

### Web
- 반응형 디자인
- SEO (필요 시)

---

## 📝 구현 가이드

### 기술 스택 선택
- 프로젝트 공유 기술 스택 최대한 활용
- 기존 앱들의 패턴 참고 (reaction-speed-test, cafe 등)

### 데이터 관리
- 공공포탈 API 연동 필수
- AsyncStorage 또는 SQLite 활용 (프로젝트 패턴 참고)
- 오프라인 지원: 캐시된 데이터 활용

### 위치 서비스
- expo-location 패키지 사용
- 권한 요청 및 처리 로직 구현
- 위치 기반 경로 최적화 알고리즘

### 참고 자료
- 지하철종결자 앱의 데이터 구조 및 경로 탐색 방식
- 프로젝트 내 다른 앱들의 패턴 및 컨벤션
