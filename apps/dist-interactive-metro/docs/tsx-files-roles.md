# TSX 파일별 역할 설명

dist-interactive-metro 앱에 있는 TypeScript React(`.tsx`) 파일들의 역할을 정리한 문서입니다.

---

## 1. 앱 라우팅·레이아웃 (`src/app/`)

| 파일 | 역할 |
|------|------|
| **`_layout.tsx`** | **루트 레이아웃**. 폰트 로드, 스플래시 숨김, `GluestackUIProvider`·`ThemeProvider`·`RouteSearchProvider`로 앱 전체 감싸기. Expo Router `Stack`으로 탭 그룹 `(tabs)`와 출발/도착/경유 선택 화면·`+not-found` 등록. |
| **`+html.tsx`** | **웹 전용**. 정적 렌더 시 루트 HTML(`<html>`, `<head>`) 구성. viewport, `ScrollViewStyleReset`, 다크모드 배경 등 메타/스타일 설정. |
| **`+not-found.tsx`** | **404 화면**. 존재하지 않는 경로 접근 시 "This screen doesn't exist." 메시지와 홈으로 가는 링크 표시. |
| **`(tabs)/_layout.tsx`** | **탭 레이아웃**. `expo-router` `Tabs`로 홈(`index`)·Explore(`explore`) 탭 구성. 각 탭 아이콘·제목 설정. |
| **`(tabs)/index.tsx`** | **홈 화면**. 출발/도착(·경유) 한 행 블록, 비어 있으면 중앙/하나라도 있으면 상단+검색·부가기능 영역. `StationBlock` 사용, 경로 찾기 버튼. |
| **`(tabs)/explore.tsx`** | **Explore 탭 화면**. Expo/라우팅 예제용. ParallaxScrollView, Collapsible, ExternalLink 등 데모 UI. |
| **`departure-select.tsx`** | **출발역 선택 화면**. 헤더 + 역 목록 스크롤 + **하단 고정** `StationBlock`. 출발역 선택 시 context 반영 후 홈으로 복귀. |
| **`arrival-select.tsx`** | **도착역 선택 화면**. 헤더 + **상단 고정** `StationBlock` + 역 목록 스크롤. 도착역 선택 시 context 반영 후 홈으로 복귀. |
| **`via-select.tsx`** | **경유역 선택 화면**. 헤더 + **상단** 출발만 블록 + 경유역 선택 스크롤 + **하단** 도착만 블록. 경유 추가 시 context 반영 후 홈으로 복귀. |

---

## 2. 홈·경로 입력 관련 (`src/components/home/`)

| 파일 | 역할 |
|------|------|
| **`station-block.tsx`** | **한 행 입력 블록** (출발 \| 경유 \| 도착). `StationField`·`AddViaField` 조합. `showViaField`일 때만 경유 표시. `departureOnly`/`arrivalOnly`로 경유 화면의 위/아래 바용. 홈·선택 화면 공용. |
| **`station-field.tsx`** | **출발/도착 한 칸 필드**. 라벨·플레이스홀더·선택값 표시, 탭 시 선택 화면 이동. 한 행 레이아웃용 컴팩트 스타일·말줄임. |
| **`add-via-field.tsx`** | **경유 추가 필드**. Plus 아이콘 + 라벨/개수("N개 경유역", "최대 3개"). `disabled`·`maxReached`로 3개 시 비활성·문구 표시. |
| **`route-form-block.tsx`** | (현재 미사용) 예전 경로 폼 블록. 출발·도착·경유 + 경유 제거 등. 현재는 **`station-block.tsx`** 로 대체됨. |

---

## 3. 컨텍스트 (`src/context/`)

| 파일 | 역할 |
|------|------|
| **`route-search-context.tsx`** | **경로 검색 상태**. `departure`·`arrival`·`viaStations` 보관, `setDeparture`·`setArrival`·`addViaStation`·`removeViaStation`·`clearAll` 제공. `canSearch`(출발·도착 둘 다 있을 때), `canAddVia`, `maxViaStations`(3) 계산. `RouteSearchProvider`로 앱 루트에서 주입. |

---

## 4. 공용 UI·유틸 컴포넌트 (`src/components/`)

| 파일 | 역할 |
|------|------|
| **`external-link.tsx`** | **외부 링크**. `href`(문자열) 받아 Expo Router `Link`로 렌더. 웹이 아니면 `openBrowserAsync`로 인앱 브라우저 열기. Explore 탭 등에서 사용. |
| **`themed-view.tsx`** | **테마 배경 View**. `useThemeColor`로 light/dark 배경색 적용. `ThemedView`로 라이트/다크 대응 레이아웃. |
| **`themed-text.tsx`** | **테마 텍스트**. `useThemeColor` + `type`(default/title/subtitle/link 등)에 따른 스타일. `ThemedText`로 라이트/다크 대응 문구. |
| **`collapsible.tsx`** | **접기/펼치기 블록**. 제목 탭 시 자식 표시/숨김. Explore 탭 예제에서 사용. |
| **`parallax-scroll-view.tsx`** | **패럴랙스 스크롤**. 상단 고정 헤더 이미지 + 아래 컨텐츠 스크롤. Explore 탭 레이아웃용. |
| **`hello-wave.tsx`** | **손 흔들기 애니메이션**. 회전 애니메이션 컴포넌트. Explore 등 예제에서만 참조 가능. |
| **`navigation/tab-bar-icon.tsx`** | **탭 바 아이콘**. Ionicons 래퍼, 크기·스타일 통일. `(tabs)/_layout.tsx`에서 홈·Explore 탭 아이콘에 사용. |
| **`ui/gluestack-ui-provider/index.tsx`** | **Gluestack UI 프로바이더**. 테마(light/dark/system)·오버레이·토스트 등 Gluestack 설정. 루트 `_layout.tsx`에서 앱 전체 감쌈. |

---

## 5. 요약

- **앱 진입점·라우팅**: `_layout.tsx`, `+html.tsx`, `+not-found.tsx`, `(tabs)/_layout.tsx`
- **화면**: `(tabs)/index.tsx`(홈), `(tabs)/explore.tsx`(Explore), `departure-select` / `arrival-select` / `via-select`
- **경로 입력 UI**: `station-block`, `station-field`, `add-via-field` (실사용) / `route-form-block` (미사용)
- **상태**: `route-search-context`
- **공용 UI**: `external-link`, `themed-view`, `themed-text`, `collapsible`, `parallax-scroll-view`, `hello-wave`, `tab-bar-icon`, `gluestack-ui-provider`

위 구분으로 각 TSX 파일의 역할을 파악할 수 있습니다.
