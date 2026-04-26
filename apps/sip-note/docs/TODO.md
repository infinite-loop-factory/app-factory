# Sip Note — 구현 TODO

> PRD: [`prd-drink-diary.md`](./prd-drink-diary.md)
> 풀 로컬(expo-sqlite) 아키텍처 / Expo SDK 54

## 작업 규칙

- 각 Phase 의 항목은 **위→아래 의존성 순서**로 정렬되어 있으므로 순서대로 진행한다
- "**디자인 체크포인트**" 항목은 해당 Phase 의 코드 골격이 끝난 시점에
  `/oh-my-claudecode:designer` 또는 design 스킬로 별도 UI 패스를 진행한다
- 응답 언어: 한국어 / 코드 식별자·커밋 메시지: 영문 (`.claude/rules/i18n-guide.md`)
- 커밋 컨벤션: `feat | fix | refactor | docs | test | chore | style | perf` (`.claude/rules/commit.md`)
- 런타임 명령: pnpm + mise (`pnpm install`, `mise run …`) (`.claude/rules/dev-workflow.md`)
- 비즈니스 로직 분리: `feature → service → repository → db` (`.claude/rules/backend.md`)

---

## Phase 0 — 기반 작업 (선행조건)

- [x] 의존성 추가
  - `expo-sqlite ~16.0.10`, `expo-camera ~17.0.10`, `expo-image-picker ~17.0.10`, `expo-image-manipulator ~14.0.8`
  - `expo-location ~19.0.8`, `expo-task-manager ~14.0.9`, `expo-notifications ~0.32.16`
  - `expo-file-system ~19.0.21`, `expo-sharing ~14.0.8`, `expo-haptics ~15.0.8`
  - `react-native-maps 1.20.1`
- [x] `app.config.ts` 권한/플러그인 추가
  - camera, location (foreground + background), notifications, `expo-sqlite` plugin 등록
  - iOS `UIBackgroundModes: ["location", "fetch"]` 추가
  - Maps API key 는 Phase 2 지도 렌더링 시점에 별도 추가
- [x] 폴더 구조 정립
  - `src/db/` (client, migrations, schema) — README 로 컨벤션 정의
  - `src/features/` — `{tasting,place,pairing,badge,my}/` 는 각 Phase 진행 시 생성
  - `src/services/` — `{photo,location,notification,export}/` 는 각 Phase 진행 시 생성
- [ ] **디자인 시스템 토큰 정리 — claude design 활용**
  - 컬러 토큰 (라이트/다크), 카테고리 컬러(위스키/와인/맥주/사케/칵테일/기타)
  - 타이포 스케일, 8px 그리드, 카드/바텀시트/FAB 컴포넌트 스타일
- [x] i18n 키 베이스라인 (`ko`, `en`) — 131 키, nested namespace
  - 사용 패턴: `import i18n from "@/i18n"; i18n.t("namespace.key")` (sibling country-tracker 와 동일)

---

## Phase 1 — 기록의 시작 (테이스팅 노트 CRUD)

> 핵심 루프 완성: DB 초기화 → 사진 → 정보 입력 → 저장 → 목록

- [x] SQLite 클라이언트 (`src/db/client.ts`) — `sip-note.db` open + 마이그레이션 러너
- [x] 스키마 v1
  - `tasting_notes` (id, category, name, score, memo, price, price_unit, date, place_id, created_at, updated_at)
  - `tasting_note_tags` (note_id, tag) — CASCADE
  - `tasting_note_photos` (note_id, uri, sort_order) — CASCADE
  - `places` (stub: id, name, category, latitude, longitude) — Phase 2 에서 확장
- [ ] Repository: `tastingNoteRepo` (create / get / update / delete / list with filters)
- [ ] 사진 서비스 (`src/services/photo/`)
  - 촬영(`expo-camera`) / 선택(`expo-image-picker`)
  - 압축(`expo-image-manipulator`) → Documents 디렉토리 저장(`expo-file-system`)
- [ ] 화면: **홈 (테이스팅 피드)** — 최신순 타임라인, 카드형, FAB
- [ ] 화면: **기록 작성** (풀스크린 모달) — 카테고리, 이름, 점수(0.5단위), 태그, 메모, 가격, 사진, 날짜
- [ ] 화면: **기록 상세** (조회 / 수정 / 삭제)
- [ ] 검색 & 필터 (카테고리 / 점수 범위 / 태그 / 기간 / 텍스트)
- [ ] 햅틱 피드백 (`expo-haptics`) — 저장 완료 시
- [ ] **디자인 체크포인트** — 홈 / 작성 / 상세 → claude design 으로 UI 다듬기

---

## Phase 2 — 장소와 연결

> 기록에 위치 컨텍스트가 붙는다

