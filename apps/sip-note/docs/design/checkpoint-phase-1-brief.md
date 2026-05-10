# Phase 1 — Design Checkpoint Brief (Claude Design 첨부용)

> 사용법: `claude.ai/design` 에서 `apps/sip-note/` 코드베이스를 connect 한 뒤
> 아래 3 개 파일을 함께 첨부하고, 맨 아래 **Prompt** 블록을 그대로 붙여넣는다.
>
> 1. [`apps/sip-note/docs/design/context.md`](./context.md) — 톤·안티패턴·카테고리
> 2. [`apps/sip-note/DESIGN.md`](../../DESIGN.md) — Phase 0 산출 토큰
> 3. [`apps/sip-note/docs/design/checkpoint-phase-0.md`](./checkpoint-phase-0.md) — 직전 결정 / open issues
> 4. (선택) 시뮬레이터 스크린샷 — iOS 375pt + Android 360dp, 다크/라이트 페어

---

## 작업 범위

Phase 1 핵심 루프 3 화면의 **시각 회귀 + 토큰 정합성 검증** 후 handoff bundle 수령.

| 화면 | 라우트 | 핵심 컴포넌트 |
|---|---|---|
| 홈 (테이스팅 피드) | `src/app/(tabs)/index.tsx` | `Card` · `FAB` · `DayDivider` · `EmptyState` · `CategoryGlyph` · 검색바 + 카테고리 칩 |
| 기록 작성 (풀스크린 모달) | `src/app/note/compose.tsx` (+ `src/features/tasting/components/compose-form.tsx`) | 사진 슬롯 · 카테고리 칩 · 이름 input · `ScoreStars` (0.5 단위) · `TagChip` · 메모 textarea · 가격 · 날짜 picker |
| 기록 상세 | `src/app/note/[id].tsx` | hero 사진 · score 블록 · meta grid · 수정 / 삭제 액션 |

## 캡처해야 할 상태 (스크린샷 첨부 시)

- [ ] 홈 — 빈 상태 / 1~3 건 / 10+ 건 (DayDivider 노출) / 검색 + 카테고리 필터 활성
- [ ] 작성 — 신규 진입 / 카테고리 선택 / 사진 1~3 장 / 권한 거부 / 점수 슬라이더 활성
- [ ] 상세 — 사진 1 장 / 사진 다중 / 메모 길이 long / 삭제 확인 모달
- [ ] 라이트·다크 페어로 모두 캡처

## 통과 기준 (체크포인트)

`workflow.md` §6 AUDIT 그대로:

1. **Responsive** — 375 / 768 / 1024 px
2. **WCAG AA** — 본문 4.5:1, 인터랙티브 3:1 이상. `text` / `text.muted` / `brand.on` 핵심 페어 측정값 기록
3. **Nielsen 10** — 빈 상태 / 에러 / 되돌리기 / 시스템 상태 가시성
4. **AI slop check** — 6 종 0 건
   - purple→blue 그라데이션
   - 카드 안 카드 (페어링 카드 안에 테이스팅 카드 직접 배치 금지 — Phase 1 에서는 미해당이지만 베이스라인 점검)
   - body 16px 미만 (한국어 메모 가독성)
   - hover-only 인터랙션
   - prefers-reduced-motion 무시
   - gradient + glassmorphism + blur 3 종 결합

## 절대 룰 (handoff bundle 룰)

`workflow.md` §5 그대로 — Claude Design 출력이 아래를 위반하면 Claude Code 가 변환 후 적용한다.

1. 시맨틱 토큰만 (`text-error` ✅ / `text-red-500` ❌ / `bg-primary-500` ❌)
2. 8pt 그리드 (`p-4` ✅ / `p-[13px]` ❌)
3. Gluestack 우선 (`Box` / `Text` / `Pressable` ✅ / RN primitive ❌)
4. 다크 우선 + `dark:` prefix
5. 카테고리 컬러는 `colors.cat.*` / `colors.place.*` / `colors.pair.*` 네임스페이스만
6. 인라인 style 은 safe-area inset / animated value / Platform.select 한정

## 기존 토큰 (변경 없이 재사용)

`DESIGN.md` §2~7 참조. 핵심 요약:

- **Brand**: `#D49A4F` (dark) / `#B07533` (light) — FAB / 강조 / score 활성
- **Surface 4 단**: `surface.sunken` (입력) / `surface` (카드) / `surface.raised` (모달·시트) / `bg` (앱 배경)
- **Typography**: display·h1 = Fraunces, 본문·UI = Pretendard, body 16/1.7
- **Spacing**: 8pt grid (`1=4 / 2=8 / 4=16 / 6=24 / 8=32 …`)
- **Radius**: `xs=4 / sm=8 / md=12 / lg=16 / xl=20 / 2xl=28 / pill`
- **Motion**: `fast=120 / base=220 / slow=360`, `prefers-reduced-motion` → 0ms

