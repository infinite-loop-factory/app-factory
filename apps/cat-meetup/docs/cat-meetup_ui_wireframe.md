# cat-meetup UI Wireframe

Expo React Native 앱 `cat-meetup`의 화면 단위 와이어프레임 문서입니다.
시각 디자인이 아닌 레이아웃/네비게이션/컴포넌트 계층 기준으로 작성했습니다.

## Screen Name
Signup

### Layout structure
- SafeAreaView
- KeyboardAvoidingView
- ScrollView (세로 스크롤)
- Header 영역
- Form 영역
- Submit 영역

### Key components
- Header
  - Title: 사람 회원가입
  - Subtitle: 기본 정보 입력
- Form Sections
  - 기본 정보 섹션
    - TextInput: 이름
    - TextInput: 핸드폰번호(아이디)
    - TextInput: 카카오톡 아이디
    - TextInput: 이메일
    - PasswordInput: 비밀번호
  - 프로필 정보 섹션
    - SegmentedControl/Radio: 성별
    - DatePicker: 생년월일
    - RegionPicker (BottomSheet/Modal)
      - 옵션: 서울시 구로구, 관악구, 노원구
    - MultilineInput: 자기소개
- Footer CTA
  - PrimaryButton: 가입 완료
  - SecondaryTextButton: 이미 계정 있음 → 로그인

### Navigation actions
- `가입 완료` -> Cat registration (선택 유도) 또는 Post list
- `이미 계정 있음` -> 로그인 화면(추후)
- Back -> 이전 화면 또는 앱 홈

---

## Screen Name
Cat registration

### Layout structure
- SafeAreaView
- ScrollView
- Header 영역
- Cat Card Form 영역
- 등록된 고양이 카드 리스트 영역
- Bottom CTA 영역

### Key components
- Header
  - Title: 동물 카드 작성
  - Subtitle: 여러 마리 등록 가능
- Cat Form
  - TextInput: 고양이 이름
  - SegmentedControl/Radio: 성별
  - NumberInput: 나이
  - Toggle: 중성화 여부
  - MultiSelect Chips: 성격 (개냥이/수줍음/사나움)
  - ImageUploader: 사진
  - MultilineInput: 설명
  - Button: 카드 추가
- Registered Cards List
  - CardItem (이름, 나이, 성별, 대표 여부)
  - Action: 수정, 삭제, 대표 설정
- Footer CTA
  - PrimaryButton: 완료
  - SecondaryButton: 나중에 등록

### Navigation actions
- `카드 추가` -> 같은 화면 리스트 갱신
- `완료` -> Post list
- `나중에 등록` -> Post list
- 카드 `수정` -> Cat registration (edit mode)

---

## Screen Name
Post list (region + category filter)

### Layout structure
- SafeAreaView
- Top Filter Bar (고정)
- Status Filter Row
- FlatList (게시물 목록)
- FAB (작성자용 새 글)

### Key components
- Top Filter Bar
  - RegionFilter Dropdown/Chip Group
  - CategoryFilter Chip Group
- Status Filter Row
  - Chips: 모집 / 매칭중 / 매칭완료
- Post List Item
  - Category Badge
  - Title
  - Meet datetime
  - Region
  - Status Tag
  - Preview text
  - Optional: 신청 상태 배지 (내 신청 대기/실패/매칭)
- Empty State
  - Text + Retry Button
- FAB
  - 아이콘 + "새 글 작성"

### Navigation actions
- List item tap -> Post detail
- FAB tap -> Host create post
- Filter 변경 -> 같은 화면 데이터 재조회
- 상단 탭/버튼 -> Apply list, Matching screen

---

## Screen Name
Post detail

### Layout structure
- SafeAreaView
- ScrollView
- Post Header
- Post Meta
- Post Body
- Author/Applicant Preview Section
- Bottom Fixed CTA

### Key components
- Post Header
  - Title
  - Category Badge
  - Status Tag
- Post Meta
  - Meet datetime
  - Region
- Body
  - Content text
- Profile Preview Section
  - 작성자/신청자 프로필 요약
  - 고양이 정보 요약
  - 리뷰 요약
- Bottom CTA
  - PrimaryButton: 참여 신청
  - Disabled state: 신청 완료
  - Alternative label: 대기중

### Navigation actions
- `참여 신청` -> 상태 대기중으로 전환, 버튼 비활성
- 프로필/고양이/리뷰 tap -> 프로필 상세 모달(추후)
- Back -> Post list

---