- [ ] 위치 서비스 (`src/services/location/`) — 권한 요청 + 현위치 조회
- [ ] 스키마 확장 (마이그레이션 v2)
  - `places` 확장: address, is_wishlist, visit_count
  - `tasting_notes.place_id` FK
- [ ] Repository: `placeRepo` + 테이스팅 노트 N:1 join 쿼리
- [ ] 기록 작성 화면에 **위치 자동 태깅 + 수동 변경 UI**
- [ ] 화면: **지도 탭** (`react-native-maps`)
  - 방문 완료 핀(채움) / 위시리스트 핀(빈)
  - 카테고리 필터 토글 (바·펍 / 증류소 / 와이너리 / 브루어리 / 레스토랑 / 기타)
- [ ] 핀 탭 → **장소 요약 바텀시트** (장소명, 방문 횟수, 최근 기록 미리보기)
- [ ] 화면: **장소 상세** — 해당 장소의 모든 기록 목록
- [ ] 도시/리전 방문 통계 집계 쿼리 (Phase 4 통계에 재사용)
- [ ] **디자인 체크포인트** — 지도 / 바텀시트 / 장소 상세 → claude design

---

## Phase 3 — 경험 확장

> 페어링 + 위시리스트 + 데이터 내보내기

- [ ] 스키마 확장 (마이그레이션 v3)
  - `pairings` (id, tasting_note_id?, food_name, match_score, memo, photo_uri, place_id?, created_at)
- [ ] Repository: `pairingRepo`
- [ ] 화면: **페어링 목록** — 카드형 (주류 사진 + 음식명 + 궁합 점수 이모지)
  - 필터: 주류 카테고리별, 궁합 점수별
- [ ] 화면: **페어링 작성** — 테이스팅 노트 선택 / 신규 입력, 음식명, 궁합 점수(👎😐👍🤩), 메모
- [ ] 역방향 탐색: 특정 주류 / 특정 음식의 페어링 모아보기
- [ ] 화면: **위시리스트 추가** — 지도 롱프레스 또는 검색 후 등록
- [ ] 데이터 내보내기 서비스 (`src/services/export/`)
  - 전체 테이블 → JSON 직렬화
  - 사진 파일 묶음 + JSON → `expo-sharing` 공유 시트
- [ ] 데이터 초기화 (확인 모달 → DB drop + 사진 디렉토리 클리어)
- [ ] **디자인 체크포인트** — 페어링 목록·작성 / 위시리스트 / 내보내기 → claude design

---

## Phase 4 — 몰입 장치

> 알림, 지오펜싱, 뱃지, 통계 대시보드로 지속 사용 동기 부여

- [ ] 알림 서비스 (`src/services/notification/`) — 권한 요청, 채널 셋업, 스케줄 헬퍼
- [ ] 로컬 알림: **주간 기록 리마인더** (기본 금요일 저녁, 시간 설정 가능)
- [ ] 로컬 알림: **주간 리포트** (일요일 아침, "이번 주 N잔 / 평균 점수 X.X")
- [ ] 백그라운드 **지오펜싱** (`expo-location` + `expo-task-manager`)
  - 위시리스트 장소 반경 진입 감지 → 로컬 알림
  - 알림 탭 → 장소 상세 딥링크
- [ ] **뱃지 시스템**
  - 스키마 (마이그레이션 v4): `badges` (id, type, title, description, condition, unlocked_at)
  - 조건 평가기 (기록 저장/장소 추가/페어링 등록 훅에서 트리거)
  - 획득 시 햅틱 + 축하 모달
  - 종류: 카테고리 마일스톤(10/50/100), 도시 방문, 페어링 누적
- [ ] 화면: **마이 — 통계 대시보드**
  - 총 / 이번 달 기록 수
  - 카테고리 도넛, 평균 점수 월별 라인 차트
  - 방문 장소·도시 수, 태그 TOP 5, 최고 궁합 페어링
- [ ] 화면: **마이 — 뱃지 목록** (획득 / 미획득)
- [ ] 화면: **마이 — 설정**
  - 알림 on/off + 시간, 지오펜싱 반경(기본 500m)
  - 테마(라이트/다크), 기본 통화
- [ ] **디자인 체크포인트** — 마이 / 통계 / 뱃지 / 설정 → claude design

---

## Phase 5 — 마감 & 검증

- [ ] 단위 테스트: 각 repository, 사진 서비스, 뱃지 조건 평가기
- [ ] 통합 테스트: 기록 작성 → 지도 노출 → 페어링 등록 → 내보내기 골든 패스
- [ ] 다국어 검수 (`ko` / `en` 키 누락 점검)
- [ ] 접근성 패스 — WCAG AA, `prefers-reduced-motion` 대응
- [ ] 빈 상태 / 에러 / 권한 거부 화면 점검
- [ ] 배포 준비 — 아이콘 / 스플래시 / EAS Build 설정 / 스토어 스크린샷
