# Shake It - Design System & Implementation Guide

Use this skill when implementing any screen or component for the Shake It app. This guide ensures consistent design patterns, component structures, and user experience across all screens.

## Design System Overview

### Color Palette

#### Light Mode
```typescript
{
  primary: "#3d6bf5",
  "primary-dark": "#254db5",
  "background-light": "#FFFFFF",
  "surface-light": "#F2F4F6",
  "text-main": "#191F28",
  "text-sub": "#8B95A1",
}
```

#### Dark Mode
```typescript
{
  "background-dark": "#101422",
  "surface-dark": "#1C202E",
  // Text colors invert to white/light gray
}
```

#### Semantic Colors
```typescript
{
  orange: "#FF6B35", // Open status
  red: "#EF4444", // Favorite/Error
  yellow: "#F59E0B", // Star ratings
  blue: "#3d6bf5", // Primary actions
}
```

### Typography

**Font Families:**
- Display & Body: Plus Jakarta Sans, Noto Sans KR (for Korean text)

**Font Sizes:**
```typescript
{
  "3xl": "30px",  // Main hero title
  "2xl": "24px",  // Card titles
  "xl": "20px",   // Section headers
  "lg": "18px",   // Large button text
  "base": "16px", // Body text
  "sm": "14px",   // Secondary text
  "xs": "12px",   // Helper text
}
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Spacing Scale

Use consistent spacing throughout:
```typescript
{
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
}
```

### Border Radius

```typescript
{
  DEFAULT: "8px",    // 0.5rem - Default buttons/cards
  lg: "16px",        // 1rem - Large cards
  xl: "24px",        // 1.5rem - Modals
  "2xl": "32px",     // 2rem - Primary buttons
  full: "9999px",    // Circular elements
}
```

### Shadows

```typescript
{
  soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
  glow: "0 0 40px rgba(61, 107, 245, 0.15)",
  card: "0 20px 60px -15px rgba(0, 0, 0, 0.5)",
  button: "0 4px 16px rgba(61, 107, 245, 0.2)",
}
```

## Screen Specifications

### 1. Main Shake Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│ Header                            │
│ [Location ▼]         [👤] (dot)  │
├──────────────────────────────────┤
│                                   │
│         Title Section             │
│         Subtitle                  │
│                                   │
│     Phone Illustration            │
│     (Animated)                    │
│                                   │
│                                   │
│   [Primary Action Button]         │
│   Helper Text                     │
└──────────────────────────────────┘
```

#### Component Details

**Header Component:**
```tsx
<View className="flex-row items-center justify-between px-5 pt-12 pb-4">
  {/* Location Selector */}
  <Pressable className="flex-row items-center gap-1.5">
    <Text className="text-xl font-bold text-text-main dark:text-white">
      강남역
    </Text>
    <ChevronDown size={24} color="#191F28" />
  </Pressable>

  {/* Profile Icon with Notification */}
  <Pressable className="relative w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark items-center justify-center">
    <User size={24} color="#191F28" />
    {/* Notification Dot */}
    <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light" />
  </Pressable>
</View>
```

**Main Content:**
```tsx
<View className="flex-1 items-center justify-center px-6 -mt-10">
  {/* Background Blobs */}
  <View className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
  <View className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl opacity-30" />

  {/* Title Section */}
  <View className="text-center mb-12 space-y-3">
    <Text className="text-3xl font-extrabold leading-tight text-text-main dark:text-white">
      오늘의 점심 운명,{"\n"}
      <Text className="text-primary">흔들어서</Text> 결정하세요!
    </Text>
    <Text className="text-base font-medium text-text-sub">
      폰을 가볍게 흔들면 맛집을 찾아드려요
    </Text>
  </View>

  {/* Phone Illustration */}
  <PhoneIllustration />
</View>
```

**Phone Illustration Component:**
```tsx
<View className="relative w-[280px] aspect-square items-center justify-center mb-8">
  {/* Ripple Effects */}
  <View className="absolute inset-0 border border-primary/10 rounded-full scale-110 animate-ping" />
  <View className="absolute inset-0 border border-primary/20 rounded-full scale-125 opacity-20" />

  {/* Phone Body */}
  <View className="w-32 h-56 bg-gradient-to-br from-primary to-primary-dark rounded-[40px] shadow-glow p-3 border-4 border-white dark:border-gray-800">
    {/* Screen Reflection */}
    <View className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent" />

    {/* Notch */}
    <View className="w-12 h-4 bg-black/20 rounded-full mt-1 self-center" />

    {/* Screen Content */}
    <View className="flex-1 items-center justify-center gap-2">
      <LunchDining size={40} color="white" className="animate-bounce" />
      <View className="w-12 h-1.5 bg-white/30 rounded-full" />
      <View className="w-8 h-1.5 bg-white/20 rounded-full" />
    </View>

    {/* Home Indicator */}
    <View className="w-10 h-1 bg-white/30 rounded-full mb-1 self-center" />
  </View>

  {/* Motion Lines */}
  <MotionLines position="left" />
  <MotionLines position="right" />
</View>
```

