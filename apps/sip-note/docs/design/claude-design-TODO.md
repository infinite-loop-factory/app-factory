# Claude Design 전용 TODO — sip-note

> **목적**: Anthropic *Claude Design* (web, <https://claude.ai/design>) 을 sip-note 시각 작업의 1 차 도구로 쓰기 위해, 자산·워크플로우·체크포인트를 *영상 분석 가이드* 와 정합시키는 실행 체크리스트.
>
> **Claude Design 선행 워크플로우** = ADR-0011. 본 TODO 는 그 결정의 실행 체크리스트.
>
> **연결 문서**
> - 워크플로우: [`./workflow.md`](./workflow.md)
> - 디자인 컨텍스트: [`./context.md`](./context.md) (톤 / 카테고리 / anti-pattern)
> - 토큰 SSOT: [`../../DESIGN.md`](../../DESIGN.md)
> - 결정 근거: [`./ADR-claude-design.md`](./ADR-claude-design.md)
> - 빌드 로드맵: [`../TODO.md`](../TODO.md)
>
> **운영 룰**
> - 항목 완료 시 ADR 의 해당 번호를 cross-link 로 명시
> - 새 결정이 필요하면 ADR 에 항목 추가 → 본 TODO 에 # 추가
> - 응답 언어 한국어 / 코드·토큰명·커밋 메시지 영문 (`.claude/rules/i18n-guide.md`)
> - 시뮬레이터 캡처는 Phase 마무리 + ad-hoc 트리거 시에만 (ADR-0011)

---

## 트랙 개요

| 트랙 | 성격 | 빈도 |
|---|---|---|
| **A. 자산 정비** | DESIGN.md / context.md / exemplars 보강 | 1 회 (BOOTSTRAP 보강) |
| **B. 워크플로우 정비** | workflow.md 의 프롬프트·룰 재작성 | 1 회 (체크포인트 진입 전) |
| **C. 체크포인트 실행** | Phase 1~4 디자인 체크포인트 자체 | Phase 별 1 회 |

권장 순서: **A2 → A4 → A6 → C1 → C2 → C3 → C4 → A3 (캡처 누적 후) → 나머지**.

---

## A. 자산 정비 (1 회)

| # | 항목 | 산출물 | ADR |
|---|---|---|---|
| A1 | DESIGN.md 18 카테고리 대비표 추가 | `DESIGN.md` §10 신설 — Brand / Surface / Text / Border / Type spec / Type variants / Buttons / Controls / Inputs / Filters / Radius / Space / Elevation / Domain (drink) / Domain (place) / Badge / Logo / Icons 18 행 매핑 | ADR-0002 |
| A2 | LLM 컨텍스트 축약본 분리 | `apps/sip-note/docs/design/DESIGN.lite.md` (≤ 150 줄) — 토큰 / 카테고리 / anti-pattern / Follow-up 질문만. Claude Design 첨부 시 풀 DESIGN.md 대신 사용 | ADR-0003 |
| A3 | 모범 적용 사례 화면 3 종 | `apps/sip-note/docs/design/exemplars/{home,compose,map}.png` + 1 줄 캡션. **첫 사이클은 Claude Design 시안 캡처로 채워도 무방** (ADR-0005, ADR-0011) | ADR-0005 |
| A4 | Follow-up 질문 세트 정의 | `context.md` §"Follow-up Channel" 신설 (10 ± 2 개 표준 질문 + 우리 팀 표준 답안) | ADR-0004 |
| A5 | Reference 첨부 우선순위 룰 | `context.md` §"Reference Attachment" — PDF > HTML 단독 페이지 > 스크린샷 > URL | ADR-0005 |
| A6 | 시각 어휘 사전 (warm archive 한정) | `context.md` §"Visual Vocabulary" — *허용*(양피지 텍스처, 오크 그레인, 220ms slow reveal, 절제된 글로우) / *금지*(셰이더, 파티클, 무지갯빛, 글래스모피즘, 3 종 결합). `DESIGN.md` anti-pattern 표 확장 동기화 | ADR-0008 |
| A7 | 18 카테고리 미충족 항목 점검 | `Controls / Inputs / Filters` 토큰 누락 여부 진단. 누락 시 `DESIGN.md` 보강, 충분하면 본 항목 close | ADR-0002 |

---

## B. 워크플로우 정비

| # | 항목 | 산출물 | ADR |
|---|---|---|---|
| B1 | 2 단 점프 프롬프트 패턴 도입 | `workflow.md` Phase 1~4 프롬프트를 **(1) 1 차 구조 블록** + **(2) 2 차 시각 디테일 블록** 두 단으로 재작성. 1 차는 PRD 기반 화면 골격, 2 차는 컬러 제약·모션·텍스처·anchor 컴포넌트 변형 | ADR-0001, 0011 |
| B2 | 가설 기반 다중 시안 옵션 | `workflow.md` 에 sub-section 추가 — "가설 N × 화면 5+" 변형 프롬프트. **선택적 적용** (홈 카드 hierarchy / 지도 핀 시각언어 / 통계 차트 3 분기점만) | ADR-0009 |
| B3 | 수정 일괄 처리 룰 | `workflow.md` §5 보강 — "댓글 묶음 → 1 회 호출" 룰. 화면당 follow-up 포함 ≤ 4 호출 한도 | ADR-0010 |
| B4 | Handoff bundle 변환 룰 명문화 | `workflow.md` §5 의 7 룰 (시맨틱 토큰 / 8pt / Gluestack 등) 위에 *"bundle 그대로 적용 금지 — 변환 후 적용"* 한 줄 추가 | ADR-0006 |
| B5 | Figma 역방향 푸시 결정 반영 | ADR-0007 결정 (out of scope v1) 을 `workflow.md` 부록에 1 줄 명시. 재검토 트리거 (디자이너 팀 합류 / 스토어 스크린샷 ≥ 5) 도 함께 | ADR-0007 |
| B6 | 가드레일 최소화 점검 | `workflow.md` Phase 프롬프트의 *지시 항목 수* 를 화면당 ≤ 6 줄로 압축. 나머지는 follow-up 질문 / `context.md` 로 이동 | ADR-0001 |

---

## C. 체크포인트 실행 (Phase 1~4)

각 항목은 6 단계 흐름 ([`../TODO.md` §디자인 체크포인트 프로세스](../TODO.md)) 그대로. 본 TODO 는 *현재 미완* 만 추적. **Claude Design 선행 — 시뮬레이터 캡처는 Phase 마무리 + ad-hoc 트리거 시** (ADR-0011).

- [ ] **C1. Phase 1 체크포인트** — 홈 / 작성 / 상세
  - 입력: PRD 화면 목록 + `DESIGN.lite.md` + `context.md` (+ 있으면 exemplars)
  - 산출: `checkpoint-phase-1.md` (현재 brief 상태 → 정식 본문, *Re-verification* 섹션 포함), `Card / FAB / ScoreSlider / Tag` 변형 보강 PR
  - Phase 마무리 캡처: 의무 1 회 + ad-hoc 트리거 시 추가
  - 선행: A2, A4 권장 (A3 exemplars 는 본 사이클 산출로 누적)
- [ ] **C2. Phase 2 체크포인트** — 지도 / 바텀시트 / 장소 상세
  - 입력: 위와 동일
  - Phase 2 carry-over (caption-size brand light 토큰 스왑) 동시 처리
  - 산출: `checkpoint-phase-2.md`, `MapPin / BottomSheet` 변형 보강
  - 가설 분기점 (ADR-0009): 지도 핀 시각언어 — 가설 3 × 시안 5
- [ ] **C3. Phase 3 체크포인트** — 페어링 / 위시리스트 / 내보내기
  - **코드 전 시안 진행 가능** (ADR-0011) — 단 ADR-0010 토큰 가드 / ADR-0009 가설 단위 룰 유지
  - 입력: PRD §페어링 + §내보내기 화면 정의 + DESIGN.lite + context
- [ ] **C4. Phase 4 체크포인트** — 마이 / 통계 / 뱃지 / 설정
  - **코드 전 시안 진행 가능** (ADR-0011) — 가설 분기점: 통계 차트 — 가설 3 × 시안 5

---

## 진행 메타

- **PR 분리 전략**
  - PR 1 (현재): 본 TODO + `ADR-claude-design.md` 두 파일 신설 → ADR-0011 채택과 함께 워크플로우 반전 본문 갱신 (workflow.md / TODO.md / claude-design-TODO.md / ADR) 1 PR 흡수
  - PR 2: A 트랙 (DESIGN.md §10, DESIGN.lite.md, context.md 3 섹션, exemplars/ — 첫 사이클은 빈 폴더 + README 도 가능)
  - PR 3: B 트랙 (workflow.md Phase 프롬프트 2 단 점프 재작성)
  - PR 4+: C 트랙 (Phase 1·2 체크포인트부터)
- **체크포인트 통과 기준**: `workflow.md` §6 AUDIT 4 종 (Responsive / WCAG AA / Nielsen 10 / AI slop 6 종 0 건) — Phase 마무리 시뮬레이터 캡처 1 회로 검증
- **회귀 방지**: 본 TODO 와 ADR 의 cross-link 가 깨지면 PR 머지 금지
