# 폰트 변경 작업 계획서

## 📋 현황 분석

### 현재 상태
- ✅ `expo-font` 패키지 설치됨 (v13.0.4)
- ✅ `useFonts` 훅 사용 중 ([_layout.tsx:27-29](../src/app/_layout.tsx#L27))
- ⚠️ 현재 SpaceMono 폰트만 로드 중
- ⚠️ 디자인 시스템에 폰트 패밀리 미정의 ([design-system-modern-refined.md:176-194](design-system-modern-refined.md#L176))
- ⚠️ Tailwind Config에 폰트 설정 없음

### 디자인 시스템 분석
현재 타이포그래피는 **폰트 크기와 weight**만 정의되어 있음:
- `font-bold`, `font-semibold`, `font-medium` 사용
- 실제 폰트 패밀리 지정 없음 (시스템 기본 폰트 사용 중)

## 🎯 목표

전체 앱에 **IBM Plex Sans KR** 폰트 적용

### 선정 이유
- ✨ **전문성**: IBM의 기업용 폰트로 신뢰감과 전문성
- 🎨 **현대적**: 깔끔하고 세련된 현대적 디자인
- 📱 **가독성**: UI/UX에 최적화된 뛰어난 가독성
- 🌏 **한글 지원**: 완벽한 한글 지원 (Latin + Hangul)
- 📦 **7가지 weight**: Thin(100) ~ Bold(700) 제공
- 📝 **OFL 라이선스**: 상업적 사용 가능

### 적용 범위
1. ✅ 모든 화면 (CategorySelection, DifficultySelection, ContinuousCard 등)
2. ✅ 모든 텍스트 컴포넌트
3. ✅ 다국어 지원 고려 (i18n 설정 확인됨)
4. ✅ 4가지 weight 사용 (400, 500, 600, 700)

## 🚀 작업 계획

### Phase 1: 폰트 선정 및 준비 (30분)

#### 1.1 폰트 패밀리 결정 ✅
**선정 완료: IBM Plex Sans KR**

**사용 Weight**:
- ✅ Regular (400) - 일반 텍스트
- ✅ Medium (500) - 중간 강조
- ✅ SemiBold (600) - 제목, 강조 텍스트
- ✅ Bold (700) - 주요 강조, 숫자

**특징**:
- IBM의 공식 오픈소스 타이포그래피
- 한글과 영문의 조화로운 디자인
- 현대적이고 전문적인 느낌
- OFL(Open Font License) - 상업적 사용 가능

#### 1.2 IBM Plex Sans KR 설치
```bash
# IBM Plex Sans KR Google Fonts 패키지 설치
npx expo install @expo/google-fonts/ibm-plex-sans-kr
```

**패키지 정보**:
- 패키지명: `@expo/google-fonts/ibm-plex-sans-kr`
- 제공 weight: 100, 200, 300, 400, 500, 600, 700
- 사용 weight: 400, 500, 600, 700 (4가지)

### Phase 2: 폰트 로딩 설정 (15분)

#### 2.1 _layout.tsx 수정
**현재 코드**:
```tsx
const [loaded] = useFonts({
  SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
});
```

**수정 후 (IBM Plex Sans KR)**:
```tsx
import {
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
  IBMPlexSansKR_700Bold,
} from '@expo/google-fonts/ibm-plex-sans-kr';

const [loaded] = useFonts({
  'IBMPlexSansKR-Regular': IBMPlexSansKR_400Regular,
  'IBMPlexSansKR-Medium': IBMPlexSansKR_500Medium,
  'IBMPlexSansKR-SemiBold': IBMPlexSansKR_600SemiBold,
  'IBMPlexSansKR-Bold': IBMPlexSansKR_700Bold,
});
```

### Phase 3: Tailwind 설정 (10분)

#### 3.1 tailwind.config.ts 수정
```typescript
import type { Config } from "tailwindcss";
import nativewind from "nativewind/preset";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {
      fontFamily: {
        // IBM Plex Sans KR 폰트 패밀리
        sans: ['IBMPlexSansKR-Regular'],
        medium: ['IBMPlexSansKR-Medium'],
        semibold: ['IBMPlexSansKR-SemiBold'],
        bold: ['IBMPlexSansKR-Bold'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Phase 4: 디자인 시스템 문서 업데이트 (10분)

#### 4.1 design-system-modern-refined.md 수정
**Typography 섹션에 폰트 패밀리 추가**:
```markdown
## 🔤 타이포그래피

### 폰트 패밀리 - IBM Plex Sans KR

**선정 이유**:
- IBM의 전문적이고 현대적인 디자인
- 한글과 영문의 조화로운 타이포그래피
- UI/UX에 최적화된 가독성
- OFL 라이선스 (상업적 사용 가능)

```typescript
export const fontFamily = {
  regular: "font-sans",        // IBMPlexSansKR-Regular (400)
  medium: "font-medium",       // IBMPlexSansKR-Medium (500)
  semibold: "font-semibold",   // IBMPlexSansKR-SemiBold (600)
  bold: "font-bold",           // IBMPlexSansKR-Bold (700)
};
```

### 텍스트 크기 체계
```typescript
export const textSizes = {
  // 제목
  title: "text-xl font-semibold",          // 20px, IBMPlexSansKR-SemiBold
  cardTitle: "text-lg font-semibold",      // 18px, IBMPlexSansKR-SemiBold

  // 본문
  body: "text-base font-sans",             // 16px, IBMPlexSansKR-Regular
  bodyMedium: "text-base font-medium",     // 16px, IBMPlexSansKR-Medium
  small: "text-sm font-sans",              // 14px, IBMPlexSansKR-Regular
  tiny: "text-xs font-sans",               // 12px, IBMPlexSansKR-Regular

  // 강조
  number: "text-3xl font-bold",            // 30px, IBMPlexSansKR-Bold
  unit: "text-lg font-medium",             // 18px, IBMPlexSansKR-Medium
};
```
```

### Phase 5: 기존 컴포넌트 적용 (30분)

#### 5.1 적용 대상 파일
```
src/
├── screens/
│   ├── CategorySelectionScreen.tsx
│   ├── DifficultySelectionScreen.tsx
│   ├── ContinuousCardScreen.tsx
│   ├── QuestionMainScreen.tsx
│   └── index.tsx
└── components/
    └── (모든 커스텀 Text 컴포넌트)
```

#### 5.2 적용 방법
**변경 전**:
```tsx
<Text className="text-xl font-semibold text-gray-900">
  제목 텍스트
</Text>
```

**변경 후** (명시적 폰트 없이 기본 폰트 사용):
```tsx
<Text className="text-xl font-semibold text-gray-900">
  제목 텍스트
</Text>
```

> **참고**: Tailwind의 `font-semibold`, `font-bold` 등이 자동으로 설정한 폰트 패밀리 사용

#### 5.3 특수 케이스 처리
**숫자 강조**:
```tsx
<Text className="text-3xl font-bold text-gray-900">
  {questionCount}
</Text>
```

**다국어 텍스트**:
```tsx
// i18n 적용된 텍스트도 동일하게 폰트 적용됨
<Text className="text-base font-sans text-gray-700">
  {t('category.title')}
</Text>
```

### Phase 6: 테스트 및 검증 (20분)

#### 6.1 시각적 검증
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

**확인 사항**:
- [ ] 모든 화면에서 폰트가 올바르게 렌더링되는가?
- [ ] 한글 텍스트가 깨지지 않는가?
- [ ] 폰트 weight (Regular, Medium, SemiBold, Bold)가 명확히 구분되는가?
- [ ] 로딩 시 폰트 깜빡임(FOUT)이 없는가?

#### 6.2 성능 검증
```bash
# 번들 크기 확인
npm run build:android

# 폰트 파일 크기 확인
du -sh src/assets/fonts/*
```

**목표**:
- 전체 폰트 파일 크기 < 500KB (Google Fonts는 자동 최적화)
- 앱 초기 로딩 시간 변화 < 500ms

#### 6.3 크로스 플랫폼 검증
- [ ] Android 실기기 테스트
- [ ] iOS 시뮬레이터 테스트
- [ ] Web 브라우저 테스트

### Phase 7: 문서화 및 정리 (10분)

#### 7.1 README 업데이트
프로젝트 루트 README에 폰트 정보 추가:
```markdown
## 폰트

이 앱은 **IBM Plex Sans KR**을 사용합니다.

### Weight
- Regular (400) - 일반 텍스트
- Medium (500) - 중간 강조
- SemiBold (600) - 제목, 강조
- Bold (700) - 주요 강조

### 특징
- IBM의 오픈소스 타이포그래피
- 한글과 영문의 조화로운 디자인
- 전문적이고 현대적인 느낌

### 라이선스
OFL (Open Font License) - 상업적 사용 가능
```

#### 7.2 PR 작성
```markdown
# feat(question-card): 🎨 IBM Plex Sans KR 폰트 적용

## 변경 사항
- IBM Plex Sans KR 폰트 패밀리 적용
- Tailwind 폰트 설정 추가 (4 weights)
- 디자인 시스템 타이포그래피 업데이트
- _layout.tsx 폰트 로딩 설정

## 적용 폰트
- **IBM Plex Sans KR**
- Weight: Regular(400), Medium(500), SemiBold(600), Bold(700)
- 라이선스: OFL (상업적 사용 가능)

## 영향 범위
- 모든 화면 및 컴포넌트
- 다국어 텍스트 포함
- Android, iOS, Web 모든 플랫폼

## 테스트
- [x] Android 실기기 확인
- [x] iOS 시뮬레이터 확인
- [x] Web 브라우저 확인
- [x] 한글 텍스트 렌더링 확인
- [x] 폰트 weight 구분 확인

## 스크린샷
[Before/After 스크린샷]
```

## 📊 예상 소요 시간

| Phase | 작업 | 예상 시간 |
|-------|------|----------|
| 1 | 폰트 선정 및 준비 | 30분 |
| 2 | 폰트 로딩 설정 | 15분 |
| 3 | Tailwind 설정 | 10분 |
| 4 | 디자인 시스템 문서 업데이트 | 10분 |
| 5 | 기존 컴포넌트 적용 | 30분 |
| 6 | 테스트 및 검증 | 20분 |
| 7 | 문서화 및 정리 | 10분 |
| **합계** | | **~2시간** |

## ⚠️ 주의사항

### 1. 한글 지원 ✅
- IBM Plex Sans KR은 완벽한 한글 지원
- Latin + Hangul 모두 포함

### 2. 라이선스 ✅
- OFL(Open Font License) 확인 완료
- 상업적 사용 가능

### 3. 성능
- 너무 많은 weight 로딩 지양 (4개 이하 권장)
- Web에서는 font-display: swap 자동 적용됨 (NativeWind)

### 4. Fallback
```tsx
// iOS와 Android의 시스템 폰트 차이 대비
fontFamily: {
  sans: ['IBMPlexSansKR-Regular', 'system-ui', 'sans-serif'],
  medium: ['IBMPlexSansKR-Medium', 'system-ui', 'sans-serif'],
  semibold: ['IBMPlexSansKR-SemiBold', 'system-ui', 'sans-serif'],
  bold: ['IBMPlexSansKR-Bold', 'system-ui', 'sans-serif'],
}
```

## 🔗 참고 자료

### Expo 공식 문서
- [Expo Font](https://docs.expo.dev/versions/latest/sdk/font/)
- [Google Fonts for Expo](https://github.com/expo/google-fonts)

### NativeWind 폰트 가이드
- [Custom Fonts in NativeWind](https://www.nativewind.dev/guides/custom-fonts)

### IBM Plex Sans KR 참고 자료
- [IBM Plex 공식 사이트](https://www.ibm.com/plex/)
- [Google Fonts - IBM Plex Sans KR](https://fonts.google.com/specimen/IBM+Plex+Sans+KR)
- [GitHub - IBM Plex](https://github.com/IBM/plex)
- [Expo Google Fonts - IBM Plex Sans KR](https://github.com/expo/google-fonts/tree/master/font-packages/ibm-plex-sans-kr)

## ✅ 작업 시작 전 체크리스트

- [x] 사용할 폰트 패밀리 결정: **IBM Plex Sans KR**
- [x] 필요한 weight 확인: Regular(400), Medium(500), SemiBold(600), Bold(700)
- [x] 한글 지원 확인: ✅ 완벽 지원
- [x] 라이선스 확인: ✅ OFL (상업적 사용 가능)
- [ ] 백업 브랜치 생성 (`git checkout -b feature/ibm-plex-font`)

## 🎯 작업 시작 명령어

```bash
# 1. 브랜치 생성
git checkout -b feature/ibm-plex-font

# 2. IBM Plex Sans KR 설치
npx expo install @expo/google-fonts/ibm-plex-sans-kr

# 3. 개발 서버 시작
npm run start

# 4. 작업 후 커밋
git add .
git commit -m "feat(question-card): 🎨 IBM Plex Sans KR 폰트 적용"
```

---

**선정 폰트**: IBM Plex Sans KR
**Weight**: 400, 500, 600, 700
**라이선스**: OFL (Open Font License)
**작성일**: 2025-10-07
**작성자**: Claude Code
**버전**: 2.0 (IBM Plex Sans KR 확정)
