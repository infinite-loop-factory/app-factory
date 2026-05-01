# Sip Note — Claude Design × Claude Code 작업 가이드

> 참조: [`prd-drink-diary.md`](../prd-drink-diary.md), [`TODO.md`](../TODO.md), [`../../.design-context.md`](../../.design-context.md)
> Claude Design 소개: <https://www.anthropic.com/news/claude-design-anthropic-labs>
> 작업 도구: <https://claude.ai/design>

이 문서는 **Claude Design (web) 에서 시각 작업** 을 하고, **Claude Code (이 CLI) 가 handoff 를 받아 코드에 적용** 하는 흐름을 sip-note 프로젝트에 맞게 정리한 가이드다. TODO.md 의 각 Phase 끝에 등장하는 "디자인 체크포인트 — claude design" 항목은 모두 이 문서를 따른다.

---

## 0. 두 도구의 분업

| | Claude Design (claude.ai/design) | Claude Code (이 CLI) |
|---|---|---|
| 위치 | 웹 (Pro / Max / Team / Enterprise 구독) | 로컬 터미널 |
| 모델 | Opus 4.7 vision | Opus 4.7 |
| 입력 | 텍스트 / 이미지 / DOCX·PPTX·XLSX / 코드베이스 / 웹 요소 캡처 | 로컬 파일 + 사용자 프롬프트 |
| 산출물 | 프로토타입, 목업, 와이어프레임, 디자인 시스템 (자동 추출), 코드형 프로토타입 | 코드 변경, 파일 생성/수정 |
| Export | 내부 URL / 폴더 / Canva / PDF / PPTX / 단독 HTML | git diff |
| **연결점** | "Handoff to Claude Code" 한 번의 명령으로 bundle 전달 | bundle 수신 후 실제 코드 적용 |

핵심: **시각 작업은 Claude Design 에서**, **코드 적용은 Claude Code 에서**. 두 도구는 *handoff bundle* 로 이어진다.

---

## 1. 사전 준비 (1 회)

### 1.1 구독 확인

Claude Design 은 Pro / Max / Team / Enterprise 구독에서 사용 가능. 본 가이드는 **로그인된 claude.ai 세션** 을 전제로 한다.

### 1.2 Claude Design 에 줄 컨텍스트 파일

Claude Design 은 코드베이스를 읽어 디자인 시스템을 자동 추출하지만, 도메인 / 톤 / 안티패턴은 별도 컨텍스트로 명시해야 정확도가 올라간다. 이미 다음 파일들이 준비되어 있다:

- `apps/sip-note/.design-context.md` — 톤 / 타겟 / CJK / WCAG / 안티패턴 / 카테고리 6 종
- `apps/sip-note/docs/prd-drink-diary.md` — 화면 / 기능 / 데이터
- `apps/sip-note/docs/TODO.md` — 빌드 Phase 별 화면 목록
- `apps/sip-note/tailwind.config.ts`, `apps/sip-note/gluestack-ui.config.json` — 기존 토큰
- `apps/sip-note/src/components/ui/` — Gluestack UI v3 컴포넌트

이 파일들을 한 묶음으로 Claude Design 에 입력하는 가장 안정적인 방법은:

1. **Repo 연결**: Claude Design 의 "Connect codebase" 로 이 모노레포(또는 `apps/sip-note/`) 를 연결
2. **Pin context**: `.design-context.md` 와 `docs/prd-drink-diary.md` 를 대화에 첨부 또는 import
3. **(선택)** PRD 의 화면 목록 섹션을 Markdown 으로 paste 하여 화면별 작업 단위 명시

> ⚠️ 한 번도 import 하지 않은 새 대화방에서는 매번 `.design-context.md` 를 첨부하는 습관을 들이는 게 안전하다.

---

## 2. 전체 흐름 — 한 화면 작업의 lifecycle

