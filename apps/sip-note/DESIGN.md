# Sip Note — Design System

> Phase 0 산출물. 모든 토큰 / 폰트 / 컴포넌트 anchor 의 단일 진입점.
> Source of truth: [`src/design-system/theme.ts`](./src/design-system/theme.ts) (TS) · [`src/global.css`](./src/global.css) (web 변수) · [`src/constants/color-tokens.ts`](./src/constants/color-tokens.ts) (RN 주입).
> 디자인 컨텍스트: [`.design-context.md`](./.design-context.md) · 작업 흐름: [`docs/design-workflow.md`](./docs/design-workflow.md).

---

## 1. Overview

- **무드**: warm archive — 위스키 캐스크의 호박빛, 오크 우드, 양피지 텍스처. 자랑보다 회고에 가까운 톤.
- **테마 정책**: **다크 우선**. 술 앱은 저녁 시간대 사용 비중이 높음. 라이트는 시스템 설정 기반 자동 전환만 지원.
- **타이포 정책**: 본문·UI 한국어는 **Pretendard**, 영문 디스플레이는 **Fraunces**. 한국어 본문은 line-height 1.7 보장.
- **그리드**: 4pt base, 8pt 그리드. 인터랙티브 요소 hit target 최소 44×44pt.
- **접근성**: WCAG AA. `prefers-reduced-motion` 시 모든 motion 0ms.

## 2. Color tokens

의미 기반 토큰명만 사용한다. `primary-500` 같은 numeric ramp 는 사용하지 않는다.

| Token | Dark | Light | 용도 |
|---|---|---|---|
| `brand` | `#D49A4F` | `#B07533` | primary 액션, FAB, 강조 |
| `brand.strong` | `#B97F36` | `#8E5722` | hover / press |
| `brand.soft` | `#4A3621` | `#F4E5D0` | 액센트 배경, 칩 |
| `brand.on` | `#241910` | `#FFFCF7` | brand 위 텍스트 |
| `bg` | `#1F1B16` | `#F8F4EC` | 앱 배경 |
| `surface` | `#28231D` | `#FDFAF3` | 카드 |
| `surface.raised` | `#312B23` | `#FFFFFF` | 모달, 시트 |
| `surface.sunken` | `#191512` | `#F1ECE2` | 입력 필드 |
| `text` / `text.muted` / `text.subtle` / `text.faint` | parchment 4단 | inkwell 4단 | hierarchy |
| `border` / `.strong` / `.subtle` | 3 단 | 3 단 | divider, outline |
| `success` / `warning` / `danger` / `info` | + `.soft` 페어 | + `.soft` 페어 | status |

Tailwind 사용 예: `bg-bg`, `text-text-muted`, `bg-surface-sunken`, `text-brand`.

## 3. Categories

도메인 컬러는 6 종 drink + 6 종 place + 4 단계 pairing match 로 분리. 모두 `bg-cat-*`, `bg-place-*`, `bg-pair-*` 로 노출.

| Drink | hue 영감 | Place | hue 영감 |
|---|---|---|---|
| `cat.whiskey` | amber / oak | `place.bar` | warm amber |
| `cat.wine` | burgundy | `place.distillery` | dark oak |
| `cat.beer` | hop gold | `place.winery` | burgundy |
| `cat.sake` | rice bone | `place.brewery` | hop gold |
| `cat.cocktail` | rosé | `place.restaurant` | sage |
| `cat.etc` | neutral graphite | `place.etc` | neutral |

Pairing 4 단계: `pair.bad` (👎) · `pair.okay` (😐) · `pair.good` (👍) · `pair.great` (🤩). 디자인은 컬러 dot 만 사용 (이모지는 텍스트 라벨 보조용).

## 4. Typography

| Role | size | line-height | weight | family |
|---|---|---|---|---|
| `display` | 34 | 1.18 | 600 | Fraunces |
| `h1` | 26 | 1.18 | 600 | Fraunces |
| `h2` | 20 | 1.32 | 600 | Pretendard |
| `h3` | 17 | 1.32 | 600 | Pretendard |
| `body` | 16 | **1.7** | 400 | Pretendard |
| `bodySm` | 14 | 1.5 | 400 | Pretendard |
| `caption` | 12 | 1.5 | 500 | Pretendard |
| `overline` | 11 | 1.32 (tracking 0.12em) | 600 | Pretendard |

Tailwind: `font-display`, `font-text`, `text-body`. iOS / Android 모두 expo-font 로 4 ttf 로드. graceful fallback: `Pretendard → Apple SD Gothic Neo → Noto Sans KR → system-ui`.

## 5. Spacing & Radius

8pt 그리드. inline 픽셀 (`p-[13px]`) 금지.

| key | px | key | px |
|---|---|---|---|
| `1` | 4 | `8` | 32 |
| `2` | 8 | `10` | 40 |
| `3` | 12 | `12` | 48 |
| `4` | 16 | `16` | 64 |
| `5` | 20 | `20` | 80 |
| `6` | 24 | | |

Radius: `xs=4 / sm=8 / md=12 / lg=16 / xl=20 / 2xl=28 / pill=9999`.

## 6. Elevation

| Token | 용도 |
|---|---|
| `shadow-card-1` | 일반 카드 |
| `shadow-card-2` | hover / 떠 있는 카드 |
| `shadow-card-3` | 모달 / 바텀시트 |
| `shadow-fab` | FAB (brand-strong 톤 글로우) |

다크 / 라이트 모두 `--shadow-*` CSS 변수로 정의되어 있음.

## 7. Motion

| Token | ms | 용도 |
|---|---|---|
| `--duration-fast` | 120 | 마이크로 인터랙션, 칩 탭 |
| `--duration-base` | 220 | 모달 / 시트 |
| `--duration-slow` | 360 | 화면 전환, 큰 reveal |

Easing: `--ease-standard` (기본) / `--ease-emphasized` (진입 강조).
**`prefers-reduced-motion: reduce` 시 모든 duration 0ms 로 즉시 전환** — 햅틱은 그대로 유지.

## 8. Component anchors

Phase 0 에서는 토큰만 확정한다. 실제 컴포넌트 구현은 각 Phase 의 디자인 체크포인트에서 진행.

| Component | Phase | 의존 토큰 |
|---|---|---|
| `Card` (테이스팅 노트) | 1 | surface, border.subtle, radius.lg, shadow-card-1, cat.* |
| `FAB` | 1 | brand, brand.on, shadow-fab, radius.pill |
| `ScoreSlider` (위스키 잔 글리프) | 1 | brand, surface.sunken |
| `Tag` chip | 1 | brand.soft, brand, radius.pill |
| `BottomSheet` | 2 | surface.raised, border.subtle, shadow-card-3 |
| `MapPin` (visited / wishlist) | 2 | cat.* / place.* |

## 9. Anti-pattern watchlist

`.design-context.md` + handoff 결정사항. AUDIT 시 0 건이어야 다음 Phase 진입.

- ❌ Purple → Blue 그라데이션 배경
- ❌ Card 안의 Card 중첩 (페어링 카드 안에 테이스팅 카드 직접 배치 금지)
- ❌ body 16px 미만 (한국어 메모 가독성)
- ❌ hover-only 인터랙션 (모바일·키보드 대안 필수)
- ❌ Gradient + Glassmorphism + Blur 3 종 결합
- ❌ 시스템 폰트 fallback 없는 Pretendard / Fraunces 단독 사용
- ❌ inline px (예: `p-[13px]`) — 8pt 그리드 위반
- ❌ gluestack numeric ramp className (`bg-primary-500`) — 의미 토큰만 허용
