# AdMob 배너 크기 및 배치 옵션 분석

EasyTalking 앱의 AdMob 광고 최적화를 위한 종합 가이드

**작성일**: 2025-01-26
**버전**: 1.0.0
**기반**: react-native-google-mobile-ads v15.8.3

---

## 📊 사용 가능한 배너 광고 크기

### 표준 고정 크기

| 크기 상수 | 크기(px) | 특징 | 권장 용도 | eCPM 잠재력 |
|-----------|----------|------|-----------|-------------|
| **BANNER** | 320x50 | **가장 작음** ⭐ | Footer, 최소 방해 | 보통 (표준 인벤토리) |
| **LARGE_BANNER** | 320x100 | 높이 2배 | 더 눈에 띄는 footer | 높음 (크기↑=수익↑) |
| **FULL_BANNER** | 468x60 | 넓은 배너 | **태블릿 전용** | 보통 (태블릿 전용) |
| **LEADERBOARD** | 728x90 | 매우 넓음 | **태블릿 전용** | 높음 (태블릿 가로) |
| **MEDIUM_RECTANGLE** | 300x250 | **가장 큼** 🚨 | 인라인 컨텐츠 | **최고** (하지만 침해적) |
| **WIDE_SKYSCRAPER** | 160x600 | 세로형 | 중개 네트워크 전용 | N/A |

### 적응형 크기 (스마트/반응형)

| 크기 상수 | 동작 | 권장 용도 | 권장 사항 |
|-----------|------|-----------|-----------|
| **ANCHORED_ADAPTIVE_BANNER** | 전체 너비, 자동 높이 | Footer/header 영역 | ✅ **권장** (현대적) |
| **INLINE_ADAPTIVE_BANNER** | 가변 높이, 스크롤 가능 | 리스트 항목 사이 | ✅ QuestionListScreen에 좋음 |
| ~~ADAPTIVE_BANNER~~ | 더 이상 사용 안 함 | 레거시 앱 | ❌ 사용 금지 |

---

## 🎯 핵심 질문 답변

### Q1: Footer 배너가 가장 작은 광고인가?

**YES** - `BannerAdSize.BANNER` (320x50)이 AdMob에서 제공하는 **가장 작은 표준 배너**입니다.

- **가장 작은 고정 크기**: 320x50 (BANNER)
- **가장 작은 적응형**: ANCHORED_ADAPTIVE_BANNER (일반적으로 ~50-90px 높이)

**결론**: 현재 footer 배치에 가장 최소한의 옵션을 사용 중입니다. ✅

---

### Q2: Footer 외 다른 UI 광고 배너도 고려해야 하나?

**YES** - 남은 화면에 대해 footer 외에도 **창의적인 대안**이 있으며, UX를 희생하지 않고 수익을 개선할 수 있습니다.

---

## 💡 대체 배치 전략 (Footer 외)

### 전략 1: 인라인 광고 (컨텐츠 사이)

**적합 화면**: QuestionListScreen, CategorySelectionScreen

**구현 예시** (QuestionListScreen):
```tsx
<FlatList
  data={questions}
  renderItem={({ item, index }) => (
    <>
      <QuestionItem question={item} />

      {/* 8개 항목마다 광고 삽입 */}
      {(index + 1) % 8 === 0 && (
        <Box className="my-4">
          <BannerAdComponent
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
          />
        </Box>
      )}
    </>
  )}
/>
```

**장점**:
- ✅ 더 높은 참여도 (사용자가 스크롤하며 지나감)
- ✅ 자연스러운 컨텐츠 구분
- ✅ Footer 광고보다 높은 eCPM

**단점**:
- ❌ Footer보다 침해적
- ❌ 방해를 피하려면 신중한 간격 필요

---

### 전략 2: 헤더/상단 배치

**적합 화면**: ContinuousCardScreen (최소한으로만)

