# `src/db` — SQLite 데이터 레이어

풀 로컬 아키텍처의 단일 저장소. `expo-sqlite` 위에서 동작한다.

## 구성

- `client.ts` — DB open / 싱글톤 / 마이그레이션 러너
- `migrations/` — 버전별 SQL 마이그레이션 (Phase 1: v1, Phase 2: v2 …)
- `schema.ts` — 테이블 스키마 타입 정의 (TypeScript)

## 규칙

- 모든 SQL 은 parameterized query 만 사용 (`.claude/rules/backend.md`)
- Repository 레이어가 이 모듈을 import 한다 — UI / feature 가 직접 import 금지
