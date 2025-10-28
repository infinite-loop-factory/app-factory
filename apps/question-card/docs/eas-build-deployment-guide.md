# EAS Build Android 배포 가이드

EasyTalking 앱을 EAS Build로 Android APK 빌드 및 실제 기기 설치하는 공식 가이드

**작성일**: 2024.09.21
**기준**: Expo SDK 52, EAS Build 공식 문서

---

## 🎯 배포 목표

### 1차 목표: EAS Build로 Android APK 빌드 성공
- ✅ EAS Build 초기 설정
- ✅ Android APK 파일 생성
- ✅ 빌드 성공 및 다운로드

### 2차 목표: 실제 Android 기기에 APK 설치 및 테스트
- ✅ APK 파일 기기로 전송
- ✅ 앱 설치 및 실행 확인
- ✅ 전체 플로우 테스트

### 3차 목표: Google Play Store 배포 준비 (향후)
- ⏳ Google Play Console 계정 설정
- ⏳ 앱 서명 키 생성
- ⏳ 스토어 메타데이터 준비

---

## 📊 현재 상태 분석

### ✅ 준비된 것
- Expo SDK 52 설치됨
- EAS CLI 설치됨
- `app.config.ts` 기본 설정 존재
- Android 기본 설정 (adaptive icon)
- React Native 0.76.9

### ❌ 필요한 것
- `eas.json` 설정 파일
- Android 앱 식별자 (package name)
- 앱 아이콘/스플래시 스크린 이미지
- EAS 프로젝트 초기화

---

## 🚀 Phase 1: EAS Build 초기 설정 (30분)

### 1.1 EAS CLI 로그인 및 초기화

```bash
# 1. EAS 로그인 (Expo 계정 필요)
eas login

# 2. EAS Build 설정 파일 생성
eas build:configure
```

**자동 생성되는 파일**:
- `eas.json` - EAS Build 프로필 설정

### 1.2 `app.config.ts` 업데이트

**필수 Android 설정 추가**:

```typescript
// apps/question-card/app.config.ts
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "EasyTalking",
  slug: "question-card",
  version: "1.0.0",

  android: {
    package: "com.infiniteloop.easytalking",  // 고유한 앱 식별자
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#FF6B35"  // Modern Refined Orange
    },
    permissions: []  // 현재 앱은 특별한 권한 불필요
  },

  // ... 기존 설정
});
```

### 1.3 `eas.json` 설정 (Expo 공식 문서 기준)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-file.json",
        "track": "internal"
      }
    }
  }
}
```

**프로필 설명**:
- **development**: 개발용 빌드 (APK)
- **preview**: 내부 테스트용 빌드 (APK)
- **production**: 스토어 배포용 빌드 (AAB)

---

## 🎨 Phase 2: 앱 아이콘 및 스플래시 스크린 준비 (1시간)

### 2.1 필요한 이미지 사양

| 파일명 | 크기 | 용도 |
|--------|------|------|
| `icon.png` | 1024x1024px | 앱 아이콘 (모든 플랫폼) |
| `adaptive-icon.png` | 1024x1024px | Android Adaptive 아이콘 |
| `splash.png` | 1284x2778px | 스플래시 스크린 |
| `favicon.png` | 48x48px | 웹 Favicon |

### 2.2 이미지 준비 옵션

**Option 1: 빠른 테스트용 플레이스홀더**
```typescript
// Lucide Sprout 아이콘 기반
// Modern Refined Orange 컬러 스킴
// 단색 배경 + 아이콘
```

**Option 2: 프로페셔널 디자인**
- Figma/Canva로 디자인
- Modern Refined Orange v2.0 적용
- 브랜드 아이덴티티 반영

### 2.3 이미지 배치 경로

```
apps/question-card/src/assets/images/
├── icon.png              # 1024x1024 앱 아이콘
├── adaptive-icon.png     # 1024x1024 Android adaptive
├── splash.png            # 1284x2778 스플래시
└── favicon.png           # 48x48 웹 favicon
```

---

## 🔨 Phase 3: EAS Build 실행 (30분 - 2시간)

### 3.1 Preview 빌드 (테스트용 APK)

**Expo 공식 문서 권장 명령어**:

```bash
# Preview 프로필로 Android APK 빌드
eas build --platform android --profile preview
```

**빌드 프로세스**:
1. 프로젝트 코드 검증
2. EAS 서버에 업로드
3. 클라우드 빌드 실행
4. APK 파일 생성
5. 다운로드 링크 제공

**예상 시간**: 15-45분 (첫 빌드는 더 오래 걸림)

### 3.2 빌드 모니터링

```bash
# 빌드 목록 확인
eas build:list

# 특정 빌드 상세 정보
eas build:view [BUILD_ID]

# 웹 대시보드
https://expo.dev
```

### 3.3 로컬 빌드 (선택 사항)

**문제 해결용 로컬 빌드**:

```bash
# 로컬 머신에서 빌드 (디버깅용)
eas build --platform android --profile preview --local
```

---

## 📥 Phase 4: APK 다운로드 및 설치 (15분)

### 4.1 APK 다운로드

**방법 1: EAS CLI 사용**
```bash
eas build:download --platform android --profile preview
```

**방법 2: 웹 대시보드**
```
https://expo.dev/accounts/[your-account]/projects/question-card/builds
```

**방법 3: 빌드 완료 후 제공되는 다운로드 링크 사용**

### 4.2 Android 기기에 설치

**Option 1: ADB 사용 (USB 연결)**

```bash
# USB 디버깅 활성화 필수
# 개발자 옵션 > USB 디버깅 ON