**Animation:**
```typescript
// Shake Idle Animation
@keyframes shake-idle {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}
// Duration: 3s, ease-in-out, infinite
```

**Bottom Action Area:**
```tsx
<View className="px-6 pb-10">
  <View className="items-center gap-4">
    {/* Primary Button */}
    <Pressable className="w-full max-w-xs bg-surface-light dark:bg-surface-dark h-14 rounded-2xl flex-row items-center justify-center gap-2 active:scale-95">
      <TouchApp size={20} color="#3d6bf5" />
      <Text className="font-bold text-text-main dark:text-white">
        흔들지 않고 터치하기
      </Text>
    </Pressable>

    {/* Helper Text */}
    <Text className="text-xs text-text-sub text-center">
      흔들기가 동작하지 않나요? 설정을 확인해주세요.
    </Text>
  </View>
</View>
```

### 2. Filter Settings Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│ Top Bar: 필터            초기화  │
├──────────────────────────────────┤
│                                   │
│ 음식 종류      (중복 선택 가능)  │
│ [Chips: 한식 일식 중식...]       │
│                                   │
│ ───────────────────────────       │
│                                   │
│ 최소 평점           ⭐ 4.0 이상  │
│ [═══════════○────────]            │
│ 0.0  1.0  2.0  3.0  4.0  5.0     │
│                                   │
│ ───────────────────────────       │
│                                   │
│ 거리                   1km 이내  │
│ [500m][1km][3km][5km][10km]      │
│                                   │
├──────────────────────────────────┤
│         [설정 완료]              │
└──────────────────────────────────┘
```

#### Top Bar
```tsx
<View className="sticky top-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-5 py-4 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
  <View className="w-12" /> {/* Spacer */}
  <Text className="text-lg font-bold text-slate-900 dark:text-white flex-1 text-center">
    필터
  </Text>
  <Pressable className="w-12 items-end">
    <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">
      초기화
    </Text>
  </Pressable>
</View>
```

#### Section: 음식 종류 (Cuisine Categories)
```tsx
<View className="pt-6 px-5">
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-xl font-bold text-slate-900 dark:text-white">
      음식 종류
    </Text>
    <Text className="text-xs font-medium text-slate-400">
      중복 선택 가능
    </Text>
  </View>

  <View className="flex-row flex-wrap gap-2.5">
    {/* Active Chip - Filled */}
    <Pressable className="h-10 flex-row items-center gap-2 rounded-2xl bg-primary px-5 shadow-sm active:scale-95">
      <Text>🍚</Text>
      <Text className="text-sm font-bold text-white">한식</Text>
    </Pressable>

    {/* Active Chip - Outlined */}
    <Pressable className="h-10 flex-row items-center gap-2 rounded-2xl bg-white dark:bg-background-dark border-2 border-primary px-4 active:scale-95">
      <Text>🍝</Text>
      <Text className="text-sm font-bold text-primary">양식</Text>
    </Pressable>

    {/* Inactive Chip */}
    <Pressable className="h-10 flex-row items-center gap-2 rounded-2xl bg-surface-light dark:bg-surface-dark px-5 active:scale-95">
      <Text>🍣</Text>
      <Text className="text-sm font-medium text-slate-600 dark:text-slate-300">
        일식
      </Text>
    </Pressable>
  </View>
