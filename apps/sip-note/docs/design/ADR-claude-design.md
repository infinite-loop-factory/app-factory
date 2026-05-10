# ADR — Claude Design 운영 결정 (sip-note)

> Claude Design 을 sip-note 시각 작업의 1 차 도구로 도입하면서 내려진 결정들. *영상 분석 가이드* 와 우리 팀의 제약을 정합시킨 결과.
>
> **연결 문서**
> - 실행 체크리스트: [`./claude-design-TODO.md`](./claude-design-TODO.md)
> - 워크플로우: [`./workflow.md`](./workflow.md)
> - 디자인 컨텍스트: [`./context.md`](./context.md)
> - 토큰 SSOT: [`../../DESIGN.md`](../../DESIGN.md)
>
> **운영 룰**
> - 본 문서의 항목은 *작성 시점의 결정*. 컨텍스트가 바뀌면 **새 ADR 추가** (덮어쓰기 금지)
> - 결정이 무효화되면 Status 만 `Superseded by ADR-NNNN` 으로 갱신
> - 각 ADR 양식: **Status / Context / Decision / Consequences / Refs**

---

## ADR-0001 — 가드레일 최소화 + 의미 토큰 강제의 균형

- **Status**: Accepted
- **Context**: 영상 분석 §2 의 검증된 패러독스 — *"AI 에게 자유를 줄수록 결과가 좋다. 가드레일을 추가하면 결과가 안 좋아진다."* 75 페이지급 사내 DS 를 강제했을 때 매핑 실패가 더 많았다. 반면 토큰·anti-pattern 같은 *시맨틱 강제* 는 일관성을 확보하기 위해 필요하다.
- **Decision**:
  - **강제 영역**: 의미 토큰 (color / spacing / typography), anti-pattern 6+종, 8pt 그리드, Gluestack 우선
  - **자유 영역**: 레이아웃 조합, 컴포넌트 배치, 시각 디테일 (모션·텍스처·hierarchy 표현), 가설 단계
  - workflow.md §5 의 7 룰은 *Handoff 변환 단계* 에만 적용 — Claude Design 의 *생성 단계* 에는 적용하지 않는다
- **Consequences**:
  - workflow.md Phase 프롬프트가 항목 나열형에서 → "1 차 구조 + 2 차 디테일" 로 재작성됨 (TODO B1, B6)
  - 변환은 Claude Code 책임 — bundle 의 numeric ramp / 일반 CSS / web 컴포넌트는 Claude Code 가 변환 후 적용
  - ADR-0011 채택 후, "1 차 구조 + 2 차 디테일" 의 1 차는 PRD 만으로 진행되며 2 차에 가설 분기 / 시각 어휘 적용
- **Refs**: TODO B1, B6 / HTML §2 핵심 메타 인사이트 / ADR-0011

---

## ADR-0002 — 표준 명명 채택 (의미 기반 토큰)

- **Status**: Accepted (Phase 0 에서 적용 완료, 본 ADR 은 근거 박제)
- **Context**: 영상 분석 §4 — 사내 명명을 고집하면 LLM 사전학습 지식이 작동하지 않는다. `H1/H2/H3` → `Display / Headline / Title`, `custom-blue-1` → `primary-500` 같은 표준 매핑이 권장됨.
- **Decision**:
  - sip-note 는 의미 기반 토큰 (`brand`, `surface`, `text.muted`, `border.subtle`) 만 사용
  - Gluestack 의 numeric ramp (`bg-primary-500`) className 은 anti-pattern 으로 명시
  - 18 표준 카테고리 (Brand / Surface / Text / Border / Type / Buttons / Radius / Space / Variants / Elevation / Buttons / Controls / Inputs / Domain×2 / Badge / Logo / Icons) 와의 대비표를 DESIGN.md §10 으로 정리
- **Consequences**: 토큰 재명명 금지 — Phase 0 에서 확정 후 코드에 박혔으므로 흔들 수 없음. 신규 토큰은 18 카테고리 매핑 점검 후 추가
- **Refs**: TODO A1, A7 / DESIGN.md §2~9 / HTML §4 원칙 1~2

---

## ADR-0003 — LLM 축약본 (`DESIGN.lite.md`) 분리