```
[Claude Code]                     [Claude Design]                   [Claude Code]
1. 코드 골격 작성        ───▶    2. 화면 디자인 / 시스템 정의
   (TODO Phase N)                    - 입력: 코드 + .design-context.md
                                     - 산출: 목업 + 토큰 + 컴포넌트 변형
                                     - 반복: inline 코멘트 / sliders 로 refine
                                                  │
                                                  ▼
                                  3. "Handoff to Claude Code"
                                     bundle 생성 (URL / 단독 HTML / 토큰 JSON)
                                                  │
                                                  ▼
                                                              4. handoff bundle 수신
                                                                 - 토큰을 tailwind.config.ts 에 반영
                                                                 - 컴포넌트 코드를 src/ 에 적용
                                                                 - checkpoint-phase-N.md 에 기록
                                                              5. AUDIT (Responsive / WCAG / Slop)
                                                              6. 커밋
```

체크포인트 통과 후에만 다음 Phase 로 진행한다.

---

## 3. BOOTSTRAP — Phase 0 진입 전 1 회만

> 산출물: 디자인 시스템(=Claude Design 내부 라이브러리) + 라이트/다크 토큰 + 카테고리 6 종 + 핵심 컴포넌트(`Card`, `BottomSheet`, `FAB`, `ScoreSlider`, `Tag`, `MapPin`)

### STEP B1. Claude Design 에 코드베이스 + 컨텍스트 연결

→ Claude Design 의 **"Connect codebase"** 로 모노레포(또는 `apps/sip-note/`) 연결, `.design-context.md` 첨부.

### STEP B2. Claude Design 에 보낼 첫 프롬프트

> 그대로 복사해서 Claude Design 대화방에 붙여넣는다. (Claude Code 에 보내는 게 아님)

```
연결된 apps/sip-note 코드베이스와 첨부된 .design-context.md, docs/prd-drink-diary.md
를 기반으로 sip-note 의 디자인 시스템을 만들어주세요.

단계:
1. 코드베이스에서 기존 토큰을 자동 추출 (tailwind.config.ts + gluestack-ui.config.json)
2. .design-context.md 의 "Aesthetic Directions A/B/C" 중 추천안 1 개 + 대안 2 개를
   각각 라이트/다크 페어로 제안. 카테고리 6 종 (whisky / wine / beer / sake /
   cocktail / etc) 컬러 토큰 포함.
3. 핵심 공용 컴포넌트 6 종(Card, BottomSheet, FAB, ScoreSlider, Tag chip,
   MapPin) 의 라이브러리 변형 제공 — Gluestack v3 sub-component 패턴 호환.
4. 안티패턴 자체 점검: purple→blue 그라데이션 배경 / 카드 안 카드 / body 16px
   미만 / triple slop (gradient + glassmorphism + blur).
5. 결정 후 export 형태로 다음을 준비해주세요:
   - 라이트/다크 토큰 JSON
   - 컴포넌트 변형 미리보기 URL
   - "Handoff to Claude Code" bundle (tailwind.config.ts extend 패치 + 컴포넌트
     코드 + DESIGN.md 9 섹션 마크다운)
```

### STEP B3. Refine

Claude Design 안에서 inline 코멘트 / spacing·color slider 로 다듬는다. 합의된 안 1 개 + 라이트/다크 페어가 정해지면 STEP B4 으로 간다.

### STEP B4. Handoff to Claude Code

Claude Design 에서 **"Handoff to Claude Code"** 실행 → bundle URL / 폴더 수신.

### STEP B5. Claude Code 에 적용 요청

> 이건 다시 이 CLI 의 Claude Code 에 보내는 프롬프트.

```
Claude Design bootstrap handoff 가 도착했습니다. 다음을 적용해주세요:

[bundle URL 또는 첨부 파일 경로]

- apps/sip-note/DESIGN.md 생성 (handoff 의 9 섹션 마크다운 그대로)
- apps/sip-note/tailwind.config.ts 의 theme.extend 에 토큰 패치 적용
  - 기존 키와 충돌 시 카테고리 6 종은 colors.category.{whisky|wine|beer|sake|
    cocktail|etc}.{light|dark} 네임스페이스로 추가
- apps/sip-note/gluestack-ui.config.json 갱신 필요한 경우 함께 패치
- src/components/ui/ 에 신규 컴포넌트(card, bottom-sheet, fab, score-slider,
  tag, map-pin) 추가 — Gluestack v3 sub-component 패턴, className 기반,
  RN primitive 직수입 금지

적용 후 anti-pattern 셀프 점검 결과를 checkpoint-phase-0.md 로 저장해주세요.
```