</View>
```

**Chip States:**
1. **Active (Filled):** `bg-primary`, white text, shadow
2. **Active (Outlined):** White bg, `border-2 border-primary`, primary color text
3. **Inactive:** `bg-surface-light`, gray text, hover effects

#### Section: 최소 평점 (Minimum Rating)
```tsx
<View className="px-5">
  <View className="flex-row items-end justify-between mb-6">
    <Text className="text-xl font-bold text-slate-900 dark:text-white">
      최소 평점
    </Text>
    <View className="flex-row items-center">
      <Star size={20} color="#F59E0B" fill="#F59E0B" />
      <Text className="text-lg font-bold text-primary ml-1">
        4.0 이상
      </Text>
    </View>
  </View>

  {/* Custom Slider */}
  <View className="relative w-full h-12 items-center">
    {/* Track Background */}
    <View className="absolute w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
      {/* Filled Track */}
      <View className="h-full bg-primary rounded-full" style={{ width: '80%' }} />
    </View>

    {/* Thumb */}
    <View className="absolute w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-100 items-center justify-center" style={{ left: '80%', transform: [{ translateX: -16 }] }}>
      <View className="w-3 h-3 bg-primary rounded-full" />
    </View>

    {/* Labels */}
    <View className="absolute -bottom-6 w-full flex-row justify-between px-1">
      <Text className="text-xs text-slate-400">0.0</Text>
      <Text className="text-xs text-slate-400">1.0</Text>
      <Text className="text-xs text-slate-400">2.0</Text>
      <Text className="text-xs text-slate-400">3.0</Text>
      <Text className="text-xs font-bold text-slate-900 dark:text-white">4.0</Text>
      <Text className="text-xs text-slate-400">5.0</Text>
    </View>
  </View>
</View>
```

#### Section: 거리 (Distance)
```tsx
<View className="px-5">
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-xl font-bold text-slate-900 dark:text-white">
      거리
    </Text>
    <Text className="text-base font-semibold text-primary">
      1km 이내
    </Text>
  </View>

  {/* Segmented Control */}
  <View className="bg-surface-light dark:bg-surface-dark p-1 rounded-xl flex-row items-center">
    <Pressable className="flex-1 py-2.5 rounded-lg items-center">
      <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
        500m
      </Text>
    </Pressable>

    {/* Selected */}
    <Pressable className="flex-1 py-2.5 rounded-lg bg-white dark:bg-slate-600 shadow-sm items-center">
      <Text className="text-sm font-bold text-primary dark:text-white">
        1km
      </Text>
    </Pressable>

    <Pressable className="flex-1 py-2.5 rounded-lg items-center">
      <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
        3km
      </Text>
    </Pressable>

    {/* ... other options ... */}
  </View>

  <Text className="mt-3 text-xs text-slate-400 dark:text-slate-500 pl-1">
    현재 위치를 기준으로 반경 1km 내의 맛집을 검색합니다.
  </Text>
</View>
```

#### Sticky Bottom Button
```tsx
<View className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
  <Pressable className="w-full bg-primary h-14 rounded-2xl items-center justify-center shadow-lg active:scale-[0.98]">
    <Text className="text-white font-bold text-lg">
      설정 완료
    </Text>
  </Pressable>
</View>
```

### 3. Restaurant Result Pop-up

#### Layout Structure
```
┌──────────────────────────────────┐
│ (Blurred Map Background)          │
│ ┌────────────────────────────┐   │
│ │ [×]                         │   │
│ │ ┌────────────────────────┐ │   │
│ │ │    Hero Image          │ │   │
│ │ │              [♥]       │ │   │
│ │ └────────────────────────┘ │   │
│ │                             │   │
│ │ 성수 족발        [Open]     │   │
│ │ ⭐ 4.8 • 2,400+ reviews    │   │
│ │ [📍 450m] [⏱️ ~10 min]     │   │
│ │                             │   │
│ │ [네이버 지도에서 보기]      │   │
│ │ [다시 흔들기]               │   │
│ └────────────────────────────┘   │
│ Not what you craved? Shake again! │
└──────────────────────────────────┘
```

#### Background & Container
```tsx
{/* Dimmed Background */}
<View className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

{/* Modal Container */}
<View className="relative z-20 flex-1 items-center justify-center p-4">
  {/* Result Card */}
  <View className="w-full max-w-[360px] rounded-2xl bg-white dark:bg-[#1e2330] shadow-card overflow-hidden">
    {/* Content */}
  </View>

  {/* Helper Text */}
  <Text className="mt-6 text-white/70 text-sm font-medium animate-pulse">
    Not what you craved? Shake again!
  </Text>
