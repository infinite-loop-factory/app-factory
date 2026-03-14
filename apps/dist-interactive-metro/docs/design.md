# 디자인 시스템 및 화면 스펙

## 1. 색상 시스템

### 노선 색상 (공식)

| 노선 | 색상 | Hex |
|------|------|-----|
| 1호선 | 진한 파랑 | `#263C96` |
| 2호선 | 초록 | `#3CB44A` |
| 3호선 | 주황 | `#EF7C1C` |
| 4호선 | 하늘 | `#00A5DE` |
| 5호선 | 보라 | `#996CAC` |
| 6호선 | 갈색 | `#CD7C2F` |
| 7호선 | 올리브 | `#747F00` |
| 8호선 | 분홍 | `#E6186C` |
| 9호선 | 금색 | `#BDB092` |
| 신분당선 | 빨강 | `#D4003B` |
| 경의중앙선 | 민트 | `#77C4A3` |
| 공항철도 | 파랑 | `#0090D2` |
| 경춘선 | 초록 | `#0C8E72` |
| 수인분당선 | 노랑 | `#FABE00` |
| 신림선 | 청보라 | `#6789CA` |
| 우이신설 | 황록 | `#B0CE18` |

### 시맨틱 색상 토큰

| 역할 | 토큰 | Light |
|------|------|-------|
| 출발 (파랑) | `secondary-300` | `rgb(26, 163, 255)` |
| 도착 (주황) | `primary-300` | `rgb(255, 163, 26)` |
| 배경 (기본) | `background-0` | `rgb(255, 255, 255)` |
| 배경 (미묘) | `background-50` | `rgb(246, 246, 246)` |
| 본문 | `typography-900` | `rgb(38, 38, 39)` |
| 보조 텍스트 | `typography-500` | `rgb(140, 140, 140)` |
| 테두리 | `outline-200` | `rgb(221, 220, 219)` |
| 에러 | `error-400` | `rgb(239, 68, 68)` |
| 성공 | `success-400` | `rgb(72, 151, 102)` |

---

## 2. 타이포그래피

| 스타일 | 크기 | 굵기 | 용도 |
|--------|------|------|------|
| Title | 36px | Bold | 화면 제목 |
| Subtitle | 20px | Bold | 섹션 헤딩 |
| Heading | 16px | Semibold | 카드 제목 |
| Body | 16px | Regular | 본문 |
| Body Small | 14px | Regular/Medium | 보조 정보 |
| Caption | 12px | Regular | 레이블, 메타 |

---

## 3. 간격 및 레이아웃

- **화면 수평 패딩**: 24px
- **카드 내부 패딩**: 12–16px
- **모서리 반지름**: 카드/필드 `rounded-xl` (12px), 버튼 `rounded-lg` (8px)
- **그림자**: `ElevatedCard` — `0px 3px 10px rgba(38,38,38,0.20)`

---

## 4. 컴포넌트

### 구현된 컴포넌트

#### ElevatedCard (`components/ui/elevated-card.tsx`)
그림자가 있는 흰색 카드. 경로 결과, 출발역 선택, Go Now 화면 전반에 사용.

#### GradientBackground (`components/ui/gradient-background.tsx`)
화면 배경 그라디언트 래퍼. 경로 결과·Go Now 화면에 사용.

#### LineBadge (`components/ui/line-badge.tsx`)
노선 색상의 작은 뱃지. 역 목록, 경로 결과에 사용.

#### EmptyState (`components/ui/empty-state.tsx`)
아이콘 + 메시지. 즐겨찾기 빈 상태 등에 사용.

#### ScreenHeader (`components/navigation/screen-header.tsx`)
뒤로가기 버튼 + 타이틀 바. 최소 44×44pt 터치 영역.

---

## 5. 화면별 스펙

### 홈 화면 (index.tsx)

**레이아웃 모드**:
- **Mode A (Empty)**: 역 미선택 상태. 출발·도착 필드 수직 중앙 정렬.
- **Mode B (Expanded)**: 역 선택 후. 필드 상단 이동 (easeInEaseOut ~300ms), 경로 찾기 버튼 표시.

**필드 색상 규칙**:
- 출발 필드 → `secondary-*` (파랑 계열)
- 도착 필드 → `primary-*` (주황 계열)
- 경유 → `outline-*` (회색 계열)

### Go Now 탭 (go-now.tsx)

GPS로 현재 위치 감지 → 주변 3개 역 + 각각 가장 빠른 경로 추천. ElevatedCard로 표시.

### 출발역 선택 (departure-select.tsx)

- GPS 감지 중: 로딩 스피너
- 감지 완료: 가장 가까운 역 (파랑 하이라이트) + 2위·3위 역 카드
- 권한 거부: 경고 UI
- 하단: "모든 역 검색" 버튼 → station-select로 이동

### 역 선택 (station-select.tsx)

- 상단 고정: 검색 입력 + 노선 필터 탭 (가로 스크롤)
- 역 목록: FlatList, LineBadge + 환승 정보
- 최근 선택 역 / 검색 결과 전환

### 경로 결과 (route-result.tsx)

- **요약 카드** (ElevatedCard): 출발→도착, 소요 시간·역 수·환승 횟수, 출발역 다음 시간표 (DepartureStrip), 즐겨찾기 버튼
- **상세 경로 카드** (ElevatedCard): 수직 타임라인 (노선 색상 커넥터), 환승 구간에 TransferInfoBadge (보행 거리)

### 알림 탭 (notifications.tsx)

즐겨찾기 경로별로 실시간 시간표 표시. `useStationTimetable` 훅으로 다음 3개 출발 시간.

### 즐겨찾기 탭 (favorites.tsx)

저장된 경로 카드. 탭하면 route-result로 바로 이동.

---

## 6. 접근성

- 모든 인터랙티브 요소: 최소 44×44pt 터치 영역
- 색상 대비: WCAG AA (텍스트 4.5:1, 대형 3:1)
- `accessibilityLabel`, `accessibilityRole` 필수
- 다크 모드: 색상 토큰 스케일 반전 (0→950)

---

## 7. 지원 기기

| 기기 | 크기 | 우선순위 |
|------|------|----------|
| iPhone SE 3 | 375×667pt | 지원 필수 |
| iPhone 16/17 | 393×852pt | 기본 타겟 |
| iPhone 16/17 Pro Max | 430×932pt | 지원 필수 |

- **방향**: 세로 전용
- **Safe Area**: 상단 (Dynamic Island) + 하단 (홈 바) 인셋 처리

---

## 8. 프로토타입 참고

초기 v0.dev 스크린샷: `docs/prototype/` (2026-01-25 기준, 현재 구현과 차이 있음)

참고 앱: 지하철종결자, 카카오맵 지하철, 네이버 지도 지하철, Citymapper
