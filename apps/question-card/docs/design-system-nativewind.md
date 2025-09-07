# EasyTalking 디자인 시스템 - Vibrant Orange 테마

## 개요

EasyTalking 앱은 **NativeWind 우선** 접근 방식과 **Vibrant Orange (Modified Quantum Rose)** 테마로 디자인 시스템을 구축합니다.

### 🧡 Vibrant Orange 테마 특징

- **테마명**: Vibrant Orange (Modified Quantum Rose)
- **컨셉**: 따뜻하고 에너지 넘치는 오렌지 계열 디자인
- **기본 색상**: `#FF6B35` (hsl(14, 100%, 60%))
- **분위기**: 친근하고 활동적이며 긍정적인 사용자 경험

### 스타일링 우선순위

1. **NativeWind (Tailwind CSS for React Native)** - 주요 스타일링 방법
2. **Gluestack-ui 컴포넌트** - 적합한 컴포넌트가 있을 때 사용
3. **React Native StyleSheet** - NativeWind로 표현하기 어려운 경우에만 사용

## Vibrant Orange 테마 색상 팔레트

### 🎨 기본 테마 색상

새로운 Vibrant Orange 테마는 다음과 같은 색상 체계를 사용합니다:

```typescript
// 기본 테마 색상
export const themeColors = {
  background: "#FFF5F0",        // 화면 배경 (매우 연한 오렌지)
  foreground: "#7A2E0E",        // 주요 텍스트 (짙은 오렌지)
  primary: "#FF6B35",           // 기본 색상 (생동감 있는 오렌지)
  secondary: "#FFD1B8",         // 보조 색상 (부드러운 오렌지)
  accent: "#FFA983",            // 강조 색상 (중간 오렌지)
  muted: "#FFE6D6",             // 비활성 색상 (연한 오렌지)
  card: "#FFFAF8",              // 카드 배경 (거의 흰색)
  border: "#FFCC99",            // 테두리 (연한 오렌지)
};
```

### 🏷️ 테마 NativeWind 클래스

```typescript
// 가장 자주 사용하는 테마 클래스들
export const themeTailwindClasses = {
  // 배경
  background: "bg-orange-50",      // 화면 배경
  primary: "bg-orange-500",        // 메인 버튼, 강조 요소
  secondary: "bg-orange-200",      // 보조 버튼, 카드 배경
  
  // 텍스트
  foreground: "text-orange-900",   // 주요 텍스트
  primaryText: "text-orange-500",  // 강조 텍스트
  mutedText: "text-orange-600",    // 부가 설명 텍스트
  
  // 테두리 및 입력
  border: "border-orange-300",     // 일반 테두리
  input: "bg-orange-100",          // 입력 필드 배경
  focus: "focus:ring-orange-500 focus:border-orange-500", // 포커스 스타일
};
```

### 📂 카테고리 색상 (업데이트)

6개 카테고리별 Tailwind 클래스 매핑:

```typescript
// 사용 예제
import { getCategoryTailwindClass } from "@/constants/designSystem";

// 배경색
<Box className={`${getCategoryTailwindClass("hobby", "bg", 100)}`} />
// → "bg-red-100"

// 텍스트 색상  
<Text className={`${getCategoryTailwindClass("hobby", "text", 600)}`} />
// → "text-red-600"

// 테두리 색상
<View className={`border-2 ${getCategoryTailwindClass("hobby", "border", 500)}`} />
// → "border-red-500"
```

새로운 테마와 조화를 이루는 카테고리별 색상으로 업데이트되었습니다:

#### 🎯 카테고리별 색상 의미와 매핑