## 추가하고 싶은 anchor 변형 (Phase 1 누적)

TODO.md "Anchor 컴포넌트 누적 표" Phase 1 항목.

- `Card` 변형 — `default` (피드) / `hero` (상세 상단) / `compact` (검색 결과 후보)
- `ScoreStars` 인터랙션 — 슬라이더 모드 (작성) / 표시 모드 (피드·상세)
- 사진 슬롯 — 1 장 / 다중 / 빈 상태 + 권한 거부 카피 슬롯
- Compose 폼의 카테고리 칩 — Phase 0 `CategoryGlyph` 위에 active / inactive 상태 정밀화

## Open Issues 이월 (Phase 0 → 1)

`checkpoint-phase-0.md` "Open issues / Carry-over" 중 Phase 1 에 해당:

- **Phase 1 시각 회귀** ← 이번 체크포인트의 본 작업
- **Brand on Light bg 측정값** — 라이트 테마 brand 컬러 대비비 실측 추가
- **anchor 컴포넌트 6 종** 중 `Card` / `FAB` / `ScoreSlider` / `Tag` 의 Phase 1 적용판 확정

---

## Prompt (Claude Design 대화방에 붙여넣기)

```
연결된 apps/sip-note 코드베이스와 첨부한 docs/design/context.md, DESIGN.md,
checkpoint-phase-0.md, 그리고 시뮬레이터 스크린샷을 기반으로 Phase 1 화면을
다듬어주세요.

대상 화면 (모두 라이트/다크 페어, 375 / 768 / 1024 px):

1. 홈 (테이스팅 피드) — src/app/(tabs)/index.tsx
   - Phase 0 Card / FAB / DayDivider / EmptyState 라이브러리 기반
   - 검색바 + 카테고리 칩(6 종) + 일자 그룹 + 카드 피드 + 우하단 FAB
   - 빈 상태 / 로딩 / 에러 / 검색 결과 0 건 변형

2. 기록 작성 (풀스크린 모달) — src/app/note/compose.tsx
   - 사진 슬롯 (0~다중, 권한 거부 슬롯 포함)
   - 카테고리 칩 (active/inactive) + 이름 + ScoreStars 0.5 단위 슬라이더
   - 태그 chip + 메모 (한국어 line-height 1.7) + 가격 + 날짜
   - 저장 / 취소 액션, 키보드 회피

3. 기록 상세 — src/app/note/[id].tsx
   - 사진 hero (1 장 / 다중) + score 블록 + 메타 그리드(카테고리·태그·가격·날짜·장소 placeholder)
   - 수정 / 삭제 액션, 삭제 확인 모달 (destructive 는 error 토큰)

제약:
- DESIGN.md 의 시맨틱 토큰만 사용 — gluestack numeric ramp 금지
- 8pt 그리드, body 최소 16px, 한국어 line-height 1.7 보장
- 다크 우선 + 라이트 시스템 동조
- prefers-reduced-motion 시 모든 motion 0ms
- 안티패턴 6 종 0 건 (docs/design/context.md 참조)

산출:
- 인터랙티브 프로토타입 (3 화면 + 상태 변형)
- 라이트/다크 brand-on-bg 대비비 측정값
- 토큰 패치가 필요하면 DESIGN.md 9 섹션 형식으로 제안 (가능하면 없음)
- "Handoff to Claude Code" bundle — Card / FAB / ScoreStars / Tag chip / 사진 슬롯의
  Phase 1 변형 코드 + 화면 적용 diff 포함
```

---

## Handoff 수신 후 Claude Code 에 보낼 적용 프롬프트 (참고)

```
Claude Design Phase 1 handoff 가 도착했습니다.

[bundle URL 또는 압축 해제 경로]

- 적용 대상: src/app/(tabs)/index.tsx, src/app/note/compose.tsx,
  src/app/note/[id].tsx, src/components/ui-domain/* (필요 시 변형 추가),
  src/features/tasting/components/compose-form.tsx
- workflow.md §5 의 7 개 룰 통과 후 적용 (위반 시 Claude Code 가 변환)
- 적용 후 checkpoint-phase-1.md 작성 — 스크린샷·AUDIT·Decisions·Open Issues 4 섹션
- 커밋 메시지: docs(sip-note): 📚 design checkpoint phase 1
- 변경 파일을 diff 요약으로 보고
```
