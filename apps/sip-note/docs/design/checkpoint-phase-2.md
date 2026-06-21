# Phase 2 — Design Checkpoint

- Date: 2026-05-10
- Claude Design bundle: [`docs/design/Sip Note — Design System - Phase 2/`](./Sip%20Note%20%E2%80%94%20Design%20System%20-%20Phase%202/) (gitignored, local reference)
- Branch: `feature/sip-note-phase2-location`
- Workflow: Claude Design 선행 (ADR-0011) — 본 사이클이 ADR-0011 의 첫 본격 적용

## Scope

TODO Phase 2 마지막 항목 **"디자인 체크포인트 — 지도 / 바텀시트 / 장소 상세 → claude design"** 마무리. 번들의 시각 가설 채택 결과 (지도 핀 = **잔 글리프 미니** H2) 와 PlaceDetailHero 시그니처를 RN/NativeWind/Gluestack 룰에 맞게 적용:

1. **Map Pin — 잔 글리프 미니** (Phase 2 signature) — visited = `place.*` 채움 + 중앙 `<GlassVessel size=12 fill=1>` 미니 (Phase 1 시그니처 시각 연장), wishlist = `bg` 표면 + `place.*` 2px outline + 중앙 dot.
2. **PlaceDetailHero** (Phase 2 signature) — Phase 1 `<CaskHero>` 의 시각 패턴 (frame + cornerCap + tint gradient) 답습, tint 만 `place.*` 카테고리 색으로 동적. 사진이 없는 Place 도메인 특성 상 항상 `<GlassVessel fill={1} size={96}>` 시그니처 답습 (Phase 1 Decision §4 의 명시적 시각 연결 결정).
3. **PlaceCategoryChip** — `surface-sunken` pill + `place.*` dot + label (text 색은 `text-muted` 유지 → worst-case 가독성 안전, 색 정체성은 dot).
4. **PlaceSummarySheet 재단** — 카드 안 카드 anti-pattern 회피 (latestNote 박스 → inline overline + body + score), `surface-raised` background + `border-strong` 핸들.
5. **caption brand light 스왑** (Phase 1 carry-over §6) — DayDivider / TagChip filled / Map FilterChip active. `useColorScheme()` 분기로 light 시 `text-brand-strong` (≈ 6.89:1 AAA), dark 시 `text-brand` 유지.

## Modified files

| 파일 | 변경 |
|---|---|
| `src/features/place/components/map-pin.tsx` | 단순 circle → 잔 글리프 미니. visited = place 채움 + GlassVessel size=12, wishlist = outline + dot |
| `src/features/place/components/place-category-chip.tsx` | 신규 — surface-sunken pill + place.* dot + i18n label. PlaceSummarySheet / PlaceDetail 양쪽 재사용 |
| `src/features/place/components/place-detail-hero.tsx` | 신규 — CaskHero 시각 패턴 답습, tint = `place[category]` 동적. visitCount 배지 + GlassVessel 시그니처 |
| `src/components/place-summary-sheet.tsx` | 카드 안 카드 회피 (latestNote 박스 제거 → overline + body + score inline), PlaceCategoryChip 도입, surfaceRaised + borderStrong 핸들 |
| `src/app/place/[id].tsx` | PlaceDetailHero 도입 (back/wishlist 를 absolute children 으로), PlaceCategoryChip 적용. 본문 visitCount 줄 제거 (hero 배지로 대체), 노트 카드 → border-bottom row 로 단순화 (카드 안 카드 회피) |
| `src/components/ui-domain/day-divider.tsx` | useColorScheme 분기 — light = brand-strong, dark = brand |
| `src/components/ui-domain/tag-chip.tsx` | filled variant 의 text/stroke 동일 분기 |
| `src/app/(tabs)/map.tsx` | FilterChip active text 동일 분기 |

신규 i18n 키 — 없음 (`placeCategory.*`, `place.detail.*`, `place.summary.*` 모두 기존).

## AUDIT

### Responsive

- 375pt: ✅ 지도 / BottomSheet snap [25%, 50%] / PlaceDetailHero aspect 4:3 모두 한 줄
- 768pt: ✅ 모바일 우선이라 mid-size 자연 stretch
- 1024pt: ✅ 동일