| 카테고리 | 의미 | Tailwind 색상 | 50 | 100 | 500 | 600 | 700 |
|----------|------|---------------|----|----|-----|-----|-----|
| **hobby** (나의 취향) | 메인 테마 색상 | **orange** | bg-orange-50 | bg-orange-100 | bg-orange-500 | bg-orange-600 | bg-orange-700 |
| **talent** (나의 재능) | 성장의 그린 | **emerald** | bg-emerald-50 | bg-emerald-100 | bg-emerald-500 | bg-emerald-600 | bg-emerald-700 |
| **values** (나의 가치관) | 신뢰의 블루 | **blue** | bg-blue-50 | bg-blue-100 | bg-blue-500 | bg-blue-600 | bg-blue-700 |
| **experience** (나의 경험) | 따뜻한 황금색 | **amber** | bg-amber-50 | bg-amber-100 | bg-amber-500 | bg-amber-600 | bg-amber-700 |
| **daily** (나의 일상) | 생동감 있는 핑크 | **fuchsia** | bg-fuchsia-50 | bg-fuchsia-100 | bg-fuchsia-500 | bg-fuchsia-600 | bg-fuchsia-700 |
| **direction** (나의 방향성) | 미래의 스카이 블루 | **sky** | bg-sky-50 | bg-sky-100 | bg-sky-500 | bg-sky-600 | bg-sky-700 |

> **💡 색상 선택 철학**: 각 카테고리는 그 의미를 시각적으로 표현하는 색상으로 선택되었으며, 전체적으로 Vibrant Orange 테마와 조화를 이룹니다.

### 난이도 색상

3개 난이도별 Tailwind 클래스:

```typescript
import { getDifficultyTailwindClass } from "@/constants/designSystem";

// 쉬움 - green-500
<View className={getDifficultyTailwindClass("easy", "bg")} />
// → "bg-green-500"

// 보통 - amber-500
<View className={getDifficultyTailwindClass("medium", "bg")} />
// → "bg-amber-500"

// 어려움 - red-500  
<View className={getDifficultyTailwindClass("hard", "bg")} />
// → "bg-red-500"
```

## 🎨 Vibrant Orange 테마 컴포넌트 스타일링 가이드

### 🔥 1. 테마 기반 기본 컴포넌트

```jsx
// ✅ 새로운 테마를 활용한 기본 컴포넌트들
import { Box, Text, Pressable } from "@/components/ui";
import { themeTailwindClasses, styleExamples } from "@/constants/designSystem";

// 화면 기본 레이아웃 (Vibrant Orange 배경)
const Screen = ({ children }) => (
  <View className={styleExamples.layouts.screen}> {/* bg-orange-50 */}
    {children}
  </View>
);

// 테마 기본 카드
const ThemeCard = ({ children, variant = "default" }) => (
  <View className={`
    ${styleExamples.layouts.card}
    ${variant === "accent" ? styleExamples.theme.accentBadge : ""}
  `}>
    {children}
  </View>
);

// 테마 기본 버튼
const ThemeButton = ({ children, type = "primary", ...props }) => (
  <Pressable 
    className={styleExamples.buttons[type]}
    {...props}
  >
    <Text className={type === "primary" ? "text-white" : themeTailwindClasses.primaryText}>
      {children}
    </Text>
  </Pressable>
);
```

### 🏷️ 2. 카테고리 카드 (업데이트)

```jsx
// ✅ Vibrant Orange 테마와 조화로운 카테고리 카드
import { Box, Text } from "@/components/ui";
import { getCategoryTailwindClass, styleExamples } from "@/constants/designSystem";

const CategoryCard = ({ category }) => (
  <Box className={styleExamples.categoryCard.base}> {/* 테마 적용된 카드 */}
    {/* 카테고리 아이콘 */}
    <Text className="text-2xl mb-3">{category.icon}</Text>
    
    {/* 카테고리 이름 (테마 텍스트 색상) */}
    <Text className={`text-lg font-medium ${getCategoryTailwindClass(category.id, "text", 600)}`}>
      {category.name}
    </Text>
    
    {/* 카테고리 배지 (동적 색상) */}
    <View className={styleExamples.categoryCard.categoryBadge(category.id)}>
      <Text className={getCategoryTailwindClass(category.id, "text", 600)}>
        {category.description}
      </Text>
    </View>
  </Box>
);
```

### 2. 난이도 배지

```jsx
// ✅ NativeWind 우선 방식
import { getDifficultyTailwindClass } from "@/constants/designSystem";

const DifficultyBadge = ({ difficulty }) => (
  <View className={`px-3 py-1 rounded-xl ${getDifficultyTailwindClass(difficulty, "bg")}`}>
    <Text className="text-white text-sm font-medium">
      {difficulty === "easy" && "쉬움"}
      {difficulty === "medium" && "보통"}  
      {difficulty === "hard" && "어려움"}
    </Text>
  </View>
);
```

