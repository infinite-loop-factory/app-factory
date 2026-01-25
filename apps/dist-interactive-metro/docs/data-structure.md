# 데이터 구조 (Data Structure)

이 문서는 Dist Interactive Metro 앱에서 사용하는 지하철 노선, 역, 거리 데이터의 구조를 정의합니다.

## 📊 데이터 개요

### 데이터 유형
1. **노선 정보** (Lines)
2. **역 정보** (Stations)
3. **역 간 거리 정보** (Distances)
4. **환승 정보** (Transfers)

### 데이터 소스
- **공공포탈 API**: 지하철 노선 및 역 정보
- **데이터 범위**: 전국 노선 지원 목표, 현재는 수도권까지 구현
- **업데이트**: API를 통한 주기적 업데이트 지원
- **참고**: 지하철종결자 앱의 데이터 구조 참고

---

## 🚇 노선 정보 (Lines)

### 구조
```typescript
interface Line {
  id: string              // 노선 ID (예: "line-1", "line-2")
  name: string            // 노선명 (한글)
  nameEn: string          // 노선명 (영문)
  color: string           // 노선 색상 (HEX 코드)
  stations: string[]      // 역 ID 배열 (순서대로)
}
```

### 예시
```json
{
  "id": "line-1",
  "name": "1호선",
  "nameEn": "Line 1",
  "color": "#0052A4",
  "stations": ["station-101", "station-102", "station-103", ...]
}
```

---

## 🏢 역 정보 (Stations)

### 구조
```typescript
interface Station {
  id: string              // 역 ID (예: "station-101")
  name: string            // 역명 (한글)
  nameEn: string          // 역명 (영문)
  lineIds: string[]       // 소속 노선 ID 배열 (환승역의 경우 여러 개)
  stationNumber: string   // 역 번호 (예: "101", "201")
  coordinates?: {         // 좌표 (선택사항, 지도 표시용)
    lat: number
    lng: number
  }
}
```

### 예시
```json
{
  "id": "station-101",
  "name": "서울역",
  "nameEn": "Seoul Station",
  "lineIds": ["line-1", "line-4"],
  "stationNumber": "101",
  "coordinates": {
    "lat": 37.554648,
    "lng": 126.970258
  }
}
```

---

## 📏 역 간 거리 정보 (Distances)

### 구조
```typescript
interface Distance {
  fromStationId: string   // 출발 역 ID
  toStationId: string     // 도착 역 ID
  distance: number         // 거리 (미터 단위)
  lineId: string          // 해당 노선 ID
}
```

### 예시
```json
{
  "fromStationId": "station-101",
  "toStationId": "station-102",
  "distance": 1200,
  "lineId": "line-1"
}
```

**참고**: 
- 양방향 거리는 동일하다고 가정 (from→to = to→from)
- 또는 양방향 모두 저장 가능

---

## 🔄 환승 정보 (Transfers)

### 구조
```typescript
interface Transfer {
  stationId: string        // 환승역 ID
  fromLineId: string      // 출발 노선 ID
  toLineId: string        // 도착 노선 ID
  transferDistance: number // 환승 통로 거리 (미터 단위)
  transferTime?: number   // 환승 소요 시간 (초 단위, 선택사항)
}
```

### 예시
```json
{
  "stationId": "station-101",
  "fromLineId": "line-1",
  "toLineId": "line-4",
  "transferDistance": 150,
  "transferTime": 180
}
```

---

## 📁 데이터 관리 구조

### API 기반 데이터 구조
```
services/
├── subway-api-client.ts    # 공공포탈 API 클라이언트
├── subway-data-loader.ts   # 데이터 로딩 및 파싱
└── subway-cache.ts         # 로컬 캐싱 관리
```

### 로컬 캐시 구조
```
캐시 저장소 (AsyncStorage 또는 SQLite):
- lines_cache: 노선 정보 캐시
- stations_cache: 역 정보 캐시
- distances_cache: 거리 정보 캐시
- transfers_cache: 환승 정보 캐시
- cache_metadata: 캐시 버전 및 업데이트 시간
```

### 데이터 범위
- **현재 지원**: 수도권 지하철 노선
- **향후 확장**: 전국 노선 (TODO)

---

## 🔍 데이터 관계도

```
Lines (노선)
  ↓ (1:N)
Stations (역)
  ↓ (1:N)
Distances (거리)
  ↓
Transfers (환승) ← Stations (환승역)
```

---

## 📝 데이터 예시 (전체)

### lines.json
```json
[
  {
    "id": "line-1",
    "name": "1호선",
    "nameEn": "Line 1",
    "color": "#0052A4",
    "stations": ["station-101", "station-102", "station-103"]
  },
  {
    "id": "line-2",
    "name": "2호선",
    "nameEn": "Line 2",
    "color": "#00A84D",
    "stations": ["station-201", "station-202", "station-203"]
  }
]
```

### stations.json
```json
[
  {
    "id": "station-101",
    "name": "서울역",
    "nameEn": "Seoul Station",
    "lineIds": ["line-1", "line-4"],
    "stationNumber": "101"
  },
  {
    "id": "station-102",
    "name": "시청역",
    "nameEn": "City Hall",
    "lineIds": ["line-1", "line-2"],
    "stationNumber": "102"
  }
]
```

### distances.json
```json
[
  {
    "fromStationId": "station-101",
    "toStationId": "station-102",
    "distance": 1200,
    "lineId": "line-1"
  },
  {
    "fromStationId": "station-102",
    "toStationId": "station-103",
    "distance": 950,
    "lineId": "line-1"
  }
]
```

### transfers.json
```json
[
  {
    "stationId": "station-101",
    "fromLineId": "line-1",
    "toLineId": "line-4",
    "transferDistance": 150,
    "transferTime": 180
  }
]
```

---

## 🗂️ 그래프 구조

### 노드 (Node)
- 각 역을 노드로 표현
- 역 ID를 노드 ID로 사용

### 엣지 (Edge)
- 인접한 역 간 연결을 엣지로 표현
- 엣지의 가중치 = 거리 (미터)
- 환승의 경우 추가 엣지 생성 (환승 거리 포함)

### 예시 그래프
```
[서울역] --1200m--> [시청역] --950m--> [종각역]
   |                                      |
   | (환승: 150m)                         |
   ↓                                      |
[서울역-4호선] --800m--> [회현역]
```

---

## 🔄 데이터 업데이트 전략

### API 연동
- 공공포탈 API를 통한 데이터 수집
- 주기적 업데이트 (앱 시작 시 또는 백그라운드)
- 버전 관리 및 변경 감지

### 캐싱 전략
- 최초 로딩 시 API에서 데이터 수집
- 로컬 캐시에 저장 (AsyncStorage 또는 SQLite)
- 오프라인 시 캐시된 데이터 활용
- 캐시 만료 시 재요청

### 데이터 범위
- **현재**: 수도권 지하철 노선
- **향후**: 전국 노선 확장 (TODO)

## 📝 구현 참고

### 지하철종결자 앱 참고
- 데이터 구조 및 형식 참고
- 필요한 부분만 개선하여 적용