- **Status**: Accepted
- **Context**: DESIGN.md 가 풀버전·축약본 역할을 둘 다 수행 중. Claude Design 컨텍스트에 큰 .md 를 통째로 던지면 토큰을 빠르게 소진하고 응답 품질이 떨어진다는 영상 분석 §4 원칙 4 ("LLM 용 축약본 별도 운영").
- **Decision**:
  - `apps/sip-note/docs/design/DESIGN.lite.md` ≤ 150 줄로 별도 운영
  - 포함: 토큰 (의미 + 카테고리 6+6+4) / anti-pattern / Follow-up 질문 표
  - 제외: 변경 이력, 상세 spec, 참조 코드 경로
  - 동기화는 *수동* — 풀 DESIGN.md 변경 시 본 ADR cross-link 를 보고 함께 갱신. PR 리뷰어가 양쪽 일치 점검
- **Consequences**: Claude Design 호출 시 첨부 우선순위는 `DESIGN.lite.md` > `context.md` > `prd-drink-diary.md`. 풀 DESIGN.md 는 Claude Code 작업용
- **Refs**: TODO A2 / HTML §4 원칙 4

---

## ADR-0004 — Follow-up 질문 세트를 SSOT 로

- **Status**: Accepted
- **Context**: 영상 분석 §3 — *"메타 필드(회사명·설명) 보다 follow-up 답변이 결과를 좌우한다."* 즉 Claude Design 이 초기 프롬프트 이후 던지는 질문에 답하는 단계가 진짜 컨텍스트 채널.
- **Decision**:
  - `context.md` 에 §"Follow-up Channel" 신설, 표준 질문 10 ± 2 개와 우리 팀의 표준 답안 페어 정의
  - 후보 질문: 톤·타겟·라이트/다크 우선순위·핵심 인터랙션 1 개·차별화 포인트·금기 사항·참조 사이트 1 개·CJK 처리·접근성 우선순위·반응형 범위
  - Claude Design 호출 시 follow-up 이 오면 표준 답안을 *그대로 페이스트* 한 후 화면별 보충만 추가
- **Consequences**: 질문 답변이 일관되어 시안 간 톤 편차 감소. 표준 답안이 바뀌면 ADR 추가 (-0004 supersede)
- **Refs**: TODO A4 / HTML §3 Follow-up 질문 / §4 원칙 11

---

## ADR-0005 — 모범 적용 사례 화면 3 종 동봉

- **Status**: Accepted
- **Context**: 영상 분석 §4 원칙 6 — *"토큰·컴포넌트 명세만으론 부족. 이 DS 로 만든 표본 화면 3-5 개가 함께 있어야 LLM 이 조합 패턴을 학습한다."*
- **Decision**:
  - `apps/sip-note/docs/design/exemplars/` 폴더에 PNG 3 종 동봉
    - `home.png` — Phase 1 홈 (테이스팅 피드 + FAB + Day divider)
    - `compose.png` — Phase 1 작성 (카테고리 칩 + ScoreSlider + 메모)
    - `map.png` — Phase 2 지도 (MapPin visited / wishlist + 카테고리 필터 + 바텀시트 peek)
  - ADR-0011 채택 후: 첫 사이클은 *Claude Design 시안 캡처* 로 채울 수 있음 (코드 산출 캡처가 아니어도 무방). 이후 사이클에서 실제 화면 캡처로 교체
  - 각 PNG 옆에 1 줄 캡션 (.md 페어). Reference 첨부 우선순위: PDF > HTML 단독 페이지 > 스크린샷 > URL
- **Consequences**: Claude Design 호출 시 exemplars 첨부가 표준. 스크린샷이 *낡았으면* 갱신 필수 — 낡은 exemplar 가 더 해로움
- **Refs**: TODO A3, A5 / HTML §4 원칙 6, §2 좋은 입력 / ADR-0011

---

## ADR-0006 — Handoff bundle 변환 강제

