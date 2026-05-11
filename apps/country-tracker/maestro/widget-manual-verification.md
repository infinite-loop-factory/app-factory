# 위젯 수동 검증 체크리스트

maestro는 iOS 홈스크린 위젯 자동화를 지원하지 않습니다. 아래 절차로 수동 검증하세요.

## iOS (시뮬레이터 / 디바이스)

### 사전
- [ ] `npx expo prebuild --platform ios --clean` 통과
- [ ] Xcode에서 `ios/CountryTracker.xcworkspace` 열림
- [ ] `CountryTracker` 메인 타겟 + `CountryWidget` extension 타겟 모두 빌드 성공
- [ ] `Signing & Capabilities`에서 두 타겟 모두 App Group `group.com.gracefullight.countrytracker` 활성화

### 위젯 추가 시나리오
1. 앱 빌드 + 실행 → 로그인 → 방문 데이터 1개 이상 있는 상태
2. 앱 종료 → 홈스크린 길게 누르기 → `+` → "Country Tracker" 검색 → 2x2 (Small) 위젯 추가
3. **확인**: 위젯에 헤더 "최근 방문", 최근 방문국 1-3개 (국기/이름/일수), 푸터 "총 N개국 · N일" 표시
4. 위젯 탭 → 앱이 deep link `country-tracker://home`으로 진입하는지 확인
5. 앱에서 새 방문 추가 → 앱 종료 → 홈스크린 위젯 데이터 갱신 확인 (수 초 내)

### 빈 상태 시나리오
1. 미로그인 또는 visits 0개인 계정으로 위젯 추가
2. **확인**: 헤더는 "Country Tracker", 본문 "여행을 기록해보세요", 푸터 "총 0개국 · 0일" 표시

### 다크모드
- [ ] 시스템 다크모드 전환 시 위젯 텍스트가 자동으로 라이트/다크 적응 (`.secondary` / `.primary` 컬러 자동 처리)

## Android (에뮬레이터 / 디바이스)

### 사전
- [ ] `npx expo prebuild --platform android --clean` 통과 또는 EAS dev build 설치
- [ ] `AndroidManifest.xml`에 `CountryWidget` AppWidgetProvider 등록 확인

### 위젯 추가 시나리오
1. 앱 설치 + 실행 → 로그인 → 방문 데이터 1개 이상
2. 앱 종료 → 홈스크린 길게 누르기 → "위젯" → "Country Tracker" → 2x2 위젯 드래그
3. **확인**: 동일 레이아웃 (헤더 / 최대 3행 / 푸터) 표시
4. 위젯 탭 → 앱 진입 확인
5. 새 방문 추가 후 → 위젯 갱신 확인 (앱 재진입 또는 수 초 후)

### 백그라운드 위치 트리거
1. 백그라운드 위치 권한 부여
2. (모의) 위치 변경으로 다른 국가 코드 감지 시뮬레이션
3. **확인**: 위젯이 새 국가 정보 반영하여 자동 갱신

### maestro 자동화 보조
- `maestro test maestro/flows/08-widget-render.yaml` — 앱 lifecycle만 검증 (위젯 OS 표시는 검증 못 함)

## 알려진 한계

- iOS 위젯 표시 텍스트는 시뮬레이터/디바이스에서 시각으로만 확인 가능 (XCUITest로도 launcher 텍스트 접근 제한)
- Android RemoteViews 텍스트는 maestro의 적절한 selector 없음 — 시각 확인 필요
- App Store/Play Console 첫 빌드 업로드 시 위젯 extension 자동 인식
