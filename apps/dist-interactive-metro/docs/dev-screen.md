# 개발자 화면 (Dev Tab)

`__DEV__` 빌드에서만 탭 바에 표시되는 개발자 전용 탭입니다. 프로덕션 빌드에서는 탭이 숨겨지고 `/dev` 직접 접근 시 홈으로 리다이렉트됩니다.

관련 파일: `src/app/(tabs)/dev.tsx`, `src/components/dev/api-inspector.tsx`

---

## 섹션 1: Database Entities

로컬 DB 엔티티별 현재 항목 수 표시. `SyncStatusContext.items`와 연동.

| 엔티티 | 스키마 |
|--------|--------|
| Lines (노선) | id, name, nameEn, color, stations[] |
| Stations (역) | id, name, nameEn, lineIds[], stationNumber, coordinates? |
| Distances (역간 거리) | fromStationId, toStationId, distance, lineId |
| Transfers (환승) | stationId, fromLineId, toLineId, transferDistance, transferTime? |

---

## 섹션 2: Sync Status

KRIC API → 로컬 동기화 상태.

- **Status**: `Idle` / `Syncing…` / `Success` / `Error`
- **Last sync**: 마지막 완료 타임스탬프
- **Synced items**: 동기화된 항목 수 (노선·역·거리·환승)
- **Error**: 실패 시 에러 메시지

### SyncStatusContext 연동

```ts
// 동기화 시작
useSyncStatus().setSyncStatus("syncing");

// 동기화 완료
useSyncStatus().setLastSync(Date.now(), {
  lines: linesCount,
  stations: stationsCount,
  distances: 0,
  transfers: transfersCount,
});

// 동기화 실패
useSyncStatus().setLastSync(Date.now(), currentItems, "에러 메시지");
```

---

## 섹션 3: API Inspector

KRIC API를 화면에서 직접 테스트할 수 있는 도구 (`ApiInspector` 컴포넌트).

### 지원 엔드포인트

| 엔드포인트 | 설명 |
|------------|------|
| `subwayRouteInfo` | 노선별 역 목록 |
| `subwayTimetable` | 노선 시간표 |
| `stationTimetable` | 역 출발 시간표 |
| `stationTransferInfo` | 환승 거리/시간 |
| `transferMovement` | 환승 이동 단계 (엘리베이터 등) |

### 공통 쿼리 옵션

- **노선 선택**: 14개 노선 드롭다운
- **역 선택**: 텍스트 입력 + 자동완성 드롭다운 (`getAllStations()` 기반)
- **요일 코드**: 평일 / 토요일 / 일요일·공휴일

### transferMovement 추가 옵션

`transferMovement`는 세 개의 역 참조 필요:
- 이전 역 (prevStinCd)
- 환승 목표 노선 (chthTgtLn)
- 다음 역 (chtnNextStinCd)

`TransferExtras` 서브컴포넌트에서 처리.

### 결과 포맷

엔드포인트별로 앱 사용 방식에 맞게 포맷된 결과 패널 표시:
- `RouteInfoResult`: 역 목록 (순서 포함)
- `TimetableResult`: 출발 시간 목록
- `TransferInfoResult`: 보행 거리 카드
- `TransferMovementResult`: 단계별 이동 경로

---

## 섹션 4: Dev Actions

| 버튼 | 동작 |
|------|------|
| Simulate successful sync | `syncKricStations({ force: true })` 실행 → 실제 API 호출 |
| Simulate sync error | 1초 후 에러 상태로 전환 (네트워크 오류 시뮬레이션) |
| Reset sync state | 동기화 상태 초기화 |