# APK 설치
adb install path/to/the/file.apk

# 설치 확인
adb shell pm list packages | grep easytalking
```

**Option 2: 직접 전송**
1. APK 파일을 기기로 전송 (이메일, Google Drive, USB 등)
2. 기기 설정에서 "알 수 없는 소스" 설치 허용
   - 설정 > 보안 > 알 수 없는 소스 허용
3. 파일 관리자에서 APK 파일 탭하여 설치

**Option 3: EAS CLI로 직접 설치**

```bash
# 에뮬레이터에 직접 설치
eas build:run --platform android --latest

# 또는 특정 빌드 선택
eas build:run --platform android
```

### 4.3 설치 확인 및 테스트

**테스트 체크리스트**:
- [ ] 앱 실행 확인
- [ ] 초기화 화면 (Sprout 아이콘) 정상 표시
- [ ] Category 선택 → Difficulty 선택 → Main → Card
- [ ] 4가지 모드 모두 테스트
- [ ] 스와이프 제스처 작동 확인
- [ ] 플로팅 UI 버튼 작동 확인
- [ ] 크래시 또는 에러 없음

---

## 🔧 Phase 5: 문제 해결 (필요시)

### 5.1 일반적인 빌드 에러 및 해결책

#### 에러 1: 패키지 이름 충돌
```
Error: Package name already exists
```

**해결책**:
```typescript
// app.config.ts
android: {
  package: "com.infiniteloop.easytalking.unique"
}
```

#### 에러 2: 이미지 파일 누락
```
Error: Cannot find image at path: ./src/assets/images/icon.png
```

**해결책**:
- 모든 이미지 파일이 정확한 경로에 있는지 확인
- 파일 이름 대소문자 확인
- 파일 권한 확인

#### 에러 3: Gradle 빌드 실패
```
Error: Gradle build failed
```

**해결책**:
```bash
# 의존성 재설치
rm -rf node_modules
npm install

# 또는
pnpm install

# 로컬 빌드로 테스트
npx expo run:android --variant release
```

### 5.2 APK 크기 최적화 (선택 사항)

```typescript
// app.config.ts
android: {
  enableProguardInReleaseBuilds: true,  // 코드 난독화 및 최적화
  enableHermes: true,  // Hermes JS 엔진 (기본값)
}
```

---

## 📚 추가 설정 (향후 Play Store 배포용)

### Google Play Store 제출 준비

**1. Service Account Key 생성**:
```bash
# Google Play Console에서 서비스 계정 키 다운로드
# service-account-file.json으로 저장
```

**2. 내부 테스트 트랙으로 제출**:
```bash
# 프로덕션 빌드 생성
eas build --platform android --profile production

# Google Play 내부 테스트 트랙으로 제출
eas submit --platform android
```

**3. 자동 제출 (빌드 + 제출)**:
```bash
eas build --platform android --profile production --auto-submit
```

---

## ⏱️ 예상 소요 시간

| Phase | 작업 | 예상 시간 |
|-------|------|----------|
| Phase 1 | EAS 초기 설정 | 30분 |
| Phase 2 | 앱 아이콘/스플래시 준비 | 1시간 |
| Phase 3 | EAS Build 실행 | 30분 - 2시간 |
| Phase 4 | APK 설치 및 테스트 | 15분 |
| **총계** | | **2시간 15분 - 3시간 45분** |

---

## 📋 체크리스트

### Phase 1: 초기 설정 ✅ (완료)
- [x] EAS CLI 로그인 완료
- [x] `eas.json` 생성 완료
- [x] `app.config.ts` Android 설정 추가
- [x] Android package name 설정

### Phase 2: 에셋 준비 🔄 (진행중)
- [x] 앱 아이콘 생성 (1024x1024)
- [x] Adaptive 아이콘 생성 (1024x1024)
- [x] 스플래시 스크린 생성
- [x] Favicon 생성

### Phase 3: 빌드 실행 ✅ (완료)
- [x] Preview 빌드 실행
- [x] 빌드 완료 대기 및 모니터링
- [x] 빌드 성공 확인
- [x] APK 다운로드 링크 확보

### Phase 4: 설치 및 테스트 ✅ (완료)
- [x] APK 다운로드 완료
- [x] Android 기기에 설치 성공
- [x] 앱 실행 확인
- [x] 전체 플로우 테스트 (6개 화면)
- [x] 4가지 모드 모두 작동 확인
- [x] 크래시/에러 없음 확인

### Phase 5: 최적화 (선택)
- [ ] APK 크기 확인
- [ ] 성능 테스트
- [ ] 필요시 최적화 적용

---

## 🔗 공식 문서 참고

- [EAS Build 소개](https://docs.expo.dev/build/introduction/)
- [Android 빌드 설정](https://docs.expo.dev/build-reference/android-builds/)
- [APK vs AAB](https://docs.expo.dev/build-reference/apk/)
- [내부 배포](https://docs.expo.dev/build/internal-distribution/)
- [Google Play 제출](https://docs.expo.dev/submit/android/)

---

## 🎯 다음 단계

**즉시 시작**:
```bash
eas login
eas build:configure
```

**문제 발생 시**:
- [Troubleshooting 가이드](https://docs.expo.dev/build-reference/troubleshooting/)
- [Discord 커뮤니티](https://expo.dev/discord)
- [GitHub Issues](https://github.com/expo/expo/issues)
