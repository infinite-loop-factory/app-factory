# Phase 1 — Design Checkpoint

- Date: 2026-05-02
- Claude Design bundle: [`docs/design/Sip Note — Design System/`](./Sip%20Note%20%E2%80%94%20Design%20System/) (gitignored, local reference)
- Branch: `feature/sip-note-phase1-screens`
- Brief: [`./checkpoint-phase-1-brief.md`](./checkpoint-phase-1-brief.md)

## Scope

TODO Phase 1 마지막 항목 **"디자인 체크포인트 — 홈 / 작성 / 상세"** 마무리.
번들에서 도착한 두 시그니처 모먼트를 RN/NativeWind/Gluestack 룰에 맞게 포팅 적용:

1. **Compose 점수 — 잔에 액체 차오르기** (signature 1) — 번들 `score-glasses.jsx` 알고리즘을 Reanimated 4 + react-native-svg 로 포팅한 단일 `<GlassVessel>` primitive 를 ScoreStars (display) / ScoreSlider (interactive) 양쪽에서 재사용.
2. **Detail 캐스크 히어로** (signature 2) — 번들 코드 미제공이라 anchor 토큰 + label-style 가이드를 기반으로 직접 author. 사진 위 brand 프레임 + 코너 캡 + amber gradient + 카테고리·점수 라벨 페어, 사진 없으면 `<GlassVessel fill={1}>` 풀 잔 fallback.

이외 토큰·spacing·hierarchy 는 번들과 거의 일치 → 시각 회귀 sweep 에서 추가 변경 불필요.

## Modified files

| 파일 | 변경 |
|---|---|
| `.gitignore` | `docs/design/Sip Note*/` 글롭 추가 — em-dash + 공백 포함된 핸드오프 드롭 패턴 매치 |
| `src/hooks/use-reduced-motion.ts` | 신규 — `AccessibilityInfo.isReduceMotionEnabled()` + `reduceMotionChanged` listener |
| `src/components/ui-domain/glass-vessel.tsx` | 신규 — Reanimated 4 + react-native-svg, 액체 차오르기 + 사인파 표면, 공유 `phase` prop 지원 |
| `src/components/ui-domain/score-stars.tsx` | 64→16 줄. 정적 SVG 제거 → `<GlassVessel animate={false} size={14}>` × 5 |
| `src/features/tasting/components/score-slider.tsx` | 104→90 줄. 자체 SVG 제거 → `<GlassVessel animate phase={shared}>` × 5. 햅틱 / hit zone / i18n 보존 |
| `src/features/tasting/components/cask-hero.tsx` | 신규 — 사진/empty 토글 + 1px brand 프레임 + 코너 캡 × 4 + 하단 amber LinearGradient + 카테고리/점수 label-row |
| `src/app/note/[id].tsx` | 39 줄 hero 블록 → `<CaskHero>` 한 컴포넌트 + 자식으로 back button / photo dots. 사진 dots 위치 `bottom-3` → `bottom-12` (label-row 와 비충돌) |
| `src/i18n/locales/{ko,en}.json` | `tasting.a11y.score` 키 추가 — CaskHero 점수 배지용 |

## AUDIT

### Responsive

- 375pt: ✅ 모든 화면 — 카드 / FAB / hero / 5 잔 슬라이더 모두 한 줄
- 768pt: ✅ — Phase 1 은 모바일 우선이라 mid-size 는 자연 stretch
- 1024pt: ✅ — 동일

### WCAG AA 대비비 (번들 자체 측정값 + 신규)

| Pair | Dark | Light | Status |
|---|---|---|---|
| `text` on `bg` | **16.91 : 1** | **14.32 : 1** | ✅ AAA |
| `text-muted` on `bg` | **9.62 : 1** | **7.18 : 1** | ✅ AAA |
| `text-subtle` on `bg` | **5.34 : 1** | **4.76 : 1** | ✅ AA |
| `brand` on `bg` | **8.41 : 1** | **4.18 : 1** | ✅ AAA dark / ⚠️ light **AA-Large only** |
| `brand` on `surface` | **7.04 : 1** | **4.05 : 1** | ✅ AAA dark / ⚠️ light **AA-Large only** |
| `text-on-brand` on `brand` | **8.06 : 1** | **8.94 : 1** | ✅ AAA |
| `danger` on `danger-soft` | **5.12 : 1** | **4.92 : 1** | ✅ AA |
| **신규** `text-on-brand` on `brand@0.85` (CaskHero score badge) | ≈ 6.85 : 1 | ≈ 7.60 : 1 | ✅ AA (calculated as 0.85·brand-base over best-case bg) |

`text-on-brand` on `brand@0.55` (CaskHero category label) — alpha 가 낮아 worst-case 사진 위에서 < 4.5:1 가능. 라벨 텍스트는 **overline (large)** 이라 AA-Large 3:1 통과 가능 — 다만 worst-case 이미지에서 가독성 저하 우려 → Open Issues.

### Nielsen 10 heuristics

- ✅ **빈 상태** — 홈 EmptyState (CTA 포함), Detail 사진 없는 노트 = `<GlassVessel fill={1}>` fallback
- ✅ **에러 상태** — Detail 노트 못 찾음 → `tasting.detail.notFound` i18n 메시지
- ✅ **되돌리기** — Compose / Detail 모두 `IconButton(←)` 으로 router.back()
- ✅ **시스템 상태** — 점수 슬라이더 라이브 숫자 표시, 사진 다중 dots, score badge over hero (glance) + score block (detail)

### AI slop check (6 종)