---

## 4. Phase 별 체크포인트

각 Phase 의 코드 골격이 끝난 시점에 아래 흐름을 반복한다. 4 개 Phase 모두 동일 패턴.

### 공통 STEP

| # | 도구 | 액션 |
|---|---|---|
| 1 | Claude Design | 화면 set 디자인 (아래 Phase 별 프롬프트 사용) |
| 2 | Claude Design | inline 코멘트 / slider 로 refine |
| 3 | Claude Design | "Handoff to Claude Code" bundle 생성 |
| 4 | Claude Code | bundle 수신 후 적용 (아래 적용 프롬프트 사용) |
| 5 | Claude Code | AUDIT → `checkpoint-phase-N.md` 저장 |
| 6 | Claude Code | 커밋 (`docs(sip-note): design checkpoint phase N`) |

### Phase 1 — 홈 / 기록 작성 / 기록 상세

**Claude Design 에 보낼 프롬프트**

```
sip-note Phase 1 화면을 디자인해주세요. 375px 모바일 우선, 라이트/다크 페어 모두.

1. 홈 (테이스팅 피드)
   - Card (Phase 0 라이브러리) 기반 최신순 타임라인
   - 우하단 FAB, safe area 처리
   - 빈 상태 / 로딩 / 에러 상태 변형
2. 기록 작성 (풀스크린 모달)
   - 사진 슬롯, 카테고리 선택 (카테고리 6 종 컬러 칩),
     이름, 점수 (ScoreSlider 0.5 단위 5 점), 태그 (Tag chip),
     메모 (Korean line-height 1.7-1.8), 가격, 날짜, 위치 자동 태깅 + 수동 변경
   - 권한 거부 상태
3. 기록 상세
   - 사진 슬라이더, 메타, 수정/삭제 액션

각 화면 인터랙티브 프로토타입 + Handoff bundle (코드 변경 diff 포함) 으로 마무리.
```

**Claude Code 에 보낼 적용 프롬프트**

```
Claude Design Phase 1 handoff 가 도착했습니다.

[bundle URL]

- 화면 위치: apps/sip-note/src/app/ 의 적절한 라우트
- gluestack-nativewind 규칙 준수 (시맨틱 토큰 / 8px 스케일 / Box·Text·Pressable)
- 적용 후 checkpoint-phase-1.md 작성 (스크린샷 + 위반 0 건 + 미해결 이슈)
- 변경 파일 목록을 diff 요약으로 보고
```

### Phase 2 — 지도 / 바텀시트 / 장소 상세

**Claude Design 에 보낼 프롬프트**

```
sip-note Phase 2 화면을 디자인해주세요.

1. 지도 탭 — react-native-maps
   - MapPin (Phase 0): visited 채움 / wishlist 빈, 카테고리 6 종 컬러 매핑
   - 카테고리 필터 토글 칩 (바·펍 / 증류소 / 와이너리 / 브루어리 / 레스토랑 / 기타)
2. 장소 요약 BottomSheet
   - snap point 3 단계 (peek / half / full), 드래그 인디케이터
   - 장소명, 방문 횟수, 최근 기록 미리보기
3. 장소 상세
   - 헤더 + 해당 장소의 모든 기록 카드 리스트 (Phase 1 Card 재사용)

핀 디자인은 라이트/다크에서 모두 가시성 4.5:1 이상 보장.
Handoff bundle 까지.
```

**Claude Code 에 보낼 적용 프롬프트**

