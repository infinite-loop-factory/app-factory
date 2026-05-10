# Sip Note — Design Context

> 디자인 작업의 단일 진입점(SSOT). Claude Design / Claude Code 양쪽에서 첨부·참조.
> 변경 이력: `git log apps/sip-note/docs/design/context.md` 로 추적.

---

## Project

- **App**: Sip Note (한 잔의 기록)
- **Scope**: 위스키 / 와인 / 맥주 / 사케 / 칵테일 / 기타 — 통합 음주 아카이브
- **Source PRD**: [`docs/prd-drink-diary.md`](../prd-drink-diary.md)
- **Build roadmap**: [`docs/TODO.md`](../TODO.md)
- **Design workflow**: [`docs/design/workflow.md`](./workflow.md)

## Stack

- React Native 0.81 / React 19.1 / Expo SDK 54 (New Architecture)
- TypeScript 5
- **Styling**: Gluestack UI v3 + NativeWind v4 + Tailwind (`tailwind.config.ts`)
- **Routing**: Expo Router (file-based)
- **Local-only data**: expo-sqlite + expo-file-system (no cloud backend)

## Languages & Typography

- **Supported languages**: `ko` (primary) + `en`
- **CJK requirement**: yes — Korean memo / tags / place names
- **Bundled fonts** (`src/assets/fonts/`, expo-font 로 `_layout.tsx` 등록):
  1. **Pretendard** Regular / SemiBold — 본문·UI 한국어 (CJK-ready, SIL OFL 1.1)
  2. **Fraunces** Regular / SemiBold — display·h1 영문 한정
- **Fallback**: Apple SD Gothic Neo → Noto Sans CJK KR → `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Body min size: **16px** on mobile, line-height **1.7** for Korean memo readability

## Audience

- Primary: 주류를 즐기며 자신의 경험을 체계적으로 기록하고 싶은 20–40대
- Secondary: 바·증류소·와이너리 탐방을 좋아하는 사용자 / 음식 페어링에 관심 있는 사용자
- Segment: B2C, mobile-first, iOS + Android 동시 지원

## Brand Tone

- Keywords: **warm, archive, intimate, slow**
- Avoid: cold corporate / hyped marketing / cute mascot
- 이유: PRD 1.1 — "나만의 음주 아카이브" — 자랑보다 회고에 가까운 기록 도구

## Aesthetic Direction (confirmed — Phase 0)

**A. Cellar Premium (다크 우선)** — 위스키 캐스크 / 와인 셀러 모티프, 어두운 우드 톤 + 앰버 액센트.
라이트는 시스템 설정 동조로만 제공. 카테고리 컬러 6 종은 동일 시맨틱 이름으로 라이트/다크 페어 매핑.

> 결정 근거: `docs/design/checkpoint-phase-0.md` Decisions §1·§2.
> 토큰 SSOT: `src/design-system/theme.ts` · 문서: `DESIGN.md`.

## Reference Sites

- [vivino.com](https://vivino.com) — 와인 리뷰 카드 hierarchy
- [distiller.com](https://distiller.com) — 위스키 노트 / 점수 / 페어링 패턴
- [untappd.com](https://untappd.com) — 체크인 피드 / 위치 + 사진 결합
- [apple.com/journal](https://www.apple.com/newsroom/2023/12/apple-launches-journal-app-a-new-app-for-reflecting-on-everyday-moments/) — Apple Journal 의 차분한 archive 무드
- 카테고리 컬러 영감: 주류 자체의 색 (위스키 amber, 와인 burgundy, 맥주 gold, 사케 bone, 칵테일 coral, etc neutral)

## Accessibility

- **WCAG AA** minimum
  - 본문 텍스트 대비비 4.5:1 이상
  - 큰 텍스트 / 인터랙티브 요소 3:1 이상
- 모든 인터랙티브 요소에 visible focus state
- `prefers-reduced-motion` 대응 — 햅틱(`expo-haptics`) + 모션 결합 시 motion 만 축소
- 터치 타겟 최소 44×44pt (iOS HIG / Material 3 기준)

## Categories (Domain Tokens)

`tasting_notes.category` enum 과 1:1 대응. 시맨틱 이름은 디자인-도메인 공용:

| Domain key | Display (ko) | Hue 영감 |
|---|---|---|
| `whisky` | 위스키 | Amber / oak |
| `wine` | 와인 | Burgundy / oxblood |
| `beer` | 맥주 | Honey gold |
| `sake` | 사케 | Rice bone |
| `cocktail` | 칵테일 | Coral / citrus |
| `etc` | 기타 | Neutral graphite |

각 컬러는 **light scale (50–500)** + **dark scale (500–950)** 페어로 정의하고, 핀/칩/차트에서 동일 토큰을 재사용한다.

## Component Anchors

이미 `src/components/ui/` 에 Gluestack UI v3 가 깔려 있으므로, 도메인 컴포넌트는 다음 우선순위로 작성:

1. Gluestack 기본 컴포넌트 직접 사용 (`Box`, `Text`, `Pressable`, `Input`, …)
2. `tva` 로 variant 패턴 — `Card`, `MapPin`, `CategoryChip` 등
3. 신규 native module 의존 컴포넌트만 별도 파일 — `BottomSheet`, `ScoreSlider`

## Anti-Pattern Watchlist (sip-note 특화)

- ❌ Purple → Blue 그라데이션 배경 (위스키 / 와인 톤과 충돌, AI slop 시그널)
- ❌ 카드 안의 카드 중첩 (테이스팅 노트 카드 안에 페어링 카드 직접 배치 금지)
- ❌ body 16px 미만 (한국어 메모 가독성)
- ❌ hover-only 인터랙션 (모바일 + 키보드 대안 필수)
- ❌ Gradient + Glassmorphism + Blur 3 종 결합 (triple slop)
- ❌ 시스템 폰트 fallback 없는 Pretendard 단독 (graceful degrade 필수)

## Resolved (Phase 0)

1. **기본 모드**: 다크 우선, 시스템 설정이 light 일 때만 라이트로 전환 (`_layout.tsx`).
2. **카테고리 컬러**: 실제 술 색에 가까운 hue 영감을 유지하되 채도를 한 단계 낮춰 archive 톤으로 통일 (`cat.*` 토큰).
3. **FAB 컬러**: 단일 `brand` (앰버). 카테고리 컨텍스트 컬러는 칩·핀에서만 사용.
4. **폰트**: Pretendard / Fraunces 4 종 ttf 를 `src/assets/fonts/` 에 로컬 번들, expo-font 등록. 시스템 fallback 은 graceful degrade 용.

## License & Attribution

- Pretendard Variable: SIL Open Font License 1.1 (사용 시 attribution 필요)
- 다른 외부 디자인 자산은 v1 범위 내 미사용
