# sip-note — E2E (Maestro)

> Mobile UI E2E with [Maestro](https://github.com/mobile-dev-inc/Maestro). Expo dev client + Android emulator 한정. ADR-0011 의 *Phase 마무리 의무 캡처 + ad-hoc 트리거* 자동화 도구로도 사용.

## 디렉토리

```
e2e/
├── README.md                            — 이 문서
├── test-plan.md                         — flow 매트릭스 · 검증 회차 · 발견 이슈
├── flows/
│   ├── home-smoke.yaml                  — A1 launch + 홈 + FAB
│   ├── compose-create.yaml              — A2 작성 골든
│   ├── compose-edit-delete.yaml         — A3 수정/삭제
│   ├── feed-search-filter.yaml          — A4 검색/필터
│   ├── map-pins.yaml                    — A6 지도 진입 + FilterBar
│   ├── compose-location-tagging.yaml    — A9 PlacePicker
│   ├── error-not-found.yaml             — B5 not-found 딥링크
│   ├── place-summary-sheet.yaml         — A7 시트 peek/half + 상세 보기
│   ├── place-detail.yaml                — A8 장소 상세 + 위시리스트 + addNote
│   ├── theme-light.yaml                 — B3 라이트 테마 오버라이드
│   ├── checkpoint-phase-2-screenshots.yaml — C ADR-0011 9 컷
│   └── helpers/
│       ├── seed-tasting-fixtures.yaml   — dev 딥링크 결정적 시딩 (subflow)
│       └── set-theme.yaml               — dev 딥링크 테마 오버라이드 (env MODE)
└── (.maestro-output/)                   — takeScreenshot 산출물 (gitignore)
```

## 결정적 시딩 / 테마 (dev 딥링크)

`places` 는 UI(PlacePicker)로만 생성되고 핀은 `getCurrentPosition()` 좌표에 의존하므로,
에뮬레이터 단일 위치로는 9 컷의 *서로 다른 카테고리 핀 4 + 위시리스트* 를 만들 수 없다.
또한 `_layout.tsx` 가 dark 우선 정책으로 강제 다크라 adb uimode 로는 라이트 전환이 안 된다.
→ `__DEV__` 전용 딥링크 라우트 `src/app/dev.tsx` 로 둘 다 결정화한다.

| 딥링크 | 동작 | 구현 |
|---|---|---|
| `sip-note:///dev?seed=default` | 고정 id·서울 근방 좌표로 place 5 + 노트 11 시딩 | `src/features/dev/seed-fixtures.ts` |
| `sip-note:///dev?theme=light` / `dark` | nativewind `setColorScheme` 전역 오버라이드 (강제-다크 위로) | `src/app/dev.tsx` |
| `sip-note:///map?present=<placeId>` | 지도 요약 시트 자동 present (마커 좌표 탭 회피) | `src/app/(tabs)/map.tsx` (`__DEV__`) |
| `sip-note:///place/<id>` | 장소 상세 직행 (실 스택 라우트) | — |

helper 는 subflow 전용 — 호출 flow 가 먼저 `launchApp` 후 `runFlow` 로 부른다.

```yaml
- runFlow: helpers/seed-tasting-fixtures.yaml
- runFlow:
    file: helpers/set-theme.yaml
    env:
      MODE: light   # 또는 dark
```

> 고정 place id: `e2e-bar`(노트 3) · `e2e-distillery`(빈) · `e2e-winery`(노트 6) ·
> `e2e-brewery`(노트 1) · `e2e-wish`(위시리스트). 멱등 — 시딩 시 기존 `e2e-*` 제거 후 재삽입.

## 사전 조건 (1 회)

### 1. Maestro 설치

```bash
curl -Ls https://get.maestro.mobile.dev | bash
# binary: ~/.maestro/bin/maestro
# PATH 등록 (선택): echo 'export PATH="$HOME/.maestro/bin:$PATH"' >> ~/.zshrc
```

### 2. Android SDK + AVD

이미 갖춰져 있음 (`/Users/jam/Library/Android/sdk` + `Pixel_8` AVD).

### 3. Expo dev client 빌드

sip-note 는 native module 의존도가 높아 **Expo Go 미지원** — dev client 빌드 필수.

```bash
cd apps/sip-note

# 첫 실행만 — android/ 디렉토리 생성 + APK 빌드 + AVD 설치
npx expo prebuild --platform android
npx expo run:android --device Pixel_8
```

소요: 첫 빌드 ≈ 5–15 분. 이후엔 metro 만 띄우면 됨 (`pnpm --filter sip-note start`).

> `android/` 디렉토리는 CNG (Continuous Native Generation) 정책에 따라 *commit 하지 않는다* — `.gitignore` 에 추가 후 prebuild 시마다 재생성. (ADR 추가 시 cross-link)

## 실행

### Smoke 1 개 (반드시 `apps/sip-note` cwd 에서 실행)

```bash
cd apps/sip-note
~/.maestro/bin/maestro test e2e/flows/home-smoke.yaml
```

### 디렉토리 전체

```bash
cd apps/sip-note
~/.maestro/bin/maestro test e2e/flows/
```

### 스크린샷 출력 위치

`takeScreenshot.path: e2e/.maestro-output/<name>` 패턴으로 *cwd 기준 상대* 저장.
**호출 cwd 가 `apps/sip-note` 이어야 함** — 다른 cwd 에서 호출하면 path 가 어긋난다.
Maestro 자체 로그 / json report 는 `~/.maestro/tests/<run-id>/` 에 별도 저장.

## Selector 전략

1. **i18n 한국어 텍스트 직접 매치** — 가장 간단, 재정렬에 강함 (`assertVisible: "기록 추가"`)
2. **`accessibilityLabel`** — 시각 텍스트가 없는 곳 (FAB / 아이콘 버튼)
3. **`testID`** — 동적 컴포넌트 (Card 인스턴스 등) 가 늘어나면 추가. 현재는 미사용
4. 텍스트 + accessibilityLabel 만으로 부족할 때만 testID 도입 — 코드 부담 최소화

## 회귀 / Carry-over 통합

ADR-0011 의 *Phase 마무리 의무 캡처 9 컷* 은 본 e2e 의 별도 flow (예: `flows/checkpoint-phase-N-screenshots.yaml`) 로 자동화. 각 화면별 `takeScreenshot` 단계만 누적하면 9 컷이 자동 생성. 결과는 `checkpoint-phase-N.md` §Re-verification 표에 첨부.

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `Could not find any device` | AVD 부팅 안 됨 → `~/Library/Android/sdk/emulator/emulator -avd Pixel_8 &` |
| `App com.infiniteloopfactory.sipnote not found` | dev client 미설치 → `npx expo run:android` 한 번 실행 |
| `Element not found: ...` | metro 가 stale → `pnpm --filter sip-note start --clear` |
| 한글 텍스트 매치 실패 | i18n 키 변경 / 줄바꿈 / 공백. `maestro studio` 로 hierarchy 확인 |
| 첫 launch timeout | `timeout: 30000` (30s) 도 부족하면 시뮬레이터 cold start. AVD 미리 부팅 |
| **지도 진입 시 앱이 런처로 튕김** | playstore AVD 의 GMS 가 `MapsDynamite` 모듈을 미프로비저닝 (`MapView` native init crash, test-plan §발견 이슈 #3). `adb logcat \| grep MapsCoreDynamite` 로 확인. **해결**: `google_apis`(비-playstore) 이미지 기반 AVD 사용 — 모듈이 GMS 에 번들됨. 아래 §지도 의존 flow 참조 |
| **지도가 빈 화면(흰 화면)으로 뜸** | Maps API 키 부재 — `MapView.<init>` 가 `API key not found` 로 soft-throw(앱은 생존, 지도만 미렌더). `adb logcat \| grep "API key not found"` 로 확인. **해결**: `GOOGLE_MAPS_API_KEY` env 설정 후 prebuild 리빌드. 아래 §지도 의존 flow 참조 |
| `dev?theme` 가 안 먹힘 | 구버전: `_layout.tsx` 강제-다크 effect 재발화로 오버라이드 즉시 환원. ref 가드(최초 1회) 적용본인지 확인 |

## 지도 의존 flow 와 환경 전제

지도 진입(`/map` cold 딥링크 또는 탭 진입)이 정상 렌더되려면 **두 가지 전제**가 모두 충족돼야 한다.
2026-05-30 시점엔 (1)이 (2)를 가려, dynamite crash 만 보였다. (1) 해소 후 (2)가 드러났다(2026-05-31).

**(1) GMS Maps 다이너마이트 모듈 — `google_apis` AVD 사용**

`google_apis_playstore` 이미지는 `MapsDynamite` 모듈을 런타임에 Play 로 내려받는데, 미프로비저닝 시
`MapView` native init 가 `dl-MapsCoreDynamite ... does not exist` 로 앱을 죽인다. **비-playstore
`google_apis` 이미지엔 모듈이 GMS 에 번들**되어 이 crash 가 없다(+ `adb root` 가능).

```bash
SDK=~/Library/Android/sdk
"$SDK/cmdline-tools/latest/bin/sdkmanager" "system-images;android-35;google_apis;arm64-v8a"
# 해상도/skin/좌표 보존을 위해 기존 Pixel_8 을 복제하고 이미지만 google_apis 로 교체하는 것을 권장.
# (절대좌표 point:"810,2273" 등이 1080x2400 에 의존하므로 device 프로파일을 바꾸지 말 것.)
"$SDK/emulator/emulator" -avd Pixel_8_Maps_e2e -no-snapshot-load
```

검증(2026-05-31): `Pixel_8_Maps_e2e`(google_apis) 에서 `MapsDynamite.apk` 로드 확인, 지도 탭 진입 시
런처-튕김 없이 `MainActivity` 생존. dynamite crash 해소됨.

**(2) Maps SDK for Android API 키 — `GOOGLE_MAPS_API_KEY`**

react-native-maps(Android)는 Google provider 전용이라 키가 필수다. 미설정 시 `MapView.<init>` 가
`API key not found` 로 soft-throw → 앱은 살지만 **지도 화면이 빈 화면**으로 렌더된다(FilterBar 등
오버레이 노드도 미마운트). `app.config.ts` 의 `android.config.googleMaps.apiKey` 가 prebuild 시
manifest `<meta-data com.google.android.geo.API_KEY>` 로 주입한다.

```bash
# 1) 키 발급: Google Cloud Console → "Maps SDK for Android" 활성화 → 사용자 인증 정보 → API 키
# 2) apps/sip-note/.env 에 작성 (.env.example 참조, 절대 커밋 금지)
echo 'GOOGLE_MAPS_API_KEY=AIza...' >> apps/sip-note/.env
# 3) manifest 재생성 + 리빌드
cd apps/sip-note && npx expo prebuild -p android --clean && npx expo run:android
```

지도 의존 flow 는 항상 **탭바 point-tap 으로 먼저 워밍**한 뒤 present 딥링크를 쓴다 (cold `/map` 딥링크는
첫 MapView mount 타이밍에 취약; 워밍 후 remount 가 안전).

## 다음 작업 (carry-over)

- **9 컷 cut 1~5 / A6 / A7** — 위 (1)+(2) 충족 시(`google_apis` AVD + `GOOGLE_MAPS_API_KEY`)
  `checkpoint-phase-2-screenshots.yaml`·`map-pins.yaml`·`place-summary-sheet.yaml` 재실행하면 채워짐.
  키 없이는 빈 지도라 PASS 불가
- `flows/photo-attach.yaml` (A5) — 갤러리 + 권한 grant
- `flows/permission-denied.yaml` (B1) / `i18n-locale-switch.yaml` (B2) / `db-fresh-install.yaml` (B4)