```
Claude Design Phase 2 handoff 적용 요청.

[bundle URL]

- 적용 후 checkpoint-phase-2.md 작성
- BottomSheet 는 @gorhom/bottom-sheet 사용 가정, snap point 와 안전영역 검증
- WCAG AA 대비비 측정값을 체크포인트 문서에 함께 기록
```

### Phase 3 — 페어링 / 위시리스트 / 내보내기

**Claude Design 에 보낼 프롬프트**

```
sip-note Phase 3 화면을 디자인해주세요.

1. 페어링 목록
   - 카드형 (주류 사진 + 음식명 + 궁합 점수 이모지 4 단계 👎😐👍🤩)
   - 필터: 주류 카테고리 / 궁합 점수
2. 페어링 작성
   - 테이스팅 노트 선택 / 신규 입력 토글
   - 음식명, 궁합 점수, 메모, 사진
3. 위시리스트 추가
   - 지도 long-press 진입, 검색 진입 두 플로우
4. 데이터 내보내기 트리거
   - expo-sharing 진입 전 확인 모달 (destructive 컬러 사용 금지)

Handoff bundle.
```

**Claude Code 에 보낼 적용 프롬프트**

```
Claude Design Phase 3 handoff 적용 요청.

[bundle URL]

- 적용 후 checkpoint-phase-3.md
- 페어링 카드와 테이스팅 노트 카드의 hierarchy 가 충돌하지 않는지 점검
- "카드 안 카드" 안티패턴 회피 — 페어링 카드 안에서 테이스팅 노트는 inline 텍스트
  요약 또는 chip 으로만 표현
```

### Phase 4 — 마이 / 통계 / 뱃지 / 설정

**Claude Design 에 보낼 프롬프트**

```
sip-note Phase 4 화면을 디자인해주세요.

1. 마이 — 통계 대시보드
   - 도넛 차트 (카테고리 비율) + 월별 라인 차트 (평균 점수 추이)
   - 카테고리 토큰 재사용
   - 방문 장소 / 도시 수, 태그 TOP 5, 최고 궁합 페어링
2. 마이 — 뱃지 목록
   - unlocked / locked 변형, 획득 시 축하 모달
   - 햅틱 + 모션 결합 시 prefers-reduced-motion 대응
3. 마이 — 설정
   - 알림 on/off + 시간, 지오펜싱 반경 슬라이더 (기본 500m)
   - 라이트/다크 토글, 기본 통화
   - 데이터 초기화 (확인 모달, destructive 컬러는 error 토큰 사용)

차트 컬러 가이드 + 인터랙션 명세 + Handoff bundle.
```

**Claude Code 에 보낼 적용 프롬프트**

```
Claude Design Phase 4 handoff 적용 요청.

[bundle URL]

- 차트 라이브러리 선택 시 Gluestack 호환 우선 (victory-native 또는 react-native-svg
  기반)
- 적용 후 checkpoint-phase-4.md
- prefers-reduced-motion 대응 코드와 햅틱 분기 검증 결과 기록
```

---

## 5. Handoff bundle 적용 시 Claude Code 의 룰

Bundle 이 어떤 형태로 오든 다음을 강제한다.

1. **시맨틱 토큰만** — `text-error-500` ✅ / `text-red-500` ❌
2. **8px 그리드** — `p-4` ✅ / `p-[13px]` ❌ (gluestack-nativewind Rule 4)
3. **Gluestack 우선** — `Box / Text / Pressable / Pressable` ✅ / `View / Text / TouchableOpacity` ❌
4. **다크 모드** — `dark:` prefix + CSS variables
5. **인라인 style** 은 동적 값 (safe area inset, animated value, Platform.select) 한정
6. **카테고리 컬러** 는 BOOTSTRAP 에서 확립한 네임스페이스(`colors.category.*`) 만 사용
7. **변경 diff** 를 항상 사용자에게 먼저 제시하고 적용 여부 확인 — 이전에 수동으로 다듬은 커스텀 부분을 덮어쓰지 않게

만약 bundle 의 코드가 위 규칙을 위반하면 **그대로 적용하지 말고**, Claude Code 가 변환한 뒤 적용 + 변환 내역을 체크포인트 문서에 기록.