- **Status**: Accepted
- **Context**: Claude Design bundle 은 종종 web 컴포넌트 / 일반 CSS / numeric ramp 로 도착한다. 그대로 적용하면 sip-note 의 Gluestack v3 + NativeWind v4 + 의미 토큰 룰을 위반.
- **Decision**:
  - **bundle 그대로 적용 금지** — Claude Code 가 다음 변환 후 적용
    1. 시맨틱 토큰만 (`text-error-500` ✅ / `text-red-500` ❌)
    2. 8pt 그리드 (`p-4` ✅ / `p-[13px]` ❌)
    3. Gluestack 우선 (`Box / Text / Pressable` ✅ / `View / Text / TouchableOpacity` ❌)
    4. 다크 prefix + CSS 변수
    5. 인라인 style 은 동적 값 한정
    6. 카테고리 컬러는 `colors.cat.*` / `colors.place.*` 네임스페이스만
    7. 변경 diff 를 사용자에게 먼저 제시 (수동 다듬은 부분 보호)
  - 변환 내역은 해당 Phase 의 `checkpoint-phase-N.md` 에 기록
- **Consequences**: bundle 적용 PR 의 리뷰 포인트는 *변환 일치도*. workflow.md §5 의 7 룰이 정식 변환 룰
- **Refs**: TODO B4 / workflow.md §5

---

## ADR-0007 — Figma 역방향 푸시 — out of scope (v1)

- **Status**: Accepted
- **Context**: 영상 분석 §5 — Claude Design → Claude Code → Figma MCP 푸시는 약 7 분 소요, 반응형 / 컴포넌트 인스턴스 매핑 불완전, **3 중 토큰 비용** 발생. sip-note 팀은 Figma 본진을 운영하지 않으며 SSOT 는 코드 (`DESIGN.md` / `theme.ts`).
- **Decision**:
  - v1 범위에서 Figma 역방향 푸시는 **사용하지 않는다**
  - workflow.md 부록에 1 줄로 명시
  - 재검토 트리거: ① 디자이너 팀 합류로 Figma SSOT 가 실제 운영됨 ② 스토어용 디자인 페이지 수가 ≥ 5 로 증가
  - 트리거 발생 시 ADR 추가 (-0007 supersede), Figma MCP 사전 조건 작업 항목 신설
- **Consequences**: Claude Design ↔ Claude Code 의 양 끝만 운영. 정제는 Claude Code + 시뮬레이터 캡처 + (필요 시) HTML 미리보기로 한다
- **Refs**: TODO B5 / HTML §5

---

## ADR-0008 — 시각 어휘 사전 — warm archive 한정

- **Status**: Accepted
- **Context**: 영상 분석 §2 의 *시각 어휘* (WebGL 셰이더 / 파티클 / 3D 카드 틸팅 / 무지갯빛 / 글래스모피즘) 는 일반론으로 미려하지만, sip-note 의 컨셉은 `context.md` 의 **Cellar Premium / warm archive — 자랑보다 회고**. 이 톤과 직접 충돌.
- **Decision**:
  - **허용 어휘**: 양피지 텍스처, 오크 그레인, 220ms slow reveal, 절제된 글로우 (brand-strong 톤), 슬로우 페이드, 시즌 변화 없는 정적 hero
  - **금지 어휘** (anti-pattern 추가): 셰이더 배경, 파티클 효과, 3D 카드 틸팅 + 무지갯빛, 글래스모피즘, gradient + glassmorphism + blur 3 종 결합 — `DESIGN.md` §9 anti-pattern 표 확장
  - 어휘 사전을 `context.md` §"Visual Vocabulary" 로 정의
- **Consequences**: 톤 일관성 확보. 일반 LLM 권장 어휘 일부를 의도적으로 거부하므로 Claude Design 결과가 "trendy 하지 않게" 나올 수 있음 — 이는 의도된 결정
- **Refs**: TODO A6 / context.md §Brand Tone / Aesthetic Direction

---

## ADR-0009 — 가설 기반 다중 시안 — 선택적 적용

- **Status**: Accepted
- **Context**: 영상 분석 §3 — "PRD 기반 가설 3 × 화면 5+" 패턴은 강력하지만 **모든 화면에 적용하면 토큰 비효율**. sip-note 는 풀 로컬 / 단일 톤 / Phase 0 에서 카테고리·무드 확정.
- **Decision**:
  - 다중 시안은 **3 분기점에만** 선택적 적용
    1. 홈 카드 hierarchy (Phase 1)
    2. 지도 핀 시각언어 + 바텀시트 인터랙션 (Phase 2)
    3. 통계 차트 (Phase 4)
  - 그 외 화면은 단일 시안 + follow-up 으로 정제
  - 가설 분기는 *PRD 시나리오 기반* 만 허용 (조형 분기 ❌)
  - ADR-0011 이후 *모든 신규 화면이 사실상 코드 전 시안 단계* 를 거치므로 "분기점 3 곳" 은 **다중 시안 (3 × 5)** 의 강도를 적용하는 곳을 뜻하고, 나머지 화면은 단일 시안 + follow-up 으로 정제
