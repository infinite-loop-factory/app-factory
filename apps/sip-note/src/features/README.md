# `src/features` — 도메인별 기능 슬라이스

각 폴더는 하나의 도메인을 담당한다. UI 컴포넌트, 훅, repository 를 함께 둔다.

## 도메인 (PRD §2 기준)

- `tasting/` — 테이스팅 노트 CRUD + 피드 + 작성·상세 화면
- `place/` — 장소 관리 + 지도 + 위시리스트
- `pairing/` — 페어링 기록 + 목록·작성 화면
- `badge/` — 뱃지 조건 평가 + 획득 모달 + 목록
- `my/` — 통계 대시보드 + 설정

## 규칙

- 각 도메인 내부: `screens/`, `components/`, `hooks/`, `repo/` 로 추가 분리 가능
- 도메인 간 직접 import 금지 — 공유 로직은 `src/services/` 또는 `src/components/` 로 추출
