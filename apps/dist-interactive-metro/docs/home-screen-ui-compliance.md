# 홈 화면 UI 요구사항 반영 검토

`docs/home-screen-ui-prompt.md`에 정리된 요구사항이 코드에 모두 반영되었는지 검토한 결과입니다.

---

## 1. 기본 노출 (항상)

| 요구사항 | 반영 여부 | 코드 위치 |
|----------|-----------|-----------|
| 출발역 필드: 라벨 "출발역", 빈 상태 플레이스홀더 "출발역 선택" | ✅ | `station-block.tsx` → `StationField`에 `i18n.t("homeScreen.departure")`, `i18n.t("homeScreen.departurePlaceholder")` 전달. `ko.json`에 "출발역", "출발역 선택" 정의 |
| 출발역 탭 시 → 출발역 전용 선택 화면으로 이동 | ✅ | `index.tsx` `handleDeparturePress` → `router.push("/departure-select")` |
| 도착역 필드: 라벨 "도착역", 빈 상태 "도착역 선택" | ✅ | 동일하게 `homeScreen.arrival`, `homeScreen.arrivalPlaceholder` 사용 |
| 도착역 탭 시 → 도착역 전용 선택 화면으로 이동 | ✅ | `handleArrivalPress` → `router.push("/arrival-select")` |
| 이 두 필드만 있을 때 "경유 추가" 미노출 | ✅ | `showViaField = !!departure \|\| !!arrival`. `StationBlock`에서 `showViaField`일 때만 `AddViaField` 렌더 |

---

## 2. 경유 추가 노출 조건

| 요구사항 | 반영 여부 | 코드 위치 |
|----------|-----------|-----------|
| 출발 또는 도착 중 하나라도 선택되면 "경유 추가" 표시 | ✅ | `showViaField` 조건 및 `StationBlock` 내 `{showViaField && <AddViaField ... />}` |
| 경유역 최대 3개 | ✅ | `route-search-context.tsx` `MAX_VIA_STATIONS = 3`, `addViaStation`에서 `prev.length >= MAX_VIA_STATIONS` 시 추가 안 함 |
| "경유 추가" 탭 시 → 경유역 전용 선택 화면 | ✅ | `handleViaPress` → `router.push("/via-select")` |
| 3개일 때 비활성화 및 "최대 3개" 문구 | ✅ | `AddViaField`에 `disabled={!canAddVia}`, `maxReached={viaStations.length >= maxViaStations}`. `canAddVia`는 context에서 `viaStations.length < MAX_VIA_STATIONS` 포함. `add-via-field.tsx`에서 `maxReached`일 때 subText "최대 3개", `disabled && "opacity-50"` |

---

## 3. 레이아웃 모드 (중앙 vs 상단)

| 요구사항 | 반영 여부 | 코드 위치 |
|----------|-----------|-----------|
| 입력 블록: 출발·(경유)·도착 **한 행(가로)** 에 배치, 형태는 앱 전반 동일 | ✅ | `StationBlock`이 `flex-row items-stretch gap-2`로 한 행 구성. 홈·선택 화면 모두 동일 컴포넌트 사용 |
| 비어 있음: 출발·도착·경유 모두 미설정 | ✅ | `isBlockEmpty = !(departure \|\| arrival) && viaStations.length === 0` (논리적으로 `!departure && !arrival && viaStations.length === 0`와 동일) |
| **모드 A** (비어 있을 때): 출발·도착만, 화면 **세로 중앙** 배치 | ✅ | 단일 레이아웃: 상단 `View flex-1`(스페이서) → 블록 → 하단 `View flex-1`(스페이서). `LayoutAnimation`으로 확장 시 중앙→상단 전환 애니메이션 |
| 모드 A: 제목/부제목, 검색 버튼, 부가 기능 영역 **미표시** | ✅ | 비어 있을 때 상·하단은 스페이서만, 제목·검색 영역 없음 |
| **모드 B** (하나라도 설정): 제목·부제목 표시 | ✅ | `showExpandedLayout`일 때 상단 영역에 `homeScreen.title`, `homeScreen.subtitle` |
| 모드 B: 입력 블록이 **최상단**에 위치 | ✅ | 단일 레이아웃에서 상단 영역(제목) → 블록 → 하단 영역(ScrollView 내 검색·부가 기능) |
| 모드 B: "검색 및 부가 기능" 영역 + 경로 찾기 버튼 | ✅ | `homeScreen.searchAndExtras` 문구와 `SearchButton` 포함 |

---

## 4. 선택 화면별 블록 위치 (유동적 UI)

| 요구사항 | 반영 여부 | 코드 위치 |
|----------|-----------|-----------|
| **출발역 선택 화면**: 블록 **최상단** (블록 위, 역 목록 아래) | ✅ | `departure-select.tsx`: 헤더 → 블록 `View` → `ScrollView`(flex-1) |
| **도착역 선택 화면**: 블록 **최상단** (블록 위, 역 목록 아래) | ✅ | `arrival-select.tsx`: 헤더 → 블록 `View` → `ScrollView`(flex-1) |
| **경유역 선택 화면**: 출발 **위**, 도착 **아래**, **중간**에 경유역 선택 | ✅ | `via-select.tsx`: 헤더 → `StationBlock departureOnly`(상단) → `ScrollView`(중간) → `StationBlock arrivalOnly`(하단) |

---

## 5. 검색 버튼 동작

| 요구사항 | 반영 여부 | 코드 위치 |
|----------|-----------|-----------|
| 검색(경로 찾기) 버튼은 **모드 B에서만** 노출 | ✅ | `SearchButton`이 `showExpandedLayout` 분기 안의 `ScrollView` 내부에만 존재 |
| 출발·도착 **둘 다** 선택 시에만 활성화 | ✅ | `canSearch = departure !== null && arrival !== null` (context), `SearchButton disabled={!canSearch}` |
| 비활성 시 회색 스타일, 탭해도 검색 실행 안 함 | ✅ | `disabled`일 때 `bg-outline-100`, `text-outline-400`. `handleSearchPress`에서 `if (!canSearch) return` |

---

## 6. 요약

- **기본 노출·경유 조건·한 행 블록·중앙/상단 레이아웃·검색 버튼·선택 화면별 블록 위치** 요구사항이 모두 코드에 반영되어 있습니다.
- 동일한 **한 행 입력 블록**(`StationBlock`)이 홈에서는 중앙/상단만 바꾸고, 출발·도착 선택 화면에서는 **항상 상단**, 경유 선택 화면에서는 반분(split)으로만 위치가 달라지도록 구현되어 있습니다.

---

*검토 기준: `docs/home-screen-ui-prompt.md` (섹션 1~5, 7).*