## Screen Name
Apply list

### Layout structure
- SafeAreaView
- Filter Bar
- FlatList (내가 신청한 게시물)

### Key components
- Filter Bar
  - Region Filter
  - Category Filter
  - Status Filter
- Applied Post Item
  - Post title
  - Category/Region
  - Meet datetime
  - My status badge: 대기 / 매칭 / 실패
  - Right status box (매칭/대기/실패)
- Empty State
  - 신청 내역 없음 안내

### Navigation actions
- Item tap -> Post detail
- 상단 탭 이동 -> Post list / Matching screen

---

## Screen Name
Matching screen

### Layout structure
- SafeAreaView
- Segmented Tabs (매칭중 / 매칭완료)
- FlatList
- Bottom helper panel

### Key components
- Segment control
  - Tab A: 매칭중(수락 필요)
  - Tab B: 매칭완료
- Match Item
  - Post title
  - 상대방 연락처 노출 상태
  - 상태 텍스트
  - PrimaryButton: 수락 (매칭중에서만)
- Helper Panel
  - 안내 텍스트: 수락 후 연락 가능, 리뷰 가능 시점

### Navigation actions
- `수락` -> 상태 매칭완료 업데이트
- Item tap -> Post detail
- 탭 변경 -> 같은 화면 내 데이터 전환

---

## Screen Name
Host create post

### Layout structure
- SafeAreaView
- ScrollView
- Header
- Form Sections
- Bottom Fixed CTA

### Key components
- Header
  - Title: 새 글 작성
- Form
  - TextInput: 제목
  - CategorySelector: 돌봄/친구찾기/물품나눔
  - DateTimePicker: 만날 날짜/시간(24시간)
  - MultilineInput: 본문
- Bottom CTA
  - PrimaryButton: 게시물 등록
  - SecondaryButton: 임시저장(선택)

### Navigation actions
- `게시물 등록` -> Host manage matching 또는 Post detail
- Back -> Post list

---

## Screen Name
Host manage matching

### Layout structure
- SafeAreaView
- Post Summary Header
- Applicant List (FlatList)
- Selection Control Panel (하단 고정)

### Key components
- Post Summary Header
  - 제목/카테고리/일시/상태
- Applicant List Item
  - 신청자 기본 프로필
  - 고양이 정보 요약
  - 리뷰 평점 요약
  - 상태 배지
  - ActionButton: 선택
- Selection Control Panel
  - 선택 변경 가능 여부 (하루 1회 제한 표시)
  - PrimaryButton: 매칭 선택 확정
  - WarningText: 매칭완료 시 변경 불가

### Navigation actions
- 신청자 item tap -> 신청자 상세 모달(프로필/고양이/리뷰)
- `매칭 선택 확정` -> 선택자=매칭중, 나머지=실패
- 선택자 수락 확인 후 -> 상태 매칭완료
- Back -> Post detail 또는 Post list

---

## Screen Name
Review writing

### Layout structure
- SafeAreaView
- Review 대상 요약 카드
- Form 영역
- Submit 영역

### Key components
- Target Summary Card
  - 게시물 제목
  - 상대 사용자 이름
  - 완료 일시
  - 작성 가능 시작일 안내
- Form
  - Rating selector (1~5)
  - MultilineInput: 리뷰 내용
- Submit
  - PrimaryButton: 리뷰 등록
  - Validation/Error message

### Navigation actions
- `리뷰 등록` -> 완료 후 Post detail 또는 Apply list
- 작성 가능 시점 이전이면 -> 버튼 비활성 + 안내
- Back -> 이전 화면

---

## Navigation flow summary
- Signup -> Cat registration (optional) -> Post list
- Post list -> Post detail -> Apply action
- Post list -> Apply list
- Post list -> Matching screen
- Post list -> Host create post -> Host manage matching
- 일정 종료 +1일 이후 -> Review writing

## Component hierarchy notes (implementation)
- Shared Layout
  - `ScreenContainer` (SafeArea + padding)
  - `TopFilterBar` (region/category/status)
  - `StatusBadge`
  - `ProfilePreviewCard`
- Domain UI
  - `PostListItem`
  - `ApplicantListItem`
  - `CatCardItem`
  - `MatchActionPanel`
  - `ReviewForm`
- State/Route
  - 라우트 단위: `app/(auth)`, `app/(cat)`, `app/(posts)`, `app/(host)`, `app/(applicant)`
  - 서버 상태: post list/apply list/matching list 분리 캐시 키 사용
