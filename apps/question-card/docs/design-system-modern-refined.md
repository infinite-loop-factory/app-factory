# EasyTalking 현대적 세련된 디자인 시스템 v2.0

## 🎯 디자인 철학 - Modern Refined Orange

### 핵심 원칙
1. **미니멀 + 포인트**: 그레이 톤 베이스 + 오렌지 포인트 컬러
2. **현대적 우아함**: 과도한 색상 사용 지양, 차분하고 세련된 톤
3. **계층적 시각화**: 색상이 아닌 크기, 간격, 타이포그래피로 정보 구조화
4. **일관된 인터랙션**: 모든 터치 요소에 일관된 hover/active 상태

### 색상 사용 철학
- **오렌지**: 브랜드 색상으로만 사용 (로고, 포인트 라인, 테두리)
- **그레이**: 베이스 색상 (텍스트, 배경, 카드, 아이콘)
- **화이트**: 청정함과 공간감을 위한 주요 배경색

## 🎨 새로운 색상 팔레트

### 주요 색상 체계

```typescript
// 현대적 세련된 색상 시스템
export const modernColors = {
  // 베이스 색상 (주요 사용)
  white: "#FFFFFF",           // 카드, 메인 배경
  gray50: "#F9FAFB",         // 아이콘 배경, 섹션 구분
  gray200: "#E5E7EB",        // 테두리, 구분선
  gray400: "#9CA3AF",        // 보조 텍스트
  gray700: "#374151",        // 주요 텍스트
  gray900: "#111827",        // 강조 텍스트
  
  // 포인트 색상 (제한적 사용)
  orangeAccent: "#FF6B35",   // 브랜드 포인트
  orange200: "#FED7AA",      // 연한 테두리
  orangeLine: "#FB923C",     // 강조 라인
};
```

### NativeWind 클래스 매핑

```typescript
export const modernClasses = {
  // 텍스트
  textPrimary: "text-gray-900",      // 주요 텍스트
  textSecondary: "text-gray-700",    // 일반 텍스트  
  textMuted: "text-gray-400",        // 보조 텍스트
  textBrand: "text-orange-500",      // 브랜드 컬러 텍스트
  
  // 배경
  screenBg: "bg-orange-50",          // 화면 배경 (연한 오렌지 유지)
  cardBg: "bg-white",                // 카드 배경
  iconBg: "bg-gray-50",              // 아이콘 배경
  
  // 테두리
  borderLight: "border-gray-200",    // 기본 테두리
  borderOrange: "border-orange-200", // 오렌지 포인트 테두리
  
  // 그림자
  shadowSm: "shadow-sm",             // 기본 그림자
  shadowMd: "shadow-md",             // hover 그림자
};
```

## 🏗️ 컴포넌트 스타일 가이드

### 1. 태그 (Tag) 컴포넌트

**현대적 Pill 스타일**:
```tsx
// ✅ 권장 스타일
<View className="mr-2 mb-1">
  <Text className="text-sm text-gray-700 rounded-full border border-orange-200 bg-white px-3 py-1.5">
    {tagText}
  </Text>
</View>
```

**특징**:
- `rounded-full`: 완전한 둥근 모서리 (pill 스타일)
- `bg-white`: 깔끔한 화이트 배경
- `border-orange-200`: 은은한 오렌지 테두리
- `text-gray-700`: 차분한 텍스트 색상
- `px-3 py-1.5`: 세련된 패딩 비율

### 2. 카드 (Card) 컴포넌트

**미니멀 카드 디자인**:
```tsx
// ✅ 권장 스타일
<TouchableOpacity className="flex-row items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
  {/* 카드 내용 */}
</TouchableOpacity>
```

**특징**:
- `border-gray-200`: 중성적인 회색 테두리
- `bg-white`: 깔끔한 화이트 배경  
- `shadow-sm`: 기본 그림자
- `hover:shadow-md transition-shadow`: 인터랙션 효과

### 3. 아이콘 컨테이너

**중성적 아이콘 배경**:
```tsx
// ✅ 권장 스타일
<View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
  <Text className="text-lg">{iconEmoji}</Text>
</View>
```

**특징**:
- `bg-gray-50`: 중성적인 연한 회색
- `rounded-full`: 원형 배경
- 크기는 `h-10 w-10` (40x40px) 기본

