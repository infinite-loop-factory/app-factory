# Dist Interactive Metro

거리 기반 GPS 통합 지하철 경로 추천 앱 (수도권)

## 앱 소개

출발 승강장에서 도착 승강장까지 최적 경로를 추천하는 지하철 경로 안내 앱입니다. GPS로 주변 역을 자동 감지하고, KRIC(한국철도데이터활용센터) Open API를 통해 실시간 시간표와 환승 정보를 제공합니다.

### 핵심 기능

- **GPS 기반 출발역 자동 감지** — 현재 위치에서 가장 가까운 역 추천
- **Dijkstra 경로 탐색** — 거리 기반 최적 경로 계산
- **실시간 시간표** — KRIC API 연동, 다음 출발 시간 표시
- **환승 정보** — 환승 통로 보행 거리 및 예상 소요 시간
- **즐겨찾기** — 자주 쓰는 경로 저장 및 빠른 재검색
- **오프라인 지원** — 역 정보 캐싱 (KRIC 코드 맵 24시간 TTL)

## 탭 구성

| 탭 | 설명 |
|----|------|
| **홈 (Route)** | 출발·도착·경유 선택 → 경로 탐색 |
| **Go Now** | GPS로 현재 위치 기반 즉시 경로 추천 |
| **알림 (Notifications)** | 즐겨찾기 경로별 실시간 출발 시간 |
| **즐겨찾기 (Favorites)** | 저장된 경로 관리 |
| **설정 (Settings)** | 언어·기본 탭 설정 |
| **Dev** _(개발 빌드 전용)_ | API Inspector, DB 시각화, 동기화 시뮬레이션 |

## 기술 스택

| 항목 | 세부 |
|------|------|
| Framework | Expo SDK ~54, React Native 0.81.5 |
| Language | TypeScript 5.9+ |
| Routing | Expo Router 6 (파일 기반) |
| Styling | NativeWind 4 (Tailwind CSS) + Gluestack UI 3 |
| Icons | Lucide React Native |
| State | Context API (`RouteSearchContext`, `SyncStatusContext`) |
| Data API | KRIC Open API (5개 엔드포인트) |
| Caching | AsyncStorage (KRIC 코드 맵 24h TTL) |
| Location | expo-location |
| i18n | i18n-js (한국어·영어) |
| Linter | Biome |

## 환경 설정

```bash
# .env.local
EXPO_PUBLIC_KRIC_SERVICE_KEY=your_kric_service_key
```

KRIC API 키는 [https://data.kric.go.kr](https://data.kric.go.kr) 에서 발급합니다.

## 개발 실행

```bash
pnpm install
pnpm --filter dist-interactive-metro dev
```

## 문서

- [아키텍처](./docs/architecture.md) — 파일 구조, 데이터 흐름, 핵심 패턴
- [디자인](./docs/design.md) — 컬러 시스템, 컴포넌트, 화면 스펙
- [API 연동](./docs/api-research.md) — KRIC API 엔드포인트 및 사용 방법
- [사용자 플로우](./docs/user-flow.md) — 화면 구성 및 네비게이션
- [개발자 화면](./docs/dev-screen.md) — Dev 탭 기능 및 API Inspector
