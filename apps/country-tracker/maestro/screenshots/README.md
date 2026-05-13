# Maestro E2E Screenshots

iPhone 16 Pro (iOS 26.4) 시뮬레이터에서 maestro 플로우 실행 중 캡쳐한 화면입니다.
20개 플로우 모두 PASS 상태에서 핵심 스크린만 추출.

| # | File | 설명 | 검증 flow |
|---|------|------|-----------|
| 1 | `01-home.png` | My Travels 홈 (4개국, 12일, fixture 데이터) | 02, 04, 08, 16, 20 |
| 2 | `02-country-detail.png` | Japan detail (Visit History 2건, 6일) | 07, 17 |
| 3 | `03-settings.png` | Settings 화면 (Preferences/Support 섹션) | 06, 12, 13, 19 |
| 4 | `04-add-visit.png` | Add Visit 폼 (신규 add-visit primitives) | 03, 14 |
| 5 | `05-login.png` | 로그인 화면 (clearState 후) | 01 |

## 재캡쳐 방법

```bash
# 1. Supabase MCP로 fixture 시드 (별도 가이드)
# 2. Metro 기동 + EAS dev build 설치
cd apps/country-tracker
EXPO_PUBLIC_E2E_MODE=true npx expo start --port 8081 &
npx expo run:ios --device "iPhone 16 Pro"

# 3. 인증 시드
maestro test --device <UDID> \
  -e MAESTRO_E2E_SUPABASE_URL=https://xxx.supabase.co \
  -e MAESTRO_E2E_SUPABASE_ANON_KEY=eyJ... \
  -e MAESTRO_E2E_TEST_EMAIL=e2e-bot@maestro.dev \
  -e MAESTRO_E2E_TEST_PASSWORD='********' \
  maestro/setup/00-seed-auth.yaml

# 4. 화면 캡쳐
xcrun simctl io booted screenshot maestro/screenshots/01-home.png
```

자세한 설정은 `../widget-manual-verification.md` 참조.