### 4. 화살표/인디케이터

**미니멀 화살표**:
```tsx
// ✅ 권장 스타일  
<View className="h-6 w-6 items-center justify-center">
  <Text className="text-lg text-gray-400 opacity-60">→</Text>
</View>
```

**특징**:
- 배경 없음 (이전의 원형 배경 제거)
- `text-gray-400 opacity-60`: 은은한 표시
- `→` 문자 사용 (더 모던한 느낌)

### 5. 숫자 강조 표시

**세련된 숫자 디스플레이**:
```tsx
// ✅ 권장 스타일
<View className="items-center">
  <Text className="text-sm text-gray-400 mb-1">총 질문 개수</Text>
  <View className="flex-row items-end">
    <Text className="text-3xl font-bold text-gray-900">{number}</Text>
    <Text className="text-lg font-medium text-gray-400 ml-1 mb-1">개</Text>
  </View>
  <View className="h-1 w-12 rounded-full bg-orange-500 mt-2 opacity-60" />
</View>
```

**특징**:
- 숫자는 `text-gray-900`: 강하게 표시
- 단위는 `text-gray-400`: 은은하게 표시
- 하단에 얇은 오렌지 라인: 브랜드 포인트

## 🎛️ 인터랙션 가이드라인

### 터치 피드백
```tsx
// ✅ 표준 터치 피드백
<TouchableOpacity 
  activeOpacity={0.7}
  className="...hover:shadow-md transition-shadow"
>
```

### 상태별 스타일
- **기본**: `shadow-sm border-gray-200`
- **Hover**: `shadow-md` (웹에서)
- **Active**: `activeOpacity={0.7}` (네이티브에서)
- **Disabled**: `opacity-50`

## 📏 간격 시스템

### 표준 간격
- **컴포넌트 간**: `gap-3` (12px)
- **섹션 간**: `py-4` (16px 상하)
- **화면 패딩**: `p-5` (20px)
- **카드 내부**: `p-5` (20px)
- **태그 패딩**: `px-3 py-1.5` (12px x 6px)

## 🔤 타이포그래피

### 텍스트 크기 체계
```typescript
export const textSizes = {
  // 제목
  title: "text-xl font-semibold",          // 20px, 섹션 제목
  cardTitle: "text-lg font-semibold",      // 18px, 카드 제목
  
  // 본문
  body: "text-base",                       // 16px, 일반 텍스트
  small: "text-sm",                        // 14px, 보조 텍스트
  tiny: "text-xs",                         // 12px, 주석
  
  // 강조
  number: "text-3xl font-bold",            // 30px, 숫자 강조
  unit: "text-lg font-medium",             // 18px, 단위
};
```

### 텍스트 색상 체계
- **주요 텍스트**: `text-gray-900` (가장 진함)
- **일반 텍스트**: `text-gray-700`
- **보조 텍스트**: `text-gray-400`  
- **브랜드 텍스트**: `text-orange-500` (제한적 사용)

## ✅ Do's and Don'ts

### ✅ Do's
- 오렌지는 포인트 용도로만 사용 (라인, 테두리)
- 회색 톤을 베이스로 차분한 분위기 연출
- 화이트 배경으로 깔끔함 유지
- 일관된 둥근 모서리 사용 (`rounded-xl`, `rounded-full`)
- 적절한 그림자로 깊이감 표현

### ❌ Don'ts  
- 오렌지 배경색 과도 사용 금지
- 너무 강한 색상 대비 지양
- 불필요한 장식적 요소 제거
- 텍스트 가독성을 해치는 색상 조합 금지
- 일관성 없는 간격 사용 금지

## 🚀 앞으로 적용할 화면들

이 디자인 가이드라인을 다음 화면들에 순차적으로 적용:

1. **CategorySelectionScreen**: 카테고리 선택 카드
2. **DifficultySelectionScreen**: 난이도 선택 버튼  
3. **ContinuousCardScreen**: 질문 카드 디자인
4. **QuestionListScreen**: 질문 리스트 아이템
5. **IndividualCardScreen**: 개별 질문 카드

각 화면은 위의 가이드라인을 기반으로 일관된 현대적 세련된 UI로 업데이트될 예정입니다.