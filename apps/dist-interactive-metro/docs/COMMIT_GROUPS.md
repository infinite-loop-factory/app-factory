# 커밋 분류 제안 (Commit Groups)

현재 작업된 변경 사항을 **기능 단위**로 나눈 분류입니다.  
원하는 granularity에 따라 1개 그룹을 1개 커밋으로 하거나, 여러 그룹을 하나의 커밋으로 합칠 수 있습니다.

---

## 그룹 1: 탭 구조 + 기본 홈 설정

**의도**: 홈을 ‘경로안내’로 고정하고, 샘플 탭 3개 추가 + 앱 실행 시 기본 탭 지정 기능.

| 구분 | 경로 |
|------|------|
| 수정 | `src/app/(tabs)/_layout.tsx` (탭 구성, 기본 홈 리다이렉트) |
| 수정 | `src/app/(tabs)/settings.tsx` (기본 홈 선택 UI) — 이미 있으면 해당 파일 |
| 삭제 | `src/app/(tabs)/explore.tsx` |
| 신규 | `src/app/(tabs)/notifications.tsx` |
| 신규 | `src/app/(tabs)/favorites.tsx` |
| 신규 | `src/app/(tabs)/settings.tsx` (없을 경우) |
| 신규 | `src/lib/default-home.ts` |
| 수정 | `package.json` (AsyncStorage 의존성) |
| 수정 | `src/i18n/locales/ko.json`, `src/i18n/locales/en.json` (tabs.*, settings.defaultHome, settings.defaultHomeDescription) |
| 수정 | `pnpm-lock.yaml` (이 그룹에서 의존성 추가 시) |

**제안 커밋 메시지**:  
`feat(dist-interactive-metro): 경로안내 홈 + 알림/즐겨찾기/설정 탭, 기본 홈 설정`

---

## 그룹 2: 네비게이션·Safe Area·출발/도착/경유 전용 씬 제거

**의도**: 모든 화면 상단 safe area 적용, 출발/도착/경유는 인플레이스만 사용, 서브 씬은 알림 설정만 유지.

| 구분 | 경로 |
|------|------|
| 수정 | `src/components/navigation/screen-header.tsx` (useSafeAreaInsets, 상단 여백) |
| 수정 | `src/app/_layout.tsx` (departure-select/arrival-select/via-select 제거, notification-settings 추가) |
| 신규 | `src/app/notification-settings.tsx` |
| 수정 | `src/app/(tabs)/notifications.tsx` (SafeAreaView 적용) — 그룹1에서 이미 추가했다면 |
| 수정 | `src/app/(tabs)/favorites.tsx` (SafeAreaView) |
| 수정 | `src/app/(tabs)/settings.tsx` (SafeAreaView) |
| 수정 | `src/app/+not-found.tsx` (SafeAreaView) |
| 수정 | `src/app/route-result.tsx` (ScreenHeader만 사용, SafeAreaView 제거) |

**참고**: 그룹1에서 새 탭 파일을 만들었다면, 그룹2에서는 해당 파일에 SafeAreaView만 추가하는 수정으로 두면 됨.

**제안 커밋 메시지**:  
`feat(dist-interactive-metro): 전역 Safe Area 적용, 출발/도착/경유 전용 씬 제거, 알림 설정 서브 씬 추가`

---

## 그룹 3: 경로안내 씬 공통 레이아웃·재사용 컴포넌트

**의도**: RouteSceneLayout / StationSelectPanel / StationListItem 도입으로 유지보수·재사용성 확보.

| 구분 | 경로 |
|------|------|
| 신규 | `src/components/home/route-scene-layout.tsx` |
| 신규 | `src/components/home/station-select-panel.tsx` |
| 신규 | `src/components/home/station-list-item.tsx` |
| 수정 | `src/i18n/locales/ko.json`, `en.json` (stationSelect.viaShort 등 이 그룹에서 쓰는 키) |

**제안 커밋 메시지**:  
`refactor(dist-interactive-metro): 경로안내 공통 레이아웃 및 선택 패널/리스트 아이템 컴포넌트`