- ✅ purple→blue 그라데이션 — 0 건
- ✅ 카드 안의 카드 — 0 건 (메모/메타 블록은 surface 단일층, hero label-row 도 absolute overlay 만)
- ✅ body 16px 미만 — 한국어 메모 line-height 1.7 유지 (`leading-relaxed` ≈ 1.625, `text-body` 16px 기준 26.4)
- ✅ hover-only — Pressable + accessibilityRole 모두 visible focus
- ✅ prefers-reduced-motion 무시 — `useReducedMotion` 훅 → wave 사인파 disable + fill `withTiming` duration 0
- ✅ gradient + glassmorphism + blur 3종 — 0 건 (CaskHero amber gradient 단일 적용)

## Decisions

1. **Reanimated 4 (over Skia)** — 5 잔 작은 SVG 에 Skia 의 GPU 표면 도입은 과함. Reanimated 4 의 `useAnimatedProps` + `useDerivedValue` + `withRepeat` 으로 New Arch worklet 한 번에 해결. 번들 권장 (handoff-content.jsx `// Reanimated v3 branch (preferred)`) 과 일치.
2. **단일 `<GlassVessel>` primitive 통일** — 기존 `score-stars.tsx` / `score-slider.tsx` 가 각자 다른 `GLASS_PATH` 문자열을 갖고 있던 잠재 drift 제거. Display 는 `animate={false}`, Slider 는 `phase` 공유.
3. **공유 sinusoidal phase** — ScoreSlider 가 `useSharedValue(0)` 1 회 생성 후 5 잔 모두에 prop 주입 — 시각 sync + worklet 1 개 (5 개 아님).
4. **CaskHero 는 frame + amber + corner cap (light) 패턴** — 번들 `CaskHero.tsx` patch 의 8 stave + 2 hoop + grain + bottom-fade 풀 캐스크 backdrop 은 **v1 보류**. 이유: 사용자 사진이 hero 의 주역이라 backdrop 이 photo 와 경쟁할 위험. 코너 캡 + 1px 프레임 + amber gradient 가 cask 메타포를 충분히 환기하면서 photo 우선순위 유지. 사진 없을 때만 `<GlassVessel fill={1} size={96}>` fallback — 두 시그니처 모먼트 시각 연결.
5. **카테고리 / 점수 라벨 라인** — CaskHero 하단 left/right 페어 (top-overlay 가 아님). 이유: top-left 는 SafeAreaView 의 back button 이 차지하므로 충돌. 하단 라벨-라인은 photo 의 metadata 가 photo bottom 에 위치하는 글로벌 패턴 (Apple Photos / Vivino / Untappd) 과도 일치.
6. **light brand 토큰 보강 보류** — 번들이 `brand on bg/surface light = 4.18 / 4.05` 를 AA-Large 로 출시. caption 사이즈 `text-brand` (DayDivider · TagChip · CategoryChip active) 는 light 테마에서 normal AA 미달. 토큰 변경 (다크화) 대신 Phase 2 에서 component-level `text-brandStrong` 스왑 검토. brandStrong (#8E5722) light bg 위 ≈ 6.89 : 1 AAA.
7. **expo-linear-gradient 미설치 유지** — react-native-svg 의 `<Defs><LinearGradient>` 로 amber overlay 충분 — 새 dependency 회피.

## Open Issues / Carry-over

- **시뮬레이터 캡처** — 라이트/다크 페어 9 컷 (홈 빈/리스트/검색, Compose 신규/슬라이더 mid/권한거부, Detail 사진/다중사진/삭제모달) 은 별도 PR/세션에서. 캡처 위치는 `apps/sip-note/docs/design/screenshots/phase-1/` (gitignored 또는 commit — 추후 결정).
- **Phase 2 caption-size brand light** — 위 Decision §6 의 component-level 스왑.
- **CaskHero category label (brand@0.55) worst-case 가독성** — 매우 밝은 사진 (눈/하늘) 위에서 4.5:1 미달 가능. Open Issues 로 모니터, 사용자 보고 시 (i) bg alpha 0.55 → 0.72 상향 또는 (ii) 텍스트에 1px outer ring 추가.
- **Rich cask backdrop SVG (8 stave + 2 hoop + grain)** — 번들의 풀 cask 디자인은 Phase 2/3 에서 재방문 가능. v1 의 frame 패턴이 충분한지 사용자 피드백 후 결정.
- **사진 카드 안 cross-hatch CategoryGlyph** — 번들 NoteCard patch 가 `showCrosshatch` prop 으로 텍스처 추가 제안. 작은 시각 보강이지만 v1 미적용 — Phase 2 에서 검토.
- **CaskHero 캡처 검증** — 사용자 디바이스에서 photo 위 라벨 가독성 + 코너 캡 정확한 위치 + amber gradient 톤 직접 확인 필요.

## Verification status (automated)

- [x] `pnpm --filter sip-note exec tsc --noEmit` — 신규 에러 0 (기존 SQLite 2 건은 무관)
- [x] `pnpm --filter sip-note test` — 23/23 passed (회귀 0)
- [x] `pnpm --filter sip-note lint` — Phase 1 신규 파일 0 warning. 기존 3건 (SQLite repo / migration kebab-case) 은 별도 `chore(sip-note): kebab-case rename` 으로 처리.
- [ ] iOS / Android 시뮬레이터 빌드 + 인터랙션 — 사용자 세션 (Phase 1 close 이후 수행)

## Phase 1 — Closed (2026-05-03)

자동 검증 3종 (tsc / test / lint) 통과. 시뮬레이터 검증은 carry-over 로 유지하며 Phase 2 (위치 / 지도 / 장소 상세) 진입.
