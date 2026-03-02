# app-factory 프로젝트 설명서 (Java/Spring 백엔드 개발자용)

## 1. 한 줄 요약
`app-factory`는 **Expo(React Native) 기반 멀티앱 모노레포**이며, 현재 다수 앱이 서버를 직접 두기보다 **Supabase(BaaS)와 클라이언트가 직접 통신**하는 구조입니다.

## 2. 이 레포를 백엔드 관점에서 보면
- 이 저장소의 주력 코드는 모바일/웹 클라이언트입니다.
- 전통적인 Spring Boot 서버 모듈(예: `apps/api`, `services/*`)은 현재 보이지 않습니다.
- 즉, 백엔드 개발자가 보면 "서버 구현체"보다는 "서버 소비자(클라이언트)" 코드가 중심입니다.

## 3. 모노레포 구조
- 루트: Turborepo + pnpm workspace
- `apps/*`: 개별 서비스 앱
- `packages/*`: 공용 라이브러리

### 주요 디렉터리
- `apps/cafe`
- `apps/country-tracker`
- `apps/delivery`
- `apps/dog-walk`
- `apps/question-card`
- `apps/reaction-speed-test`
- `packages/common`: 공통 유틸
- `packages/ui`: 공통 UI 컴포넌트
- `turbo/generators`: 신규 앱/모듈 생성기

## 4. 실행/개발 방식 (백엔드 개발자용 빠른 이해)
### 루트 공통
- 패키지 매니저: `pnpm`
- 워크스페이스: `pnpm-workspace.yaml`
- 오케스트레이션: `turbo.json`

### 자주 쓰는 명령
- 전체 시작: `pnpm start`
- 특정 앱 시작: `pnpm start <app-name>`
- 특정 플랫폼 시작: `pnpm start <app-name> ios|android|web`
- 테스트: `pnpm test`
- 린트: `pnpm lint`

`pnpm start`는 내부적으로 `scripts/start.ts`에서 앱 선택 후 `pnpm --filter "@infinite-loop-factory/<app>" start`를 실행합니다.

## 5. 데이터/인증 아키텍처 핵심
### 5.1 현재 기본 패턴
- 인증: Supabase Auth
- 데이터 접근: Supabase JS Client (`from(...).select/insert/update`, `rpc(...)`)
- 캐시/동기화: TanStack React Query (`useQuery`, `useMutation`, `useInfiniteQuery`)

### 5.2 예시 파일
Supabase 클라이언트 초기화:
- `apps/dog-walk/api/supabaseClient.ts`
- `apps/country-tracker/src/lib/supabase.ts`
- `apps/delivery/supabase/utils/supabase.ts`

데이터 조회/변경 훅 (React Query):
- `apps/dog-walk/api/reactQuery/course/useFindCourse.ts`
- `apps/dog-walk/api/reactQuery/*`
- `apps/country-tracker/src/features/*/hooks/*`

RPC 사용 예시:
- `apps/country-tracker/src/features/map/apis/fetch-year-summaries.ts`

## 6. 백엔드(Spring) 개발자가 읽어야 하는 포인트
### 포인트 1: "API 계층"이 아직 분산돼 있음
- 많은 앱이 `service` 또는 `api/reactQuery` 폴더에서 바로 Supabase를 호출합니다.
- 전통적인 BFF/서버 API 계층(Controller-Service-Repository)은 이 레포 안에는 없습니다.

### 포인트 2: 앱마다 도메인 스키마가 다름
- 예: `delivery`는 생성된 타입 파일(`apps/delivery/supabase/supabase.ts`)에 `cart`, `order`, `menu`, `driver_location` 등 도메인이 명시돼 있습니다.
- 같은 Supabase라도 앱별 테이블/규칙이 분리된 형태입니다.

### 포인트 3: 인증/세션은 모바일 런타임 특성 반영
- `AsyncStorage` 기반 세션 유지
- `AppState` 활성/비활성 전환 시 토큰 자동 갱신 제어
- 웹/모바일 분기 로직 포함

## 7. Spring 백엔드 도입 시 현실적인 연결 전략
### 단계 1: 앱별 "데이터 접근 인터페이스" 먼저 고정
- 각 앱의 Supabase 직접 호출 코드를 바로 전면교체하지 말고, 앱 내부에서 API 호출 모듈 경계를 먼저 통일합니다.
- 예: `api/client.ts` 또는 `services/backend/*` 레이어를 만들고 화면/훅은 이 레이어만 참조하도록 정리합니다.

### 단계 2: Supabase 호출을 Spring API 호출로 점진 전환
- 초기에는 읽기 API부터 전환하는 것이 리스크가 낮습니다.
- React Query의 `queryKey`/`queryFn` 구조는 유지하고 `queryFn` 내부만 Supabase -> HTTP 호출로 변경하면 됩니다.

### 단계 3: 인증 전략 결정
- 선택지 A: Supabase Auth 유지 + Spring은 JWT 검증만 수행
- 선택지 B: Spring Security 중심으로 완전 전환
- 모바일 딥링크/OAuth(예: Naver, Google)까지 고려해 전환 순서를 정하는 것이 중요합니다.

### 단계 4: DB 책임 분리
- 현재처럼 Supabase(Postgres + RLS) 중심 운영인지,
- 혹은 Spring + 별도 DB(또는 Supabase를 단순 DB로만 사용)로 갈지 먼저 확정해야 API/권한 설계가 안정됩니다.

## 8. "Spring 개발자 온보딩" 관점에서 추천 읽기 순서
1. 루트 설정 파악: `package.json`, `pnpm-workspace.yaml`, `turbo.json`
2. 한 앱 선택(예: `dog-walk`) 후 진입점 확인: `app/_layout.tsx`
3. 데이터 흐름 확인: `api/reactQuery/*` -> `supabaseClient.ts`
4. 인증 흐름 확인: `AuthProvider`/`auth-context`
5. 그다음 Spring API 스펙(엔드포인트/권한/오류코드) 매핑표 작성

## 9. 현재 상태를 한 문장으로 정리
이 프로젝트는 "여러 Expo 앱이 공통 UI/유틸 패키지를 공유하면서, 다수 기능을 Supabase에 직접 연결해 동작하는 클라이언트 중심 모노레포"이며, Spring 백엔드 도입 시에는 앱별 데이터 접근 레이어를 먼저 표준화한 뒤 점진적으로 API 전환하는 방식이 가장 안전합니다.
