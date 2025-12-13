# AdMob 기술 구현 가이드

EasyTalking 앱에 Google AdMob을 안전하게 통합하기 위한 완전한 개발자 가이드

**최종 업데이트**: 2025-01-26 | **버전**: 2.0.0 (환경변수 기반)

---

## 📋 목차

1. [개요](#개요)
2. [환경 분리 전략](#환경-분리-전략)
3. [설치 및 설정](#설치-및-설정)
4. [구현 가이드](#구현-가이드)
5. [테스트 디바이스 설정](#테스트-디바이스-설정)
6. [광고 타입별 구현](#광고-타입별-구현)
7. [트러블슈팅](#트러블슈팅)

---

## 개요

### 왜 테스트 광고를 사용해야 하나요?

**⚠️ 중요**: 개발 중 실제 광고 ID를 사용하면 Google AdMob 정책 위반으로 계정이 정지될 수 있습니다.

**해결책**: `react-native-google-mobile-ads`는 개발용 테스트 광고 ID(`TestIds`)를 제공합니다.

### 테스트 광고 vs 실제 광고

| 구분 | 테스트 광고 (개발) | 실제 광고 (프로덕션) |
|------|-------------------|---------------------|
| 광고 ID | `TestIds.BANNER` 등 | `ca-app-pub-xxx...` |
| 수익 발생 | ❌ 없음 | ✅ 있음 |
| 계정 위험 | ✅ 안전 | ⚠️ 잘못 사용 시 정지 |
| 사용 환경 | 개발/디버깅 | 프로덕션 배포 |

---

## 환경 분리 전략

### EasyTalking 구현 방식: 환경변수 기반

**핵심 원칙**: `.env` 파일로 테스트/프로덕션 자동 전환

```typescript
// ✅ 현재 구현: 환경변수 기반 (src/constants/admob.ts)
const useTestAds = process.env.EXPO_PUBLIC_USE_TEST_ADS === "true";

export const AdMobIds = {
  BANNER: useTestAds ? TestIds.BANNER : process.env.EXPO_PUBLIC_ADMOB_BANNER_ID,
  // ...
};
```

### 환경별 자동 전환

```bash
# 개발/테스트 빌드 (자동으로 TestIds 사용)
npm start                                    # .env.development
eas build -p android --profile preview      # .env.development

# 프로덕션 빌드 (자동으로 실제 AdMob IDs 사용)
eas build -p android --profile production   # .env.production
```

### 환경변수 파일 구조

```
.env.development   # 테스트 광고 설정 (Git 커밋 O)
.env.production    # 실제 광고 설정 (Git 커밋 X - .gitignore)
.env.example       # 템플릿 파일 (문서화용)
```

**`.env.development` 내용**:
```bash
EXPO_PUBLIC_USE_TEST_ADS=true
```

**`.env.production` 내용**:
```bash
EXPO_PUBLIC_USE_TEST_ADS=false
EXPO_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-실제ID~실제ID
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-실제ID/실제ID
# ... 나머지 광고 단위 IDs
```

### 보안 주의사항

- ✅ `.env.production` 파일은 `.gitignore`에 추가되어 Git에 절대 커밋 안 됨
- ✅ 실제 AdMob ID는 로컬에만 존재
- ✅ 개발 중 TestIds만 사용하여 계정 안전
- ⚠️ **개발 중 실제 광고 클릭 절대 금지** (AdMob 정책 위반 → 계정 정지)

---

## 설치 및 설정

### 1단계: 라이브러리 설치

```bash
npm install react-native-google-mobile-ads
```

**현재 버전**: `react-native-google-mobile-ads@15.8.3`

### 2단계: Expo 플러그인 설정

**`app.config.ts` 수정**:

```typescript
import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  // ... 기존 설정 ...
  plugins: [
    "expo-router",
    "expo-localization",
    "expo-font",
    [
      "react-native-google-mobile-ads",
      {
        // AdMob 앱 ID (Google AdMob 대시보드에서 발급)
        // 개발/테스트: Google 공식 테스트 App ID
        // 프로덕션: 실제 AdMob 계정에서 발급받은 App ID로 교체
        androidAppId: "ca-app-pub-3940256099942544~3347511713",  // Test App ID
        iosAppId: "ca-app-pub-3940256099942544~1458002511",       // Test App ID

        // iOS 14+ App Tracking Transparency 메시지
        userTrackingUsageDescription: "맞춤형 광고를 제공하기 위해 사용됩니다."
      }
    ]
  ],
  // ... 기존 설정 ...
});
```

**⚠️ 주의**:
- `androidAppId`/`iosAppId`는 **앱 ID** (물결표 `~` 포함)
- 광고 단위 ID (슬래시 `/` 포함)와 다름
- Google AdMob 대시보드 > 앱 설정에서 확인

### 3단계: 환경변수 파일 생성

프로젝트 루트에 환경변수 파일 생성:

**`.env.development`**:
```bash
# 개발/테스트 환경 설정
EXPO_PUBLIC_USE_TEST_ADS=true
```

**`.env.production`**:
```bash
# 프로덕션 환경 설정
EXPO_PUBLIC_USE_TEST_ADS=false
EXPO_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXX~YYYYYYYYYY
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXX/YYYYYYYYYY
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXX/YYYYYYYYYY
EXPO_PUBLIC_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXX/YYYYYYYYYY
EXPO_PUBLIC_ADMOB_APP_OPEN_ID=ca-app-pub-XXXXXXXXXXXXX/YYYYYYYYYY
```

**`.gitignore` 업데이트**:
```bash
# .env.production 파일 Git 추적 제외 (보안)
.env.production
.env.local
.env*.local
```

### 4단계: EAS 빌드 또는 재설치

```bash
# 네이티브 코드 변경으로 인해 재빌드 필요
eas build -p android --profile preview

# 또는 로컬 개발 시
npx expo prebuild --clean
npm run android
```

---

## 구현 가이드

### 1단계: 광고 ID 상수 정의

**`src/constants/admob.ts` 생성** (이미 완료됨):

```typescript
import { TestIds } from "react-native-google-mobile-ads";
import { Platform } from "react-native";

/**
 * 환경변수에서 테스트 모드 여부 읽기
 */
const useTestAds = process.env.EXPO_PUBLIC_USE_TEST_ADS === "true";

/**
 * 프로덕션 AdMob Unit IDs
 * .env.production 파일에서 환경변수로 관리
 */
const PRODUCTION_IDS = {
  BANNER: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || "PLACEHOLDER_BANNER_ID",
  INTERSTITIAL:
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ||
    "PLACEHOLDER_INTERSTITIAL_ID",
  REWARDED:
    process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || "PLACEHOLDER_REWARDED_ID",
  APP_OPEN:
    process.env.EXPO_PUBLIC_ADMOB_APP_OPEN_ID || "PLACEHOLDER_APP_OPEN_ID",
};

/**
 * 광고 단위 ID 설정
 * - 테스트 모드 (useTestAds=true): Google 공식 TestIds 사용
 * - 프로덕션 모드 (useTestAds=false): 환경변수의 실제 AdMob IDs 사용
 */
export const AdMobIds = {
  // 배너 광고 (하단 고정, 인라인)
  BANNER: useTestAds ? TestIds.BANNER : PRODUCTION_IDS.BANNER,

  // 전면 광고 (화면 전환 시 - 향후 사용)
  INTERSTITIAL: useTestAds ? TestIds.INTERSTITIAL : PRODUCTION_IDS.INTERSTITIAL,

  // 리워드 광고 (보상형 - 향후 사용)
  REWARDED: useTestAds ? TestIds.REWARDED : PRODUCTION_IDS.REWARDED,

  // 앱 오픈 광고 (앱 시작 시 - 향후 사용)
  APP_OPEN: useTestAds ? TestIds.APP_OPEN : PRODUCTION_IDS.APP_OPEN,
} as const;

/**
 * 현재 환경 확인 유틸리티
 */
export const isTestAdsEnabled = useTestAds;

/**
 * 광고 환경 정보 출력 (디버깅용)
 */
export const logAdEnvironment = () => {
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log("===== AdMob Environment =====");
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log(`Platform: ${Platform.OS}`);
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log(`Test Ads Enabled: ${useTestAds}`);
  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log(`Environment: ${useTestAds ? "DEVELOPMENT/TEST" : "PRODUCTION"}`);

  if (useTestAds) {
    // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
    console.log("✅ Using Google TestIds (Safe for development)");
  } else {
    // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
    console.log("⚠️ Using Production AdMob IDs");
    // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
    console.log(`Banner ID: ${AdMobIds.BANNER}`);

    // 프로덕션 모드인데 PLACEHOLDER 사용 시 경고
    if (AdMobIds.BANNER.includes("PLACEHOLDER")) {
      // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
      console.warn(
        "⛔ WARNING: Production mode enabled but using PLACEHOLDER IDs!",
      );
      // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
      console.warn(
        "⛔ Please update .env.production with actual AdMob Unit IDs",
      );
    }
  }

  // biome-ignore lint/suspicious/noConsole: Debug function for AdMob environment
  console.log("=============================");
};
```

### 2단계: SDK 초기화

**`src/app/_layout.tsx` 수정** (이미 완료됨):

```typescript
import { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { logAdEnvironment } from '@/constants/admob';

export default function RootLayout() {
  useEffect(() => {
    // AdMob SDK 초기화
    mobileAds()
      .initialize()
      .then(() => {
        console.log('[AdMob] SDK initialized successfully');
        logAdEnvironment(); // 환경 정보 출력
      })
      .catch((error) => {
        console.error('[AdMob] Initialization failed:', error);
      });

    // 테스트 디바이스 설정 (개발 환경)
    mobileAds()
      .setRequestConfiguration({
        testDeviceIdentifiers: [
          'EMULATOR', // 에뮬레이터 자동 인식
          // 실제 디바이스 ID는 아래 "테스트 디바이스 설정" 섹션 참고
        ],
      })
      .then(() => {
        console.log('[AdMob] Test device configuration set');
      });
  }, []);

  return (
    // ... 기존 코드 ...
  );
}
```

### 3단계: 배너 광고 컴포넌트 생성

**`src/components/ads/BannerAd.tsx` 생성** (이미 완료됨):

```typescript
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AdMobIds } from '@/constants/admob';

interface BannerAdComponentProps {
  size?: BannerAdSize;
}

export function BannerAdComponent({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER
}: BannerAdComponentProps) {
  return (
    <BannerAd
      unitId={AdMobIds.BANNER}
      size={size}
      requestOptions={{
        requestNonPersonalizedAdsOnly: false,
      }}
      onAdLoaded={() => {
        console.log('[AdMob] Banner ad loaded successfully');
      }}
      onAdFailedToLoad={(error) => {
        console.error('[AdMob] Banner ad failed to load:', error);
      }}
    />
  );
}
```

### 4단계: 화면에 배너 광고 추가

```typescript
import { BannerAdComponent } from '@/components/ads/BannerAd';
import { BannerAdSize } from 'react-native-google-mobile-ads';

export default function YourScreen() {
  return (
    <View className="flex-1">
      {/* 기존 콘텐츠 */}

      {/* 하단 광고 영역 */}
      <View className="border-gray-200 border-t bg-white px-5 py-3">
        <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    </View>
  );
}
```

---

## 테스트 디바이스 설정

### 실제 Android 디바이스에서 테스트 광고 보기

EAS Build APK에서 테스트 광고를 표시하려면 실제 Android 디바이스를 테스트 디바이스로 등록해야 합니다.

### 1단계: APK 설치 및 실행

```bash
# EAS Build로 생성된 APK를 디바이스에 설치
eas build -p android --profile preview
eas build:download -p android

# APK 설치 후 앱 실행
# 광고가 표시되는 화면으로 이동 (예: QuestionListScreen)
```

### 2단계: ADB 연결

```bash
# USB 디버깅 활성화 확인
adb devices

# 출력 예시:
# List of devices attached
# XXXXXXXXXX	device
```

### 3단계: AdMob 로그에서 디바이스 ID 확인

```bash
# AdMob 관련 로그만 출력
adb logcat | grep "GADMobileAds"
```

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

### 4단계: 코드에 디바이스 ID 추가

**파일**: `src/app/_layout.tsx`

```typescript
mobileAds()
  .setRequestConfiguration({
    testDeviceIdentifiers: [
      "EMULATOR", // 에뮬레이터 자동 인식
      "33BE2250B43518CCDA7DE426D04EE231", // ← 여기에 확인한 ID 추가
    ],
  })
  .then(() => {
    console.log('[AdMob] Test device configuration set');
  });
```

### 5단계: 재빌드 및 테스트

```bash
# 새로운 APK 빌드
eas build -p android --profile preview

# APK 다운로드 및 설치 후 테스트
```

### 성공 확인 방법

#### 시각적 확인
- ✅ Google 테스트 광고 내용 표시
- ✅ 광고 하단에 "Test Ad" 마킹

#### 로그 확인
```bash
adb logcat | grep "AdMob"

# 성공 로그:
# [AdMob] Banner ad loaded successfully
# [AdMob] Test device configuration set
```

### 문제 해결

#### 디바이스 ID가 로그에 안 나타남
- 앱이 실제로 광고를 요청했는지 확인
- 광고가 표시되는 화면으로 이동했는지 확인
- 인터넷 연결 확인

#### 디바이스 ID 추가했는데도 광고 안 나옴
```bash
# 전체 AdMob 로그 확인
adb logcat | grep -i "ad"

# SDK 초기화 확인
adb logcat | grep "MobileAds"
```

**체크리스트**:
- [ ] `.env.development`에 `EXPO_PUBLIC_USE_TEST_ADS=true` 확인
- [ ] `src/app/_layout.tsx`에 올바른 디바이스 ID 추가 확인
- [ ] APK 재빌드 및 재설치 확인
- [ ] 인터넷 연결 확인

### 대체 방법: AdMob 대시보드에서 확인

1. **Google AdMob 콘솔 접속**: https://apps.admob.google.com/
2. **설정 → 테스트 디바이스 메뉴**: 디바이스 이름 입력, 디바이스 ID 확인 및 등록
3. **등록된 디바이스 ID 사용**: AdMob 대시보드에서 확인한 ID를 코드에 추가

---

## 광고 타입별 구현

### 배너 광고 (Banner Ad)

**현재 상태**: ✅ 구현 완료 (6개 화면)

**사용 화면**:
- IndexScreen (Footer)
- DifficultySelectionScreen (Footer)
- QuestionMainScreen (Footer)
- QuestionListScreen (Footer + Inline)
- IndividualCardScreen (Footer)

**배너 사이즈 옵션**:
```typescript
import { BannerAdSize } from 'react-native-google-mobile-ads';

// Footer 배너 (권장)
BannerAdSize.ANCHORED_ADAPTIVE_BANNER  // 반응형, 디바이스 폭에 맞춤

// Inline 배너
BannerAdSize.LARGE_BANNER              // 320x100, 리스트 사이 삽입용
BannerAdSize.BANNER                    // 320x50, 기본 사이즈
```

### 전면 광고 (Interstitial Ad)

**현재 상태**: ⏳ 미구현 (향후 사용)

**구현 예제**:
```typescript
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdMobIds } from '@/constants/admob';

const interstitial = InterstitialAd.createForAdRequest(AdMobIds.INTERSTITIAL);

// 광고 로드
useEffect(() => {
  const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    console.log('[AdMob] Interstitial loaded');
    interstitial.show();
  });

  interstitial.load();

  return unsubscribe;
}, []);
```

### 리워드 광고 (Rewarded Ad)

**현재 상태**: ⏳ 미구현 (향후 사용)

**구현 예제**:
```typescript
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { AdMobIds } from '@/constants/admob';

const rewarded = RewardedAd.createForAdRequest(AdMobIds.REWARDED);

// 광고 로드
useEffect(() => {
  const unsubscribeLoaded = rewarded.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      console.log('[AdMob] Rewarded ad loaded');
      rewarded.show();
    }
  );

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      console.log('[AdMob] User earned reward:', reward);
      // 보상 지급 로직
    }
  );

  rewarded.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
  };
}, []);
```

---

## 트러블슈팅

### 광고가 표시되지 않음

#### 1. 네트워크 연결 확인
- 기기가 인터넷에 연결되어 있는지 확인
- Wi-Fi 또는 모바일 데이터 활성화

#### 2. 광고 로딩 시간 대기
- 초기 광고 로드에 2-5초 소요 가능
- 화면 전환 후 잠시 대기

#### 3. 환경변수 설정 확인
```bash
# .env.development 파일 확인
cat .env.development

# 출력 확인:
# EXPO_PUBLIC_USE_TEST_ADS=true
```

#### 4. 빌드 환경 확인
```bash
# 빌드 로그에서 AdMob SDK 확인
eas build:view [BUILD_ID]

# react-native-google-mobile-ads v15.8.3 설치 확인
```

#### 5. 로그 확인
```bash
# 앱 시작 시 콘솔 출력 확인
adb logcat | grep "AdMob Environment"

# 예상 출력:
# ===== AdMob Environment =====
# Platform: android
# Test Ads Enabled: true
# Environment: DEVELOPMENT/TEST
# ✅ Using Google TestIds (Safe for development)
# =============================
```

### 에러 코드별 해결 방법

#### ERROR_CODE_INTERNAL_ERROR
```
원인: AdMob SDK 초기화 실패
해결: 앱 재시작, SDK 재초기화
```

#### ERROR_CODE_INVALID_REQUEST
```
원인: 잘못된 광고 단위 ID
해결: .env 파일에서 광고 ID 확인
```

#### ERROR_CODE_NETWORK_ERROR
```
원인: 네트워크 연결 문제
해결: 인터넷 연결 확인
```

#### ERROR_CODE_NO_FILL
```
원인: 광고 인벤토리 부족 (정상)
해결: 잠시 후 재시도, 다른 화면에서 테스트
```

### PLACEHOLDER 경고 해결

프로덕션 빌드 시 다음 경고가 나타나는 경우:

```
⛔ WARNING: Production mode enabled but using PLACEHOLDER IDs!
⛔ Please update .env.production with actual AdMob Unit IDs
```

**해결 방법**:
1. Google AdMob 계정에서 실제 광고 단위 ID 발급
2. `.env.production` 파일에 실제 ID 입력
3. 프로덕션 빌드 재실행

---

## 참고 문서

### 공식 문서
- **Google AdMob 공식 문서**: https://developers.google.com/admob
- **react-native-google-mobile-ads 문서**: https://docs.page/invertase/react-native-google-mobile-ads
- **Expo AdMob 가이드**: https://docs.expo.dev/versions/latest/sdk/admob/

### 프로젝트 내부 문서
- **ADMOB_PLACEMENT.md**: 광고 배치 전략 및 최적화 가이드
- **ADMOB_STATUS.md**: 프로젝트 현황 및 다음 단계
- **CLAUDE.md**: 프로젝트 전체 개요 및 빠른 시작 가이드

---

## 프로덕션 배포 체크리스트

프로덕션 빌드 전 필수 확인 사항:

- [ ] **AdMob 계정 생성 및 광고 단위 발급 완료**
- [ ] **`.env.production` 파일에 실제 AdMob IDs 입력**
  - [ ] `EXPO_PUBLIC_USE_TEST_ADS=false`
  - [ ] `EXPO_PUBLIC_ADMOB_APP_ID_ANDROID` 실제 ID
  - [ ] `EXPO_PUBLIC_ADMOB_BANNER_ID` 실제 ID
  - [ ] (선택) 나머지 광고 타입 IDs
- [ ] **`app.config.ts`에 프로덕션 App ID 입력**
- [ ] **프로덕션 빌드 실행**
  ```bash
  eas build -p android --profile production
  ```
- [ ] **앱 시작 시 `logAdEnvironment()` 출력 확인**
  - "Using Production AdMob IDs" 메시지 확인
  - PLACEHOLDER 경고 없는지 확인
- [ ] **AdMob 대시보드에서 광고 노출 및 수익 모니터링**

---

**작성일**: 2025-01-26
**버전**: 2.0.0
**변경 사항**: 환경변수 기반 테스트/프로덕션 분리 구현 반영
