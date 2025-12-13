# AdMob 테스트 디바이스 ID 확인 가이드

## 목적
EAS Build APK에서 테스트 광고를 표시하려면 실제 Android 디바이스를 테스트 디바이스로 등록해야 합니다.

## 디바이스 ID 확인 방법

### 1. APK 설치 및 실행
```bash
# EAS Build로 생성된 APK를 디바이스에 설치
# 앱을 실행하여 광고 화면(QuestionListScreen)으로 이동
```

### 2. ADB 연결
```bash
# USB 디버깅 활성화 확인
adb devices

# 출력 예시:
# List of devices attached
# XXXXXXXXXX	device
```

### 3. AdMob 로그 필터링
```bash
# AdMob 관련 로그만 출력
adb logcat | grep "GADMobileAds"
```

### 4. 디바이스 ID 확인
로그에서 다음과 같은 메시지를 찾습니다:

```
I/Ads     : Use RequestConfiguration.Builder().setTestDeviceIds(Arrays.asList("33BE2250B43518CCDA7DE426D04EE231"))
```

또는:

```
I/Ads     : To get test ads on this device, set:
            GADMobileAds.sharedInstance.requestConfiguration.testDeviceIdentifiers = @[ @"33BE2250B43518CCDA7DE426D04EE231" ];
```

**디바이스 ID**: `33BE2250B43518CCDA7DE426D04EE231` (예시)

### 5. 코드에 디바이스 ID 추가

**파일**: `src/app/_layout.tsx`

```typescript
return mobileAds().setRequestConfiguration({
  testDeviceIdentifiers: [
    "EMULATOR", // 에뮬레이터 자동 인식
    "33BE2250B43518CCDA7DE426D04EE231", // ← 여기에 확인한 ID 추가
  ],
});
```

### 6. 재빌드 및 테스트
```bash
# 새로운 APK 빌드
eas build -p android --profile preview

# APK 다운로드 및 설치 후 테스트
```

## 성공 확인 방법

### 1. 시각적 확인
- ✅ "[테스트 모드] AdMob 배너 ✅" 라벨 표시
- ✅ Google 테스트 광고 내용 표시
- ✅ 광고 하단에 "Test Ad" 또는 "Google Mobile Ads" 마킹

### 2. 로그 확인
```bash
adb logcat | grep "AdMob"

# 성공 로그:
# [AdMob] Banner ad loaded successfully
# [AdMob] Test device configuration set
```

### 3. 실패 시 로그
```bash
# 에러 로그:
# [AdMob] Banner ad failed to load: [에러 메시지]

# QuestionListScreen 하단에 빨간색 에러 메시지 표시:
# "광고 로드 실패: [에러 내용]"
```

## 문제 해결

### 1. 디바이스 ID가 로그에 안 나타남
- 앱이 실제로 광고를 요청했는지 확인
- QuestionListScreen(모드 4 선택)으로 이동했는지 확인
- 인터넷 연결 확인

### 2. 디바이스 ID 추가했는데도 광고 안 나옴
```bash
# 전체 AdMob 로그 확인
adb logcat | grep -i "ad"

# SDK 초기화 확인
adb logcat | grep "MobileAds"
```

**체크리스트**:
- [ ] `src/constants/admob.ts`의 `useTestAds = true` 확인
- [ ] `src/app/_layout.tsx`에 올바른 디바이스 ID 추가 확인
- [ ] APK 재빌드 및 재설치 확인
- [ ] 인터넷 연결 확인

### 3. 광고 영역만 보이고 광고 안 나옴
**현재 상황**: 이 문서가 해결하려는 문제

**원인**:
- `__DEV__ = false`로 인해 TestIds 사용 안 됨
- 실제 디바이스가 테스트 디바이스로 등록 안 됨

**해결**:
- `useTestAds = true`로 강제 설정 (완료)
- 테스트 디바이스 항상 등록 (완료)
- 디바이스 ID 추가 (이 가이드 따라 진행)

## 대체 방법: AdMob 대시보드에서 확인

### 1. Google AdMob 콘솔 접속
https://apps.admob.google.com/

### 2. 설정 → 테스트 디바이스 메뉴
- 디바이스 이름 입력
- 디바이스 ID 확인 및 등록

### 3. 등록된 디바이스 ID 사용
AdMob 대시보드에서 확인한 ID를 코드에 추가

## 참고 문서
- Google AdMob 공식 문서: https://developers.google.com/admob/android/test-ads
- react-native-google-mobile-ads: https://docs.page/invertase/react-native-google-mobile-ads/testing

---

**작성일**: 2025-01-26
**버전**: 1.0.0
**최종 업데이트**: AdMob 테스트 디바이스 ID 확인 가이드 작성
