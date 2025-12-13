# BannerAd 컴포넌트 프로젝트 적용 전략

EasyTalking 앱에 최소한의 UX 방해로 배너 광고를 적용하기 위한 전략 문서

## 📊 현재 프로젝트 구조 분석

### 7개 화면 구조
1. **IndexScreen** (스플래시) - 1.5초 후 자동 이동
2. **CategorySelectionScreen** - 카테고리 선택
3. **DifficultySelectionScreen** - 난이도 선택
4. **QuestionMainScreen** - 4가지 모드 선택
5. **ContinuousCardScreen** - 모드 1,2,3 (스와이프 카드)
6. **QuestionListScreen** - 모드 4 (질문 목록)
7. **IndividualCardScreen** - 모드 4 (개별 카드)

### 앱 플로우
```
IndexScreen (스플래시)
    ↓
CategorySelectionScreen (카테고리 선택)
    ↓
DifficultySelectionScreen (난이도 선택)
    ↓
QuestionMainScreen (모드 선택)
    ↓
    ├─→ ContinuousCardScreen (모드 1,2,3 - 스와이프)
    └─→ QuestionListScreen (모드 4 - 리스트)
            ↓
        IndividualCardScreen (모드 4 - 개별 카드)
```

---

## 🎯 광고 적용 원칙 (사용자 요구사항)

✅ **최소한의 광고**: 필수 위치에만 배치
✅ **UX 비방해**: 유저 플로우 차단 금지
✅ **컨텐츠 보호**: 핵심 질문 카드 내용 가리지 않음

---

## 📍 권장 광고 배치 전략

### ✅ 적용 가능한 화면 (3곳)

#### 1. **QuestionListScreen** (최우선 추천) ⭐⭐⭐⭐⭐

**위치**: 화면 최하단 (하단 버튼 위)

**이유**:
- ✅ 질문 목록을 스크롤하는 **정적 화면**
- ✅ 하단 버튼 영역이 이미 존재 (line 216-225)
- ✅ FlatList 컨텐츠와 분리되어 **가리지 않음**
- ✅ 스크롤 시 광고는 고정되어 컨텐츠 방해 최소화
- ✅ 사용자가 질문을 탐색하는 시간에 자연스럽게 노출

**적용 방법**:
```tsx
{/* 질문 목록 FlatList */}
<FlatList
  contentContainerStyle={{ paddingVertical: 16 }}
  data={questions}
  renderItem={renderQuestionItem}
  showsVerticalScrollIndicator={false}
/>

{/* 하단 광고 영역 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>

{/* 하단 버튼 */}
<Box className="border-gray-200 border-t bg-white p-5">
  <Pressable
    className="h-12 items-center justify-center rounded-lg bg-orange-500 px-6 py-3"
    onPress={handleBackToMain}
  >
    <Text className="text-center font-medium text-white">
      질문 모드 선택으로 돌아가기
    </Text>
  </Pressable>
</Box>
```

**파일**: `src/components/screens/QuestionListScreen.tsx`
**수정 위치**: line 214 (FlatList 종료 후, 하단 버튼 전)

---

#### 2. **IndexScreen** (스플래시) ⭐⭐⭐⭐

**위치**: 화면 최하단

**이유**:
- ✅ 1.5초 대기 시간 존재 → **광고 사전 로드**
- ✅ 정적 화면으로 컨텐츠 방해 없음
- ✅ 앱 로고 하단 여백 활용 가능
- ✅ 초기 진입 시 광고 초기화 시간 확보

**적용 방법**:
```tsx
{/* 기존 로고 및 설명 */}
<View className="items-center px-8">
  <View className="mb-6 h-24 w-24 items-center justify-center">
    <Sprout color="#8B5A2B" size={80} strokeWidth={1.5} />
  </View>
  <Text className={`font-bold text-3xl ${themeTailwindClasses.foreground} mb-1 text-center`}>
    이지토킹
  </Text>
  {/* ... 설명 ... */}
</View>

{/* 하단 광고 (절대 위치) */}
<View className="absolute bottom-8 w-full px-5">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</View>
```

**파일**: `src/components/screens/IndexScreen.tsx`
**수정 위치**: line 93 (로딩 표시 후, View 종료 전)

---

#### 3. **QuestionMainScreen** (모드 선택) ⭐⭐⭐

**위치**: 화면 최하단 (4가지 모드 버튼 아래)

**이유**:
- ✅ 정적 선택 화면으로 컨텐츠 방해 없음
- ✅ 모드 선택 버튼과 분리 가능
- ✅ 유저가 모드를 고민하는 시간에 노출
- ✅ 하단 여백 존재

**적용 방법**:
```tsx
{/* 4가지 모드 선택 버튼 */}
{/* ... 모드 버튼들 ... */}

{/* 하단 광고 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>
```

**파일**: `src/components/screens/QuestionMainScreen.tsx`
**수정 위치**: 화면 최하단 (모드 버튼 영역 후)