---

## 6. AUDIT (체크포인트 통과 기준)

각 Phase 종료 시 Claude Code 가 다음 4 단계 검증 후 다음 Phase 진입을 허용한다.

1. **Responsive** — 375px / 768px / 1024px 캡처 (Expo 시뮬레이터 또는 web 빌드)
2. **WCAG AA** — 텍스트/배경 대비비 4.5:1 이상, 모든 인터랙티브 요소 visible focus state
3. **Nielsen 10 heuristics** — 빈 상태 / 에러 / 되돌리기 / 시스템 상태 가시성
4. **AI slop check** — 다음 6 종 0 건
   - purple→blue 그라데이션 배경
   - 카드 안 카드
   - body 16px 미만
   - hover-only 인터랙션
   - prefers-reduced-motion 무시
   - gradient + glassmorphism + blur 3 종 결합

산출물: `apps/sip-note/docs/design/checkpoint-phase-{0..4}.md`

```
# Phase N — Design Checkpoint

- Date: YYYY-MM-DD
- Claude Design URL: <handoff bundle URL>
- Modified files: [...]

## Screens
| 375px | 768px | 1024px |
|---|---|---|
| ![](./screenshots/phase-N-375.png) | ... | ... |

## AUDIT
- [x] Responsive
- [x] WCAG AA — 평균 대비비 X.X:1
- [x] Nielsen 10
- [x] AI slop check — 0 건

## Decisions
- (이번 Phase 에서 확정한 디자인 결정사항)

## Open Issues
- (다음 Phase 로 이월하거나 별도 이슈로 분리)
```

---

## 7. 트러블슈팅

### Q. Claude Design 에 코드베이스 connect 가 안 된다
- 모노레포 루트 connect 가 너무 무거우면 `apps/sip-note/` 만 별도로 connect 시도
- 또는 핵심 파일만 첨부: `tailwind.config.ts`, `gluestack-ui.config.json`, `.design-context.md`, `docs/prd-drink-diary.md`

### Q. Handoff bundle 이 Tailwind 가 아닌 일반 CSS 로 와 있다
- Claude Code 에 "이 CSS 를 tailwind.config.ts 의 theme.extend 토큰 + className 으로 변환해서 적용해주세요" 라고 명시

### Q. Handoff bundle 의 컴포넌트가 React Native 가 아닌 web 컴포넌트다
- Claude Design 의 출력은 종종 web 우선이므로, Claude Code 에 "Gluestack v3 + NativeWind v4 컴포넌트로 변환 후 적용" 을 명시

### Q. 디자인 안이 .design-context.md 의 톤과 어긋난다
- Claude Design 에 `.design-context.md` 를 다시 첨부하고, 어긋난 항목을 inline 코멘트로 지적
- 그래도 어긋나면 STEP B2 의 첫 프롬프트로 돌아가 컨텍스트를 재주입

---

## 부록 — 빠른 참조

| 항목 | 값 |
|---|---|
| Claude Design 진입 | <https://claude.ai/design> (Pro / Max / Team / Enterprise) |
| 첨부 우선순위 | `.design-context.md` → `docs/prd-drink-diary.md` → 코드베이스 connect |
| Export 권장 | "Handoff to Claude Code" bundle (URL) |
| Claude Code 응답 언어 | 한국어 (`.claude/rules/i18n-guide.md`) |
| 코드 / 토큰명 / 커밋 메시지 | 영문 |
| 커밋 컨벤션 | `feat / fix / refactor / docs / test / chore / style / perf` |
| 런타임 | pnpm + mise (`pnpm install`, `mise run …`) |

### 핵심 룰 한 줄 요약

- **Claude Design 이 시각, Claude Code 가 코드** — 역할을 섞지 말 것
- **Handoff bundle 은 그대로 쓰지 말고 룰을 통과시켜라** — 시맨틱 토큰 / 8px 스케일 / Gluestack 우선
- **각 Phase 마다 체크포인트 문서 1 개** — 다음 Phase 진입의 통행증