</View>
```

#### Result Card
```tsx
<View className="w-full max-w-[360px] rounded-2xl bg-white dark:bg-[#1e2330] shadow-card overflow-hidden">
  {/* Close Button */}
  <Pressable className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md items-center justify-center">
    <X size={20} color="white" />
  </Pressable>

  {/* Hero Image */}
  <View className="relative h-64 w-full">
    <Image
      source={{ uri: imageUrl }}
      className="w-full h-full"
      resizeMode="cover"
    />

    {/* Gradient Overlay */}
    <View className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

    {/* Favorite Button */}
    <Pressable className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-lg items-center justify-center active:scale-95">
      <Heart size={20} color="#EF4444" fill="#EF4444" />
    </Pressable>
  </View>

  {/* Content Section */}
  <View className="p-6 gap-6">
    {/* Header Info */}
    <View className="gap-2">
      <View className="flex-row items-start justify-between">
        <Text className="text-2xl font-extrabold text-[#0d111c] dark:text-white flex-1">
          성수 족발
        </Text>
        <View className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1">
          <Text className="text-xs font-bold text-orange-700 dark:text-orange-300">
            Open
          </Text>
        </View>
      </View>

      {/* Rating & Info */}
      <View className="flex-row items-center gap-1.5">
        <Star size={18} color="#F59E0B" fill="#F59E0B" />
        <Text className="font-bold text-[#0d111c] dark:text-white">4.8</Text>
        <Text className="text-slate-400">•</Text>
        <Text className="text-sm text-slate-600 dark:text-slate-400 underline">
          2,400+ reviews
        </Text>
        <Text className="text-slate-400">•</Text>
        <Text className="text-sm text-slate-600 dark:text-slate-400">
          Korean Cuisine
        </Text>
      </View>

      {/* Distance & Time Chips */}
      <View className="flex-row gap-2 mt-2">
        <View className="flex-row items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
          <MapPin size={16} />
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            450m away
          </Text>
        </View>
        <View className="flex-row items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
          <Clock size={16} />
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            ~10 min walk
          </Text>
        </View>
      </View>
    </View>

    {/* Action Buttons */}
    <View className="gap-3">
      {/* Primary Action */}
      <Pressable className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
        <Map size={20} color="white" />
        <Text className="font-bold text-base text-white">
          네이버 지도에서 보기
        </Text>
      </Pressable>

      {/* Secondary Action */}
      <Pressable className="w-full bg-transparent border border-transparent p-3 rounded-xl flex-row items-center justify-center gap-2">
        <RefreshCw size={20} color="#64748b" />
        <Text className="font-semibold text-sm text-slate-500 dark:text-slate-400">
          다시 흔들기
        </Text>
      </Pressable>
    </View>
  </View>
</View>
```

## Component Patterns

### Button Variants

#### 1. Primary Button (Filled)
```tsx
<Pressable className="bg-primary h-14 rounded-2xl px-6 items-center justify-center shadow-lg active:scale-[0.98]">
  <Text className="text-white font-bold text-lg">버튼 텍스트</Text>
</Pressable>
```

#### 2. Secondary Button (Surface)
```tsx
<Pressable className="bg-surface-light dark:bg-surface-dark h-14 rounded-2xl px-6 items-center justify-center active:scale-95">
  <Text className="text-text-main dark:text-white font-bold">버튼 텍스트</Text>
</Pressable>
```

#### 3. Ghost Button (Transparent)
```tsx
<Pressable className="bg-transparent border border-slate-200 dark:border-slate-700 h-12 rounded-xl px-4 items-center justify-center">
  <Text className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
    버튼 텍스트
  </Text>
</Pressable>
```

#### 4. Chip Button (Toggle)
```tsx
{/* Active */}
<Pressable className="h-10 rounded-2xl bg-primary px-5 flex-row items-center gap-2 active:scale-95">
  <Icon />
  <Text className="text-sm font-bold text-white">Label</Text>
</Pressable>

{/* Inactive */}
<Pressable className="h-10 rounded-2xl bg-surface-light dark:bg-surface-dark px-5 flex-row items-center gap-2 active:scale-95">
  <Icon />
  <Text className="text-sm font-medium text-slate-600 dark:text-slate-300">
    Label
  </Text>
</Pressable>
```

### Badge/Status Indicators

```tsx
{/* Open Status */}
<View className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1">
  <Text className="text-xs font-bold text-orange-700 dark:text-orange-300">
    Open
  </Text>
</View>

{/* Closed Status */}
<View className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">
  <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">
    Closed
  </Text>
</View>
```

### Information Chips

```tsx
<View className="flex-row items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
  <Icon size={16} color="#64748b" />
  <Text className="text-sm text-slate-500 dark:text-slate-400">
    Information
  </Text>