### 🎯 3. 버튼 스타일 (Vibrant Orange 테마 적용)

```jsx
// ✅ 새로운 테마를 적용한 다양한 버튼 스타일
import { styleExamples } from "@/constants/designSystem";

const Button = ({ type = "primary", children, disabled, ...props }) => (
  <Pressable 
    className={`
      ${styleExamples.buttons[type]}
      ${disabled ? "opacity-50" : ""}
    `}
    disabled={disabled}
    {...props}
  >
    <Text className={getButtonTextClass(type)}>
      {children}
    </Text>
  </Pressable>
);

// 버튼 타입별 텍스트 클래스
const getButtonTextClass = (type) => {
  switch (type) {
    case "primary": return "text-white font-medium";
    case "secondary": return "text-orange-800 font-medium";
    case "accent": return "text-orange-800 font-medium";
    case "ghost": return "text-orange-500 font-medium";
    case "destructive": return "text-white font-medium";
    default: return "text-white font-medium";
  }
};

// 사용 예제
<Button type="primary">메인 버튼</Button>
<Button type="secondary">보조 버튼</Button>
<Button type="accent">강조 버튼</Button>
<Button type="ghost">텍스트 버튼</Button>
<Button type="destructive">삭제 버튼</Button>
```

### 🏠 4. 레이아웃 컴포넌트 (새 테마 적용)

```jsx
// ✅ Vibrant Orange 테마가 적용된 레이아웃
import { styleExamples, themeTailwindClasses } from "@/constants/designSystem";

// 화면 레이아웃 (오렌지 배경)
const Screen = ({ children }) => (
  <View className={styleExamples.layouts.screen}> {/* flex-1 bg-orange-50 */}
    {children}
  </View>
);

// 헤더 (테마 색상)
const Header = ({ title, leftButton, rightButton }) => (
  <View className={styleExamples.layouts.header}>
    {leftButton}
    <Text className={`text-lg font-semibold ${themeTailwindClasses.foreground}`}>
      {title}
    </Text>
    {rightButton}
  </View>
);

// 콘텐츠 컨테이너
const Container = ({ children }) => (
  <View className={styleExamples.layouts.container}>
    {children}
  </View>
);

// 모달 (테마 적용)
const Modal = ({ children, visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className={styleExamples.layouts.modalOverlay}>
      <View className={styleExamples.layouts.modalContent}>
        {children}
      </View>
    </View>
  </Modal>
);
```

### 🎨 5. 상태별 컴포넌트 

```jsx
// ✅ 상태별 알림 및 피드백 컴포넌트
import { styleExamples } from "@/constants/designSystem";

const Alert = ({ type = "info", children }) => (
  <View className={`
    p-4 rounded-lg border flex-row items-center
    ${styleExamples.states[`${type}Bg`]}
    ${styleExamples.states[`${type}Border`]}
  `}>
    <Text className={`flex-1 ${styleExamples.states[`${type}Text`]}`}>
      {children}
    </Text>
  </View>
);

// 사용 예제
<Alert type="success">✅ 성공적으로 저장되었습니다!</Alert>
<Alert type="warning">⚠️ 주의해서 진행해주세요.</Alert>
<Alert type="error">❌ 오류가 발생했습니다.</Alert>
<Alert type="info">💡 추가 정보를 확인해보세요.</Alert>
```

## 마이그레이션 가이드

### StyleSheet → NativeWind 변환

#### Before (StyleSheet)
```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
});

<View style={styles.container}>
  <View style={styles.card}>
    <Text style={styles.title}>Title</Text>
  </View>
</View>
```

#### After (NativeWind)
```jsx
<View className="flex-1 bg-gray-50 p-4">
  <View className="bg-white rounded-xl p-5 shadow-md">
    <Text className="text-lg font-semibold text-gray-800 mb-2">Title</Text>
  </View>
</View>
```

### 하드코딩된 색상 → Tailwind 클래스 변환