**구현 예시**:
```tsx
<SafeAreaView className="flex-1 bg-orange-50">
  {/* 고정 상단 배너 - 가장 작은 크기만 */}
  <Box className="border-gray-200 border-b bg-white">
    <BannerAdComponent size={BannerAdSize.BANNER} />
  </Box>

  {/* 진행률 표시 */}
  <Box className="px-5 py-4">
    <Progress value={progressPercentage * 100} />
  </Box>

  {/* 카드 컨텐츠 */}
  <Box className="flex-1 items-center justify-center">
    {/* 질문 카드 */}
  </Box>
</SafeAreaView>
```

**장점**:
- ✅ 하단 스와이프 제스처를 방해하지 않음
- ✅ 카드 보는 동안 항상 보임

**단점**:
- ❌ 질문 카드의 세로 공간 감소
- ❌ 카드 중심 화면에서 침해적으로 느껴질 수 있음
- ❌ **UX 원칙상 비권장**

---

### 전략 3: 선택 카드 사이 (그리드 레이아웃)

**적합 화면**: CategorySelectionScreen, DifficultySelectionScreen

**구현 예시** (CategorySelectionScreen):
```tsx
<ScrollView className="flex-1">
  <View className="gap-4 p-5">
    {/* 처음 3개 카테고리 */}
    {categories.slice(0, 3).map((cat) => (
      <CategoryCard key={cat.id} category={cat} />
    ))}

    {/* 3번째 카테고리 후 인라인 광고 */}
    <Box className="my-2">
      <BannerAdComponent
        size={BannerAdSize.LARGE_BANNER}
      />
    </Box>

    {/* 나머지 3개 카테고리 */}
    {categories.slice(3).map((cat) => (
      <CategoryCard key={cat.id} category={cat} />
    ))}
  </View>
</ScrollView>
```

**장점**:
- ✅ 컨텐츠 흐름에서 자연스러운 구분
- ✅ 더 큰 배너가 더 잘 맞음 (320x100)
- ✅ Footer보다 높은 가시성

**단점**:
- ❌ 선택 흐름 방해
- ❌ 사용자 결정 속도 저하 가능
- ❌ "빠른 선택" 원칙에 어긋남

---

### 전략 4: 고정 적응형 배너 (현대적 접근)

**적합 화면**: 모든 footer 배치 (현재 BANNER 교체)

**구현 예시**:
```tsx
// 현대적 적응형 배너 - 화면 너비에 자동 조정
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
</Box>
```

**장점**:
- ✅ 기기 너비에 자동 최적화
- ✅ 더 나은 광고 채우기 비율 (더 많은 광고 인벤토리)
- ✅ 잠재적으로 더 높은 eCPM
- ✅ 여전히 최소한의 침해

**단점**:
- ❌ 높이가 가변적 (50-90px vs 고정 50px)
- ❌ 예상보다 컨텐츠를 더 밀어올릴 수 있음

---

## 📱 화면별 상세 권장사항

### 1. IndexScreen ✅ (현재 광고 있음)

**현재 구현**: Footer absolute 배치 (BANNER 320x50)

**권장 업그레이드**:
```tsx
<View className="absolute bottom-8 w-full px-5">
  <BannerAdComponent
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
</View>
```

**영향**: +10-15% 수익, UX 영향 없음

---

### 2. CategorySelectionScreen ❌ (현재 광고 없음)

**옵션 A**: Footer 적응형 배너 (안전)
```tsx
// 선택 요약 아래, "다음 단계" 버튼 위
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
</Box>
```
- **수익 증가**: +25% (전체 노출)
- **UX 영향**: 낮음
- **평가**: ✅ **추가 가능** (좋은 간격)

**옵션 B**: 인라인 대형 배너 (공격적)
```tsx
// 3번째 카테고리 후
<BannerAdComponent size={BannerAdSize.LARGE_BANNER} />
```
- **수익 증가**: +30-40% (더 높은 eCPM)
- **UX 영향**: 중간 (흐름 방해)
- **평가**: ⚠️ **수익이 매우 중요한 경우만**

**최종 권장**: 옵션 A (Footer 적응형)

---

### 3. DifficultySelectionScreen ❌ (현재 광고 없음)

**권장 옵션**: Footer 배너 (표준 또는 적응형)
```tsx
// "선택된 난이도" 아래, "다음 단계" 버튼 위
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>
```

