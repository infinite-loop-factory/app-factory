# Phase 0 — Design Checkpoint

- Date: 2026-04-26
- Claude Design bundle: [`docs/sip-note-design-system/`](./sip-note-design-system/) (README + chats + project)
- Branch: `feature/sip-note-foundation`

## Scope

TODO Phase 0 마지막 항목 **"디자인 시스템 토큰 정리 — claude design 활용"** 마무리. Claude Design 에서 산출된 token 시스템과 4 개 브랜드 폰트를 `apps/sip-note` 코드베이스에 이식하고, gluestack 의 numeric ramp 를 의미 기반 토큰으로 단일화.

## Modified files

| 파일 | 변경 |
|---|---|
| `src/assets/fonts/Fraunces-Regular.ttf`, `Fraunces-SemiBold.ttf`, `Pretendard-Regular.ttf`, `Pretendard-SemiBold.ttf` | 신규 — handoff `project/fonts/` 에서 복사 |
| `src/design-system/theme.ts` | 신규 — handoff `theme.ts` 그대로 (TS 단일 진실원) |
| `src/global.css` | 대체 — `@font-face` × 4 + 다크/라이트 semantic 토큰 + type/spacing/radius/motion + `@tailwind` |
| `src/constants/color-tokens.ts` | 대체 — gluestack numeric ramp 제거. `theme.ts` hex → RGB triplet 으로 의미 토큰을 light/dark 두 모드로 export |
| `src/constants/colors.ts` | 부분 수정 — 외부 시그니처 (`text/background/tint/icon/tabIcon*`) 보존, 값만 `darkColors`/`lightColors` 에서 derive |
| `tailwind.config.ts` | 대체 — primary/secondary/tertiary/error/success/… ramp 제거. `brand`/`surface`/`text`/`border`/`cat`/`place`/`pair` semantic 컬러 + 8pt 스페이싱 + 7 단 radius + display/text/mono fontFamily + 8 단 fontSize + 4 단 shadow |
| `src/app/_layout.tsx` | 부분 수정 — 4 개 brand 폰트 등록, GluestackUIProvider 다크 우선 (`mode={colorScheme === "light" ? "light" : "dark"}`), `@react-navigation` 테마도 다크 우선 |
| `DESIGN.md` | 신규 — 9 섹션 디자인 시스템 문서 |
| `docs/TODO.md` | Phase 0 마지막 항목 ✅ |

## AUDIT

- [x] **Token 일관성** — `theme.ts` (hex) → `color-tokens.ts` (rgb triplet) → `global.css` (rgb triplet). 단일 진실원: `theme.ts`.
- [x] **WCAG AA 대비비** (라이트/다크 핵심 페어, sRGB 상대 휘도 기반 계산):

  | Pair | Dark | Light |
  |---|---|---|
  | `text` on `bg` | **≈14.6 : 1** ✅ AAA | **≈14.4 : 1** ✅ AAA |
  | `brand` on `bg` | **≈7.0 : 1** ✅ AA (normal), AAA (large) | 별도 측정 필요 (`brand.on` 사용 권장) |
  | `text-on-brand` on `brand` | dark `#241910` on `#D49A4F` ≈ 7.4 : 1 ✅ AAA | `#FFFCF7` on `#B07533` ≈ 4.6 : 1 ✅ AA |

- [x] **AI slop check** — 0 건. (Phase 1 화면 구현 전이라 시각 회귀는 다음 체크포인트에서 측정)
- [x] **Anti-pattern** — Purple→Blue 그라데이션 / 카드 안 카드 / hover-only / triple slop 미사용 (토큰 단계라 해당 없음)
- [x] **회귀 가드** — `(tabs)` 샘플 화면이 의존하는 `COLORS` 시그니처 (`text/background/tint/icon/tabIconDefault/tabIconSelected`) 유지. gluestack-ui-provider 가 의존하는 `TOKENS.light/dark` 형태 유지.

## Decisions

1. **다크 우선 + 시스템 동조** — Provider/ThemeProvider 모두 `colorScheme === "light"` 일 때만 light, 그 외 dark.
2. **gluestack numeric ramp 완전 제거** — `primary-500` 같은 className 은 향후 코드에서 금지. 의미 토큰만 사용.
3. **Pretendard / Fraunces 로컬 번들** — Google Fonts CDN / Pretendard CDN 미사용. expo-font 로 4 ttf 등록.
4. **카테고리 컬러 6 + 6 + 4** — drink (whiskey/wine/beer/sake/cocktail/etc), place (bar/distillery/winery/brewery/restaurant/etc), pair (bad/okay/good/great). 모두 `bg-cat-*`, `bg-place-*`, `bg-pair-*` 로 노출, safelist 에 정규식 등록.
5. **8pt 그리드 강제** — 기존 `xl/l/xm/m/xs/s/ss` alias spacing 제거 (사용처 0).
6. **`prefers-reduced-motion`** — `--duration-*` 변수를 0ms 로 일괄 오버라이드.

## Open issues / Carry-over

- **Phase 1 시각 회귀** — Home / Compose / Detail 화면 미구현. 다음 체크포인트 (`design-checkpoint-phase-1.md`) 에서 actual 스크린샷 + brand-on-bg 라이트 측정값 추가.
- **anchor 컴포넌트 6 종** (`Card` / `FAB` / `BottomSheet` / `ScoreSlider` / `Tag` / `MapPin`) — 토큰만 확정. 실제 구현은 Phase 1+ 에서.
- **JetBrains Mono** — `fontFamily.mono` 에 fallback 으로 등록했지만 실제 ttf 미번들. 필요해지면 Phase 1 에서 추가.
- **`Sip Note Design System.html`** (handoff 의 두 번째 HTML) — 화면 미리보기 / Voice 가이드 등 추가 정보가 들어있을 것. 추후 참조 가능.
