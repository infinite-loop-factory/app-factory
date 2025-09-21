# 헤더 제거 및 플로팅 UI 구현 가이드

## 개요

React Native 앱에서 기존 헤더를 완전히 제거하고 플로팅 UI 컴포넌트로 대체하는 작업 가이드입니다.

## 현재 작업 상황 (2024.09.21)

### 작업 배경
- Phase 3 완성 후 Modern Refined Orange v2.0 디자인 시스템 적용
- 기존 헤더 기반 네비게이션을 플로팅 UI로 전환하여 현대적인 몰입형 경험 제공
- 6개 화면 모두에 일관된 플로팅 UI 적용 목표

### 완료된 작업
✅ **커밋 #1: 플로팅 UI 컴포넌트 생성** (완료)
- FloatingBackButton.tsx
- ProgressIndicator.tsx
- FloatingMenuButton.tsx
- FloatingActionButton.tsx
- TypeScript 타입 정의 및 export 설정

### 현재 진행 중 작업
🔄 **커밋 #2: 선택 화면 헤더 제거** (진행 중)
- CategorySelectionScreen.tsx - **⚠️ 문제 발견**
- DifficultySelectionScreen.tsx - **미완료**

### 🚨 중요한 문제
사용자 피드백에 따르면 **헤더가 여전히 표시되고 있음**:
- 화면 상단에 하얀 배경의 "카테고리 선택" 헤더가 남아있음
- 단순히 타이틀을 컨텐츠 영역으로 이동하는 것이 아니라 **헤더 자체를 완전히 제거**해야 함

## 헤더 제거 구현 방법

### 1. 완전한 헤더 제거
```tsx
// ❌ 잘못된 방법 - 헤더가 여전히 남아있음
<SafeAreaView className="flex-1 bg-white">
  <View className="pt-20"> // 상단 공간만 추가
    <Text>카테고리 선택</Text> // 타이틀을 여기로 이동
  </View>
</SafeAreaView>

// ✅ 올바른 방법 - 헤더 완전 제거
<View className="flex-1"> // SafeAreaView 제거 또는 수정
  <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
  <View className="flex-1 bg-white pt-16"> // StatusBar 영역만 고려
    <!-- 플로팅 UI 컴포넌트들 -->
    <FloatingBackButton />
    <!-- 컨텐츠 -->
  </View>
</View>
```

### 2. StatusBar 설정
```tsx
import { StatusBar } from 'expo-status-bar';

// 투명한 StatusBar로 몰입형 경험 제공
<StatusBar style="dark" backgroundColor="transparent" translucent />
```

### 3. 플로팅 UI 배치
```tsx
// z-index와 absolute positioning 활용
<FloatingBackButton
  position="top-left"
  style="dark"
  onPress={() => router.back()}
/>

<FloatingActionButton
  position="bottom-right"
  style="primary"
  icon="✓"
  onPress={handleSelectAll}
/>
```

## 각 화면별 구현 체크리스트

### CategorySelectionScreen
- [ ] 기존 헤더 완전 제거 (SafeAreaView 등)
- [ ] StatusBar 투명 설정
- [ ] FloatingBackButton 추가
- [ ] FloatingActionButton 추가 (전체선택)
- [ ] 타이틀을 컨텐츠 영역에 적절히 배치

### DifficultySelectionScreen
- [ ] CategorySelectionScreen과 동일한 패턴 적용
- [ ] 헤더 완전 제거
- [ ] 플로팅 UI 요소 추가

### QuestionMainScreen
- [ ] 헤더 제거
- [ ] FloatingBackButton 추가
- [ ] 필요시 FloatingMenuButton 추가

### ContinuousCardScreen
- [ ] 헤더 제거
- [ ] ProgressIndicator 추가
- [ ] FloatingBackButton 추가

### IndividualCardScreen
- [ ] ContinuousCardScreen과 유사한 구현
- [ ] 플로팅 UI 요소 적용

### QuestionListScreen
- [ ] 헤더 제거
- [ ] 리스트 화면에 적합한 플로팅 UI 적용

## 주의사항

### 1. 헤더 제거 시 주의점
- **SafeAreaView 사용법 주의**: 일부 경우 완전히 제거하거나 스타일 조정 필요
- **StatusBar 영역 고려**: translucent StatusBar 사용 시 적절한 padding 적용
- **네비게이션 구조 확인**: Expo Router의 헤더 설정이 있는지 확인

### 2. 플로팅 UI 가이드라인
- **Z-index 관리**: 플로팅 요소들이 서로 겹치지 않도록 조정
- **터치 영역**: 44px 이상의 충분한 터치 영역 확보
- **접근성**: 적절한 접근성 라벨 제공

### 3. 디자인 시스템 준수
- Modern Refined Orange v2.0 컬러 시스템 사용
- NativeWind 기반 스타일링
- 일관된 spacing과 typography 적용

## 트러블슈팅

### 헤더가 여전히 보이는 경우
1. **SafeAreaView 확인**: 상단에 불필요한 SafeAreaView가 있는지 체크
2. **Navigation 헤더**: Expo Router에서 설정된 헤더가 있는지 확인
3. **컨테이너 구조**: View 계층구조가 올바른지 점검

### StatusBar 겹침 문제
1. **Translucent 설정**: StatusBar를 투명하게 설정
2. **Padding 조정**: 상단 padding을 적절히 조정
3. **Safe Area 처리**: 필요한 부분에만 safe area 적용

## 다음 단계
1. 🚨 **긴급**: CategorySelectionScreen 헤더 완전 제거
2. DifficultySelectionScreen 동일 문제 수정
3. 나머지 4개 화면 순차적 적용
4. 전체 플로우 테스트 및 검증

## 커밋 계획
1. ✅ 플로팅 UI 컴포넌트 생성
2. 🔄 선택 화면 헤더 제거 (현재 진행 중 - **문제 수정 필요**)
3. ⏳ 메인 화면 헤더 제거
4. ⏳ 카드 화면 헤더 제거
5. ⏳ 리스트 화면 헤더 제거
6. ⏳ 최종 테스트 및 검증
7. ⏳ 문서화 완료