- **Consequences**: 토큰 예산 안에서 가설 검증의 효과를 분기점에 집중. 분기점 외 화면에서 다중 시안 요청이 들어오면 본 ADR 인용해 reject
- **Refs**: TODO B2 / HTML §2 가설 기반 다중 시안 / §3 새 워크플로우 / ADR-0011

---

## ADR-0010 — 토큰 비용 가드

- **Status**: Accepted
- **Context**: 영상 분석 §1 한계 — *"테스트 시연만으로 $47 발생, 사용량 제한 빠르게 도달."* sip-note 는 솔로 빌더 환경, 비용 효율이 우선.
- **Decision**:
  - **호출 한도**: Claude Design 1 화면당 follow-up 포함 ≤ 4 호출 가이드
  - **수정 일괄 처리**: inline 댓글을 모은 뒤 1 회로 일괄 호출 (Drawing / Tweaks / 댓글 묶기 도구 활용)
  - **한도 초과 시**: 작업을 *(a) Claude Code 인라인 수정* 또는 *(b) Figma* (현재 out of scope, ADR-0007) 로 이전
  - 한도 초과가 반복되면 본 ADR 갱신 또는 supersede
- **Consequences**: workflow.md §5 에 일괄 처리 룰 추가. 체크포인트 문서에 "Claude Design 호출 횟수" 메타 1 줄 기록
- **Refs**: TODO B3 / HTML §1 한계, §3 시안 수정 도구

---

## ADR-0011 — Claude Design 선행 워크플로우 채택

- **Status**: Accepted (Supersedes ADR-0001 §workflow 가정 일부, ADR-0009 분기점 단위 해석)
- **Context**: 기존 6 단계 흐름은 **"코드 골격 → 시뮬레이터 캡처 → Claude Design → 적용"** 순서. 영상 분석 §3 의 새 디자이너 워크플로우 (*PRD → 가설 → 시안 → 논의 → 확정 → Claude Code 핸드오프*) 와 **정반대**. sip-note 의 시각 결정을 Claude Design 이 *선행* 하도록 전환.
- **Decision**:
  - **신규 화면**: Claude Design 에서 시안 확정 → Claude Code 구현
  - **시뮬레이터 캡처**: 다음 4 가지 *재검증 트리거* 시에만 수행
    1. Phase 코드 적용 완료 직후 1 회 (의무 — AUDIT 게이트)
    2. AI slop 6 종 의심
    3. WCAG 자동 계산과 실제 화면 차이 감지
    4. 사용자 명시 요청
  - **가설 단위**: 화면 단위 권장 (Phase 단위 가능)
  - **AUDIT 게이트**: Phase 마무리 1 회는 시뮬레이터 캡처로만 통과 (ad-hoc 트리거는 빠른 점검용)
- **Consequences**:
  - `workflow.md` §0·§2·§6·§부록 본문 갱신 — Claude Design 선행 톤
  - `docs/TODO.md` §디자인 체크포인트 프로세스 6 단계 재구성 (시뮬레이터 캡처 1 단계 → 5 단계로 이동)
  - `claude-design-TODO.md` §C 트랙 입력이 *PRD 기반* 으로 통일
  - exemplars (ADR-0005) 는 *코드 캡처* 대신 *Claude Design 시안 캡처* 로도 채울 수 있음 — 첫 사이클은 빈 상태 허용
  - Phase 3·4 화면도 코드 없이 시안 진행 가능 — 단 ADR-0010 토큰 가드 / ADR-0009 가설 단위 룰 유지
  - `checkpoint-phase-N.md` 에 *Re-verification* 섹션 추가 — 캡처 여부 / ad-hoc 트리거 발생 / 발견된 불일치 기록
- **Refs**: HTML §3 새 워크플로우 / TODO B1·B6·C 트랙 / ADR-0001·0009·0010