#### Before
```jsx
<Text style={{ color: "#3b82f6", fontSize: 16, fontWeight: "500" }}>
  Blue Text
</Text>
```

#### After  
```jsx
<Text className="text-blue-500 text-base font-medium">
  Blue Text
</Text>
```

## NativeWind 한계점과 StyleSheet 사용 시점

### StyleSheet를 사용해야 하는 경우

1. **복잡한 그림자 효과**
   ```jsx
   // NativeWind로 표현하기 어려운 복잡한 그림자
   const complexShadow = {
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.15,
     shadowRadius: 25,
     elevation: 8,
   };
   ```

2. **정밀한 애니메이션 스타일**
   ```jsx
   // Animated.Value와 함께 사용하는 동적 스타일
   const animatedStyle = {
     transform: [{ translateX: animatedValue }],
     opacity: opacityValue,
   };
   ```

3. **플랫폼별 조건부 스타일**
   ```jsx
   // Platform.select를 사용하는 경우
   const platformStyle = Platform.select({
     ios: { paddingTop: 20 },
     android: { paddingTop: StatusBar.currentHeight },
   });
   ```

### Gluestack-ui 컴포넌트를 사용하는 경우

1. **접근성이 중요한 폼 요소**
   ```jsx
   import { Input, Button, Checkbox } from "@/components/ui";
   
   // 접근성이 내장된 폼 컴포넌트
   <Input placeholder="이메일" accessibilityLabel="이메일 입력" />
   <Checkbox value="agree" accessibilityLabel="약관 동의" />
   ```

2. **복잡한 상호작용이 필요한 컴포넌트**
   ```jsx
   import { Modal, AlertDialog } from "@/components/ui";
   
   // 키보드 처리, 포커스 관리가 내장된 컴포넌트
   <Modal>...</Modal>
   <AlertDialog>...</AlertDialog>
   ```

## 디자인 토큰 사용 예제 모음

### 자주 사용하는 스타일 조합

```jsx
import { styleExamples } from "@/constants/designSystem";

// 1. 화면 기본 레이아웃
<View className={styleExamples.layouts.screen}>
  <View className={styleExamples.layouts.header}>
    <Text>헤더 제목</Text>
  </View>
  <View className={styleExamples.layouts.container}>
    <View className={styleExamples.layouts.card}>
      <Text>카드 내용</Text>
    </View>
  </View>
</View>

// 2. 버튼 스타일
<Pressable className={styleExamples.buttons.primary}>
  <Text>주요 버튼</Text>
</Pressable>

<Pressable className={styleExamples.buttons.secondary}>
  <Text>보조 버튼</Text>
</Pressable>

// 3. 카테고리별 동적 스타일
{categories.map(category => (
  <View 
    key={category.id}
    className={styleExamples.categoryCard.categoryBadge(category.id)}
  >
    <Text>{category.name}</Text>
  </View>
))}
```

## 개발 워크플로우

### 1. 🎨 Vibrant Orange 테마 우선 접근

```jsx
// 1단계: 테마 기반 NativeWind 클래스로 시작
<View className={styleExamples.layouts.screen}> {/* bg-orange-50 */}

// 2단계: 테마 디자인 토큰과 카테고리 함수 결합
<View className={`
  ${styleExamples.layouts.card}
  ${getCategoryTailwindClass(category.id, "border", 500)}
`}>

// 3단계: 필요시에만 StyleSheet 추가 (애니메이션 등)
<View 
  className={styleExamples.layouts.card}
  style={complexAnimationStyles}
>
```

### 2. 🚀 성능 최적화 (테마 적용)

```jsx
// ✅ 테마 기반 클래스명을 상수로 분리
const THEME_CARD_STYLES = styleExamples.layouts.card;
const THEME_TITLE_STYLES = `text-lg font-semibold ${themeTailwindClasses.foreground} mb-2`;
const THEME_BUTTON_PRIMARY = styleExamples.buttons.primary;

const ThemedCard = React.memo(({ title, children, category }) => (
  <View className={THEME_CARD_STYLES}>
    <Text className={THEME_TITLE_STYLES}>{title}</Text>
    {children}
    <View className={styleExamples.categoryCard.categoryBadge(category.id)}>
      <Text>{category.name}</Text>
    </View>
  </View>
));
```

