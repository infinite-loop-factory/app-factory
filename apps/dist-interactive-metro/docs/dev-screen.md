# 개발자 모드 화면 (Dev Screen)

앱 내 DB 시각화 및 공공 데이터 API 동기화 상태를 확인하는 **개발자 전용** 화면입니다.

---

## 접근 방법

- **__DEV__ (개발 빌드)** 에서만 탭 바에 **"Dev"** 탭이 노출됩니다.
- 프로덕션 빌드에서는 탭이 숨겨지며, `/dev`로 직접 진입해도 홈으로 리다이렉트됩니다.

---

## 화면 구성

### 1. Database entities (DB 시각화)

앱에서 다루는 로컬 DB 엔티티를 시각화합니다.

| 엔티티 | 스키마 요약 | 설명 |
|--------|-------------|------|
| **Lines (노선)** | id, name, nameEn, color, stations[] | 노선 정보 |
| **Stations (역)** | id, name, nameEn, lineIds[], stationNumber, coordinates? | 역 정보 |
| **Distances (역간 거리)** | fromStationId, toStationId, distance, lineId | 역 간 거리(미터) |
| **Transfers (환승)** | stationId, fromLineId, toLineId, transferDistance, transferTime? | 환승 정보 |

각 엔티티별 **현재 로컬에 저장된 항목 수**가 표시됩니다. (동기화 후 `SyncStatusContext`의 `items`와 연동)

### 2. Sync status (API → 로컬 동기화)

공공 데이터 API를 통해 로컬에 동기화했을 때의 상태를 표시합니다.

- **Status**: `Idle` / `Syncing…` / `Success` / `Error`
- **Last sync**: 마지막 동기화 완료 시각 (타임스탬프, 로컬 포맷)
- **Synced items**: 동기화된 항목 수 (Lines, Stations, Distances, Transfers)
- **Error**: 동기화 실패 시 에러 메시지

---

## 실제 동기화 연동 방법

API 동기화를 구현한 뒤, 아래처럼 `SyncStatusContext`를 사용하면 Dev 화면에 자동 반영됩니다.

1. **동기화 시작 시**
   ```ts
   useSyncStatus().setSyncStatus("syncing");
   ```

2. **동기화 완료 시 (성공)**
   ```ts
   useSyncStatus().setLastSync(Date.now(), {
     lines: linesCount,
     stations: stationsCount,
     distances: distancesCount,
     transfers: transfersCount,
   });
   ```

3. **동기화 실패 시**
   ```ts
   useSyncStatus().setLastSync(Date.now(), currentItems, "에러 메시지");
   ```

- `SyncStatusProvider`는 루트 `_layout.tsx`에서 이미 감싸져 있으므로, 동기화 서비스/훅에서 `useSyncStatus()`만 호출하면 됩니다.

---

## Dev 전용 액션 (현재)

- **Simulate successful sync**: 성공 시나리오로 타임스탬프·항목 수 갱신 (테스트용)
- **Simulate sync error**: 실패 시나리오로 에러 메시지 표시 (테스트용)
- **Reset sync state**: 동기화 상태 초기화

실제 API 연동 후에는 위 시뮬레이션 버튼을 제거하거나, "Sync now" 버튼으로 교체해 실제 동기화를 트리거할 수 있습니다.

---

*참고: `src/context/sync-status-context.tsx`, `src/types/sync-status.ts`, `src/app/(tabs)/dev.tsx`*
