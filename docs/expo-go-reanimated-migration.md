# React-Native-Worklets 버전 미스매치 분석 및 해결 보고서

> **날짜**: 2026-01-10
> **프로젝트**: app-factory (Turborepo 모노레포)
> **대상 앱**: apps/hungry

---

## 1. 문제 현상

### 에러 메시지
```
[WorkletsError: [Worklets] Mismatch between JavaScript part and native part of Worklets (0.7.1 vs 0.5.1)]
```

### 발생 위치
- `apps/hungry/src/components/parallax-scroll-view.tsx:4`
- `apps/hungry/src/components/hello-wave.tsx`

### 발생 조건
- `expo start` 명령어로 앱 실행
- Expo Go 앱으로 QR 코드 스캔하여 접속

---

## 2. 근본 원인 분석

### 버전 불일치 구조

| 구분 | 버전 | 출처 |
|------|------|------|
| **프로젝트 JS** | worklets 0.7.1 | pnpm-lock.yaml에서 설치 |
| **Expo Go Native** | worklets 0.5.1 | Expo Go 앱에 번들됨 (변경 불가) |

### 기술적 배경

1. **Expo Go의 한계**
   - Expo Go는 **미리 컴파일된 네이티브 모듈**만 포함
   - 커스텀 네이티브 코드 실행 불가
   - 번들된 worklets 버전은 0.5.1로 고정

2. **react-native-reanimated 4.x의 요구사항**
   - react-native-worklets 0.7.x 이상 필요
   - 네이티브 C++ 코드 컴파일 필요
   - New Architecture 지원

3. **핵심 제약**
   > **Expo SDK 54 + reanimated 4.x + Expo Go = 불가능**

   이는 Expo의 구조적 한계이며, 설정이나 버전 조정으로 해결 불가능

### 의존성 체인
```
apps/hungry/package.json
└── react-native-reanimated@~4.1.6
    └── react-native-worklets@>=0.5.0 (peerDependency)
        ├── JavaScript part: 0.7.1 (설치됨)
        └── Native bindings: 0.5.1 (Expo Go에 번들됨) ← 미스매치!
```

### 영향받는 컴포넌트
1. `parallax-scroll-view.tsx` - `Animated.ScrollView`, `useAnimatedStyle` 사용
2. `hello-wave.tsx` - `useSharedValue`, `withRepeat`, `withTiming` 사용

---

## 3. 해결 방안 옵션

### 방안 A: 템플릿에서 reanimated 제거 (Expo Go 호환) ⭐ 선택됨

**개요**: Expo SDK 54 유지 + reanimated 의존성 제거

**장점**:
- Expo SDK 54 버전 유지
- Expo Go로 즉시 개발 가능
- 새 앱 생성 시 항상 Expo Go 호환
- 빠른 개발 사이클 유지

**단점**:
- 고급 애니메이션 기능 사용 불가 (interpolate, useAnimatedStyle 등)
- parallax-scroll-view 등 reanimated 컴포넌트 제거/대체 필요

**적합한 경우**:
- 빠른 프로토타이핑이 필요한 경우
- 네이티브 빌드 환경이 없는 경우
- 고급 애니메이션이 필수가 아닌 경우

---

### 방안 B: Development Build 사용 (현재 설정 유지)

**개요**: Expo Go 대신 로컬 네이티브 빌드 실행

**장점**:
- 현재 버전 유지 (reanimated 4.x, New Architecture)
- 최신 애니메이션 기능 모두 사용 가능
- 프로덕션과 동일한 환경
- 커스텀 네이티브 모듈 추가 가능

**단점**:
- 초기 빌드 시간 필요 (~5-10분)
- Android Studio / Xcode 설치 필수
- 디바이스마다 빌드 필요

**실행 방법**:
```bash
# Android
cd apps/hungry && pnpm android

# iOS
cd apps/hungry && pnpm ios
```

**적합한 경우**:
- 프로덕션 수준의 앱 개발
- 고급 애니메이션이 필수인 경우
- 네이티브 빌드 환경이 갖춰진 경우

---

### 방안 C: 조건부 분리 (Hybrid)

**개요**: reanimated 사용하는 앱 vs Expo Go 전용 앱 분리