---

## 그룹 4: 출발/도착 시각 구분 + 라벨 제거 + 전환·오버플로우

**의도**: 출발(파란) vs 도착(주황) 시각 구분, 좌→우만으로 의미 전달(라벨 제거), 레이아웃 전환·텍스트 오버플로우 정리.

| 구분 | 경로 |
|------|------|
| 수정 | `src/components/home/station-field.tsx` (hideLabel, active, activeVariant) |
| 수정 | `src/components/home/station-block.tsx` (selectingMode, hideLabels, min-w-0) |
| 수정 | `src/components/home/add-via-field.tsx` (min-w-0, 텍스트 overflow 방지) |
| 수정 | `src/app/(tabs)/index.tsx` (RouteSceneLayout 사용, StationSelectPanel/StationListItem, LayoutAnimation) |
| 수정 | `src/app/route-result.tsx` (텍스트 numberOfLines 등) |
| 수정 | `src/i18n/locales/ko.json`, `en.json` (departureShort, arrivalShort 등) |

**제안 커밋 메시지**:  
`feat(dist-interactive-metro): 출발/도착 시각 구분·라벨 제거·전환 애니메이션·텍스트 오버플로우 수정`

---

## 그룹 5: 기반 코드 (컨텍스트·타입·기타 홈 컴포넌트)

**의도**: 경로안내 기능의 데이터/상태·타입·기존 홈 UI 컴포넌트.  
그룹 1~4보다 먼저 있던 변경이면 **가장 먼저 커밋**하는 것이 좋음.

| 구분 | 경로 |
|------|------|
| 신규 | `src/context/route-search-context.tsx` |
| 신규 | `src/context/sync-status-context.tsx` |
| 신규 | `src/types/station.ts` |
| 신규 | `src/types/sync-status.ts` |
| 신규 | `src/components/home/station-block.tsx` |
| 신규 | `src/components/home/station-field.tsx` |
| 신규 | `src/components/home/add-via-field.tsx` |
| 신규 | `src/components/home/route-form-block.tsx` |

**참고**: 이 파일들이 이미 그룹 4에서 “수정”으로 들어가 있다면, **최초 추가**는 이 그룹, **이후 변경**은 그룹 4로 나누면 됨.

**제안 커밋 메시지**:  
`feat(dist-interactive-metro): 경로 검색 컨텍스트·스테이션 타입·홈 스테이션 블록/필드 컴포넌트`

---

## 그룹 6: 문서·기타

**의도**: 프로젝트 문서·README·락파일 등 기능과 직접 무관한 변경.

| 구분 | 경로 |
|------|------|
| 수정 | `README.md`, `docs/PROJECT_STATUS.md`, `docs/architecture.md`, `docs/requirements.md`, `docs/user-flow.md` |
| 수정 | `src/components/external-link.tsx` (다른 작업에서 수정된 경우) |
| 신규 | `docs/concept-overview.md`, `docs/dev-screen.md`, `docs/home-screen-*.md`, `docs/tsx-files-roles.md` 등 |

**제안 커밋 메시지**:  
`docs(dist-interactive-metro): 프로젝트 상태·아키텍처·요구사항·홈 화면 문서 정리`

---

## 커밋 순서 제안

1. **그룹 5** (기반: context, types, home 컴포넌트) — 다른 그룹이 여기에 의존.
2. **그룹 3** (RouteSceneLayout, StationSelectPanel, StationListItem) — 그룹 4가 이걸 사용.
3. **그룹 1** (탭 + 기본 홈).
4. **그룹 2** (네비게이션·Safe Area·전용 씬 제거).
5. **그룹 4** (출발/도착 구분·라벨 제거·전환·오버플로우) — 그룹 3 사용.
6. **그룹 6** (문서).

필요하면 **그룹 3+4**를 하나의 “경로안내 UX 개선” 커밋으로, **그룹 1+2**를 “탭·네비게이션 정리” 하나로 묶어도 됩니다.
