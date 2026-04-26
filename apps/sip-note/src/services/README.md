# `src/services` — 교차-feature 부수효과 모듈

여러 feature 가 공유하는 네이티브/IO 작업을 캡슐화한다.

## 모듈

- `photo/` — 카메라(`expo-camera`) / 갤러리(`expo-image-picker`) / 압축(`expo-image-manipulator`) / 파일 저장(`expo-file-system`)
- `location/` — 위치 권한 / 현위치 / 지오펜싱(`expo-location` + `expo-task-manager`)
- `notification/` — 로컬 알림 스케줄링(`expo-notifications`)
- `export/` — JSON + 사진 묶음 → 공유 시트(`expo-sharing`)

## 규칙

- feature 코드가 이 모듈만 호출하고, 모듈은 expo SDK 만 호출 — 의존성 단방향
- 권한 요청은 모듈 내부에서 처리, feature 는 결과(URI / 좌표) 만 받음