---

### ❌ 적용 피해야 할 화면 (4곳)

#### 1. **ContinuousCardScreen** (스와이프 카드) ❌

**이유**:
- ❌ 전체 화면 카드 UX → **광고가 질문 내용 가림**
- ❌ 스와이프 제스처 영역과 충돌 가능
- ❌ 핵심 컨텐츠 집중 방해
- ❌ 상단 진행률, 하단 버튼으로 여백 없음

**결론**: **절대 적용 금지** - 핵심 UX 방해

---

#### 2. **IndividualCardScreen** (개별 카드) ❌

**이유**:
- ❌ 카드 뷰어 화면 → **질문 내용이 메인**
- ❌ 상단 진행률, 하단 버튼으로 여백 부족
- ❌ 광고가 카드 내용 가릴 위험
- ❌ 사용자가 질문에 집중해야 하는 화면

**결론**: **적용 금지** - 컨텐츠 보호 원칙 위반

---

#### 3. **CategorySelectionScreen** (카테고리 선택) ❌

**이유**:
- ❌ 빠른 선택 플로우 → 광고로 지연 유발 가능
- ❌ 6개 카테고리 버튼이 화면 대부분 차지
- ❌ 초기 진입 화면으로 **첫인상 중요**
- ❌ 여백 부족

**결론**: **적용 비추천** - 첫인상 및 빠른 플로우 방해

---

#### 4. **DifficultySelectionScreen** (난이도 선택) ❌

**이유**:
- ❌ CategorySelection과 동일 (빠른 플로우)
- ❌ 3개 난이도 버튼 + 설명으로 구성
- ❌ 광고 추가 시 UI 밸런스 붕괴
- ❌ 선택 프로세스 중간 단계

**결론**: **적용 비추천** - 플로우 연속성 유지

---

## 🚀 최종 권장 구현 계획

### Phase 1: 최소 광고 (1곳) - 추천 ⭐

**QuestionListScreen 하단만 적용**

**장점**:
- ✅ 가장 안전하고 UX 방해 최소
- ✅ 정적 화면 + 스크롤 가능 영역
- ✅ 하단 버튼과 분리되어 컨텐츠 보호
- ✅ 최소 광고 원칙 완벽 준수

**구현**:
```tsx
// src/components/screens/QuestionListScreen.tsx
// line 214: FlatList 종료 후, 하단 버튼 전

{/* 하단 광고 영역 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>

{/* 하단 버튼 */}
<Box className="border-gray-200 border-t bg-white p-5">
  {/* 기존 버튼 */}
</Box>
```

---

### Phase 2: 확장 (2-3곳) - 선택적

**IndexScreen + QuestionMainScreen 추가**

**적용 조건**:
- Phase 1 테스트 후 UX 영향 없음 확인
- 사용자 피드백 긍정적
- 수익화 필요성 증가

**구현**:
1. **IndexScreen**: 스플래시 하단 (절대 위치)
2. **QuestionMainScreen**: 모드 선택 하단
3. **QuestionListScreen**: 유지

**총 광고 수**: 최대 3곳 (전체 7개 화면 중 약 43%)

---

## 📐 BannerAd 컴포넌트 크기 옵션

### 사용 가능한 크기

```typescript
import { BannerAdSize } from 'react-native-google-mobile-ads';

BannerAdSize.BANNER          // 320x50 (기본, 추천) ⭐
BannerAdSize.LARGE_BANNER    // 320x100 (공간 여유 있을 때)
BannerAdSize.MEDIUM_RECTANGLE // 300x250 (부적합 - 너무 큼)
BannerAdSize.FULL_BANNER     // 468x60 (태블릿)
```

### 추천 크기: `BannerAdSize.BANNER` (320x50)

**이유**:
- ✅ 모바일 화면에 최적화된 표준 크기
- ✅ 컨텐츠 방해 최소화
- ✅ 광고 인벤토리 가장 풍부
- ✅ 로딩 속도 빠름

**사용 예시**:
```tsx
<BannerAdComponent size={BannerAdSize.BANNER} />
```

---

## 🎨 UI 통합 가이드

### 1. Modern Refined Orange 스타일 적용

```tsx
{/* 광고 영역: border-t로 상단 구분선 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>
```

### 2. 안전 영역 (Safe Area) 고려

```tsx
// 하단 버튼이 있는 경우
<SafeAreaView edges={['bottom']}>
  <Box className="bg-white px-5 py-3">
    <BannerAdComponent size={BannerAdSize.BANNER} />
  </Box>
</SafeAreaView>
```

### 3. 여백 및 간격 규칙

- **상단 구분선**: `border-t border-gray-200`
- **좌우 패딩**: `px-5` (20px)
- **상하 패딩**: `py-3` (12px)
- **배경색**: `bg-white` (Modern Refined 스타일)

---

## ✅ 구현 체크리스트

### 광고 적용 전 확인사항

