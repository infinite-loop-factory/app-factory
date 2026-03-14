# KRIC API 연동

## 선택한 API

**한국철도데이터활용센터 (KRIC) Open API**
[https://data.kric.go.kr](https://data.kric.go.kr)

초기에 공공데이터포털(data.go.kr)의 여러 API를 검토했으나, 수도권 전체 노선(1~9호선 + 광역철도)을 단일 키로 커버할 수 있는 KRIC으로 확정했습니다. 인증: `EXPO_PUBLIC_KRIC_SERVICE_KEY` 환경 변수.

---

## 사용 중인 엔드포인트

모두 `src/lib/kric-api.ts`에서 호출됩니다.

### 1. subwayRouteInfo — 노선별 역 목록

```
GET /trainUseInfo/subwayRouteInfo
params: { lnCd, railOprIsttCd, serviceKey }
```

- 노선 코드(`lnCd`) + 운영기관 코드(`railOprIsttCd`)로 전체 역 목록 조회
- **용도**: 앱 시작 시 `syncKricStations()` 실행 → 정적 데이터에 없는 노선 역 동적 로드

### 2. subwayTimetable — 노선 시간표

```
GET /trainUseInfo/subwayTimetable
params: { lnCd, railOprIsttCd, stinCd, dayCd, serviceKey }
dayCd: 1(평일) | 2(토요일) | 3(일요일·공휴일)
```

- 특정 역의 하루 전체 시간표
- **용도**: `useStationTimetable` 훅에서 현재 시각 이후 N건 필터

### 3. stationTimetable — 역 출발 시간표

```
GET /convenientInfo/stationTimetable
params: { lnCd, railOprIsttCd, stinCd, dayCd, serviceKey }
```

- subwayTimetable과 유사, 편의정보 그룹 엔드포인트
- **용도**: `useStationTimetable` 훅의 주 호출 대상 (stationTimetable 우선)

### 4. stationTransferInfo — 환승 거리 정보

```
GET /convenientInfo/stationTransferInfo
params: { stinCd, railOprIsttCd, serviceKey }
```

응답 필드:
- `chtnLn`: 환승 대상 노선명
- `mvTm`: 이동 시간 (분)
- `mvDstnc`: 이동 거리 (m)

**용도**: `useTransferInfo` 훅 → 환승 구간 보행 거리·예상 시간 표시

### 5. transferMovement — 환승 이동 경로

```
GET /vulnerableUserInfo/transferMovement
params: { prevStinCd, chthTgtLn, chtnNextStinCd, serviceKey }
```

응답: 단계별 이동 경로 (엘리베이터/계단 포함)
**용도**: `useTransferMovement` 훅 → 접근성 환승 경로 안내

---

## KRIC 코드 맵

역 이름 + 노선 이름을 KRIC 코드로 변환하는 맵.

```typescript
// 키: "stinNm|kricLnCd" (예: "강남|2")
// 값: { stinCd, railOprIsttCd, lnCd }
```

- `getCodeMap()` — AsyncStorage 캐시 (24시간 TTL) 또는 API 재조회
- `getKricRef(stationName, lineName)` — 앱 노선명 → KRIC 코드 변환 후 반환

### 앱 노선명 → KRIC lnCd 매핑

| 앱 노선명 | KRIC lnCd |
|----------|-----------|
| 1호선~9호선 | "1"~"9" |
| 신분당선 | "D" |
| 경의중앙선 | "K" |
| 공항철도 | "A" |
| 경춘선 | "P" |
| 수인분당선 | "BD" |

---

## 동적 역 동기화

```typescript
// src/data/kric-station-sync.ts
syncKricStations({ force?: boolean }): Promise<SyncResult>
```

- 앱 시작 시 호출 (`app/_layout.tsx`)
- 정적 데이터에 없는 노선(6, 8, 공항, 경의중앙, 경춘, 수인분당 등) 역을 KRIC에서 로드
- 결과를 `station-store.ts`의 `setDynamicStations()`로 병합
- `SyncStatusContext`에 상태 반영

---

## 주의사항

- `EXPO_PUBLIC_KRIC_SERVICE_KEY`는 절대 커밋하지 않습니다 (`.gitignore`에 `.env*` 포함)
- 모든 역 조회는 `getAllStations()` 사용 — 정적 `stations` 배열 직접 참조 금지
- KRIC API는 XML/JSON 모두 지원하나, 본 앱은 JSON만 사용