### 3. 타입 안전성
```typescript
// NativeWind 클래스의 타입 안전성 확보
type CategoryId = keyof typeof categoryTailwindClasses;
type ColorShade = 50 | 100 | 500 | 600 | 700;

const getCategoryClass = (
  categoryId: CategoryId,
  type: "bg" | "text" | "border",
  shade: ColorShade = 500
): string => {
  return getCategoryTailwindClass(categoryId, type, shade);
};
```

## 🎯 실제 적용 예제

### EasyTalking 앱에서의 Vibrant Orange 테마 활용

```jsx
// ✅ CategorySelectionScreen에서 새 테마 적용 예제
import { 
  styleExamples, 
  themeTailwindClasses, 
  getCategoryTailwindClass 
} from "@/constants/designSystem";

const CategorySelectionScreen = () => {
  return (
    <View className={styleExamples.layouts.screen}>
      {/* 헤더 */}
      <View className={styleExamples.layouts.header}>
        <Text className={`text-xl font-bold ${themeTailwindClasses.foreground}`}>
          카테고리 선택
        </Text>
      </View>

      {/* 카테고리 목록 */}
      <ScrollView className={styleExamples.layouts.container}>
        {categories.map(category => (
          <Pressable 
            key={category.id}
            className={`
              ${styleExamples.layouts.card}
              ${getCategoryTailwindClass(category.id, "border", 200)}
              mb-4
            `}
          >
            <Text className="text-2xl mb-2">{category.icon}</Text>
            <Text className={`text-lg font-medium ${getCategoryTailwindClass(category.id, "text", 600)}`}>
              {category.name}
            </Text>
            <View className={styleExamples.categoryCard.categoryBadge(category.id)}>
              <Text className={`text-sm ${getCategoryTailwindClass(category.id, "text", 700)}`}>
                {category.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="p-6">
        <Pressable className={styleExamples.buttons.primary}>
          <Text className="text-white font-medium text-center">다음으로</Text>
        </Pressable>
      </View>
    </View>
  );
};
```

## 🧡 새로운 Vibrant Orange 테마 요약

### 🎨 테마 핵심 특징

- **🔥 메인 색상**: `#FF6B35` - 따뜻하고 에너지 넘치는 오렌지
- **🌅 배경 색상**: `bg-orange-50` - 부드럽고 편안한 연한 오렌지 배경
- **📝 텍스트 색상**: `text-orange-900` - 높은 대비율을 위한 짙은 오렌지
- **🎯 카테고리 색상**: 메인 테마와 조화로운 6가지 의미별 색상

### 🚀 개발 효율성 향상

- **빠른 개발**: `styleExamples`를 통한 즉시 적용 가능한 스타일
- **일관된 디자인**: `themeTailwindClasses`로 통일된 색상 시스템
- **동적 스타일링**: 카테고리별/상황별 자동 색상 적용
- **타입 안전성**: TypeScript와 완벽한 통합으로 런타임 오류 방지

## 결론

**🧡 Vibrant Orange 테마 + NativeWind 우선** 접근 방식을 통해:

- **✨ 매력적인 UI**: 따뜻하고 친근한 사용자 경험 제공
- **⚡ 개발 속도**: 테마 기반 컴포넌트로 빠른 프로토타이핑
- **🔧 유지보수성**: 중앙화된 디자인 시스템으로 쉬운 업데이트
- **📱 반응형 디자인**: 모든 디바이스에서 일관된 경험
- **♿ 접근성**: 높은 대비율과 명확한 시각적 계층 구조

### 🎯 핵심 개발 원칙

1. **NativeWind 우선**: 90% 이상의 스타일링을 NativeWind로 처리
2. **테마 일관성**: `styleExamples`와 `themeTailwindClasses` 적극 활용  
3. **성능 최적화**: 상수화된 스타일 클래스로 재계산 방지
4. **점진적 개선**: Gluestack-ui → StyleSheet 순서로 필요시에만 사용

**🎨 EasyTalking만의 독특하고 따뜻한 Vibrant Orange 경험을 만들어보세요!**