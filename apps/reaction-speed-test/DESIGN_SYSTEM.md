# 무채색 디자인 시스템 가이드

## 🎨 색상 팔레트

### Primary Colors (메인 인터랙션)
주요 버튼, 링크, 활성 상태에 사용하는 블루-그레이 톤
- `primary-50` ~ `primary-950`: #f8fafc ~ #020617

### Secondary Colors (보조 요소)  
보조 버튼, 배경, 카드에 사용하는 중성 그레이 톤
- `secondary-50` ~ `secondary-950`: #f9fafb ~ #030712

### Tertiary Colors (미묘한 구분)
구분선, 비활성 요소에 사용하는 진정한 그레이 톤
- `tertiary-50` ~ `tertiary-950`: #fafafa ~ #09090b

### Typography Colors (텍스트)
가독성을 위한 고대비 색상
- `typography-white`: #ffffff
- `typography-gray`: #71717a  
- `typography-black`: #09090b
- `typography-50` ~ `typography-950`: 그레이 스케일

### Background Colors (배경)
- `background-light`: #ffffff (라이트 모드)
- `background-dark`: #09090b (다크 모드)
- `background-muted`: #f4f4f5 (비활성 배경)

### Accent Colors (액센트, 제한적 사용)
측정 앱 특성상 필요한 색상만 제한적으로 사용
- `accent-start`: #10b981 (시작/성공)
- `accent-stop`: #ef4444 (정지/위험)
- `accent-neutral`: #6b7280 (중립)

## 📐 사용 가이드라인

### 1. 텍스트 색상
```css
/* 주요 텍스트 */
text-typography-900 (라이트 모드)
text-typography-0 (다크 모드)

/* 보조 텍스트 */
text-typography-600 (라이트 모드)
text-typography-400 (다크 모드)

/* 비활성 텍스트 */
text-typography-400 (라이트 모드)
text-typography-600 (다크 모드)
```

### 2. 배경 색상
```css
/* 메인 배경 */
bg-background-0 (라이트 모드)
bg-background-950 (다크 모드)

/* 카드/컨테이너 배경 */
bg-background-50 (라이트 모드)
bg-background-900 (다크 모드)

/* 호버 상태 */
hover:bg-background-100 (라이트 모드)
hover:bg-background-800 (다크 모드)
```

### 3. 테두리 색상
```css
/* 기본 테두리 */
border-outline-200 (라이트 모드)
border-outline-700 (다크 모드)

/* 포커스 테두리 */
border-primary-500 (공통)

/* 호버 테두리 */
hover:border-outline-300 (라이트 모드)
hover:border-outline-600 (다크 모드)
```

## 🧩 공통 컴포넌트 클래스

### 버튼
```css
/* 주요 버튼 */
.button-primary

/* 보조 버튼 */
.button-secondary
```

### 입력 필드
```css
/* 텍스트 입력 */
.input
```

### 카드
```css
/* 카드 컨테이너 */
.card
```

## 🌙 다크 모드 대응

모든 색상은 `prefers-color-scheme: dark` 미디어 쿼리를 통해 자동으로 다크 모드를 지원합니다.

### 접근성 고려사항
- 최소 4.5:1 컨트라스트 비율 유지
- 다크 모드에서도 동일한 가독성 보장
- 색상에만 의존하지 않는 정보 전달

## 🚀 측정 앱 특수 상황

### 반응 속도 측정 시 색상
- **대기 상태**: `accent-neutral` (#6b7280)
- **시작 신호**: `accent-start` (#10b981) 
- **정지 신호**: `accent-stop` (#ef4444)

이 색상들은 측정의 정확성을 위해 예외적으로 사용하며, 나머지 UI는 무채색을 유지합니다.

## 📝 코딩 컨벤션

1. Tailwind 클래스 사용 우선
2. 커스텀 CSS는 global.css의 컴포넌트 클래스 활용
3. 다크 모드는 `dark:` prefix 사용
4. 상태별 스타일은 `hover:`, `focus:`, `active:` prefix 사용

## 🔧 개발 도구

- Tailwind IntelliSense 확장 프로그램 사용 권장
- 색상 컨트라스트 검사 도구로 접근성 확인
- 다크 모드 테스트를 위한 시스템 설정 변경 