**영향**:
- **수익 증가**: +20% (전체 노출)
- **UX 영향**: 최소 (충분한 세로 공간)
- **평가**: ✅ **추가 안전** - 좋은 간격

---

### 4. QuestionMainScreen ✅ (현재 광고 있음)

**현재 구현**: Footer (BANNER 320x50)

**권장 업그레이드**:
```tsx
<View className="border-orange-200 border-t bg-white px-5 py-3">
  <BannerAdComponent
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
</View>
```

**영향**: +10-15% 수익, UX 영향 없음

---

### 5. ContinuousCardScreen ❌ (현재 광고 없음)

**옵션 검토됨**:
- 상단 고정 배너: ❌ 카드 보기 영역 축소
- 카드 간 전면 광고: ❌ 흐름 방해
- Footer 배너: ❌ 스와이프 제스처 충돌

**최종 권장**: **광고 없이 유지** ✅

**이유**:
- 핵심 UX 화면 (앱의 본질)
- 스와이프 제스처 충돌 위험
- 질문 내용을 가리거나 방해하면 안 됨

---

### 6. QuestionListScreen ✅ (현재 광고 있음)

**현재 구현**: Footer (BANNER 320x50)

**권장 업그레이드 1** (안전):
```tsx
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
</Box>
```

**영향**: +10-15% 수익, UX 영향 없음

**권장 업그레이드 2** (고급 - 테스트 필요):
```tsx
// FlatList renderItem 내부
{(index + 1) % 8 === 0 && (
  <Box className="my-4">
    <BannerAdComponent
      size={BannerAdSize.LARGE_BANNER}
    />
  </Box>
)}
```

**영향**:
- **수익 증가**: +60-80% (해당 화면)
- **UX 영향**: 중간 (사용자 테스트 필요)
- **평가**: ⚠️ **먼저 사용자 테스트**

---

### 7. IndividualCardScreen ❌ (현재 광고 없음)

**권장 옵션**: Footer 배너 (카드와 네비게이션 사이)
```tsx
// 카드와 네비게이션 버튼 사이
<Box className="border-gray-200 border-t bg-white px-5 py-3">
  <BannerAdComponent size={BannerAdSize.BANNER} />
</Box>
```

**영향**:
- **수익 증가**: +20% (전체 노출)
- **UX 영향**: 낮음 (카드 가리지 않음)
- **평가**: ✅ **Phase 3에서 고려**

---

## 🚀 단계별 구현 계획

### Phase 1 (현재 - 유지) ✅

**3/7 화면에 광고**:
- ✅ IndexScreen footer: BANNER (320x50)
- ✅ QuestionMainScreen footer: BANNER (320x50)
- ✅ QuestionListScreen footer: BANNER (320x50)

**상태**: 완료 및 작동 중

---

### Phase 2 (빠른 성과 - 업그레이드) 🎯

**모든 BANNER를 ANCHORED_ADAPTIVE_BANNER로 교체**:
```tsx
// 모든 화면에서
- <BannerAdComponent size={BannerAdSize.BANNER} />
+ <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
```

**영향**:
- **수익**: 모든 화면에서 +10-15%
- **작업 시간**: 5분 (전역 검색/교체)
- **위험**: 매우 낮음
- **권장**: ✅ **즉시 진행**

---

### Phase 3 (확장 - 화면 추가) 📈

**1. DifficultySelectionScreen** footer 추가: BANNER 또는 ADAPTIVE
**2. IndividualCardScreen** footer 추가: BANNER 또는 ADAPTIVE

**영향**:
- **수익**: 총 노출 +40-50%
- **작업 시간**: 30분
- **위험**: 낮음 (둘 다 좋은 간격)
- **권장**: ✅ **Phase 2 성공 후 진행**

---

### Phase 4 (고급 - 신중히 테스트) ⚠️

**QuestionListScreen 인라인 광고**: LARGE_BANNER 또는 INLINE_ADAPTIVE
- 8개 항목마다 삽입
- 사용자 리텐션 A/B 테스트