</View>
```

## Interaction Patterns

### Touch Feedback

**Standard Buttons:**
- Active state: `active:scale-95` or `active:scale-[0.98]`
- Transition: All 200ms

**Chips/Small Buttons:**
- Active state: `active:scale-95`
- Transition: 150ms

**Icon Buttons:**
- Active state: `active:opacity-70`
- Hover: `hover:scale-110` (web only)

### Modal/Overlay Behavior

**Background Dimming:**
```tsx
<View className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
```

**Modal Animation:**
- Entry: Fade in + Zoom in (scale 0.9 → 1.0)
- Duration: 300ms
- Easing: ease-out

## Animation Guidelines

### Phone Shake Animation
```typescript
// Idle state
@keyframes shake-idle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}
// Duration: 3s, infinite

// On shake detected
@keyframes shake-active {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
  20%, 40%, 60%, 80% { transform: rotate(10deg); }
}
// Duration: 500ms
```

### Ripple Effect
```tsx
<View className="absolute inset-0 border border-primary/10 rounded-full animate-ping" />
```

### Pulse Animation
```tsx
<View className="w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
```

## Accessibility

### Minimum Touch Targets
- All interactive elements: Minimum 44x44 points
- Buttons: Minimum height 40px (h-10) to 56px (h-14)

### Color Contrast
- Primary text on white: 16:1 (WCAG AAA)
- Secondary text: Minimum 4.5:1 (WCAG AA)
- Primary button: Sufficient contrast for visibility

### Screen Reader Support
```tsx
<Pressable
  accessibilityLabel="흔들지 않고 터치하기"
  accessibilityHint="터치하여 맛집 추천 받기"
  accessibilityRole="button"
>
  {/* ... */}
</Pressable>
```

## Implementation Dependencies

### Required Packages
```json
{
  "expo-sensors": "~14.0.x",           // Accelerometer for shake detection
  "expo-haptics": "~14.0.x",           // Haptic feedback
  "lucide-react-native": "^0.x.x",     // Icons
  "react-native-gesture-handler": "~2.28.0", // Gesture handling
  "@react-navigation/native": "^7.1.14", // Navigation
  "nativewind": "catalog:",            // Styling
  "tailwindcss": "catalog:"
}
```

### Icon Usage (Lucide React Native)

Common icons used:
```typescript
import {
  ChevronDown,    // Dropdown indicator
  User,           // Profile icon
  TouchApp,       // Touch gesture (use alternative)
  Star,           // Rating
  MapPin,         // Location
  Clock,          // Time
  Map,            // Map navigation
  RefreshCw,      // Refresh/shake again
  Heart,          // Favorite
  X,              // Close
} from 'lucide-react-native';
```

**Note:** For `lunch_dining`, `touch_app` - use emoji alternatives or custom SVGs as Lucide may not have exact equivalents.

## Layout Best Practices

### Safe Area Handling
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
  {/* Content */}
</SafeAreaView>
```

### ScrollView with Sticky Elements
```tsx
<ScrollView className="flex-1">
  {/* Scrollable content */}
</ScrollView>
{/* Sticky bottom button outside ScrollView */}
<View className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-xl">
  <Pressable>{/* Button */}</Pressable>
</View>
```

### Backdrop Blur (iOS/Web)
```tsx
<BlurView intensity={20} tint="light" className="...">
  {/* Content */}
</BlurView>
```

## Dark Mode Support

All components must support dark mode:

```tsx
<View className="bg-white dark:bg-background-dark">
  <Text className="text-text-main dark:text-white">
    {/* Content */}
  </Text>
</View>
```

### Color Mapping
- `bg-white` → `dark:bg-background-dark`
- `bg-surface-light` → `dark:bg-surface-dark`
- `text-text-main` → `dark:text-white`
- `text-text-sub` → `dark:text-slate-400`
- `border-slate-100` → `dark:border-slate-800`

## Testing Checklist

- [ ] All buttons have proper touch feedback
- [ ] Dark mode works correctly
- [ ] Safe areas handled on notched devices
- [ ] Shake detection works on physical device
- [ ] Haptic feedback triggers correctly
- [ ] Modals dismiss properly
- [ ] Accessibility labels present
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Animations smooth (60fps)

## Implementation Priority

1. **Main Shake Screen** - Core user experience
2. **Restaurant Result Pop-up** - Critical path
3. **Filter Settings Screen** - Enhanced functionality

## Notes

- Test shake detection on actual devices (simulators don't support accelerometer)
- Use Expo's DeviceMotion API for cross-platform shake detection
- Implement debouncing for shake events (500ms cooldown)
- Consider adding onboarding for first-time users
- Store filter preferences in AsyncStorage
- Implement proper error states for network failures
- Add loading skeletons for async operations
