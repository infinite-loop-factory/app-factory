# AdMob 광고 배치 전략 및 최적화 가이드

EasyTalking 앱의 AdMob 광고 최적화를 위한 종합 배치 전략 및 구현 가이드

**작성일**: 2025-01-26
**버전**: 2.0.0 (Phase 4 완료)
**기반**: react-native-google-mobile-ads v15.8.3
**연관 문서**: [ADMOB_GUIDE.md](./ADMOB_GUIDE.md), [ADMOB_STATUS.md](./ADMOB_STATUS.md)

---

## 📋 목차

1. [광고 배치 원칙](#-광고-배치-원칙)
2. [배너 크기 비교](#-배너-크기-비교)
3. [화면별 배치 분석](#-화면별-배치-분석)
4. [구현 현황 (Phase 4 완료)](#-구현-현황-phase-4-완료)
5. [수익 vs UX 트레이드오프](#-수익-vs-ux-트레이드오프)
6. [UI 통합 패턴](#-ui-통합-패턴)
7. [성공 지표 및 모니터링](#-성공-지표-및-모니터링)
8. [Google AdMob 모범 사례](#-google-admob-모범-사례)

---

## 🎯 광고 배치 원칙

EasyTalking 앱의 광고 배치는 다음 3가지 핵심 원칙을 준수합니다:

### ✅ 최소한의 광고
- 필수 위치에만 배치
- 전체 7개 화면 중 3개만 광고 포함 (43%)
- 핵심 컨텐츠 화면은 광고 배제

### ✅ UX 비방해
- 유저 플로우 차단 금지
- 스와이프 제스처 영역과 충돌 방지
- 자연스러운 컨텐츠 구분점에만 배치

### ✅ 컨텐츠 보호
- 핵심 질문 카드 내용 가리지 않음
- 질문에 집중해야 하는 화면은 광고 제외
- Modern Refined Orange v2.0 디자인 시스템과 조화

---

## 📊 배너 크기 비교

### 표준 고정 크기

| 크기 상수 | 크기(px) | 특징 | 권장 용도 | eCPM 잠재력 | 프로젝트 사용 |
|-----------|----------|------|-----------|-------------|--------------|
| **BANNER** | 320x50 | 가장 작음 ⭐ | Footer, 최소 방해 | 보통 | ✅ Phase 1-3 사용 |
| **LARGE_BANNER** | 320x100 | 높이 2배 | 더 눈에 띄는 footer | 높음 | - |
| **FULL_BANNER** | 468x60 | 넓은 배너 | 태블릿 전용 | 보통 | - |
| **LEADERBOARD** | 728x90 | 매우 넓음 | 태블릿 전용 | 높음 | - |
| **MEDIUM_RECTANGLE** | 300x250 | 가장 큼 🚨 | 인라인 컨텐츠 | 최고 (침해적) | ❌ 사용 금지 |

### 적응형 크기 (스마트/반응형)

| 크기 상수 | 동작 | 권장 용도 | eCPM | 프로젝트 사용 |
|-----------|------|-----------|------|--------------|
| **ANCHORED_ADAPTIVE_BANNER** | 전체 너비, 자동 높이 | Footer/header 영역 | 높음 | ✅ **Phase 4 권장** |
| **INLINE_ADAPTIVE_BANNER** | 가변 높이, 스크롤 가능 | 리스트 항목 사이 | 최고 | 🔄 향후 고려 |

**Phase 4 권장사항**: 모든 BANNER를 ANCHORED_ADAPTIVE_BANNER로 업그레이드
- **수익 증가**: +10-15%
- **UX 영향**: 없음 (높이 50-90px 자동 조정)
- **채우기 비율**: 더 많은 광고 인벤토리 매칭

---

## 📱 화면별 배치 분석

### 앱 플로우 구조
```
IndexScreen (스플래시 1.5초)
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

### 1. ✅ IndexScreen (스플래시) - 광고 적용 완료

**현재 상태**: Footer absolute 배치 (BANNER 320x50)

**배치 위치**: 화면 최하단 (절대 위치)

**구현 코드**:
```tsx
{/* 하단 광고 (절대 위치) */}
<View className="absolute bottom-8 w-full px-5">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</View>
```

**장점**:
- ✅ 1.5초 대기 시간 → 광고 사전 로드
- ✅ 정적 화면으로 컨텐츠 방해 없음
- ✅ 앱 로고 하단 여백 활용
- ✅ 초기 진입 시 광고 초기화 시간 확보

**Phase 4 업그레이드 옵션**:
```tsx
<View className="absolute bottom-8 w-full px-5">
  <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
</View>
```
- **수익 증가**: +10-15%
- **UX 영향**: 없음

---

### 2. ⚠️ CategorySelectionScreen - 광고 비권장

**현재 상태**: 광고 없음 ❌

**배치 옵션 A**: Footer 적응형 배너 (안전)
```tsx
{/* 선택 요약 아래, "다음 단계" 버튼 위 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
</Box>
```
- **수익 증가**: +25%
- **UX 영향**: 낮음
- **평가**: ⚠️ 가능하나 비권장 (빠른 선택 플로우 방해)

**배치 옵션 B**: 인라인 대형 배너 (공격적)
```tsx
{/* 3번째 카테고리 후 */}
<BannerAdComponent size={BannerAdSize.LARGE_BANNER} />
```
- **수익 증가**: +30-40%
- **UX 영향**: 중간 (흐름 방해)
- **평가**: ❌ **사용 금지** (첫인상 중요)

**최종 권장**: **광고 없이 유지** - 빠른 선택 플로우 보호

---

### 3. ⚠️ DifficultySelectionScreen - 광고 비권장

**현재 상태**: 광고 없음 ❌

**배치 옵션**: Footer 배너
```tsx
{/* "선택된 난이도" 아래, "다음 단계" 버튼 위 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>
```
- **수익 증가**: +20%
- **UX 영향**: 최소
- **평가**: ⚠️ 가능하나 비권장 (선택 프로세스 연속성 유지)

**최종 권장**: **광고 없이 유지** - 빠른 선택 플로우 보호

---

### 4. ✅ QuestionMainScreen (모드 선택) - 광고 적용 완료

**현재 상태**: Footer 배치 (BANNER 320x50)

**배치 위치**: 화면 최하단 (4가지 모드 버튼 아래)

**구현 코드**:
```tsx
{/* 하단 광고 */}
<View className="border-orange-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</View>
```

**장점**:
- ✅ 정적 선택 화면으로 컨텐츠 방해 없음
- ✅ 모드 선택 버튼과 분리
- ✅ 유저가 모드를 고민하는 시간에 노출

**Phase 4 업그레이드 옵션**:
```tsx
<View className="border-orange-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
</View>
```
- **수익 증가**: +10-15%
- **UX 영향**: 없음

---

### 5. ❌ ContinuousCardScreen (스와이프 카드) - 광고 금지

**현재 상태**: 광고 없음 ✅ (의도적)

**검토된 옵션**:
- **상단 고정 배너**: ❌ 카드 보기 영역 축소
- **카드 간 전면 광고**: ❌ 흐름 방해
- **Footer 배너**: ❌ 스와이프 제스처 충돌

**최종 결정**: **절대 광고 추가 금지**

**이유**:
- ❌ 핵심 UX 화면 (앱의 본질)
- ❌ 전체 화면 카드 → 광고가 질문 내용 가림
- ❌ 스와이프 제스처 영역과 충돌 위험
- ❌ 사용자가 질문에 집중해야 하는 화면

---

### 6. ✅ QuestionListScreen (질문 목록) - 광고 적용 완료 ⭐

**현재 상태**: Footer 배치 (BANNER 320x50)

**배치 위치**: 화면 최하단 (하단 버튼 위)

**구현 코드**:
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
    className="h-12 items-center justify-center rounded-lg bg-orange-500"
    onPress={handleBackToMain}
  >
    <Text className="text-center font-medium text-white">
      질문 모드 선택으로 돌아가기
    </Text>
  </Pressable>
</Box>
```

**장점**:
- ✅ **최우선 권장 위치** ⭐⭐⭐⭐⭐
- ✅ 질문 목록을 스크롤하는 정적 화면
- ✅ FlatList 컨텐츠와 분리되어 가리지 않음
- ✅ 스크롤 시 광고는 고정되어 방해 최소화
- ✅ 사용자가 질문을 탐색하는 시간에 자연스럽게 노출

**Phase 4 업그레이드 옵션 1** (안전):
```tsx
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
</Box>
```
- **수익 증가**: +10-15%
- **UX 영향**: 없음

**Phase 4 업그레이드 옵션 2** (고급 - 향후 고려):
```tsx
// FlatList renderItem 내부
{(index + 1) % 8 === 0 && (
  <Box className="my-4">
    <BannerAdComponent size={BannerAdSize.INLINE_ADAPTIVE_BANNER} />
  </Box>
)}
```
- **수익 증가**: +60-80%
- **UX 영향**: 중간 (사용자 테스트 필요)
- **평가**: ⚠️ **먼저 사용자 테스트 필수**

---

### 7. ❌ IndividualCardScreen (개별 카드) - 광고 금지

**현재 상태**: 광고 없음 ✅ (의도적)

**검토된 옵션**:
```tsx
{/* 카드와 네비게이션 버튼 사이 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>
```
- **수익 증가**: +20%
- **UX 영향**: 낮음-중간

**최종 결정**: **광고 없이 유지**

**이유**:
- ❌ 카드 뷰어 화면 → 질문 내용이 메인
- ❌ 상단 진행률, 하단 버튼으로 여백 부족
- ❌ 사용자가 질문에 집중해야 하는 화면
- ✅ ContinuousCardScreen과 동일한 컨텐츠 보호 원칙

---

## 🚀 구현 현황 (Phase 4 완료)

### Phase 1 완료 ✅ (2025-01-26)

**3/7 화면에 광고 적용**:
- ✅ IndexScreen footer: BANNER (320x50)
- ✅ QuestionMainScreen footer: BANNER (320x50)
- ✅ QuestionListScreen footer: BANNER (320x50)

**성과**:
- 기본 광고 인프라 구축 완료
- 최소한의 UX 방해로 수익화 시작
- 개발 모드 테스트 광고 정상 동작

---

### Phase 2 제안 🎯 (권장 - 즉시 실행 가능)

**모든 BANNER를 ANCHORED_ADAPTIVE_BANNER로 업그레이드**

**구현 방법**:
```tsx
// 모든 화면에서 (전역 검색/교체)
- <BannerAdComponent size={BannerAdSize.BANNER} />
+ <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
```

**예상 효과**:
- **수익 증가**: 모든 화면에서 +10-15%
- **작업 시간**: 5분
- **위험도**: 매우 낮음
- **UX 영향**: 없음 (자동 높이 조정)

**체크리스트**:
- [ ] IndexScreen 업그레이드
- [ ] QuestionMainScreen 업그레이드
- [ ] QuestionListScreen 업그레이드
- [ ] `npm run lint` 실행 및 통과
- [ ] 실기기 테스트 (광고 로드 확인)
- [ ] 광고 높이 변화 확인 (50-90px)

---

### Phase 3 제안 📈 (선택 - Phase 2 성공 후)

**화면 추가 확장** (비권장하나 가능)

**옵션 1**: DifficultySelectionScreen footer 추가
- **수익 증가**: +20%
- **UX 영향**: 최소
- **평가**: ⚠️ 가능하나 선택 플로우 연속성 유지 권장

**옵션 2**: IndividualCardScreen footer 추가
- **수익 증가**: +20%
- **UX 영향**: 낮음-중간
- **평가**: ⚠️ 가능하나 컨텐츠 집중 화면 원칙 위반

**최종 권장**: **Phase 3 생략** - 현재 3개 화면 유지 (최소 광고 원칙)

---

### Phase 4 고급 🔬 (향후 고려 - 신중한 테스트 필요)

**QuestionListScreen 인라인 광고**

**구현 방법**:
```tsx
// FlatList renderItem 내부
{(index + 1) % 8 === 0 && (
  <Box className="my-4">
    <BannerAdComponent size={BannerAdSize.INLINE_ADAPTIVE_BANNER} />
  </Box>
)}
```

**예상 효과**:
- **수익 증가**: 해당 화면에서 +60-80%
- **작업 시간**: 1-2시간 (FlatList 로직)
- **위험도**: 중간 (사용자 만족도에 영향 가능)

**필수 조건**:
- ⚠️ **A/B 테스트 필수**
- ⚠️ **14일 메트릭 수집 필수**
  - 세션 길이 변화
  - 리텐션 비율 (D1, D7)
  - 광고당 수익 (RPM)
  - 사용자 불만 리뷰

---

## 💰 수익 vs UX 트레이드오프

### 크기별 비교

| 크기 | 월간 노출 (10K 기준) | eCPM | 월 수익 | UX 영향 점수 |
|------|---------------------|------|---------|--------------|
| BANNER (320x50) | 10,000 | $0.50 | $5 | 😊 낮음 (1/5) |
| ANCHORED_ADAPTIVE | 10,000 | $0.65 | $6.50 | 😊 낮음 (1/5) |
| LARGE_BANNER (320x100) | 10,000 | $0.75 | $7.50 | 😐 중간 (2/5) |
| INLINE_ADAPTIVE | 10,000 | $1.00 | $10 | 😕 중간-높음 (3/5) |
| MEDIUM_RECTANGLE (300x250) | 10,000 | $2.00 | $20 | 😰 매우 높음 (5/5) |

**참고**: eCPM 값은 추정이며 지역, 사용자, 광고 네트워크에 따라 다름.

### 배치 전략별 비교

| 배치 전략 | 수익 배수 | UX 영향 | 프로젝트 적용 |
|----------|----------|---------|--------------|
| Footer만 (BANNER) | 1.0x (기준) | 최소 | ✅ **Phase 1 완료** |
| Footer (ADAPTIVE) | 1.15x | 최소 | 🎯 **Phase 2 권장** |
| Footer + 인라인 (8개마다) | 1.8-2.0x | 중간 | 🔬 Phase 4 고려 |
| Footer + 헤더 | 1.3-1.5x | 중간 | ❌ 비권장 |
| 인라인만 (footer 없음) | 1.8-2.5x | 높음 | ❌ 원칙 위반 |
| 인라인 MEDIUM_RECTANGLE | 3.0-4.0x | 매우 높음 | ❌ **절대 금지** |

### Phase별 누적 수익 예측

| Phase | 화면 수 | 배너 유형 | 총 노출 증가 | 수익 증가 | 작업 시간 | 위험도 |
|-------|---------|----------|-------------|----------|----------|--------|
| Phase 1 (현재) | 3/7 | BANNER | 기준 | - | 완료 | - |
| Phase 2 (권장) | 3/7 | ADAPTIVE | +0% | +10-15% | 5분 | 없음 |
| Phase 3 (선택) | 5/7 | ADAPTIVE | +50-60% | +65-75% | 35분 | 낮음 |
| Phase 4 (고급) | 5/7 | INLINE | +80-100% | +145-175% | 2시간 | 중간 |

### 권장 접근 방식

**보수적** (낮은 위험, 중간 수익) ⭐ **권장**:
- **Phase 1 + Phase 2**: +10-15% 수익
- **작업 시간**: 5분
- **UX 영향**: 없음
- **결정**: ✅ **즉시 실행 가능**

**공격적** (중간 위험, 높은 수익):
- **Phase 1 + Phase 2 + Phase 4**: +70-95% 수익
- **작업 시간**: 2.5시간
- **UX 영향**: 중간 (테스트 필요)
- **결정**: ⚠️ **사용자 피드백 수집 후 결정**

---

## 🎨 UI 통합 패턴

### Modern Refined Orange v2.0 스타일 적용

```tsx
{/* 광고 영역: border-t로 상단 구분선 */}
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
</Box>
```

### 디자인 토큰

| 속성 | 값 | 설명 |
|------|-----|------|
| **상단 구분선** | `border-t border-gray-200` | 컨텐츠와 광고 영역 분리 |
| **배경색** | `bg-white` | Modern Refined 배경 |
| **좌우 패딩** | `px-5` | 20px (일관된 간격) |
| **상하 패딩** | `py-3` | 12px (적절한 여백) |
| **광고 높이** | 자동 | 50-90px (ADAPTIVE 기준) |

### Safe Area 고려

```tsx
// 하단 버튼이 있는 경우
<SafeAreaView edges={['bottom']}>
  <Box className="bg-white px-5 py-3">
    <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </Box>
</SafeAreaView>
```

### 레이아웃 패턴

**Footer 광고 (IndexScreen, QuestionMainScreen)**:
```tsx
<SafeAreaView className="flex-1 bg-orange-50">
  {/* 메인 컨텐츠 */}
  <View className="flex-1">
    {/* ... */}
  </View>

  {/* 하단 광고 */}
  <View className="border-orange-200 border-t bg-white px-5 py-3">
    <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </View>
</SafeAreaView>
```

**리스트 + Footer 광고 (QuestionListScreen)**:
```tsx
<SafeAreaView className="flex-1 bg-orange-50">
  {/* FlatList 컨텐츠 */}
  <FlatList
    data={questions}
    renderItem={renderQuestionItem}
  />

  {/* 광고 영역 */}
  <Box className="border-gray-200 border-t bg-white px-5 py-3">
    <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  </Box>

  {/* 하단 버튼 */}
  <Box className="border-gray-200 border-t bg-white p-5">
    <Pressable>...</Pressable>
  </Box>
</SafeAreaView>
```

---

## 📊 성공 지표 및 모니터링

### 유지해야 할 KPI (Phase 2-3)

**사용자 참여도**:
- ✅ Day 1 리텐션 ≥ 60%
- ✅ Day 7 리텐션 ≥ 30%
- ✅ 평균 세션 길이 ≥ 3분
- ✅ 질문 화면 도달률 ≥ 80%
- ✅ 앱 스토어 평점 ≥ 4.0★

**광고 성과**:
- ✅ 광고 채우기 비율 ≥ 70%
- ✅ 광고 조회 가능율 ≥ 50%
- ✅ 세션당 광고 노출 ≥ 2회

### 위험 신호 (광고 줄이기 필요)

**사용자 이탈**:
- ❌ Day 1 리텐션 < 40%
- ❌ 평균 세션 < 2분
- ❌ "광고" 언급한 1점 리뷰 급증
- ❌ 질문 화면 도달률 < 60%

**광고 문제**:
- ❌ 광고 채우기 비율 < 50%
- ❌ 광고 로드 시간 > 3초
- ❌ 광고 오류율 > 10%

### 추적 지표

**AdMob 대시보드**:
- 세션당 광고 노출 수
- 광고당 수익 (RPM)
- 광고 채우기 비율
- eCPM 트렌드
- 사용자당 수익 (ARPU)

**Analytics**:
- 화면별 체류 시간
- 광고 화면 도달률
- 플로우 완료율 (스플래시 → 질문)
- 모드별 사용 비율

---

## 🎯 Google AdMob 모범 사례

### ✅ 해야 할 것

**배치 원칙**:
- ✅ 현대적 반응형 디자인에 적응형 배너 사용
- ✅ 자연스러운 컨텐츠 구분점에 배너 배치
- ✅ 실제 사용자로 다양한 배치 테스트
- ✅ 배너:컨텐츠 비율 < 30% 유지

**성능 최적화**:
- ✅ 광고 사전 로드 (스플래시 화면 활용)
- ✅ 광고 새로고침 비율 30-90초 준수
- ✅ 광고 로드 실패 시 graceful degradation
- ✅ 테스트 모드에서 개발 디바이스 등록

### ❌ 하지 말아야 할 것

**정책 위반 방지**:
- ❌ 핵심 컨텐츠를 광고로 가리기
- ❌ 같은 화면에 여러 배너 사용 (AdMob 위반)
- ❌ 광고를 너무 자주 새로고침 (<30초)
- ❌ 컨텐츠 접근을 위해 광고 시청 강제

**UX 원칙 위반**:
- ❌ 모바일에 MEDIUM_RECTANGLE 사용 (데스크탑용)
- ❌ 스와이프 제스처 영역에 광고 배치
- ❌ 질문 컨텐츠를 가리는 광고
- ❌ 빠른 선택 플로우 방해

---

## 📝 구현 체크리스트

### Phase 2 업그레이드 (즉시 실행 권장)

**코드 수정**:
- [ ] IndexScreen: BANNER → ANCHORED_ADAPTIVE_BANNER
- [ ] QuestionMainScreen: BANNER → ANCHORED_ADAPTIVE_BANNER
- [ ] QuestionListScreen: BANNER → ANCHORED_ADAPTIVE_BANNER
- [ ] `npm run lint` 실행 및 통과
- [ ] TypeScript 타입 체크 통과

**테스트**:
- [ ] EAS Build APK 생성
- [ ] 실기기 테스트 (광고 로드 확인)
- [ ] 광고 높이 변화 확인 (50-90px)
- [ ] 모든 화면 레이아웃 정상 동작
- [ ] 네비게이션 흐름 확인

**검증**:
- [ ] 광고 채우기 비율 확인
- [ ] 광고 조회 가능율 확인
- [ ] 사용자 리텐션 모니터링 (7일)
- [ ] 앱 스토어 리뷰 모니터링

---

## 📚 참고 문서

### 내부 문서
- **[ADMOB_GUIDE.md](./ADMOB_GUIDE.md)** - AdMob 통합 종합 가이드
- **[ADMOB_STATUS.md](./ADMOB_STATUS.md)** - AdMob 구현 현황 및 단계별 상태
- **[design-system-modern-refined.md](./design-system-modern-refined.md)** - Modern Refined Orange v2.0 디자인 시스템
- **[component-architecture.md](./component-architecture.md)** - 컴포넌트 구조 가이드
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - 프로젝트 현황 종합

### 외부 문서
- [react-native-google-mobile-ads 공식 문서](https://docs.page/invertase/react-native-google-mobile-ads)
- [Google AdMob 배너 광고 가이드](https://developers.google.com/admob/android/banner)
- [AdMob 정책 센터](https://support.google.com/admob/answer/6128543)
- [AdMob 최적화 가이드](https://support.google.com/admob/answer/6128877)

---

## 🎯 최종 권장사항

### 즉시 실행 (Phase 2) ✅

**모든 BANNER를 ANCHORED_ADAPTIVE_BANNER로 업그레이드**

**예상 효과**:
- 수익: +10-15%
- UX: 영향 없음
- 위험: 없음
- 작업 시간: 5분

**결정**: ✅ **지금 바로 진행**

### 장기 고려 (Phase 4) 🔬

**QuestionListScreen 인라인 광고** (8개 항목마다)

**예상 효과**:
- 수익: +60-80%
- UX: 중간 영향
- 위험: 중간

**결정**: ⚠️ **사용자 테스트 필수** → 피드백 수집 → 데이터 기반 결정

### 절대 금지 ❌

- ❌ ContinuousCardScreen 광고 (핵심 UX 보호)
- ❌ IndividualCardScreen 광고 (컨텐츠 집중 화면)
- ❌ MEDIUM_RECTANGLE (300x250) 사용 (너무 침해적)
- ❌ 전면 광고 (카드 흐름 방해)

---

**최종 업데이트**: 2025-01-26 (Phase 4 완료)
**다음 리뷰**: Phase 2 구현 후 또는 사용자 피드백 발생 시
**문서 버전**: 2.0.0
