# Shake-It! 개발 작업 계획서

> PRD 기반 단계별 개발 가이드

---

## 📋 목차

1. [Phase 0: 환경 설정 및 의존성 추가](#phase-0-환경-설정-및-의존성-추가)
2. [Phase 1: 프로젝트 구조 및 타입 정의](#phase-1-프로젝트-구조-및-타입-정의)
3. [Phase 2: 디자인 시스템 구축](#phase-2-디자인-시스템-구축)
4. [Phase 3: 로컬 스토리지 및 설정 관리](#phase-3-로컬-스토리지-및-설정-관리)
5. [Phase 4: 위치 서비스 연동](#phase-4-위치-서비스-연동)
6. [Phase 5: 네이버 지도 API 연동](#phase-5-네이버-지도-api-연동)
7. [Phase 6: 흔들기 센서 구현](#phase-6-흔들기-센서-구현)
8. [Phase 7: 메인 화면 UI 구현](#phase-7-메인-화면-ui-구현)
9. [Phase 8: 설정 화면 구현](#phase-8-설정-화면-구현)
10. [Phase 9: 결과 모달 및 딥링크](#phase-9-결과-모달-및-딥링크)
11. [Phase 10: 통합 및 최종 테스트](#phase-10-통합-및-최종-테스트)

---

## Phase 0: 환경 설정 및 의존성 추가

### Task 0.1: 필수 패키지 설치

- [x] 다음 패키지들을 설치해주세요:

```bash
npx expo install expo-sensors expo-location @react-native-async-storage/async-storage
```

**설치할 패키지 목록:**
| 패키지 | 용도 |
|--------|------|
| `expo-sensors` | 가속도 센서(Accelerometer)를 통한 흔들기 감지 |
| `expo-location` | 사용자 현재 위치 조회 |
| `@react-native-async-storage/async-storage` | 사용자 설정 로컬 저장 |

### Task 0.2: 환경 변수 설정

- [x] 프로젝트 루트에 `.env` 파일을 생성하고 네이버 API 키를 설정해주세요:

```env
EXPO_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
EXPO_PUBLIC_NAVER_CLIENT_SECRET=your_naver_client_secret
```

**주의사항:**

- `.gitignore`에 `.env`가 포함되어 있는지 확인
- 네이버 개발자 센터(https://developers.naver.com)에서 "검색" API 사용 신청 필요

### Task 0.3: app.config.ts 업데이트

- [x] `app.config.ts`에 필요한 권한과 플러그인을 추가해주세요:

**추가할 설정:**

- iOS `NSLocationWhenInUseUsageDescription` 권한 설명
- iOS `NSMotionUsageDescription` 권한 설명 (가속도 센서)
- Android `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` 권한

---

## Phase 1: 프로젝트 구조 및 타입 정의

### Task 1.1: 폴더 구조 생성

- [x] 다음 폴더 구조를 생성해주세요:

```
src/
├── app/                    # (기존) Expo Router
├── components/
│   ├── ui/                 # (기존) gluestack-ui 컴포넌트
│   ├── shake/              # 흔들기 관련 컴포넌트
│   └── result/             # 결과 표시 컴포넌트
├── hooks/
│   ├── use-shake.ts        # 흔들기 감지 훅
│   ├── use-location.ts     # 위치 정보 훅
│   └── use-settings.ts     # 설정 관리 훅
├── services/
│   ├── kakao-api.ts        # 카카오 로컬 API
│   ├── storage.ts          # AsyncStorage 래퍼
│   └── linking.ts          # 딥링크 유틸리티
├── types/
│   └── index.ts            # 타입 정의
└── constants/
    ├── categories.ts       # 음식 카테고리 상수
    └── config.ts           # 앱 설정 상수
```

### Task 1.2: 타입 정의 작성

- [x] `src/types/index.ts` 파일을 생성하고 다음 타입들을 정의해주세요:

```typescript
// 사용자 설정 타입
export interface UserSettings {
  preferred_categories: FoodCategory[];
  min_rating: number;
  shake_sensitivity: number;
}

// 음식 카테고리
export type FoodCategory =
  | "한식"
  | "중식"
  | "일식"
  | "양식"
  | "분식"
  | "카페"
  | "패스트푸드"
  | "기타";

// 네이버 API 응답에서 사용할 식당 정보
export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  mapx: string; // 경도 (Naver KATEC 좌표)
  mapy: string; // 위도 (Naver KATEC 좌표)
  link: string;
  rating?: number;
  distance?: number;
}

// 방문 히스토리 (v2용)
export interface VisitHistory {
  restaurant_id: string;
  restaurant_name: string;
  visit_date: string;
}

// 위치 정보
export interface Location {
  latitude: number;
  longitude: number;
}
```

### Task 1.3: 상수 정의

- [x] `src/constants/categories.ts`:

```typescript
export const FOOD_CATEGORIES = [
  { id: "korean", label: "한식", query: "한식" },
  { id: "chinese", label: "중식", query: "중식" },
  { id: "japanese", label: "일식", query: "일식" },
  { id: "western", label: "양식", query: "양식" },
  { id: "snack", label: "분식", query: "분식" },
  { id: "cafe", label: "카페", query: "카페" },
  { id: "fastfood", label: "패스트푸드", query: "패스트푸드" },
  { id: "etc", label: "기타", query: "맛집" },
] as const;
```

`src/constants/config.ts`:

```typescript
export const APP_CONFIG = {
  // 흔들기 감지 기본 임계값
  DEFAULT_SHAKE_THRESHOLD: 1.5,
  // 흔들기 감지 간격 (ms)
  SHAKE_DETECTION_INTERVAL: 100,
  // 흔들기 쿨다운 (ms) - 연속 감지 방지
  SHAKE_COOLDOWN: 1000,
  // 기본 최소 별점
  DEFAULT_MIN_RATING: 3.5,
  // 검색 반경 (미터)
  SEARCH_RADIUS: 1000,
  // 네이버 API 검색 결과 개수
  SEARCH_DISPLAY_COUNT: 20,
} as const;

export const STORAGE_KEYS = {
  USER_SETTINGS: "@user_settings",
  VISIT_HISTORY: "@visit_history",
} as const;
```

---

## Phase 2: 디자인 시스템 구축

### Task 2.1: 브랜드 컬러 정의

- [ ] `src/constants/colors.ts`를 PRD의 디자인 시스템에 맞게 업데이트해주세요:

```typescript
export const BRAND_COLORS = {
  // Primary - 세련된 블루
  primary: "#3366FF",
  primaryLight: "#5C85FF",
  primaryDark: "#1A4FCC",

  // Background
  background: "#FFFFFF",
  surface: "#F2F4F6",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",

  // Status
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  // Rating star
  star: "#FBBF24",
} as const;
```

### Task 2.2: gluestack-ui 테마 커스터마이징

- [ ] `src/components/ui/gluestack-ui-provider/config.ts`에 브랜드 컬러를 적용해주세요.

### Task 2.3: 공통 UI 컴포넌트 생성

- [ ] 다음 재사용 가능한 컴포넌트들을 생성해주세요:

**`src/components/ui/gradient-button.tsx`**

- 네이버 지도 연결 버튼용 그라데이션 버튼
- Primary 색상 기반 그라데이션 적용

**`src/components/ui/rating-stars.tsx`**

- 별점 표시 컴포넌트
- 0~5점 사이의 별점을 시각적으로 표시

**`src/components/ui/category-chip.tsx`**

- 카테고리 선택용 칩 컴포넌트
- 선택/미선택 상태 스타일 구분

---

## Phase 3: 로컬 스토리지 및 설정 관리

### Task 3.1: Storage 서비스 구현

- [x] `src/services/storage.ts` 파일을 생성해주세요:

**구현 요구사항:**

- AsyncStorage를 래핑하는 유틸리티 함수들
- `getUserSettings()`: 사용자 설정 조회
- `saveUserSettings(settings)`: 사용자 설정 저장
- `getVisitHistory()`: 방문 히스토리 조회 (v2용)
- `addVisitHistory(restaurant)`: 방문 히스토리 추가 (v2용)
- JSON 파싱/직렬화 에러 핸들링 포함

### Task 3.2: useSettings 훅 구현

- [x] `src/hooks/use-settings.ts` 파일을 생성해주세요:

**구현 요구사항:**

```typescript
export function useSettings() {
  // 반환값
  return {
    settings: UserSettings | null, // 현재 설정
    isLoading: boolean, // 로딩 상태
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>,
    resetSettings: () => Promise<void>,
  };
}
```

**동작:**

- 컴포넌트 마운트 시 AsyncStorage에서 설정 로드
- 설정이 없으면 기본값 반환
- 설정 변경 시 자동으로 AsyncStorage에 저장

---

## Phase 4: 위치 서비스 연동

### Task 4.1: 위치 서비스 구현

- [x] `src/hooks/use-location.ts` 파일을 생성해주세요:

**구현 요구사항:**

```typescript
export function useLocation() {
  return {
    location: Location | null, // 현재 위치
    isLoading: boolean, // 로딩 상태
    error: string | null, // 에러 메시지
    requestPermission: () => Promise<boolean>, // 권한 요청
    refreshLocation: () => Promise<void>, // 위치 갱신
  };
}
```

**동작:**

- `expo-location`의 `requestForegroundPermissionsAsync()` 사용
- 권한 거부 시 적절한 에러 메시지 반환
- `getCurrentPositionAsync()`로 현재 위치 조회
- 위치 정확도: `Accuracy.Balanced` (배터리 효율과 정확도 균형)

### Task 4.2: 위치 권한 요청 UI

- [ ] 위치 권한이 없을 때 표시할 안내 컴포넌트를 만들어주세요:

**`src/components/location-permission-prompt.tsx`**

- 위치 권한이 필요한 이유 설명
- "권한 허용하기" 버튼
- 권한 거부 시 설정 앱으로 이동하는 안내

---

## Phase 5: 네이버 지도 API 연동

### Task 5.1: 네이버 검색 API 서비스 구현

- [ ] `src/services/kakao-api.ts` 파일을 생성해주세요:

**구현 요구사항:**

```typescript
export async function searchRestaurants(params: {
  query: string;
  latitude: number;
  longitude: number;
  display?: number;
}): Promise<Restaurant[]>;
```

**API 정보:**

- 엔드포인트: `https://openapi.naver.com/v1/search/local.json`
- 헤더:
  - `X-Naver-Client-Id`: 환경변수에서 가져옴
  - `X-Naver-Client-Secret`: 환경변수에서 가져옴
- 쿼리 파라미터:
  - `query`: 검색어 (예: "강남역 한식")
  - `display`: 검색 결과 개수 (기본 20)
  - `sort`: `random` (랜덤 정렬)

**응답 파싱:**

- HTML 태그 제거 (식당 이름에 `<b>` 태그 포함됨)
- KATEC 좌표를 WGS84로 변환 (딥링크용)

### Task 5.2: 랜덤 선택 로직 구현

- [ ] `src/services/restaurant-picker.ts` 파일을 생성해주세요:

**구현 요구사항:**

```typescript
export function pickRandomRestaurant(
  restaurants: Restaurant[],
  settings: UserSettings,
): Restaurant | null;
```

**동작:**

1. 설정된 카테고리에 맞는 식당만 필터링
2. 최소 별점 이상인 식당만 필터링
3. 필터링된 목록에서 무작위로 1개 선택
4. 결과가 없으면 `null` 반환

---

## Phase 6: 흔들기 센서 구현

### Task 6.1: useShake 훅 구현

- [ ] `src/hooks/use-shake.ts` 파일을 생성해주세요:

**구현 요구사항:**

```typescript
export function useShake(options: {
  threshold?: number;    // 감지 임계값 (기본 1.5)
  onShake: () => void;   // 흔들기 감지 시 콜백
}) {
  return {
    isListening: boolean,   // 센서 리스닝 상태
    startListening: () => void,
    stopListening: () => void,
  };
}
```

**동작:**

- `expo-sensors`의 `Accelerometer` 사용
- 가속도 변화량(delta)이 임계값을 초과하면 흔들기로 판정
- 계산 공식: `Math.sqrt(dx² + dy² + dz²) > threshold`
- 쿨다운 적용하여 연속 트리거 방지 (1초)
- 컴포넌트 언마운트 시 자동으로 리스너 정리

### Task 6.2: 흔들기 애니메이션 컴포넌트

- [ ] `src/components/shake/shake-indicator.tsx` 파일을 생성해주세요:

**구현 요구사항:**

- 대기 상태: 상하로 부드럽게 움직이는 폰 아이콘
- 감지 중 상태: 아이콘이 좌우로 흔들리는 애니메이션
- `react-native-reanimated` 또는 기본 `Animated` API 사용
- lucide-react-native의 `Smartphone` 아이콘 활용

---

## Phase 7: 메인 화면 UI 구현

### Task 7.1: 메인 화면 레이아웃

- [ ] `src/app/(tabs)/index.tsx`를 메인 화면으로 변경해주세요:

**화면 구성:**

```
┌─────────────────────────┐
│                         │
│     [설정 아이콘]        │  ← 우상단 설정 버튼
│                         │
│                         │
│      [흔들기 아이콘]      │  ← 중앙 애니메이션 아이콘
│                         │
│   "오늘의 운명에         │
│    맡겨보시겠어요?"      │  ← 유도 문구
│                         │
│   현재 필터: 한식, 중식   │  ← 설정된 필터 요약
│   별점 3.5 이상          │
│                         │
│                         │
│  ───────────────────── │
│      [광고 배너 영역]     │  ← 하단 광고 영역 (빈 공간)
└─────────────────────────┘
```

**구현 요구사항:**

- 설정 화면으로 이동하는 상단 아이콘 버튼
- 중앙에 `ShakeIndicator` 컴포넌트 배치
- 현재 설정된 필터 정보를 간략히 표시
- 하단에 광고 영역 placeholder (높이 60px)

### Task 7.2: 상태 관리 및 통합

- [ ] 메인 화면에서 다음 상태들을 관리해주세요:

```typescript
type AppState =
  | "loading" // 초기 로딩 (설정, 위치)
  | "no-settings" // 설정 없음 → 설정 화면으로 유도
  | "no-location" // 위치 권한 없음
  | "ready" // 흔들기 대기
  | "searching" // 검색 중
  | "result" // 결과 표시
  | "error"; // 에러 발생
```

---

## Phase 8: 설정 화면 구현

### Task 8.1: 설정 화면 생성

- [ ] `src/app/settings.tsx` (또는 `src/app/(tabs)/settings.tsx`) 파일을 생성해주세요:

**화면 구성:**

```
┌─────────────────────────┐
│  ← 뒤로    설정          │
├─────────────────────────┤
│                         │
│  카테고리 선택           │
│  ┌───┐ ┌───┐ ┌───┐     │
│  │한식│ │중식│ │일식│    │  ← 멀티 선택 칩
│  └───┘ └───┘ └───┘     │
│  ┌───┐ ┌───┐ ┌───┐     │
│  │양식│ │분식│ │카페│    │
│  └───┘ └───┘ └───┘     │
│                         │
├─────────────────────────┤
│                         │
│  최소 별점              │
│  ★★★★☆  4.0점 이상     │  ← 슬라이더
│  ──────●───────        │
│                         │
├─────────────────────────┤
│                         │
│  흔들기 민감도           │
│  약함 ────●──── 강함    │  ← 슬라이더 (선택적)
│                         │
├─────────────────────────┤
│                         │
│    [ 설정 저장하기 ]     │  ← Primary 버튼
│                         │
└─────────────────────────┘
```

### Task 8.2: 설정 화면 로직

- [ ] **구현 요구사항:**

- 카테고리: 최소 1개 이상 선택 필수
- 별점: 0.5 단위로 조절 (0 ~ 5)
- 민감도: 0.5 ~ 3.0 범위 (선택적 기능)
- 저장 버튼 클릭 시 AsyncStorage에 저장 후 메인 화면으로 이동
- 처음 앱 실행 시 이 화면으로 자동 이동

---

## Phase 9: 결과 모달 및 딥링크

### Task 9.1: 결과 모달 컴포넌트

- [ ] `src/components/result/result-modal.tsx` 파일을 생성해주세요:

**모달 구성:**

```
┌─────────────────────────┐
│           ✕            │  ← 닫기 버튼
│                         │
│   🎉 오늘의 점심은       │
│                         │
│   ┌─────────────────┐  │
│   │                 │  │
│   │   김밥천국       │  │  ← 식당 이름
│   │   ★★★★☆ 4.2    │  │  ← 별점
│   │   한식 · 500m   │  │  ← 카테고리, 거리
│   │                 │  │
│   │   서울시 강남구... │  │  ← 주소
│   │                 │  │
│   └─────────────────┘  │
│                         │
│  ┌─────────────────────┐│
│  │  네이버 지도에서 보기  ││  ← 그라데이션 버튼
│  └─────────────────────┘│
│                         │
│     다시 흔들어보기      │  ← 텍스트 버튼
│                         │
└─────────────────────────┘
```

### Task 9.2: 네이버 지도 딥링크 구현

- [ ] `src/services/linking.ts` 파일을 생성해주세요:

**구현 요구사항:**

```typescript
export async function openNaverMap(restaurant: Restaurant): Promise<void>;
```

**딥링크 스키마:**

- 네이버 지도 앱: `nmap://place?lat={위도}&lng={경도}&name={이름}&appname={앱번들ID}`
- 앱 미설치 시 웹: `https://map.naver.com/v5/search/{검색어}`

**동작:**

1. `Linking.canOpenURL()`로 네이버 지도 앱 설치 여부 확인
2. 설치됨 → 딥링크로 앱 실행
3. 미설치 → 웹 브라우저로 네이버 지도 열기

### Task 9.3: 결과 화면 통합

- [ ] 메인 화면에서 결과 모달을 연결해주세요:

**동작 흐름:**

1. 흔들기 감지 → `searching` 상태로 전환
2. API 호출 및 랜덤 선택 (0.5초 이내)
3. 결과 있음 → 모달 표시
4. 결과 없음 → "조건에 맞는 식당이 없어요" 토스트 표시
5. "네이버 지도에서 보기" → 딥링크 실행
6. "다시 흔들어보기" → 모달 닫기, `ready` 상태로 복귀

---

## Phase 10: 통합 및 최종 테스트

### Task 10.1: 에러 핸들링 강화

- [ ] 모든 API 호출과 센서 접근에 대해 에러 핸들링을 추가해주세요:

**체크리스트:**

- [ ] 네트워크 오류 시 사용자 친화적 메시지 표시
- [ ] 위치 권한 거부 시 설정 앱으로 안내
- [ ] 센서 사용 불가 시 대체 UI (버튼으로 트리거)
- [ ] API 응답 없음 시 재시도 옵션 제공

### Task 10.2: 로딩 상태 UI

- [ ] 각 상태에 맞는 로딩 UI를 구현해주세요:

- `loading`: 스플래시 또는 스켈레톤 UI
- `searching`: 중앙에 Spinner + "맛집 찾는 중..." 문구
- 네트워크 요청 중: 버튼 비활성화 + 로딩 인디케이터

### Task 10.3: 탭 네비게이션 정리

- [ ] 불필요한 탭을 제거하고 단일 화면 앱으로 정리해주세요:

**최종 라우트 구조:**

```
src/app/
├── _layout.tsx        # 루트 레이아웃
├── index.tsx          # 메인 화면 (리다이렉트)
├── (tabs)/
│   ├── _layout.tsx    # 탭 레이아웃 (탭바 숨김 또는 제거)
│   └── index.tsx      # 메인 흔들기 화면
└── settings.tsx       # 설정 화면 (모달 또는 별도 스크린)
```

### Task 10.4: 최종 테스트 체크리스트

- [ ] **기능 테스트:**

- [ ] 앱 최초 실행 → 설정 화면 표시
- [ ] 설정 저장 후 메인 화면으로 이동
- [ ] 폰 흔들기 → 0.5초 내 결과 표시
- [ ] 결과 모달에서 "네이버 지도에서 보기" → 앱 실행
- [ ] 네이버 지도 미설치 시 → 웹 브라우저로 열림
- [ ] 설정 변경 후 재검색 시 필터 적용 확인

**예외 상황 테스트:**

- [ ] 위치 권한 거부 상태에서의 동작
- [ ] 네트워크 미연결 상태에서의 동작
- [ ] 검색 결과 0건일 때의 동작
- [ ] 연속 흔들기 시 중복 호출 방지

**성능 테스트:**

- [ ] 흔들기 감지 후 결과까지 0.5초 이내 (PRD 요구사항)
- [ ] 메모리 누수 없음 (센서 리스너 정리)

---

## 부록: 위트 있는 문구 모음

메인 화면과 결과 화면에서 사용할 문구들:

**대기 화면:**

- "오늘의 운명에 맡겨보시겠어요?"
- "결정 장애 탈출, 3초 컷!"
- "고민은 배송만 늦출 뿐"

**결과 화면:**

- "🎉 오늘의 점심은"
- "운명이 선택했습니다"
- "여기 어때요?"

**결과 없음:**

- "앗, 조건에 맞는 식당이 없어요 😢"
- "필터를 조금 느슨하게 해볼까요?"

**에러:**

- "잠시 문제가 생겼어요"
- "다시 한 번 흔들어주세요"

---

## 개발 순서 요약

```
Phase 0 → Phase 1 → Phase 3 → Phase 4 → Phase 5
                ↓
            Phase 2 (병렬 진행 가능)
                ↓
Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10
```

각 Phase를 순서대로 진행하되, Phase 2(디자인 시스템)는 Phase 1 이후 언제든 병렬로 진행 가능합니다.
