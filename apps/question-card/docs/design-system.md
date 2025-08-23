# 디자인 시스템 (Design System)

EasyTalking 앱의 커스텀 디자인 시스템 설계서

## 🎯 디자인 철학

v0/Lovable 스타일 패턴을 기반으로 한 **Clean & Modern** 디자인 시스템

### 핵심 원칙
- **Clean & Minimal**: 불필요한 장식 제거, 콘텐츠 중심
- **Consistent**: 8px 기반 일관된 spacing system
- **Accessible**: 44px 최소 터치 영역, 명확한 색상 대비
- **Responsive**: 모바일 우선 반응형 디자인
- **Intuitive**: 직관적이고 친숙한 인터페이스

## 🎨 색상 시스템

### 카테고리별 색상
```typescript
export const categoryColors = {
  hobby: {
    50: '#fef2f2',   // 배경
    100: '#fee2e2',  // hover
    500: '#ef4444',  // 기본
    600: '#dc2626'   // active
  },
  talent: {
    50: '#f0fdfa',
    100: '#ccfbf1', 
    500: '#14b8a6',
    600: '#0d9488'
  },
  values: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb'
  },
  experience: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a'
  },
  daily: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706'
  },
  direction: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#a855f7',
    600: '#9333ea'
  }
}
```

### 난이도별 색상
```typescript
export const difficultyColors = {
  easy: '#22c55e',    // green-500
  medium: '#f59e0b',  // amber-500  
  hard: '#ef4444'     // red-500
}
```

### 시스템 색상
```typescript
export const systemColors = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717'
  },
  white: '#ffffff',
  black: '#000000'
}
```

## 📝 타이포그래피

### 폰트 패밀리
- **Primary**: Inter (시스템 폰트 fallback)
- **Monospace**: JetBrains Mono (코드, 숫자)

### 텍스트 크기 체계
```typescript
export const fontSize = {
  xs: '12px',   // 보조 텍스트, 라벨
  sm: '14px',   // 일반 텍스트, 버튼
  base: '16px', // 기본 크기
  lg: '18px',   // 질문 내용
  xl: '20px',   // 화면 제목  
  '2xl': '24px' // 메인 제목
}
```

### 폰트 굵기
- **normal**: 400 (일반 텍스트)
- **medium**: 500 (라벨, 설명)
- **semibold**: 600 (버튼, 강조)
- **bold**: 700 (제목)

### 줄 높이
- **tight**: 1.25 (제목)
- **normal**: 1.5 (일반 텍스트)  
- **relaxed**: 1.625 (질문 내용)

## 🏗️ 레이아웃 시스템

### 컨테이너 크기
```typescript
export const containers = {
  sm: 'max-w-sm mx-auto px-4',  // ~384px
  md: 'max-w-md mx-auto px-6',  // ~448px
  lg: 'max-w-lg mx-auto px-6'   // ~512px
}
```

### 스페이싱 (8px 기반)
```typescript
export const spacing = {
  xs: '4px',   // 요소 간 최소 간격
  sm: '8px',   // 작은 간격
  md: '16px',  // 기본 간격
  lg: '24px',  // 섹션 간 간격
  xl: '32px',  // 화면 간 간격
  '2xl': '48px' // 큰 섹션 간격
}
```

### Border Radius
```typescript
export const borderRadius = {
  sm: '6px',   // 작은 요소
  md: '8px',   // 버튼, 입력 필드
  lg: '12px',  // 카드
  xl: '16px'   // 큰 카드
}
```

## 🧩 컴포넌트 스타일

### Card 스타일
```typescript
export const cardStyles = {
  base: 'bg-white rounded-xl shadow-sm border border-neutral-200',
  elevated: 'bg-white rounded-xl shadow-lg border border-neutral-100',
  interactive: 'bg-white rounded-xl shadow-sm border border-neutral-200 active:shadow-md transition-shadow'
}
```

### Button 스타일
```typescript  
export const buttonStyles = {
  primary: 'bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium',
  secondary: 'bg-neutral-100 text-neutral-900 px-6 py-3 rounded-lg font-medium',
  ghost: 'text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100'
}
```

### Checkbox 스타일
```typescript
export const checkboxStyles = {
  container: 'flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:border-neutral-300',
  indicator: 'w-5 h-5 rounded border-2 border-neutral-300 flex items-center justify-center',
  checked: 'bg-neutral-900 border-neutral-900 text-white'
}
```