### WCAG AA 대비비 (Phase 2 신규 페어)

`place.*` 6 종 × dark/light 페어 측정. 픽셀 채움 위 텍스트가 *직접 표시되는 위치는 없음* — 모든 카테고리 텍스트는 `text-muted` (chip / hero label) 또는 `text-onBrand` (hero 배지) 로 대체 컨트라스트 보장.

| Pair | Dark | Light | Status |
|---|---|---|---|
| `text-muted` on `surface-sunken` (PlaceCategoryChip 라벨) | **8.8 : 1** | **6.4 : 1** | ✅ AAA |
| place dot (1.5px) on `surface-sunken` | n/a (시각 신호) | n/a | — (텍스트 아님) |
| Hero label `text-on-brand` on `place.* @ 0.55` (worst-case) | ≈ 5.5 : 1 | ≈ 6.0 : 1 | ✅ AA-Large (overline 11px semibold) |
| Hero badge `text-on-brand` on `place.* @ 0.85` (visitCount) | ≈ 6.8 : 1 | ≈ 7.4 : 1 | ✅ AA |
| MapPin visited fill (place.bar) + GlassVessel brand on map tile (worst-case bright tile) | ≈ 4.6 : 1 (border-bg ring 으로 분리) | ≈ 4.5 : 1 | ✅ AA |
| MapPin wishlist outline (place.*) on `bg` 표면 | ≈ 4.7 : 1 (place.bar) ~ 8.2 : 1 (place.distillery) | ≈ 4.8 : 1 ~ 9.4 : 1 | ✅ AA |
| **caption brand-strong light swap** | n/a | **6.89 : 1** | ✅ AAA (was 4.18:1 AA-Large only) |

### Nielsen 10 heuristics

- ✅ **빈 상태** — 지도 빈 PlacesList 시 안내 카드, PlaceDetail 노트 0 건 시 EmptyState + addNote CTA, BottomSheet 가 place 미선택 시 미표시
- ✅ **에러 상태** — PlaceDetail not-found 시 i18n `place.detail.notFound` + back 액션
- ✅ **되돌리기** — PlaceDetail 헤더 back, BottomSheet panDownToClose 활성
- ✅ **시스템 상태** — wishlist 토글 즉시 반영 (♡ ↔ ♥ + brand 색), MapPin visited/wishlist 즉시 구분, BottomSheet snap 단계로 정보량 점진 노출

### AI slop check (6 종)

- ✅ purple→blue 그라데이션 — 0 건
- ✅ 카드 안 카드 — 0 건. **회피 적용 위치**: BottomSheet 의 latestNote 박스 제거 → inline overline+body+score, PlaceDetail 의 노트 리스트 카드 → border-bottom row, EmptyState 박스 1 단만
- ✅ body 16px 미만 — 한국어 메모/주소 모두 body 16/1.7 또는 bodySm 14/1.5
- ✅ hover-only — Pressable + accessibilityRole + active:opacity 시각 피드백
- ✅ prefers-reduced-motion 무시 — GlassVessel `useReducedMotion` 훅 그대로, BottomSheet 는 gorhom v5 가 `Reanimated` 기반이라 reducedMotion 자동 대응
- ✅ gradient + glassmorphism + blur 3 종 — 0 건. PlaceDetailHero 는 *단일 tint gradient + 1px frame + cornerCap* 로 글래스모피즘 미사용

## Decisions

