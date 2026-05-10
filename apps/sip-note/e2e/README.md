# sip-note — E2E (Maestro)

> Mobile UI E2E with [Maestro](https://github.com/mobile-dev-inc/Maestro). Expo dev client + Android emulator 한정. ADR-0011 의 *Phase 마무리 의무 캡처 + ad-hoc 트리거* 자동화 도구로도 사용.

## 디렉토리

```
e2e/
├── README.md           — 이 문서
├── flows/
│   └── home-smoke.yaml — 첫 smoke (앱 launch + 홈 + FAB 노출)
└── (helpers/)          — 추후 db seed 등
```

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

### Smoke 1 개

```bash
~/.maestro/bin/maestro test apps/sip-note/e2e/flows/home-smoke.yaml
```

### 디렉토리 전체

```bash
~/.maestro/bin/maestro test apps/sip-note/e2e/flows/
```

### 스크린샷 출력

기본: `~/.maestro/tests/<run-id>/<screenshot-name>.png`. 원하는 위치로 출력하려면:

```bash
~/.maestro/bin/maestro test --output e2e/.maestro-output/run-$(date +%Y%m%d-%H%M%S) \
  apps/sip-note/e2e/flows/home-smoke.yaml
```

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

## 다음 작업 (carry-over)

- `flows/compose-tasting.yaml` — Phase 1 작성 골든 패스
- `flows/map-and-place.yaml` — Phase 2 지도 → 핀 → BottomSheet → PlaceDetail
- `flows/checkpoint-phase-2-screenshots.yaml` — 9 컷 자동화 (지도 dark/light, BottomSheet peek/half, PlaceDetail 3 종, 홈 라이트 brand-strong)
- `helpers/seed-tasting-fixtures.yaml` — DB seed (compose flow 후 후속 flow 가 데이터 가정)
