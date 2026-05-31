# sip-note — E2E 검증 계획

> Phase 1·2 구현 기능을 Maestro 로 검증하기 위한 flow 목록. ADR-0011 의 *Phase 마무리 의무 캡처* + 골든 패스 + 상태 변형 / 권한 / i18n 까지 망라.
>
> **연결 문서**
> - 절차 / 실행: [`./README.md`](./README.md)
> - 디자인 워크플로우: [`../docs/design/workflow.md`](../docs/design/workflow.md)
> - ADR: [`../docs/design/ADR-claude-design.md`](../docs/design/ADR-claude-design.md) (특히 ADR-0011)
> - Phase 2 체크포인트: [`../docs/design/checkpoint-phase-2.md`](../docs/design/checkpoint-phase-2.md)
> - Phase 1·2 진행 현황: [`../docs/TODO.md`](../docs/TODO.md)
>
> **운영 룰**
> - 호출 cwd 는 항상 `apps/sip-note` (README §실행)
> - 신규 flow 추가 시 본 문서의 표에 항목 추가
> - 의무 캡처는 ADR-0011 Re-verification 의 9 컷과 1:1
> - 미구현 (Phase 3·4) 은 §E 에 명시 — 검증 대상 아님

## 최근 검증 회차

| 일시 | 환경 | 범위 | 결과 |
|---|---|---|---|
| 2026-05-10 | Pixel_8 AVD (`emulator-5554`), Maestro `~/.maestro/bin/maestro`, dev client `com.infiniteloopfactory.sipnote` 설치 | A1 단독 (yaml 작성된 유일 항목) | ✅ A1 PASS / A2~A9·B1~B5·C·helpers ⏸ flow yaml 부재로 검증 보류 |
| 2026-05-10 (2회차) | 동일 환경 | A2 신규 작성 + 실행 | ✅ A2 PASS (최소 골든 패스: 카테고리+이름+저장). 점수/태그/메모/사진/장소/가격 검증은 후속 flow 로 분리. **lesson**: maestro `hideKeyboard` 가 ESC 로 매핑되어 키보드가 없으면 BACK 네비를 일으킴 — Compose 에서 사용 금지 |
| 2026-05-10 (3회차) | 동일 환경 | A3 신규 작성 + 실행 | ✅ A3 PASS (34/34). **발견 이슈 #1** 참조: NoteDetail 편집 후 stale 데이터. **lesson**: 네이티브 Alert 의 destructive 버튼은 동일 텍스트가 detail 에 있어도 Alert 노출 동안 가려져 단일 노드 — `index` 불필요 |
| 2026-05-10 (4회차) | 동일 환경 | A6 시도 → BLOCKED | ⛔ 홈 → 지도 bottom-tab navigation 이 maestro `tapOn` (텍스트/좌표) / `openLink` / 직접 `adb shell input tap` 어느 방식으로도 트리거 안 됨. force-stop + pm clear + dev client 단독 launch 후에도 동일 증상 재현. **발견 이슈 #2** 참조 |
| 2026-05-10 (5회차) | 동일 환경 | A4 신규 작성 + 실행 | ✅ A4 PASS (37/37). **lesson**: RN FilterBar 의 horizontal ScrollView 가 `keyboardShouldPersistTaps` 기본 "never" → 키보드 노출 상태에서 chip 첫 탭이 키보드 dismiss 로 흡수. 검증 순서를 "카테고리 필터 → 검색" 으로 배치해 회피 |
| 2026-05-10 (6회차) | 동일 환경 | B5 신규 작성 + 실행 | ✅ B5 PASS (5/5). stack 라우트 deep link `sip-note:///note/<id>` 정상 — issue #2 와 별개로 stack 진입은 동작 |
| 2026-05-10 (7회차) | 동일 환경 | A9 신규 작성 + 실행 | ✅ A9 PASS (31/31). PlacePicker 흐름 (검색 → 새 장소 추가 → 카테고리 → 저장 → place 라벨 노출). **lesson**: ① 키보드 노출 상태에선 `scrollUntilVisible` 가 스와이프 영역을 못 찾아 실패 → 키보드 미노출 상태에서 미리 스크롤. ② PlacePicker 의 ScrollView 는 `keyboardShouldPersistTaps="handled"` 라 chip 더블 탭 불필요 |
| 2026-05-10 (8회차) | 동일 환경 | 발견 이슈 #1·#2 해소 + 재검증 | ✅ #1 RESOLVED — `src/app/note/[id].tsx` 를 `useFocusEffect` 로 전환 → 편집 저장 후 detail 자동 갱신. A3 를 단순화 (BACK 우회 제거) 후 29/29 PASS. ✅ #2 RESOLVED (코드 영역) — `src/app/_layout.tsx` 에 `__DEV__ && LogBox.ignoreAllLogs()` 추가 → 화면 하단 워닝 바 제거 (스크린샷 확인). **lesson**: ① 새 emulator 첫 키보드 노출 시 Gboard "Try out your stylus" onboarding 모달이 hierarchy 를 가려 한 번 dismiss 필요. ② dev 빌드 + maestro hierarchy-tap 조합에서 RN Pressable 의 onPress 가 첫 탭에서 누락되는 케이스가 산발 — 모든 navigation/state-mutation 탭에 `retryTapIfNoChange: true` 적용으로 안정화. ③ 탭 바 텍스트 (TextView, `clickable=false`) 만 hierarchy 에 노출돼 텍스트 selector tap 으론 부모 Pressable onPress 가 발화되지 않음 — point tap 또는 testID 보강 필요 |
| 2026-05-10 (9회차) | 동일 환경 | A6 재시도 (issue #2 코드 해소 후) | ✅ A6 PASS (22/22 step + 스크린샷 `e2e/.maestro-output/map-pins-empty.png`). **lesson**: ① 탭 바 Pressable 은 inner TextView (clickable=false) 만 hierarchy 에 노출 — 텍스트 selector tap 으론 onPress 미발화. 절대 좌표 `point: "810,2273"` 로 우회. ② FilterBar (상단 horizontal ScrollView) 는 maestro 의 default 화면-중앙 swipe 가 닿지 않음 — `swipe { start, end }` 로 chip 영역 (y=9%) 직접 swipe 필요. ③ 발견 이슈 #3 (Maps SDK 크래시) 는 transient 였음 — 이후 회차에서 재현되지 않아 환경 잡음으로 판단 → 이슈 close 후보 |
| 2026-05-30 (10회차) | 동일 환경 + dev 딥링크 시딩 | A7·A8·B3·C 9컷 작성 + helpers + 결정적 시딩/테마 인프라 | ✅ **A8 PASS** (place 상세 + 위시리스트 content-desc 토글 + addNote prefill 라운드트립) / ✅ **B3 PASS** (라이트 테마 — `theme-light.png` 실제 라이트 렌더 확인) / ✅ 9컷 cut 6·7·8·9 기기 검증 (place bar/distillery/winery + 홈 라이트) / ⛔ **A7·9컷 cut 1~5 env-block** (발견 이슈 #3 **재발·악화** — AVD `dl-MapsCoreDynamite` 파일 부재로 MapView crash, cold boot 미복구. A6 baseline 도 동반 crash). **발견 이슈 #4 참조**: `_layout` 강제-다크 effect 재발화로 라이트 전환 불가 → ref 가드(최초 1회)로 수정. **lesson**: ① `places` 는 UI 전용 + 에뮬 단일 위치라 다중 카테고리 핀은 `__DEV__` dev-seed 딥링크(고정 id·좌표)로만 결정화 가능. ② cold `/map` 딥링크는 첫 MapView mount 가 dynamite 미로드 crash → 탭바 point-tap 워밍 후 present 딥링크가 안전. ③ 위시리스트 ♥/♡ 는 accessibilityLabel(content-desc)로 `text` selector 매칭. ④ 노트 있는 상세의 addNote CTA 는 폴드 아래 → assertVisible 회피 |

## 발견 이슈

> 본 검증 회차에서 e2e 가 회피한 동작 이슈. 검증 자체는 통과했으나 코드 개선 여지 — 별도 처리 대상.

| # | 위치 | 증상 | 해소 / 우회 | 상태 |
|---|---|---|---|---|
| **#1** | `src/app/note/[id].tsx` `useEffect` 의존성 `[id]` | 편집(`/note/compose?noteId=...`) → `router.back()` 시 detail 가 refetch 되지 않아 stale 이름/메타 노출 | `useEffect` → `useFocusEffect(useCallback(...))` 로 전환. 화면 focus 마다 `repo.get(id)` 재호출 + 언마운트 가드 (`active` flag) | ✅ **RESOLVED** (2026-05-10 8회차). A3 단순화 후 29/29 PASS |
| **#2** | dev 빌드 `expo-router` `Tabs` + Android `LogBox` overlay | 홈 → 지도 bottom-tab navigation 이 트리거되지 않음. RN LogBox 워닝 바가 화면 하단 hit-test 를 흡수 | `src/app/_layout.tsx` 에 `if (__DEV__) LogBox.ignoreAllLogs()` 추가 → 워닝 바 제거 (스크린샷 확인). dev 빌드 + maestro 조합의 잔여 first-tap 미스는 `retryTapIfNoChange: true` 로 보강 | ✅ **RESOLVED** (2026-05-10 8회차) |
| **#3** | Android emulator — `google_apis_playstore` 이미지의 GMS Maps 다이너마이트 모듈 | 지도 탭 진입 시 `react-native-maps` (`MapView`) 의 native init 가 `dl-MapsCoreDynamite` 모듈 파일을 못 찾아 (chimera 미프로비저닝 — `... does not exist` / I/O error) 앱 프로세스가 런처로 튕김 | **근본 원인**: playstore 이미지는 다이너마이트 모듈을 런타임에 Play 로 내려받는데 미프로비저닝 상태였음(이미지 손상 아님). **해소**: 비-playstore `google_apis` 이미지 기반 AVD(`Pixel_8_Maps_e2e`) 신설 — `MapsDynamite.apk` 가 GMS 에 번들. 기존 Pixel_8 복제 후 이미지만 교체(해상도/좌표 보존). README §지도 의존 flow 참조 | ✅ **RESOLVED — env (2026-05-31)**. `google_apis` AVD 에서 dynamite 로드 확인, 지도 진입 시 런처-튕김 없이 `MainActivity` 생존. ⚠️ 단, 이 crash 가 가리고 있던 **발견 이슈 #5(Maps API 키 부재)** 가 후속 블로커로 드러남 |
| **#4** | `src/app/_layout.tsx` 강제-다크 `useEffect(() => setColorScheme("dark"), [setColorScheme])` | nativewind `setColorScheme` 의 identity 가 매 렌더 변해 effect 가 재발화 → 이후의 `setColorScheme("light")` 오버라이드(dev?theme / 향후 설정)를 즉시 환원, 라이트 전환 불가 | `didInitTheme` ref 가드로 최초 1회만 강제 다크. dark 우선 정책 유지 + 오버라이드 가능 | ✅ **RESOLVED** (2026-05-30 10회차). B3 라이트 렌더 확인 |
| **#5** | `apps/sip-note` — Google Maps SDK for Android API 키 미설정 (애초부터 부재; 과거 maps 키 커밋 `8cbfa40` 은 `apps/dog-walk` 것) | react-native-maps(Android, Google provider 전용)에서 키 부재 시 `MapView.<init>` 가 `API key not found` 로 soft-throw → 앱은 생존하나 **지도 화면이 빈 화면**(FilterBar 등 오버레이 노드도 미마운트). 이슈 #3(dynamite crash)이 이 단계 도달을 막아 가려져 있었음 | `app.config.ts` 에 `android.config.googleMaps.apiKey: process.env.GOOGLE_MAPS_API_KEY ?? ""` 추가(env 기반, 미설정 시 `""` fallback) + `.env.example`·`.gitignore` 정비. **사용자 액션**: Google Cloud 에서 "Maps SDK for Android" 키 발급 → `apps/sip-note/.env` 의 `GOOGLE_MAPS_API_KEY` → `expo prebuild -p android --clean` 리빌드 | ✅ **RESOLVED (2026-05-31)** — 키 발급·`.env` 적용·`prebuild --clean` 리빌드 후 `Pixel_8_Maps_e2e` 에서 **실지도 렌더 검증**(서울 타일 + `Google Maps Android API` init 성공, `API key not found` 소멸). debug keystore SHA-1 불변(`5E:8F:…`) 확인 → 등록 키 제한 유효 |

---

## A. 기능 골든 패스 (flow 단위)

| # | Flow | 검증 항목 | 의존성 | 우선순위 | 검증 결과 |
|---|---|---|---|---|---|
| **A1** | `home-smoke.yaml` ✅ | launch + 헤더 "테이스팅 피드" + 빈 상태 + FAB | — | High | ✅ PASS (2026-05-10, Pixel_8, 5/5 step + 스크린샷 `e2e/.maestro-output/home-smoke-empty.png`) |
| **A2** | `compose-create.yaml` ✅ | FAB → Compose → 카테고리 칩 6 종 → 이름 → 저장 → 피드 복귀 + 카드 1 건 (점수/태그/메모/사진/장소/가격 검증은 후속 flow 로 분리) | A1 | High | ✅ PASS (2026-05-10, Pixel_8, 19/19 step + 스크린샷 `e2e/.maestro-output/compose-create-feed.png`) |
| **A3** | `compose-edit-delete.yaml` ✅ | 인-flow 노트 생성 → 피드 카드 → Detail → 수정 (이름 변경) → Detail 자동 갱신 (`useFocusEffect`) → 삭제 Alert → destructive → 빈 상태 | A2 패턴 인라인 사용 | High | ✅ PASS (2026-05-10 8회차 재검증, Pixel_8, 29/29 step + 스크린샷 `e2e/.maestro-output/compose-edit-delete-empty.png`). 발견 이슈 #1 코드 해소 후 BACK 우회 제거 |
| **A4** | `feed-search-filter.yaml` ✅ | 인-flow 노트 2 건 (위스키 / 와인) → 카테고리 단일 토글 / 카테고리 교체 (위스키→맥주) / 결과 0 건 빈 상태 / 토글 해제 / 텍스트 검색 ("Cab") / 검색어 지우기 | A2 패턴 인라인 사용 (≥2 노트) | Medium | ✅ PASS (2026-05-10, Pixel_8, 37/37 step + 스크린샷 `e2e/.maestro-output/feed-search-filter-no-results.png`) |
| **A5** | `photo-attach.yaml` | Compose 사진 슬롯 → 갤러리 선택 (Android emulator gallery) → 압축 1600px → 슬롯 노출 → 다중 사진 → 제거 | A2 + 권한 grant | Medium | ⏸ flow yaml 미작성 — 검증 보류 |
| **A6** | `map-pins.yaml` ✅ | 지도 탭 진입 + FilterBar (전체 / 위시리스트 / placeCategory 6 종 — 좌측 4 즉시 / 우측 2 swipe) + 빈 상태 안내 카드 + 카테고리 / 위시리스트 칩 토글 (places 0 건 subset). 핀 / BottomSheet / 카테고리 활성 marker 변화는 place seed 부재로 본 flow 제외 → `helpers/seed-tasting-fixtures.yaml` 도입 후 본 flow 확장 또는 `map-pins-seeded.yaml` 신설 | — (clearState 직후 검증) | High | ✅ PASS (2026-05-10 9회차, Pixel_8, 22/22 step + 스크린샷 `e2e/.maestro-output/map-pins-empty.png`). 탭 진입은 `point: "810,2273"`, FilterBar swipe 는 y=9% 영역에서 직접 swipe |
| **A7** | `place-summary-sheet.yaml` ✅⛔ | 탭바 워밍 → `map?present=e2e-bar` 시트 peek 25% (PlaceCategoryChip + "3회 방문") → 드래그 half 50% (latestNote `Lagavulin 16`) → "상세 보기" CTA → place/[id] | seed + dev present 딥링크 | High | ⛔ **blocked** (발견 이슈 #3 해소됐으나 **#5(Maps API 키 부재)로 지도 빈 화면**). flow 작성 완료, 시트 present 메커니즘 코드 검증됨. `google_apis` AVD + `GOOGLE_MAPS_API_KEY` 둘 다 충족 시 PASS 예상 |
| **A8** | `place-detail.yaml` ✅ | `place/e2e-bar` → `<PlaceDetailHero>` + 노트 리스트 → wishlist ♡→♥ 토글 (content-desc) → `place/e2e-distillery` 빈 상태 + addNote CTA → Compose (placeId prefill) → 저장 → 복귀 시 노트 1 건 | seed + place 딥링크 | High | ✅ PASS (2026-05-30 10회차, Pixel_8, 25/25 step + 스크린샷 `place-detail-bar.png` / `place-detail-empty.png`). 마커 탭 불필요 (실 스택 라우트 딥링크) |
| **A9** | `compose-location-tagging.yaml` ✅ | Compose → place picker → 빈 검색 + "+ 새 장소 추가" → newForm (장소 이름 / 카테고리 6 종) → 저장 → modal close → Compose place 라벨 노출 → 노트 저장 → 피드 카드 ※ 위치 권한 / 좌표 자동 / 지도 핀 추가는 환경 이슈 #2 영향으로 본 flow 에서 제외 | A2 패턴 인라인 사용 | Medium | ✅ PASS (2026-05-10, Pixel_8, 31/31 step + 스크린샷 `e2e/.maestro-output/compose-location-tagging-feed.png`) |

## B. 상태 변형 / 권한 / i18n

| # | Flow | 시나리오 | 우선순위 | 검증 결과 |
|---|---|---|---|---|
| B1 | `permission-denied.yaml` | 카메라/위치 권한 거부 시 fallback 메시지 + 수동 대안 동작 | Medium | ⏸ flow yaml 미작성 — 검증 보류 |
| B2 | `i18n-locale-switch.yaml` | adb 로 시스템 locale `en-US` → 영문 키 노출 검증 (`Tasting Feed`, `Add note` 등) | Low | ⏸ flow yaml 미작성 — 검증 보류 |
| B3 | `theme-light.yaml` ✅ | `dev?theme=light` 오버라이드 → 라이트 테마 → 홈 DayDivider caption brand-strong 스왑 (Phase 1 §6 / ADR-0011 9 컷 #9) | High | ✅ PASS (2026-05-30 10회차, Pixel_8, 스크린샷 `theme-light.png` 실제 라이트 렌더). adb uimode 불가(`_layout` 강제-다크) → dev 딥링크 오버라이드로 대체. **발견 이슈 #4** 해소 후 동작 |
| B4 | `db-fresh-install.yaml` | clearState 후 SQLite 마이그레이션 v1→v3 자동 실행 + 첫 launch 정상 부팅 | Medium | ⏸ flow yaml 미작성 — 검증 보류 |
| B5 | `error-not-found.yaml` ✅ | 존재하지 않는 noteId 딥링크 → "기록을 찾을 수 없어요" 노출 (place 케이스는 후속 PR) | Low | ✅ PASS (2026-05-10, Pixel_8, 5/5 step + 스크린샷 `e2e/.maestro-output/error-not-found.png`). stack 라우트 deep link (`sip-note:///note/<id>`) 은 환경 이슈 #2 와 무관하게 정상 |

## C. ADR-0011 Phase 2 Re-verification 9 컷

`flows/checkpoint-phase-2-screenshots.yaml` 단일 flow 로 자동화. 결과는 `e2e/.maestro-output/checkpoint-phase-2-NN.png` 9 개 + `docs/design/checkpoint-phase-2.md` §Re-verification 표 첨부.

> **검증 결과 (2026-05-30 → 2026-05-31 갱신)**: 🟡 `checkpoint-phase-2-screenshots.yaml` 단일 flow 작성 완료 + seed/set-theme helper 도입. cut 6·7·8·9(place detail · 홈 라이트)는 기기 검증. cut 1~5(지도·BottomSheet)는 **두 전제** 충족 필요: (1) `google_apis` AVD — 이슈 #3 dynamite crash 해소(2026-05-31 완료), (2) `GOOGLE_MAPS_API_KEY` — 이슈 #5, 키 없으면 지도 빈 화면(config 배선 완료, 키 발급 대기). 둘 다 충족 시 5 컷 자동 채워짐.

| # | 컷 | 의무 |
|---|---|---|
| 1 | 지도 다크 — 필터 비활성, 4 카테고리 핀 + wishlist 1 | ✅ |
| 2 | 지도 라이트 — `bar` 필터 활성 | ✅ |
| 3 | BottomSheet peek 25% 다크 | ✅ |
| 4 | BottomSheet half 50% 다크 — latestNote inline | ✅ |
| 5 | BottomSheet half 50% 라이트 | ✅ |
| 6 | PlaceDetail 다크 — `place.bar` + 노트 3 건 | ✅ |
| 7 | PlaceDetail 라이트 — `place.distillery` + 빈 상태 (addNote CTA) | ✅ |
| 8 | PlaceDetail 다크 — `place.winery` + 노트 다수 (스크롤) | ✅ |
| 9 | 홈 라이트 + DayDivider — caption brand-strong 스왑 검증 | ✅ |

## D. Helpers

| 파일 | 역할 | 상태 |
|---|---|---|
| `helpers/seed-tasting-fixtures.yaml` | `sip-note:///dev?seed=default` → `seed-fixtures.ts` (place 5: bar/distillery/winery/brewery/wish + 노트 11, 고정 id·서울 근방 좌표). A7·A8·C 사전 조건 | ✅ 작성·검증 (subflow) |
| `helpers/set-theme.yaml` | `sip-note:///dev?theme=${MODE}` 오버라이드 (B3 / 9 컷 라이트). adb uimode 불가 → dev 딥링크로 대체 (발견 이슈 #4) | ✅ 작성·검증 (env MODE) |
| `helpers/grant-permissions.yaml` | adb `shell pm grant ... CAMERA / ACCESS_FINE_LOCATION` (B1 의 inverse) | ⏸ 미작성 (현재 `launchApp.permissions.all: allow` 로 대체) |
| `helpers/clear-state.yaml` | `pm clear com.infiniteloopfactory.sipnote` | ⏸ 미작성 (`launchApp.clearState` 로 대체) |

## E. 미구현 — 검증 대상 아님

다음은 코드가 아직 없어 E2E 대상에서 제외 ([`../docs/TODO.md`](../docs/TODO.md) Phase 3/4):

- 페어링 목록·작성·역방향 탐색 (Phase 3)
- 위시리스트 추가 (지도 long-press / 검색) (Phase 3)
- 데이터 내보내기 (Phase 3)
- 알림 / 지오펜싱 / 뱃지 / 통계 / 설정 (Phase 4)

Phase 3·4 코드 진입 시 본 문서의 §A·§B 에 flow 추가.

## 의존성 그래프

```
A1 (완료)
  ↓
A2 → seed (helpers) → A3
                ↓        ↓
                A4       A8 → A9
                ↓
                A5
A6 → A7 → A8
B3 (라이트) → C 9 컷 (ADR-0011 의무)
B1 / B2 / B4 / B5 (병렬)
```

## 우선순위 권장 진입

| 단계 | 범위 |
|---|---|
| **1 단계 (현재 PR 마무리)** | A2 / A6 / A7 / A8 + B3 + C 9 컷 — Phase 1·2 골든 패스 + ADR-0011 Re-verification 의무 캡처 완료 |
| **2 단계 (다음 세션)** | A3 / A4 / A5 / A9 + B1 / B4 |
| **3 단계 (장기)** | B2 / B5 + helpers 정비 |

## 2026-05-30 회차 현재 진행 status

| 항목 | 상태 | 메모 |
|---|---|---|
| A1 home-smoke | ✅ PASS | 1차 |
| A2 compose-create | ✅ PASS | 최소 골든 (점수/태그/메모/사진 후속 분리) |
| A3 compose-edit-delete | ✅ PASS | 8회차 재검증 — 발견 이슈 #1 코드 해소 (`useFocusEffect`), BACK 우회 제거 |
| A4 feed-search-filter | ✅ PASS | 인-flow 노트 2 건 + 카테고리 / 검색 / 빈 상태 |
| A5 photo-attach | ⏸ 미진행 | Android emulator gallery 진입 + 권한 grant 필요 — 별도 helper 도입 후 작성 |
| A6 map-pins | 🟢 지도 렌더 검증 / 🟡 swipe nit | 2026-05-31: 이슈 #3·#5 해소 후 **실지도 렌더 확인**(서울 타일 + Google Maps API init + FilterChip 6종). flow 가 지도 진입·즉시노출 칩(전체·위시리스트·바/펍·증류소·와이너리·브루어리) 전부 COMPLETED. 잔여 1건 `레스토랑`(swipe 노출) FAILED — **지도 무관**: 지도가 살아나며 FilterBar 오버레이 가로 swipe 를 MapView pan 이 흡수. swipe 좌표/제스처 분리 튜닝 필요(별도) |
| A7 place-summary-sheet | 🟡 재검증 대기 | flow·시트 present 메커니즘 코드 검증 완료. 이슈 #3·#5 해소·키 적용본에서 재실행 시 PASS 예상 |
| A8 place-detail | ✅ PASS | 10회차 — `place/e2e-bar` 딥링크 + 위시리스트 토글 + addNote prefill. 마커 탭 불필요 |
| A9 compose-location-tagging | ✅ PASS | PlacePicker 흐름 (좌표 자동 / 지도 핀 추가는 제외) |
| B1 permission-denied | ⏸ 미진행 | maestro launchApp `permissions` 옵션으로 deny + 시나리오 케이스 별 작성 필요 |
| B2 i18n-locale-switch | ⏸ 미진행 | adb `cmd locale` 외부 명령 wrap 필요. 단순 helper 스크립트 + flow 분리 작성 권장 |
| B3 theme-light | ✅ PASS | 10회차 — `dev?theme=light` 오버라이드 (발견 이슈 #4 해소). 실제 라이트 렌더 확인 |
| B4 db-fresh-install | ⏸ 미진행 | A1 과 본질 동일 (clearState 후 home empty 검증). 마이그레이션 v1→v3 직접 검증은 SQLite 쿼리 helper 필요 |
| B5 error-not-found | ✅ PASS | stack 라우트 deep link 정상 (note 케이스). place 케이스는 후속 |
| C 9 컷 | 🟡 부분 | flow 작성 완료. cut 6·7·8·9 기기 검증, cut 1~5 는 이슈 #3 해소 후 이슈 #5(API 키) 대기 |

**요약**: ✅ 8 PASS (A1·A2·A3·A4·A8·A9·B3·B5) / 🟡 1 부분 (C: 4/9 컷) / 🟡 2 blocked-키대기 (A6·A7, 이슈 #3 해소·#5 대기) / ⏸ 5 미진행 (A5·B1·B2·B4 + C 잔여)

**다음 우선순위**:
1. **`GOOGLE_MAPS_API_KEY` 발급·리빌드** (이슈 #5) — Maps SDK for Android 키 발급 → `apps/sip-note/.env` → `expo prebuild -p android --clean` → `google_apis` AVD(`Pixel_8_Maps_e2e`)에서 A6·A7·9컷 cut 1~5 검증. (이슈 #3 dynamite 는 2026-05-31 해소 완료)
2. A5 (photo-attach) / B1 / B2 / B4 작성
3. helper 보강: `grant-permissions` / `clear-state` (현재 launchApp 옵션으로 대체 중)

## 회귀 / 통합 테스트 (TODO Phase 5)

[`../docs/TODO.md`](../docs/TODO.md) Phase 5 의 *통합 테스트 골든 패스* 는 본 문서의 A2 → A6 → A7 → A8 → A9 (지도 노출까지) 를 한 묶음으로 chain. Phase 5 진입 시 `flows/golden-path-integration.yaml` 신설.

## Selector 운영 룰

[`./README.md` §Selector 전략](./README.md) 답습:

1. i18n 한국어 텍스트 직접 매치 — 가장 견고
2. `accessibilityLabel` — 시각 텍스트 없는 요소
3. `testID` — 동적 컴포넌트 (Card 인스턴스 등) 가 늘면 도입. 현재 미사용
4. 선택자 안정성을 위해 *i18n 키 변경 시 flow 동시 갱신* 룰 (PR 리뷰 항목)
