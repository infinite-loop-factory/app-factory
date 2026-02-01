# CLAUDE.md

EasyTalking (이지토킹) - 디지털 질문 카드 앱: React Native + Expo로 구축된 자기성찰 및 대화용 앱

## Project Status (2025.01.11)
- **6개 화면 완전 구현**: 모든 필수 사용자 플로우 완성
- **4가지 모드 완전 동작**: 모드 1,2,3 (연속 카드) + 모드 4 (리스트 → 개별 카드)
- **Modern UI 시스템**: Alert.alert → Toast/Actionsheet/BottomSheet 리팩토링 완료
- **TypeScript 에러 해결**: 전체 type-check 통과
- **Google AdMob 통합**: 5개 화면 광고 배치 (Footer + Inline)

## 핵심 명령어
```bash
pnpm start             # Expo 개발 서버 시작
pnpm run lint          # Biome 린트 (커밋 전 필수)
pnpm run type-check    # TypeScript 타입 체크

# EAS Build
eas build -p android --profile preview  # Android APK 빌드
```

## 기술 스택
- **Framework**: React Native + Expo SDK 52
- **Styling**: NativeWind + Gluestack-ui v2
- **Navigation**: Expo Router (file-based routing)
- **Typography**: IBM Plex Sans KR (400, 500, 600, 700)
- **State**: Context API
- **UI Components**: Toast, Actionsheet, BottomSheet (@gorhom/bottom-sheet)
- **Monetization**: Google AdMob (react-native-google-mobile-ads)
- **Quality**: Biome lint, TypeScript strict

## 프로젝트 구조
```
src/
├── app/                    # Expo Router (라우팅만)
├── components/
│   ├── screens/           # 6개 화면 컴포넌트
│   ├── ads/               # AdMob 광고 컴포넌트
│   └── ui/                # Toast, Actionsheet, BottomSheet 등
├── context/AppContext.tsx # 전역 상태 관리
├── hooks/                 # useFullscreenMode 등
├── types/                 # TypeScript 인터페이스
└── utils/questionModes.ts # 4가지 모드 알고리즘

data/questions.json        # 120개 질문 데이터
```

## 앱 플로우
```
Category Selection → Difficulty Selection → Question Main →
├── 모드 1,2,3 → Continuous Card (스와이프)
└── 모드 4 → Question List → Individual Card (버튼)
```

## 코드 품질 규칙
```bash
pnpm run lint        # 커밋 전 필수
pnpm run type-check  # TypeScript 검증
```

**핵심 규칙**:
- `any` 타입 금지 → `unknown` 또는 구체적 인터페이스
- Non-null assertion(`!`) 금지 → 안전한 null 체크
- NativeWind 우선 → Flexbox: `flex` (콘텐츠), `flex-1` (공간 채우기)
- Context API 일관성 → 로컬 state와 혼재 금지

## UI 패턴 (Modern UI)
```typescript
// 검증 메시지: Toast (3초 자동 닫힘)
toast.show({ placement: "top", duration: 3000, ... });

// 확인 대화상자: Actionsheet
<Actionsheet isOpen={showActionsheet} onClose={...}>

// 완료/에러 알림: BottomSheet (@gorhom/bottom-sheet)
completionSheetRef.current?.snapToIndex(0);
```

## 상태 관리 패턴
```typescript
// Context state 일관성 있게 사용 (로컬 state 혼재 금지)
const { progress, filteredQuestions } = useAppState();
const { goToNextQuestion, resetProgress } = useAppActions();

const currentIndex = progress.currentIndex;
const currentQuestion = progress.currentQuestion;
```

---

## 참고 문서
- `docs/PROJECT_STATUS.md` - 프로젝트 현황 종합 보고서
- `docs/troubleshooting.md` - 문제 해결 가이드
- `docs/coding-standards.md` - 코드 품질 가이드라인
- `docs/ADMOB_GUIDE.md` - AdMob 통합 가이드

---

## TODO (남은 작업)

### 실기기 테스트
```bash
eas build -p android --profile preview
```
- 5개 화면 광고 표시 확인
- 인라인 광고 동작 확인
- 네트워크 환경 테스트

### 프로덕션 배포 준비
- AdMob 계정 생성 및 실제 ID 발급
- `.env.production` 실제 IDs 입력
- Google Play Console 계정 설정
- 스토어 메타데이터 준비