**영향**:
- **수익**: 해당 화면에서 +60-80%
- **작업 시간**: 1-2시간 (FlatList 로직)
- **위험**: 중간 (사용자 만족도에 영향 가능)
- **권장**: ⚠️ **먼저 사용자 테스트 필수**

---

### 유지: 광고 없음 ❌

**절대 광고 추가하지 말 것**:
- ❌ ContinuousCardScreen (핵심 UX)
- ❌ CategorySelectionScreen (Phase 3 추가 가능하지만 비권장)

---

## 💰 수익 vs UX 트레이드오프 분석

### 크기 비교

| 크기 | 월간 노출 (추정) | eCPM | 월 수익 | UX 영향 점수 |
|------|------------------|------|---------|--------------|
| **BANNER** (320x50) | 10,000 | $0.50 | $5 | 😊 낮음 (1/5) |
| **LARGE_BANNER** (320x100) | 10,000 | $0.75 | $7.50 | 😐 중간 (2/5) |
| **INLINE_ADAPTIVE** | 10,000 | $1.00 | $10 | 😕 중간-높음 (3/5) |
| **MEDIUM_RECTANGLE** (300x250) | 10,000 | $2.00 | $20 | 😰 매우 높음 (5/5) |

**참고**: eCPM 값은 추정이며 지역, 사용자, 광고 네트워크에 따라 다름.

### 배치 영향

| 배치 전략 | 수익 배수 | UX 영향 | 권장사항 |
|----------|----------|---------|---------|
| Footer만 | 1.0x (기준) | 최소 | ✅ **현재 최선** |
| Footer + 인라인 (5개마다) | 1.5-2.0x | 중간 | ⚠️ QuestionList에서 고려 |
| Footer + 헤더 | 1.3-1.5x | 중간 | ⚠️ 필요한 경우만 |
| 인라인만 (footer 없음) | 1.8-2.5x | 높음 | ❌ 너무 침해적 |
| 인라인 중형 사각형 | 3.0-4.0x | **매우 높음** | ❌ 원칙 위반 |

---

## ✅ 최종 권장사항

### 즉시 실행 (Phase 2)
```tsx
// 모든 화면에서 BANNER를 ANCHORED_ADAPTIVE_BANNER로 업그레이드
<BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
```
- **수익**: +10-15%
- **UX**: 영향 없음
- **위험**: 없음
- **결정**: ✅ **지금 바로 하세요**

### 안전한 추가 (Phase 3)
1. **DifficultySelectionScreen** footer 추가
2. **IndividualCardScreen** footer 추가

- **수익**: +40-50%
- **UX**: 최소 영향
- **위험**: 낮음
- **결정**: ✅ **Phase 2 후 진행**

### 고급 옵션 (Phase 4)
**QuestionListScreen** 인라인 광고 (8개마다)

- **수익**: +60-80%
- **UX**: 중간 영향
- **위험**: 중간
- **결정**: ⚠️ **먼저 테스트**

### 절대 금지
- ❌ ContinuousCardScreen 광고
- ❌ MEDIUM_RECTANGLE (300x250)
- ❌ 전면 광고 (카드 흐름 방해)

---

## 📊 예상 수익 영향

### Phase별 누적 수익 증가

| Phase | 화면 수 | 총 노출 | 수익 증가 | 작업 시간 | 위험 |
|-------|---------|---------|----------|----------|------|
| **Phase 1** (현재) | 3/7 | 기준 | - | 완료 | - |
| **Phase 2** (업그레이드) | 3/7 | +10-15% | +10-15% | 5분 | 없음 |
| **Phase 3** (확장) | 5/7 | +50-60% | +65-75% | 35분 | 낮음 |
| **Phase 4** (인라인) | 5/7 | +80-100% | +145-175% | 2시간 | 중간 |

### 권장 접근 방식

**보수적** (낮은 위험, 중간 수익):
- Phase 2 + Phase 3 = **+65-75% 수익**
- 작업 시간: 40분
- UX 영향: 최소

**공격적** (중간 위험, 높은 수익):
- Phase 2 + Phase 3 + Phase 4 = **+145-175% 수익**
- 작업 시간: 3시간
- UX 영향: 중간 (테스트 필요)

