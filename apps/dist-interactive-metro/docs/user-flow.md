# 사용자 플로우

## 탭 구조

```
탭 바 (하단)
├── 홈 (Route)       — 경로 검색
├── Go Now           — GPS 즉시 추천
├── 알림             — 즐겨찾기 시간표
├── 즐겨찾기         — 저장된 경로
├── 설정             — 앱 설정
└── Dev              — 개발자 도구 (__DEV__ 전용)
```

---

## 주요 플로우

### 플로우 A — 기본 경로 검색

```
홈 탭
  → 출발역(빈칸) 탭 → departure-select (GPS 기반)
      또는 station-select (검색)
  → 도착역(빈칸) 탭 → station-select (type: "end")
  → [선택] 경유 추가 → station-select (type: "via")
  → 경로 찾기 버튼
  → route-result
  → (뒤로가기) 홈 탭
```

### 플로우 B — Go Now (GPS 즉시 경로)

```
Go Now 탭 (자동 GPS 감지)
  → 주변 역 카드 표시 (ElevatedCard × 3)
  → 카드 선택 → 자동 경로 계산 → route-result
```

### 플로우 C — 즐겨찾기에서 재검색

```
즐겨찾기 탭
  → 저장된 경로 카드 탭
  → route-result (start/end/via params 전달)
```

### 플로우 D — 알림 탭

```
알림 탭 (즐겨찾기 경로 자동 로드)
  → 각 경로별 다음 출발 시간 실시간 표시
  → 경로 카드 탭 → route-result
```

---

## 화면 상세

### 홈 탭 (index.tsx)

| 상태 | 레이아웃 |
|------|----------|
| Mode A (역 미선택) | 출발·도착 필드 수직 중앙 |
| Mode B (역 선택 후) | 필드 상단 이동 + 경로 찾기 버튼 표시 |

- 경로 찾기 버튼: 출발·도착 모두 선택 시 활성화
- 경유역: 최대 3개 추가 가능

### departure-select.tsx

출발역 선택 전용. GPS로 주변 역 자동 탐지.

| 상태 | UI |
|------|-----|
| loading | ActivityIndicator |
| granted | 가장 가까운 역 하이라이트 + 2~3위 카드 |
| denied | 권한 거부 안내 |
| error | 에러 메시지 + 재시도 버튼 |

하단 "모든 역 검색" → `station-select?type=start`로 이동.

### station-select.tsx

공통 역 검색/선택 화면. `type` 파라미터로 start / via / end 구분.

- 상단 고정: 검색 입력 + 노선 필터 탭
- 역 목록: FlatList (최근 역 또는 검색 결과)

### route-result.tsx

경로 탐색 결과 표시. `start`, `end`, `via?` 파라미터를 받아 `calculateRoute()` 실행.

- 요약 카드: 소요 시간, 역 수, 환승 횟수, 다음 출발 시간, 즐겨찾기 버튼
- 상세 경로 카드: 수직 타임라인, 환승 구간 보행 거리 표시

---

## 에러 처리

| 상황 | 처리 |
|------|------|
| GPS 권한 거부 | 수동 검색으로 폴백, 권한 안내 |
| 위치 취득 실패 | 에러 카드 + 재시도 버튼 |
| 경로 없음 | "경로를 찾을 수 없습니다" 메시지 + 뒤로가기 |
| KRIC API 실패 | 시간표/환승 정보만 숨김, 경로 결과는 정상 표시 |
| 동기화 실패 | Dev 탭에서 확인, 정적 역 데이터로 폴백 |

---

## 네비게이션 파라미터

| 화면 | 파라미터 |
|------|----------|
| `station-select` | `type: "start" \| "via" \| "end"` |
| `route-result` | `start: stationId, end: stationId, via?: stationId` |
