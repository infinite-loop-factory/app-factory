# 문제 해결 가이드 (Troubleshooting Guide)

이 문서는 EasyTalking 앱 개발 과정에서 발생했던 주요 이슈들과 해결 방법을 정리합니다.

## 📋 목차
1. [질문 네비게이션 이슈](#질문-네비게이션-이슈)
2. [텍스트 렌더링 이슈](#텍스트-렌더링-이슈)
3. [Flexbox 레이아웃 가이드라인](#flexbox-레이아웃-가이드라인)
4. [Context API 상태 관리 패턴](#context-api-상태-관리-패턴)

---

## 질문 네비게이션 이슈

### 🐛 문제 상황
**발생 날짜**: 2024.09.06  
**증상**: ContinuousCardScreen에서 "다음" 버튼을 눌러도 질문이 변경되지 않음

### 🔍 원인 분석
```tsx
// ❌ 문제가 있던 코드
const [currentIndex, setCurrentIndex] = useState(0);  // 로컬 state
const { progress } = useAppState();  // Context state

// 로컬 state를 사용하여 UI 렌더링
<Text>{questions[currentIndex]?.content}</Text>

// Context action 호출해도 로컬 state는 변경되지 않음
const goToNext = () => {
  goToNextQuestion();  // Context의 currentIndex만 변경됨
  // currentIndex (로컬)는 여전히 0
};
```

**근본 원인**: 로컬 state와 Context state가 동기화되지 않아 발생한 문제

### ✅ 해결 방법
```tsx
// ✅ 수정된 코드 - Context state 일관성 있게 사용
const { progress } = useAppState();
const { goToNextQuestion, goToPreviousQuestion } = useAppActions();

// Context에서 관리하는 상태 직접 사용
const currentIndex = progress.currentIndex;
const currentQuestion = progress.currentQuestion;

// 단일 진실 공급원으로 UI 렌더링
<Text>{currentQuestion?.content}</Text>

const goToNext = () => {
  goToNextQuestion();  // Context state 변경으로 UI 자동 업데이트
};
```

### 📚 교훈
- **단일 진실 공급원 원칙**: 상태는 한 곳에서만 관리
- **Context API 일관성**: 전역 상태는 Context에서 관리, 로컬 state 혼재 금지
- **상태 동기화 문제 방지**: 같은 데이터를 여러 곳에서 관리하지 않기

---

## 텍스트 렌더링 이슈

### 🐛 문제 상황
**발생 날짜**: 2024.09.06  
**증상**: ContinuousCardScreen에서 질문 텍스트가 화면에 표시되지 않음

### 🔍 원인 분석
```tsx
// ❌ 문제가 있던 코드
<Box className="space-y-6">
  <Box>카테고리 정보</Box>
  <Box className="flex-1">  // 문제: flex-1 사용
    <Text>질문 내용</Text>  // 표시되지 않음
  </Box>
  <Box>힌트 텍스트</Box>
</Box>
```

**근본 원인**: `flex-1` vs `flex`의 flex-basis 차이점
- `flex-1` = `flex: 1 1 0%` (flex-basis: 0% - 초기 크기를 0으로 설정)  
- `flex` = `flex: 1 1 auto` (flex-basis: auto - 콘텐츠 크기 기준)

### ✅ 해결 방법
```tsx
// ✅ 수정된 코드
<Box className="space-y-6">
  <Box>카테고리 정보</Box>
  <Box className="flex items-center justify-center py-8">  // flex 사용
    <Text>질문 내용</Text>  // 정상 표시됨
  </Box>
  <Box>힌트 텍스트</Box>
</Box>
```

### 📚 교훈
- **텍스트 콘텐츠 영역**: `flex` 사용 (콘텐츠 기반 크기 계산)
- **빈 공간 채우기**: `flex-1` 사용 (spacer 역할)
- **React Native Flexbox**: 웹 CSS와 동일한 규칙 적용

---

## Flexbox 레이아웃 가이드라인

### 🎯 권장 사용 패턴

#### ✅ 텍스트/콘텐츠 영역
```tsx
// 콘텐츠 크기에 맞춰 자연스럽게 확장
<Box className="flex items-center justify-center py-8">
  <Text className="text-center">질문 내용</Text>
</Box>
```

#### ✅ 빈 공간 채우기 (Spacer)
```tsx
<VStack>
  <Box>고정 헤더</Box>
  <Box className="flex-1" />  {/* 빈 공간 채우기 */}
  <Box>고정 푸터</Box>
</VStack>
```

#### ✅ 명시적 크기 지정
```tsx
<Box style={{ height: 200, width: '100%' }}>
  <Text>고정 크기 콘텐츠</Text>
</Box>
```

### ❌ 피해야 할 패턴

#### 텍스트 영역에서 flex-1 사용
```tsx
// ❌ 텍스트 렌더링 문제 발생 가능
<Box className="flex-1">
  <Text>질문 내용</Text>
</Box>
```

#### 중첩된 flex-1 사용
```tsx
// ❌ 예측하기 어려운 레이아웃 동작
<Box className="flex-1">
  <Box className="flex-1">
    <Text>내용</Text>
  </Box>
</Box>
```

---

## Context API 상태 관리 패턴

### ✅ 권장 패턴

#### 단일 진실 공급원
```tsx
// ✅ Context state만 사용
const { progress, filteredQuestions } = useAppState();
const { goToNextQuestion } = useAppActions();

const currentQuestion = progress.currentQuestion;
const currentIndex = progress.currentIndex;
```

#### 상태 업데이트 액션 사용
```tsx
// ✅ Context 액션을 통한 상태 변경
const handleNext = useCallback(() => {
  if (progress.canGoForward) {
    goToNextQuestion();  // Context 액션 사용
    resetCardPosition();
  }
}, [progress.canGoForward, goToNextQuestion, resetCardPosition]);
```

### ❌ 피해야 할 패턴

#### 로컬 state와 Context state 혼재
```tsx
// ❌ 동기화 문제 발생 가능
const [localIndex, setLocalIndex] = useState(0);  // 로컬 state
const { progress } = useAppState();  // Context state

// 두 상태가 따로 관리되어 불일치 발생
```

#### 직접적인 상태 변경
```tsx
// ❌ Context 상태를 직접 변경
progress.currentIndex = newIndex;  // 불가능하고 위험함

// ✅ Context 액션을 통한 변경
setCurrentQuestionIndex(newIndex);  // Context 액션 사용
```

---

## 🔧 디버깅 도구와 방법

### Console Logging
```tsx
// 상태 변화 추적
console.log("🔍 Debug - Current State:", {
  currentIndex: progress.currentIndex,
  currentQuestion: progress.currentQuestion?.content?.substring(0, 50),
  totalCount: filteredQuestions.totalCount,
  canGoForward: progress.canGoForward
});
```

### Visual Debugging
```tsx
// 레이아웃 문제 디버깅용 배경색
<Box style={{ backgroundColor: 'rgba(255,0,0,0.1)' }}>
  <Text>디버깅 중인 콘텐츠</Text>
</Box>
```

### 타입 안전성
```tsx
// Optional chaining으로 안전한 접근
{currentQuestion?.content || "기본값"}

// 타입 가드 사용
if (currentQuestion && typeof currentQuestion.content === 'string') {
  // 안전한 사용
}
```

---

## 🚀 예방 조치

### Code Review 체크리스트
- [ ] Context state와 로컬 state 혼재 여부 확인
- [ ] 텍스트 영역에서 `flex-1` 사용 여부 확인  
- [ ] Optional chaining 사용 여부 확인
- [ ] 상태 업데이트시 Context 액션 사용 여부 확인

### Testing Guidelines
- 전체 사용자 플로우 테스트 (Category → Difficulty → Main → Card)
- 질문 네비게이션 기능 테스트 (이전/다음 버튼)
- 텍스트 렌더링 확인 (다양한 길이의 질문)
- Context 상태 동기화 확인

### Documentation
- 주요 이슈와 해결 방법은 `docs/troubleshooting.md`에 기록
- `CLAUDE.md`에 개발 가이드라인 업데이트
- 코드 코멘트로 중요한 결정 사항 문서화

---

## 📞 추가 도움이 필요한 경우

문제가 해결되지 않는 경우:
1. 이 문서의 패턴과 비교 분석
2. 콘솔 로그로 상태 추적  
3. Visual debugging으로 레이아웃 확인
4. 단순한 예제부터 점진적 복잡도 증가
5. Context DevTools 활용 (개발 환경)