# Google AdMob 통합 가이드

EasyTalking 앱에 Google AdMob을 안전하게 통합하기 위한 개발/프로덕션 환경 분리 가이드

## 📋 목차
- [개요](#개요)
- [환경 분리 전략](#환경 분리 전략)
- [설치 및 설정](#설치 및 설정)
- [구현 가이드](#구현 가이드)
- [광고 타입별 구현](#광고 타입별 구현)
- [트러블슈팅](#트러블슈팅)

---

## 개요

### 왜 테스트 광고를 사용해야 하나요?

**⚠️ 중요**: 개발 중 실제 광고 ID를 사용하면 Google AdMob 정책 위반으로 계정이 정지될 수 있습니다.

**해결책**: `react-native-google-mobile-ads`는 개발용 테스트 광고 ID를 제공합니다.

### 테스트 광고 vs 실제 광고

| 구분 | 테스트 광고 (개발) | 실제 광고 (프로덕션) |
|------|-------------------|---------------------|
| 광고 ID | `TestIds.BANNER` 등 | `ca-app-pub-xxx...` |
| 수익 발생 | ❌ 없음 | ✅ 있음 |
| 계정 위험 | ✅ 안전 | ⚠️ 잘못 사용 시 정지 |
| 사용 환경 | 개발/디버깅 | 프로덕션 배포 |

---

## 환경 분리 전략

### 핵심 원칙

```typescript
// ✅ 올바른 방법: __DEV__ 플래그로 환경 분리
const adUnitId = __DEV__
  ? TestIds.BANNER              // 개발: 테스트 ID
  : 'ca-app-pub-xxx/yyy';       // 프로덕션: 실제 ID

// ❌ 잘못된 방법: 항상 실제 ID 사용
const adUnitId = 'ca-app-pub-xxx/yyy';  // 개발 중 계정 정지 위험!
```

### React Native의 `__DEV__` 플래그

- **개발 모드** (`npm start`, Expo Go): `__DEV__ === true`
- **프로덕션 빌드** (`eas build --profile production`): `__DEV__ === false`

---

## 설치 및 설정

### 1단계: 라이브러리 설치

```bash
npm install react-native-google-mobile-ads
```

### 2단계: Expo 플러그인 설정

**app.config.ts** 수정:

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
        androidAppId: "ca-app-pub-xxxxxxxx~xxxxxxxx",  // Android 앱 ID
        iosAppId: "ca-app-pub-xxxxxxxx~xxxxxxxx",       // iOS 앱 ID

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

### 3단계: EAS 빌드 후 재설치

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

**src/constants/admob.ts** 생성:

```typescript
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * 광고 단위 ID 설정
 * 개발: TestIds 사용 (계정 안전)
 * 프로덕션: 실제 AdMob ID 사용
 */
export const AdMobIds = {
  // 배너 광고 (하단 고정)
  BANNER: __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy',

  // 전면 광고 (화면 전환 시)
  INTERSTITIAL: __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy',

  // 리워드 광고 (보상형)
  REWARDED: __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy',

  // 앱 오픈 광고 (앱 시작 시)
  APP_OPEN: __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy',
} as const;

/**
 * 현재 환경 확인 유틸리티
 */
export const isTestAdsEnabled = __DEV__;

/**
 * 광고 환경 정보 출력 (디버깅용)
 */
export const logAdEnvironment = () => {
  console.log('[AdMob] Environment:', {
    isDevelopment: __DEV__,
    usingTestIds: isTestAdsEnabled,
    bannerAdId: AdMobIds.BANNER,
  });
};
```

### 2단계: SDK 초기화

**src/app/_layout.tsx** 수정:

```typescript
import { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { logAdEnvironment } from '../constants/admob';

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

    // 개발 모드에서 테스트 디바이스 설정 (선택사항)
    if (__DEV__) {
      mobileAds()
        .setRequestConfiguration({
          testDeviceIdentifiers: ['EMULATOR'], // 에뮬레이터 자동 인식
        })
        .then(() => {
          console.log('[AdMob] Test device configuration set');
        });
    }
  }, []);

  return (
    // ... 기존 코드 ...
  );
}
```

### 3단계: 광고 컴포넌트 작성

**src/components/ads/BannerAd.tsx** 생성:

```typescript
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View, Text } from 'react-native';
import { useState } from 'react';
import { AdMobIds } from '../../constants/admob';

interface BannerAdComponentProps {
  /** 배너 광고 크기 (기본: BANNER) */
  size?: BannerAdSize;
}

export function BannerAdComponent({ size = BannerAdSize.BANNER }: BannerAdComponentProps) {
  const [adError, setAdError] = useState<string | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  return (
    <View className="items-center py-2">
      {/* 개발 모드 인디케이터 */}
      {__DEV__ && (
        <Text className="text-xs text-orange-500 mb-1">
          [개발 모드] 테스트 광고
        </Text>
      )}

      <BannerAd
        unitId={AdMobIds.BANNER}
        size={size}
        onAdLoaded={() => {
          console.log('[AdMob] Banner ad loaded');
          setAdLoaded(true);
          setAdError(null);
        }}
        onAdFailedToLoad={(error) => {
          console.error('[AdMob] Banner ad failed to load:', error);
          setAdError(error.message);
        }}
      />

      {/* 에러 표시 (개발 모드에만) */}
      {__DEV__ && adError && (
        <Text className="text-xs text-red-500 mt-1">
          광고 로드 실패: {adError}
        </Text>
      )}
    </View>
  );
}
```

---

## 광고 타입별 구현

### 1. 배너 광고 (Banner Ad)

화면 상단/하단에 고정 표시되는 광고

```typescript
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdMobIds } from '../constants/admob';

<BannerAd
  unitId={AdMobIds.BANNER}
  size={BannerAdSize.BANNER}
  onAdLoaded={() => console.log('Banner loaded')}
  onAdFailedToLoad={(error) => console.error('Banner failed:', error)}
/>
```

**사용 예시**: 메인 화면 하단, 질문 목록 하단

### 2. 전면 광고 (Interstitial Ad)

화면 전환 시 전체 화면으로 표시되는 광고

```typescript
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { useEffect, useState } from 'react';
import { AdMobIds } from '../constants/admob';

export function useInterstitialAd() {
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(AdMobIds.INTERSTITIAL);

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[AdMob] Interstitial loaded');
      setLoaded(true);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[AdMob] Interstitial closed');
      setLoaded(false);
      ad.load(); // 다음 광고 미리 로드
    });

    ad.load();
    setInterstitial(ad);

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const show = () => {
    if (loaded && interstitial) {
      interstitial.show();
    } else {
      console.warn('[AdMob] Interstitial not ready yet');
    }
  };

  return { show, loaded };
}

// 사용법
function NavigationButton() {
  const { show, loaded } = useInterstitialAd();

  const handleNavigate = () => {
    if (loaded) {
      show(); // 광고 표시 후 화면 이동
    }
    // navigation.navigate('NextScreen');
  };

  return <Button onPress={handleNavigate}>다음 화면</Button>;
}
```

**사용 예시**: 난이도 선택 → 질문 메인 화면 전환 시

### 3. 리워드 광고 (Rewarded Ad)

사용자가 광고를 시청하면 보상을 제공하는 광고

```typescript
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useEffect, useState } from 'react';
import { AdMobIds } from '../constants/admob';

export function useRewardedAd() {
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(AdMobIds.REWARDED);

    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('[AdMob] Rewarded ad loaded');
      setLoaded(true);
    });

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('[AdMob] Reward earned:', reward);
        // 보상 지급 로직 (예: 추가 질문 카드 제공)
      }
    );

    ad.load();
    setRewarded(ad);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const show = () => {
    if (loaded && rewarded) {
      rewarded.show();
    }
  };

  return { show, loaded };
}
```

**사용 예시**: 추가 질문 카드 해금, 프리미엄 기능 체험

---

## 테스트 광고 ID 목록

`react-native-google-mobile-ads`에서 제공하는 테스트 ID:

```typescript
import { TestIds } from 'react-native-google-mobile-ads';

TestIds.BANNER              // 배너 광고
TestIds.INTERSTITIAL        // 전면 광고
TestIds.REWARDED            // 리워드 광고
TestIds.REWARDED_INTERSTITIAL  // 리워드 전면 광고
TestIds.APP_OPEN            // 앱 오픈 광고
TestIds.NATIVE              // 네이티브 광고
```

**실제 값** (참고용):
- Android 배너: `ca-app-pub-3940256099942544/6300978111`
- iOS 배너: `ca-app-pub-3940256099942544/2934735716`

---

## 트러블슈팅

### 1. 광고가 표시되지 않음

**증상**: `onAdFailedToLoad` 이벤트 발생

**원인 및 해결**:

#### A. AdMob 앱 ID 미설정
```bash
# 에러 로그
Error: The Google Mobile Ads SDK was initialized without an app ID.
```

**해결**: app.config.ts에 `androidAppId`/`iosAppId` 추가 후 재빌드

#### B. 네이티브 변경사항 미반영
```bash
# 해결: EAS 빌드 또는 prebuild 실행
eas build -p android --profile preview
# 또는
npx expo prebuild --clean
```

#### C. 광고 로드 시간 부족
```typescript
// ❌ 잘못된 방법: 즉시 show() 호출
const ad = InterstitialAd.createForAdRequest(adUnitId);
ad.show(); // 로드 전이라 실패

// ✅ 올바른 방법: LOADED 이벤트 대기
ad.addAdEventListener(AdEventType.LOADED, () => {
  ad.show();
});
ad.load();
```

### 2. 프로덕션에서 테스트 광고 표시됨

**증상**: 배포 후에도 테스트 광고가 보임

**원인**: `__DEV__` 플래그 미사용 또는 프로덕션 빌드 미수행

**해결**:
```bash
# ❌ 개발 모드 (테스트 광고)
npm start

# ✅ 프로덕션 빌드 (실제 광고)
eas build -p android --profile production
```

**검증**:
```typescript
// src/constants/admob.ts에서 로그 확인
console.log('[AdMob] __DEV__:', __DEV__);  // false여야 함
console.log('[AdMob] Ad Unit ID:', AdMobIds.BANNER); // 실제 ID여야 함
```

### 3. TypeScript 타입 에러

**증상**: `TestIds`, `BannerAd` 등 타입 인식 안 됨

**해결**:
```bash
# 타입 정의 설치
npm install --save-dev @types/react-native-google-mobile-ads

# TypeScript 캐시 제거
rm -rf node_modules/.cache
npm run type-check
```

### 4. iOS App Tracking Transparency 팝업 미표시

**증상**: iOS 14+에서 광고 성능 저하

**해결**: app.config.ts에 `userTrackingUsageDescription` 추가 (위 2단계 참고)

### 5. 개발 중 계정 정지 경고

**증상**: AdMob 대시보드에 "잘못된 광고 트래픽" 경고

**원인**: 개발 중 실제 광고 ID 사용

**해결**:
1. 즉시 `TestIds` 사용으로 전환
2. Google AdMob 지원팀에 개발 중이었음을 설명
3. 향후 `__DEV__` 플래그 철저히 사용

---

## 환경별 체크리스트

### 개발 환경
- [ ] `__DEV__ === true` 확인
- [ ] `TestIds` 사용 확인
- [ ] 콘솔에 "[개발 모드] 테스트 광고" 표시 확인
- [ ] 광고 하단에 "Test Ad" 표시 확인

### 프로덕션 환경
- [ ] `eas build --profile production` 사용
- [ ] `__DEV__ === false` 확인
- [ ] 실제 AdMob ID 사용 확인
- [ ] AdMob 대시보드에서 광고 노출 확인

---

## 참고 자료

- [react-native-google-mobile-ads 공식 문서](https://docs.page/invertase/react-native-google-mobile-ads)
- [Google AdMob 시작 가이드](https://developers.google.com/admob/android/quick-start)
- [Expo AdMob 통합 가이드](https://docs.expo.dev/versions/latest/sdk/admob/)
- [AdMob 정책 센터](https://support.google.com/admob/answer/6128543)

---

## 다음 단계

1. **AdMob 계정 생성**: [Google AdMob](https://admob.google.com/)
2. **앱 등록**: Android/iOS 앱 ID 발급
3. **광고 단위 생성**: 배너, 전면, 리워드 광고 ID 생성
4. **app.config.ts 업데이트**: 실제 앱 ID로 교체
5. **src/constants/admob.ts 업데이트**: 실제 광고 단위 ID로 교체
6. **프로덕션 빌드 테스트**: EAS Build로 APK 생성 후 검증