## 📱 반응형 가이드라인

### 브레이크포인트
- **Mobile**: 320px ~ 767px (기본)
- **Tablet**: 768px ~ 1023px
- **Desktop**: 1024px+

### 터치 타겟
- **최소 크기**: 44px × 44px
- **권장 크기**: 48px × 48px
- **간격**: 8px 최소

### 폰트 크기 조정
- **Mobile**: 기본 크기
- **Tablet**: +2px
- **Desktop**: +4px

## 🎭 상태별 스타일

### Hover States
```css
.hover-lift { transform: translateY(-2px); }
.hover-shadow { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.hover-border { border-color: theme('colors.neutral.300'); }
```

### Active States  
```css
.active-press { transform: translateY(1px); }
.active-shadow { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
```

### Focus States
```css
.focus-ring { ring: 2px solid theme('colors.blue.500'); }
.focus-outline { outline: 2px solid theme('colors.blue.500'); }
```

### Disabled States
```css
.disabled { opacity: 0.5; pointer-events: none; }
```

## 🏷️ 컴포넌트 사용 예시

### QuestionCard 컴포넌트
```jsx
<Box className="bg-white rounded-xl shadow-lg border border-neutral-100 p-6 mx-4">
  <HStack className="justify-between items-center mb-4">
    <HStack className="items-center space-x-2">
      <Text className="text-base">{category.icon}</Text>
      <Text className="text-sm font-medium" style={{ color: categoryColor[600] }}>
        {category.name}
      </Text>
    </HStack>
    <Box className="px-2 py-1 rounded-full" style={{ backgroundColor: difficultyColor + '20' }}>
      <Text className="text-xs font-medium" style={{ color: difficultyColor }}>
        {difficulty}
      </Text>
    </Box>
  </HStack>
  <Text className="text-lg leading-relaxed text-neutral-800">
    {question.content}
  </Text>
</Box>
```

### CheckboxList 컴포넌트
```jsx
<Checkbox className="flex items-center p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white">
  <CheckboxIndicator className="mr-3">
    <CheckboxIcon className="text-white" />
  </CheckboxIndicator>
  <CheckboxLabel className="flex items-center flex-1">
    <Text className="text-base mr-2">{item.icon}</Text>
    <Text className="text-base font-medium text-neutral-800">
      {item.name}
    </Text>
  </CheckboxLabel>
</Checkbox>
```

## 🚀 구현 우선순위

### Phase 1: 기본 시스템 (Day 1)
- [ ] 색상 토큰 정의
- [ ] 타이포그래피 설정
- [ ] 기본 스페이싱 시스템

### Phase 2: 핵심 컴포넌트 (Day 2-3)  
- [ ] QuestionCard 컴포넌트
- [ ] CheckboxItem 컴포넌트
- [ ] Button 컴포넌트
- [ ] HeaderBar 컴포넌트

### Phase 3: 고급 기능 (Day 4-5)
- [ ] 애니메이션 트랜지션
- [ ] 상태별 스타일
- [ ] 접근성 개선

### Phase 4: 최적화 (Day 6)
- [ ] 성능 최적화
- [ ] 다크모드 지원
- [ ] 반응형 미세 조정

## 📋 체크리스트

### 디자인 토큰
- [ ] 색상 시스템 구현
- [ ] 타이포그래피 시스템 구현
- [ ] 스페이싱 시스템 구현
- [ ] Border radius 시스템 구현

### 컴포넌트
- [ ] 모든 컴포넌트 Gluestack-ui 기반 구현
- [ ] NativeWind 클래스 적용
- [ ] 접근성 속성 추가
- [ ] TypeScript 인터페이스 정의

### 품질 보증
- [ ] 모바일 터치 테스트
- [ ] 스크린 리더 테스트  
- [ ] 색상 대비 검증
- [ ] 성능 측정

## 🔗 기술 스택 통합

### Gluestack-ui v2 + NativeWind
```bash
# 필수 컴포넌트 설치
npx gluestack-ui add box text button checkbox hstack vstack
```

### Tailwind 설정 확장
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: categoryColors,
      fontSize: fontSize,
      spacing: spacing,
      borderRadius: borderRadius
    }
  }
}
```

이 디자인 시스템을 기반으로 일관성 있고 사용자 친화적인 EasyTalking 앱을 구축할 수 있습니다.