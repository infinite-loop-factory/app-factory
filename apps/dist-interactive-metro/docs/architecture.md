# 아키텍처

## 기술 스택

| 항목 | 버전 |
|------|------|
| Expo SDK | ~54 |
| React Native | 0.81.5 |
| TypeScript | 5.9+ |
| Expo Router | 6.0.21 |
| NativeWind | 4.2.1 |
| Gluestack UI | 3.0.12 |
| Biome | 2.3.10 |
| i18n-js | 4.5.1 |

---

## 파일 구조

```
src/
├── app/
│   ├── _layout.tsx                  # 루트 레이아웃, Provider 래핑
│   ├── (tabs)/
│   │   ├── _layout.tsx              # 탭 바 레이아웃 (5탭 + Dev)
│   │   ├── index.tsx                # 홈 탭 (경로 검색)
│   │   ├── go-now.tsx               # Go Now 탭 (GPS 즉시 추천)
│   │   ├── notifications.tsx        # 알림 탭 (즐겨찾기 시간표)
│   │   ├── favorites.tsx            # 즐겨찾기 탭
│   │   ├── settings.tsx             # 설정 탭
│   │   └── dev.tsx                  # 개발자 탭 (__DEV__ 전용)
│   ├── station-select.tsx           # 역 검색/선택 화면
│   ├── departure-select.tsx         # GPS 기반 출발역 선택 화면
│   ├── route-result.tsx             # 경로 결과 화면
│   └── notification-settings.tsx    # 알림 설정 화면
│
├── components/
│   ├── ui/
│   │   ├── elevated-card.tsx        # 그림자 카드 컴포넌트
│   │   ├── gradient-background.tsx  # 그라디언트 배경
│   │   ├── line-badge.tsx           # 노선 색상 뱃지
│   │   └── empty-state.tsx          # 빈 상태 UI
│   ├── navigation/
│   │   ├── screen-header.tsx        # 뒤로가기 헤더
│   │   └── tab-bar-icon.tsx         # 탭 바 아이콘
│   └── dev/
│       └── api-inspector.tsx        # KRIC API 테스트 도구
│
├── context/
│   ├── route-search-context.tsx     # 경로 검색 전역 상태
│   └── sync-status-context.tsx      # KRIC 동기화 상태
│
├── data/
│   ├── stations.ts                  # 정적 역 데이터 (1~5호선 등)
│   ├── station-store.ts             # 동적+정적 역 통합 저장소
│   ├── station-coordinates.ts       # 역 GPS 좌표
│   ├── kric-station-sync.ts         # KRIC API → 동적 역 동기화
│   ├── favorites.ts                 # 즐겨찾기 AsyncStorage CRUD
│   └── recent-stations.ts           # 최근 역 AsyncStorage CRUD
│
├── hooks/
│   ├── use-station-timetable.ts     # KRIC 시간표 훅
│   ├── use-transfer-info.ts         # KRIC 환승 거리/시간 훅
│   ├── use-transfer-movement.ts     # KRIC 환승 경로 단계 훅
│   └── use-theme-color.ts           # 다크모드 색상 훅
│
├── lib/
│   ├── kric-api.ts                  # KRIC API 클라이언트 (5 엔드포인트)
│   └── default-home.ts             # 기본 홈 탭 설정
│
├── utils/
│   ├── route-calculator.ts          # Dijkstra 경로 탐색
│   └── geo.ts                       # GPS 거리 계산, 가장 가까운 역
│
├── types/
│   ├── station.ts                   # Station, NearbyStation 타입
│   └── sync-status.ts               # SyncStatus 타입
│
├── constants/
│   ├── color-tokens.ts              # 글루스택 색상 토큰
│   └── colors.ts                    # 노선별 색상
│
└── i18n/
    ├── index.ts                     # i18n 설정
    └── locales/
        ├── ko.json                  # 한국어
        └── en.json                  # 영어
```

---

## 핵심 데이터 흐름

### 역 데이터 (Station Store 패턴)

정적 역(1~5호선, 9호선 등)과 KRIC API에서 로드한 동적 역(6~8호선, 공항철도 등)을 `station-store.ts`가 하나의 `_merged` 배열로 관리합니다.

```
앱 시작
  → syncKricStations() [kric-station-sync.ts]
      → KRIC subwayRouteInfo API 호출
      → setDynamicStations(_merged) [station-store.ts]

이후 모든 역 조회:
  getAllStations()     → _merged 배열 전체 반환
  searchAllStations()  → _merged에서 키워드 필터
```

**중요**: 정적 `stations` 배열을 직접 import해서 쓰면 동적 역이 누락됩니다. 반드시 `getAllStations()` / `searchAllStations()`를 사용하세요.

### KRIC API 사용 흐름

```
getKricRef(stationName, lineName)   → KRIC 코드 맵에서 {stinCd, railOprIsttCd, lnCd} 조회
  → 24h AsyncStorage 캐시 (kric-station-sync.ts의 getCodeMap())

훅에서 사용:
  useStationTimetable(name, line, n)  → stationTimetable API → 현재 이후 N건 출발 시간
  useTransferInfo(name, from, to)     → stationTransferInfo API → 보행 거리 + 예상 시간
  useTransferMovement(prev, target, next) → transferMovement API → 엘리베이터 경로 단계
```

### 경로 탐색 흐름

```
사용자 출발역 + 도착역 선택
  → calculateRoute(start, end, via?) [route-calculator.ts]
      → Dijkstra (환승 패널티 1000)
      → RouteInfo { segments[], totalTime, totalStations, transfers }
  → route-result.tsx에서 표시
      → DepartureStrip: useStationTimetable(출발역, ...)
      → TransferInfoBadge: useTransferInfo(환승역, ...)
```

---

## 주요 Context

### RouteSearchContext
출발역·도착역·경유역 전역 상태. 홈 탭 ↔ 역 선택 화면 간 데이터 공유.

```typescript
{ startStation, endStation, viaStation,
  setStartStation, setEndStation, setViaStation, clearAll }
```

### SyncStatusContext
KRIC 동기화 상태 및 항목 수. Dev 탭에서 시각화.

```typescript
{ status, lastSyncTimestamp, lastSyncError, items,
  setSyncStatus, setLastSync, resetSyncState }
```

---

## 네비게이션 구조

```
Root Stack
├── (tabs)/ — 탭 네비게이터
│   ├── index        — 홈
│   ├── go-now       — Go Now
│   ├── notifications — 알림
│   ├── favorites    — 즐겨찾기
│   ├── settings     — 설정
│   └── dev          — 개발자 (__DEV__ 전용)
├── station-select   — 역 선택 (start/via/end)
├── departure-select — GPS 출발역 선택
├── route-result     — 경로 결과
└── notification-settings — 알림 설정
```

---

## 개발 원칙

- **모바일 우선**: iOS/Android 기준 설계, 웹은 동일 구조 그대로
- **Biome 규칙**: `noExcessiveCognitiveComplexity` (max 15), `noNestedTernary`, `useExhaustiveDependencies`
- **복잡도 관리**: 복잡한 로직은 컴포넌트 밖으로 추출 (module-level function)
- **환경 변수**: `EXPO_PUBLIC_KRIC_SERVICE_KEY` — 절대 커밋 금지