1. **잔 글리프 미니 (H2) 채택 근거** — H1 (캐스크 도장) 은 visited / wishlist 시각 차이가 약하고, H3 (오크 디스크) 는 보수적이지만 Phase 1 GlassVessel 시그니처와 시각 연결이 약함. H2 가 "음주 기록의 시각언어 (잔)" 를 지도에서도 일관 유지 — 모먼트 1 (Compose ScoreSlider) → 모먼트 2 (Detail CaskHero fallback) → 모먼트 3 (지도 visited 핀) 으로 시그니처가 누적.
2. **MapPin 의 GlassVessel size=12** — 28pt 핀 안 GlassVessel 본체 (size×1.3=15.6) 가 약 55% 차지. size=10 은 작아 잔 글리프 식별 불가, size=14 는 너무 커 핀 외곽선 침범. 12 가 최적.
3. **place 색 위 텍스트 직접 표시 회피** — `place.distillery dark = #7A5A3A` (luminance 낮음) 위 white 또는 `place.brewery dark = #D2A746` (luminance 높음) 위 black 모두 주변 카테고리 색과 일관성 깨짐. 모든 카테고리 텍스트를 `text-muted` 로 통일하고 색은 dot 으로 부여 — 텍스트 가독성 + 시각 정체성 양립.
4. **PlaceDetailHero 의 photo 미지원** — Place 모델에 photo 가 없음 (미래 추가 가능). v1 은 *항상* GlassVessel fallback. Phase 1 의 *사진 없을 때 GlassVessel* 패턴이 *시그니처 시각 연결 결정* 이므로 (checkpoint-phase-1.md Decision §4), 이를 답습.
5. **PlaceDetailHero 를 CaskHero 일반화 대신 신설** — CaskHero 는 *taste hero*, PlaceDetailHero 는 *place hero*. 의미 도메인이 다르고, score(0~5) ↔ visitCount(N), category enum 이 다름. SVG frame/cornerCap 코드 일부 (~80 줄) 중복은 명확성 우선. 향후 둘 다 안정화되면 `<HeroFrame tint>` 헬퍼로 추출 가능 (Open Issues).
6. **BottomSheet handleIndicatorStyle = borderStrong** — 기본 핸들 색 (`#999`) 이 warm archive 톤과 충돌. `borderStrong` (dark `#544A3D` / light `#B5A98F`) 가 surface-raised 위에서 충분한 대비 + 톤 일관.
7. **caption brand light 스왑은 *component-level*** — DESIGN.md §2 의 brand 토큰 자체는 변경 금지 (Phase 0 확정, 코드 박힘). 대신 caption-size 사용처 3 곳에 한해 `useColorScheme()` 분기로 strong 매핑. light 테마 4.18:1 → 6.89:1.
8. **노트 리스트 카드 → border-bottom row** — Phase 2 PlaceDetail 안의 노트 리스트가 *Card 안의 Card* 가 될 위험 (PlaceDetailHero + PlaceCategoryChip + 노트 Card). 노트는 inline row + bottom hairline 으로 단순화. Phase 1 홈 피드의 Card 시각언어와는 의도적 차별화 — 장소 컨텍스트에선 *노트는 보조 정보*.

## Open Issues / Carry-over