**구성**:
- 일부 앱: Development Build + reanimated 4.x (프로덕션용)
- 일부 앱: Expo Go + reanimated 없음 (빠른 프로토타이핑용)

**장점**:
- 용도에 맞는 유연한 개발 환경
- 프로토타입과 프로덕션 분리

**단점**:
- 템플릿 관리 복잡성 증가
- 두 가지 패턴 유지 필요

**적합한 경우**:
- 다양한 목적의 앱이 공존하는 모노레포
- 팀 규모가 크고 역할이 분리된 경우

---

## 4. 적용된 해결책 (방안 A)

### 선택 이유
- 사용자 요구: Expo SDK 54 유지 + Expo Go 개발 환경

### 수정 범위
- 템플릿 + hungry 앱만 (다른 앱은 미수정)

### 컴포넌트 대체 전략

| 컴포넌트 | 원본 | 대체 방식 |
|----------|------|-----------|
| `parallax-scroll-view.tsx` | reanimated `Animated.ScrollView` | React Native `ScrollView` |
| `hello-wave.tsx` | reanimated hooks | React Native `Animated` API |

---

## 5. 수정된 파일 목록

### 템플릿 파일 (turbo/generators/templates/native/)

| 파일 | 변경 내용 | 상태 |
|------|----------|------|
| `package.json` | `react-native-reanimated` 의존성 제거 | ✅ Done |
| `babel.config.js` | `react-native-reanimated/plugin` 제거 | ✅ Done |
| `src/app/_layout.tsx.hbs` | `import "react-native-reanimated"` 제거 | ✅ Done |
| `src/components/parallax-scroll-view.tsx` | ScrollView로 대체 | ✅ Done |
| `src/components/hello-wave.tsx` | RN Animated API로 대체 | ✅ Done |

### 앱 파일 (apps/hungry/)

| 파일 | 변경 내용 | 상태 |
|------|----------|------|
| `package.json` | `react-native-reanimated` 의존성 제거 | ✅ Done |
| `babel.config.js` | `react-native-reanimated/plugin` 제거 | ✅ Done |
| `src/app/_layout.tsx` | `import "react-native-reanimated"` 제거 | ✅ Done |
| `src/components/parallax-scroll-view.tsx` | ScrollView로 대체 | ✅ Done |
| `src/components/hello-wave.tsx` | RN Animated API로 대체 | ✅ Done |

---

## 6. 코드 변경 상세

### 6.1 package.json 변경

```diff
  "dependencies": {
    "react-native-gesture-handler": "~2.28.0",
-   "react-native-reanimated": "~4.1.6",
    "react-native-safe-area-context": "^5.6.2",
  }
```

### 6.2 babel.config.js 변경

```diff
- plugins: ["transform-vite-meta-env", "react-native-reanimated/plugin"],
+ plugins: ["transform-vite-meta-env"],
```

### 6.3 parallax-scroll-view.tsx 변경

**변경 전** (reanimated 사용):
```tsx
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

// Animated.ScrollView, useAnimatedStyle 등 사용
```

**변경 후** (React Native 기본):
```tsx
import { ScrollView, View } from "react-native";

// 단순 ScrollView + View 사용, 애니메이션 없음
```

### 6.4 hello-wave.tsx 변경

**변경 전** (reanimated 사용):
```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
```

**변경 후** (React Native Animated API):
```tsx
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function HelloWave() {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotationAnim, {
          toValue: 25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 4 }
    );
    animation.start();
  }, [rotationAnim]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 25],
    outputRange: ["0deg", "25deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      {/* ... */}
    </Animated.View>
  );
}
```

---

## 7. 검증 방법

### 실행 테스트
```bash
# 의존성 재설치
pnpm install

# 앱 시작
cd apps/hungry && pnpm start
```

### 확인 사항
1. Expo Go 앱으로 QR 코드 스캔
2. `WorkletsError` 없이 앱 실행되는지 확인
3. Home 탭에서 HelloWave 애니메이션 동작 확인
4. Explore 탭에서 스크롤 동작 확인

---

## 8. 기타 발견 사항

### 기존 타입 에러 (reanimated와 무관)
타입 체크 시 다음 에러가 발생하나, 이는 reanimated와 무관한 기존 에러입니다:

1. `src/components/external-link.tsx:15` - expo-router 타입 관련
2. `tailwind.config.ts:7` - darkMode 설정 타입 관련

### 다른 앱들의 상태
모노레포 내 다른 앱들도 동일한 템플릿을 사용하므로 같은 문제가 발생할 수 있습니다:
- `apps/dog-walk`
- `apps/delivery`
- `apps/question-card`
- `apps/reaction-speed-test`
- 기타...

필요시 동일한 수정 적용 필요.

---

## 9. 트러블슈팅: 기존 앱에서 Expo Go 호환으로 전환하기

> `pnpm gen` → `native`로 생성한 앱에서 Expo Go 실행 시 `WorkletsError`가 발생하면 아래 단계를 따르세요.

### 9.1 문제가 되는 파일 목록

templates/native 템플릿으로 생성된 앱에서 `react-native-reanimated`를 사용하는 파일들:

| 파일 경로 | 사용하는 reanimated API |
|----------|------------------------|
| `src/app/_layout.tsx` | `import "react-native-reanimated"` (side-effect import) |
| `src/components/hello-wave.tsx` | `useSharedValue`, `useAnimatedStyle`, `withRepeat`, `withTiming` |
| `src/components/parallax-scroll-view.tsx` | `Animated.ScrollView`, `useAnimatedRef`, `useAnimatedStyle`, `interpolate` |

### 9.2 수정 단계

#### Step 1: package.json에서 reanimated 제거

```diff
  "dependencies": {
    "react-native-gesture-handler": "~2.28.0",
-   "react-native-reanimated": "~4.1.6",
    "react-native-safe-area-context": "^5.6.2",
  }
```

#### Step 2: babel.config.js에서 플러그인 제거

```diff
- plugins: ["transform-vite-meta-env", "react-native-reanimated/plugin"],
+ plugins: ["transform-vite-meta-env"],
```

#### Step 3: _layout.tsx에서 import 제거

```diff
  import { useEffect } from "react";
- import "react-native-reanimated";

  import "@/i18n";
```

#### Step 4: hello-wave.tsx 전체 교체

파일 내용을 아래로 교체:

```tsx
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { ThemedText } from "@/components/themed-text";

export function HelloWave() {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotationAnim, {
          toValue: 25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 4 }
    );
    animation.start();
  }, [rotationAnim]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 25],
    outputRange: ["0deg", "25deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ThemedText className="mt-[-6px] text-[28px] leading-[32px]">
        👋
      </ThemedText>
    </Animated.View>
  );
}
```

#### Step 5: parallax-scroll-view.tsx 전체 교체

파일 내용을 아래로 교체:

```tsx
import type { PropsWithChildren, ReactElement } from "react";

import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import { ThemedView } from "@/components/themed-view";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const { colorScheme = "light" } = useColorScheme();

  return (
    <ThemedView className="flex-1">
      <ScrollView scrollEventThrottle={16}>
        <View
          className="h-[250px] overflow-hidden"
          style={{ backgroundColor: headerBackgroundColor[colorScheme] }}
        >
          {headerImage}
        </View>
        <ThemedView className="flex-1 gap-4 overflow-hidden p-8">
          {children}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
```

#### Step 6: 의존성 재설치

```bash
pnpm install
```

#### Step 7: 캐시 삭제 후 실행

```bash
# 캐시 삭제
rm -rf node_modules/.cache .expo

# 앱 실행
pnpm start
```

### 9.3 확인 방법

1. Expo Go 앱으로 QR 코드 스캔
2. `WorkletsError` 없이 앱이 실행되면 성공
3. Home 탭에서 👋 애니메이션 동작 확인
4. Explore 탭에서 스크롤 동작 확인

---

## 10. 향후 고려사항

### reanimated가 필요한 경우
프로젝트에서 고급 애니메이션이 필요해지면:
1. **방안 B (Development Build)**로 전환
2. `expo run:android` / `expo run:ios` 사용
3. reanimated 의존성 복원

### 새 앱 생성 시
`pnpm gen` → `native` 선택 시 Expo Go 호환 템플릿으로 생성됨