- [ ] BannerAdComponent 컴포넌트 정상 동작 확인
- [ ] 개발 모드 테스트 광고 표시 확인
- [ ] QuestionListScreen 레이아웃 구조 파악
- [ ] 하단 버튼 영역 위치 확인

### 광고 적용 중 작업사항

- [ ] QuestionListScreen에 광고 컴포넌트 import
- [ ] FlatList 하단, 버튼 상단에 광고 영역 추가
- [ ] Modern Refined 스타일 적용 (border, padding, bg)
- [ ] Biome lint 검증 통과

### 광고 적용 후 검증사항

- [ ] 질문 목록 컨텐츠 가려지지 않음 확인
- [ ] 하단 버튼 클릭 영역 정상 동작
- [ ] 광고 로드 실패 시 UI 깨짐 없음
- [ ] 개발 모드 인디케이터 표시 확인 ("[개발 모드] 테스트 광고")
- [ ] 스크롤 시 광고 고정 위치 유지
- [ ] 광고와 버튼 간 간격 적절성 (12px)

### 프로덕션 배포 전 최종 검증

- [ ] 실기기에서 테스트 광고 표시 확인
- [ ] 다양한 화면 크기에서 레이아웃 테스트
- [ ] 광고 로딩 시간 체크 (<2초)
- [ ] 전체 앱 플로우 정상 동작 확인

---

## 🔧 구현 순서

### Step 1: QuestionListScreen 광고 추가
1. `src/components/screens/QuestionListScreen.tsx` 파일 열기
2. BannerAdComponent import 추가
3. line 214 위치에 광고 영역 추가
4. Biome lint 실행 및 수정

### Step 2: 개발 모드 테스트
1. `npm start` 실행
2. QuestionListScreen 이동 (모드 4 선택)
3. 테스트 광고 표시 확인
4. "[개발 모드] 테스트 광고" 표시 확인
5. 광고 하단 "Test Ad" 표시 확인

### Step 3: 레이아웃 검증
1. 질문 목록 스크롤 테스트
2. 하단 버튼 클릭 테스트
3. 광고와 버튼 간 간격 확인
4. 다양한 질문 개수로 테스트 (1개, 10개, 120개)

### Step 4: (선택) 추가 화면 적용
1. Phase 1 성공 후 진행
2. IndexScreen 하단 광고 추가
3. QuestionMainScreen 하단 광고 추가
4. 전체 앱 플로우 재검증

---

## 📊 예상 광고 노출 패턴

### Phase 1 (QuestionListScreen만)

| 화면 | 광고 여부 | 이유 |
|------|----------|------|
| IndexScreen | ❌ | 스플래시 (1.5초) |
| CategorySelectionScreen | ❌ | 빠른 선택 |
| DifficultySelectionScreen | ❌ | 빠른 선택 |
| QuestionMainScreen | ❌ | 모드 선택 |
| ContinuousCardScreen | ❌ | 핵심 컨텐츠 |
| QuestionListScreen | ✅ | **광고 표시** |
| IndividualCardScreen | ❌ | 핵심 컨텐츠 |

**노출률**: 7개 화면 중 1개 (약 14%)

### Phase 2 (확장 시)

| 화면 | 광고 여부 | 이유 |
|------|----------|------|
| IndexScreen | ✅ | **스플래시 광고** |
| CategorySelectionScreen | ❌ | 빠른 선택 |
| DifficultySelectionScreen | ❌ | 빠른 선택 |
| QuestionMainScreen | ✅ | **모드 선택 광고** |
| ContinuousCardScreen | ❌ | 핵심 컨텐츠 |
| QuestionListScreen | ✅ | **질문 목록 광고** |
| IndividualCardScreen | ❌ | 핵심 컨텐츠 |

**노출률**: 7개 화면 중 3개 (약 43%)

---

## 🎯 최종 권장사항

### 1단계: 최소 구현 (QuestionListScreen만)
- ✅ **가장 안전한 선택**
- ✅ UX 방해 최소화
- ✅ 빠른 구현 및 테스트 가능
- ✅ 사용자 피드백 수집 후 확장 결정

### 2단계: 확장 고려사항
- 사용자 피드백이 긍정적일 경우
- 광고 수익화 필요성이 높을 경우
- IndexScreen, QuestionMainScreen 순차 추가

### 절대 금지 화면
- ❌ ContinuousCardScreen
- ❌ IndividualCardScreen
- ⚠️ CategorySelectionScreen (비추천)
- ⚠️ DifficultySelectionScreen (비추천)

---

## 📝 참고 문서

- **AdMob 통합 가이드**: `docs/admob-integration.md`
- **디자인 시스템**: `docs/design-system-modern-refined.md`
- **컴포넌트 아키텍처**: `docs/component-architecture.md`
- **프로젝트 현황**: `docs/PROJECT_STATUS.md`

---

**작성일**: 2025-10-26
**버전**: 1.0.0
**최종 업데이트**: AdMob 배너 광고 배치 전략 수립