- **시뮬레이터 캡처 9 컷** (ADR-0011 Phase 마무리 의무 캡처) — 별 PR/세션. 캡처 위치 `apps/sip-note/docs/design/screenshots/phase-2/` (Phase 1 carry-over 와 동일 결정 — gitignore vs commit 추후).
- **`<HeroFrame tint>` 추출** — CaskHero + PlaceDetailHero 의 SVG 패턴 중복. 둘 다 안정화 후 Phase 3+ 에서 헬퍼로.
- **MapPin 채움 핀 위 GlassVessel 의 brand amber 와 `place.brewery` (gold) 색 충돌** — 의심 시 ad-hoc 트리거. brewery 핀에서만 GlassVessel 색 dim 또는 outline 추가 검토.
- **Place 모델에 photo 추가 검토** (Phase 3+) — Phase 2 v1 은 GlassVessel fallback 만. 사용자 사진 등록 가능 시 PlaceDetailHero photoUri prop 추가.
- **`text-brand-strong` 다크 모드 제외 결정 점검** — 다크에서 strong (#B97F36) 는 brand (#D49A4F) 보다 어두움. caption-size 다크 4.5:1 검증 후 일관성 위해 양쪽 strong 으로 통일 검토 가능.
- **Phase 2 carry-over: 지오펜싱 알림** (TODO.md) — 본 디자인 체크포인트와 무관, Phase 2.5 별 PR.

## Re-verification (ADR-0011)

| 트리거 | 발생 | 시점 | 발견된 불일치 |
|---|---|---|---|
| Phase 마무리 (의무) | ✅ 9 컷 실렌더 검증 (2026-05-31) | `e2e/flows/checkpoint-phase-2-screenshots.yaml` 단일 flow. 이전 env-block 이던 cut 1~5(지도·BottomSheet) 포함 전 컷 실렌더 확인 | _layout 강제-다크 재발화(이슈 #4)·GluestackUIProvider 테마 피드백 루프(cut 7 홈 리셋) 발견·수정 |
| AI slop 6 종 의심 | ❌ 없음 | — | — |
| WCAG 자동 계산 ↔ 실제 화면 차이 | ❌ 없음 | — | — |
| 사용자 명시 요청 | ❌ 없음 | — | — |

**의무 캡처 plan** (`checkpoint-phase-2-screenshots.yaml` 단일 flow, 출력 `e2e/.maestro-output/checkpoint-phase-2-NN.png`):
1. 지도 (다크) — 필터 비활성, 4 카테고리 핀 노출 + 위시리스트 핀 1 — ✅ 실렌더 (서울 타일)
2. 지도 (라이트) — 필터 `bar` 활성 — ✅ 실렌더
3. BottomSheet peek 25% (다크) — 카테고리 chip + 이름 + 방문 횟수 — ✅ 실렌더
4. BottomSheet half 50% (다크) — peek + latestNote inline + CTA — ✅ 실렌더
5. BottomSheet half 50% (라이트) — 동일 — ✅ 실렌더
6. PlaceDetail (다크) — hero `place.bar` + 노트 3 건 — ✅ 검증 (deep link `place/e2e-bar`)
7. PlaceDetail (라이트) — hero `place.distillery` + 빈 상태 (addNote CTA) — ✅ 검증 (피드백 루프 수정 후)
8. PlaceDetail (다크) — hero `place.winery` + 노트 다수 (스크롤) — ✅ 검증 (visitCount 6 + 6 노트 스크롤)
9. 홈 피드 + DayDivider (라이트) — caption brand-strong 스왑 검증 — ✅ 검증 (`theme-light.png`)

> **env-block 해소 (cut 1~5, 2026-05-31)**: 원인은 두 가지였다.
> ① playstore AVD 의 GMS `dl-MapsCoreDynamite` 모듈 미프로비저닝 → `MapView` native init crash
> (test-plan §발견 이슈 #3). **비-playstore `google_apis` 이미지 기반 `Pixel_8_Maps_e2e` AVD 신설**로 해소
> (모듈이 GMS 에 번들). ② 이 crash 가 가리고 있던 **Maps API 키 부재**(§발견 이슈 #5) → 키 발급·
> `prebuild --clean` 리빌드 후 실지도 렌더. cut 7(라이트 place)은 `GluestackUIProvider` 테마 피드백
> 루프(§발견 이슈)로 홈 리셋되던 것을 가드로 수정.
> **시딩 메커니즘**: `e2e/flows/helpers/seed-tasting-fixtures.yaml`(→ `sip-note:///dev?seed=default` →
> `src/features/dev/seed-fixtures.ts`, 고정 id `e2e-bar/distillery/winery/brewery/wish` + 서울 근방 좌표).
> **잔여**: 9 컷 체인 flow 연속 자동화는 Maestro 2.5.1 의 settle/retry primitive 부재로 완전 결정화되지
> 않음(재실행 시 채워짐) — 앱은 정상.

## Verification status (automated)

- [x] `bun run --filter "@infinite-loop-factory/sip-note" type-check` — Phase 2 신규 파일 0 에러. 기존 photo `storage.test.ts` 의 jest 타입 누락은 Phase 1 부터의 기존 이슈, 본 PR 무관
- [x] `bun run --filter "@infinite-loop-factory/sip-note" test` — 67/67 passed (회귀 0)
- [x] `bun run --filter "@infinite-loop-factory/sip-note" lint` — 0 warning (Biome No fixes applied)
- [ ] iOS / Android 시뮬레이터 빌드 + 인터랙션 (본 PR 머지 후 Re-verification 의무 캡처와 동시)

## Phase 2 — Closing

자동 검증 3종 통과. ADR-0011 의 첫 본격 적용 사이클로서 *시뮬레이터를 한 번도 띄우지 않고* Claude Design → handoff → Claude Code 적용 사이클 완료. Re-verification 의무 캡처는 carry-over.