**권장**: 보수적 접근으로 시작 → 사용자 피드백 수집 → 필요시 Phase 4

---

## 🎯 Google AdMob 모범 사례

**공식 AdMob 가이드라인 기반**:

### ✅ 해야 할 것
- 현대적 반응형 디자인에 적응형 배너 사용
- 자연스러운 컨텐츠 구분점에 배너 배치
- 실제 사용자로 다양한 배치 테스트
- 광고 새로고침 비율 모니터링 (30-90초)
- 배너:컨텐츠 비율 < 30% 유지

### ❌ 하지 말아야 할 것
- 핵심 컨텐츠를 광고로 가리기
- 같은 화면에 여러 배너 사용 (AdMob 위반)
- 광고를 너무 자주 새로고침 (<30초)
- 모바일에 MEDIUM_RECTANGLE 사용 (데스크탑용)
- 컨텐츠 접근을 위해 광고 시청 강제

---

## 📝 구현 체크리스트

### Phase 2 업그레이드 (즉시)

- [ ] IndexScreen: BANNER → ANCHORED_ADAPTIVE_BANNER
- [ ] QuestionMainScreen: BANNER → ANCHORED_ADAPTIVE_BANNER
- [ ] QuestionListScreen: BANNER → ANCHORED_ADAPTIVE_BANNER
- [ ] `npm run lint` 실행 및 통과
- [ ] EAS Build APK 생성
- [ ] 실기기 테스트 (광고 로드 확인)
- [ ] 광고 높이 변화 확인 (50-90px)

### Phase 3 확장 (Phase 2 성공 후)

- [ ] DifficultySelectionScreen footer 광고 추가
- [ ] IndividualCardScreen footer 광고 추가
- [ ] 모든 화면 레이아웃 테스트
- [ ] 네비게이션 흐름 확인
- [ ] 사용자 리텐션 메트릭 모니터링 (14일)
- [ ] 부정적 피드백 없음 확인

### Phase 4 인라인 (선택, 테스트 필수)

- [ ] QuestionListScreen FlatList 로직 수정
- [ ] 인라인 광고 간격 테스트 (5, 8, 10개)
- [ ] A/B 테스트 설정 (50% 트래픽)
- [ ] 14일 메트릭 수집:
  - [ ] 세션 길이 변화
  - [ ] 리텐션 비율 (D1, D7)
  - [ ] 광고당 수익 (RPM)
  - [ ] 사용자 불만 리뷰
- [ ] 결과 기반 최종 결정

---

## 🔍 모니터링 지표

### 성공 지표 (Phase 2-3)

**유지해야 할 것**:
- ✅ Day 1 리텐션 ≥ 60%
- ✅ Day 7 리텐션 ≥ 30%
- ✅ 평균 세션 길이 ≥ 3분
- ✅ 질문 화면 도달률 ≥ 80%
- ✅ 앱 스토어 평점 ≥ 4.0★

**위험 신호** (광고 줄이기):
- ❌ Day 1 리텐션 < 40%
- ❌ 평균 세션 < 2분
- ❌ "광고" 언급한 1점 리뷰 급증
- ❌ 질문 화면 도달률 < 60%

### 수익 지표

**추적할 것**:
- 세션당 광고 노출 수
- 광고당 수익 (RPM)
- 광고 채우기 비율
- eCPM 트렌드
- 사용자당 수익 (ARPU)

---

## 📚 참고 문서

- [react-native-google-mobile-ads 공식 문서](https://docs.page/invertase/react-native-google-mobile-ads)
- [Google AdMob 배너 광고 가이드](https://developers.google.com/admob/android/banner)
- [AdMob 정책 센터](https://support.google.com/admob/answer/6128543)
- 내부 문서:
  - `docs/admob-integration.md` - 통합 가이드
  - `docs/admob-placement-strategy.md` - 배치 전략
  - `docs/admob-device-id-guide.md` - 테스트 디바이스 설정

---

**최종 업데이트**: 2025-01-26
**다음 리뷰**: Phase 2 구현 후 또는 사용자 피드백 발생 시
