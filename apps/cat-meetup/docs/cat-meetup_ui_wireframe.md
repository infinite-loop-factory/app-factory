# cat-meetup UI Wireframe

Expo React Native 앱 `cat-meetup`의 화면 단위 와이어프레임 문서입니다.
시각 디자인이 아닌 레이아웃/네비게이션/컴포넌트 계층 기준으로 작성했습니다.

## Screen Name
Signup

### Route
`app/(auth)/signup.tsx`

### Layout structure
- SafeAreaView
- KeyboardAvoidingView
- ScrollView
- Header
- Form
- Submit CTA

### Key components
- Header: title, subtitle
- Form fields
  - name
  - phone (ID)
  - kakaoId
  - email
  - password
  - gender
  - birthDate
  - region picker
  - bio
- CTA buttons
  - 가입 완료
  - 이미 계정 있음

### Navigation actions
- 가입 완료 -> Cat registration 또는 Post list
- 이미 계정 있음 -> 로그인(추후)
- Back -> 이전 화면

### Server actions
- `createUserProfile`

### State source
- local: form 입력값, validation 에러, loading
- server: 없음 (submit 시 mutation)
- derived: 가입 가능 여부(`isValid && !isSubmitting`)

---

## Screen Name
Cat registration

### Route
`app/(cat)/register.tsx`

### Layout structure
- SafeAreaView
- ScrollView
- Header
- Cat form
- Registered cat list
- Bottom CTA

### Key components
- Cat form fields
  - name, gender, age, neutered, temperament, image, description
- Registered cats list
- CTA
  - 카드 추가
  - 완료
  - 나중에 등록

### Navigation actions
- 카드 추가 -> 같은 화면 목록 갱신
- 완료 -> Post list
- 나중에 등록 -> Post list
- 카드 수정 -> Cat registration(edit)

### Server actions
- `insertCatCard`

### State source
- local: 현재 입력중인 cat form, 이미지 임시 상태
- server: 등록된 cat card 목록
- derived: 대표 고양이 여부, 카드 추가 가능 여부

---

## Screen Name
Post list (region + category filter)

### Route
`app/(posts)/list.tsx`

### Layout structure
- SafeAreaView
- Top filter bar
- Status filter row
- FlatList
- FAB

### Key components
- Region/Category/Status filters
- `PostCard variant="list"`
- FAB: 새 글 작성

### Navigation actions
- 카드 탭 -> Post detail
- FAB 탭 -> Host create post
- 필터 변경 -> 목록 재조회
- 탭 이동 -> Apply list / Matching screen

### Server actions
- 없음 (query-only)

### State source
- local: filter UI state(region, category, status)
- server: `posts(region, category, status)`
- derived: empty state 여부, 로딩/오류 표시 상태

---

## Screen Name
Post detail

### Route
`app/(posts)/[id].tsx`

### Layout structure
- SafeAreaView
- ScrollView
- Post summary
- Body
- Profile preview
- Bottom fixed CTA

### Key components
- `PostCard variant="list"` (상세에서는 expanded mode)
- 프로필/고양이/리뷰 preview
- CTA: 참여 신청

### Navigation actions
- 참여 신청 -> 신청 완료 상태 전환
- 프로필/고양이/리뷰 탭 -> 상세 모달(추후)
- Back -> Post list

### Server actions
- `createPostApplication`

### State source
- local: 신청 버튼 비활성 상태(optimistic)
- server: post detail, 내 신청 상태
- derived: 신청 가능 여부(status, 본인 작성글 여부, 점수 제한)

---

## Screen Name
Apply list

### Route
`app/(posts)/applied.tsx`

### Layout structure
- SafeAreaView
- Filter bar
- FlatList

### Key components
- Region/Category/Status filters
- `PostCard variant="applied"`

### Navigation actions
- 카드 탭 -> Post detail
- 상단 탭 이동 -> Post list / Matching screen

### Server actions
- 없음 (query-only)

### State source
- local: filter UI state
- server: 내가 신청한 posts + application status
- derived: 매칭/대기/실패 뱃지 매핑

---

## Screen Name
Matching screen

### Route
`app/(applicant)/matches.tsx`

### Layout structure
- SafeAreaView
- Segmented tabs
- FlatList
- Bottom helper panel

### Key components
- Tabs: 매칭중 / 매칭완료
- `PostCard variant="match"`
- CTA: 수락

### Navigation actions
- 수락 -> 매칭완료 상태 전환
- 카드 탭 -> Post detail
- 탭 변경 -> 같은 화면 내 데이터 전환

### Server actions
- `acceptMatching`

### State source
- local: 선택 탭, 수락 진행중 상태
- server: 매칭중/매칭완료 목록
- derived: 수락 버튼 활성 여부(상태/권한/연락처 노출 조건)

---

## Screen Name
Host create post

### Route
`app/(host)/create.tsx`

### Layout structure
- SafeAreaView
- ScrollView
- Header
- Form
- Bottom fixed CTA

### Key components
- title
- category
- meet_at datetime
- content
- CTA: 게시물 등록

### Navigation actions
- 게시물 등록 -> Host manage matching 또는 Post detail
- Back -> Post list

### Server actions
- `createPost` (신규)

### State source
- local: form 입력값, datetime picker 상태
- server: 없음 (submit 시 mutation)
- derived: 게시 가능 여부(form validation)

---

## Screen Name
Host manage matching

### Route
`app/(host)/manage/[id].tsx`

### Layout structure
- SafeAreaView
- Post summary header
- Applicant list
- Selection control panel

### Key components
- 신청자 리스트 아이템
- 선택 확정 CTA
- 하루 1회 변경 제한 안내

### Navigation actions
- 신청자 탭 -> 프로필/고양이/리뷰 모달
- 매칭 선택 확정 -> 선택자 매칭중, 나머지 실패
- 수락 확인 후 -> 매칭완료
- Back -> Post detail/Post list

### Server actions
- `selectMatchingCandidate` (신규)
- `confirmMatchingCompleted` (신규)

### State source
- local: 현재 선택중 applicant id, 변경 가능 여부 표시
- server: applications by post, post status
- derived: 재선택 가능 여부(24시간 1회 제한, 매칭완료 잠금)

---

## Screen Name
Review writing

### Route
`app/(reviews)/write.tsx` (신규 파일 필요)

### Layout structure
- SafeAreaView
- Target summary card
- Review form
- Submit CTA

### Key components
- 대상 게시물/상대 사용자 요약
- 작성 가능 시작일 표시
- rating
- review content
- 리뷰 등록 버튼

### Navigation actions
- 리뷰 등록 -> Post detail 또는 Apply list
- 작성 가능 시점 이전 -> 버튼 비활성
- Back -> 이전 화면

### Server actions
- `createReview` (신규)

### State source
- local: rating/content 입력 상태
- server: review 대상 정보, 작성 가능 시점
- derived: 작성 가능 여부(`now >= available_from`)

---

## Navigation flow summary
- Signup -> Cat registration(optional) -> Post list
- Post list -> Post detail -> Apply action
- Post list -> Apply list
- Post list -> Matching screen
- Post list -> Host create post -> Host manage matching
- 일정 종료 +1일 이후 -> Review writing

## Component hierarchy notes (implementation)

### 통합 카드 컴포넌트
- `PostCard` 단일 컴포넌트로 통합
  - `<PostCard variant="list" />`
  - `<PostCard variant="applied" />`
  - `<PostCard variant="match" />`

### 공통 컴포넌트
- `ScreenContainer`
- `TopFilterBar`
- `StatusBadge`
- `ProfilePreviewCard`
- `MatchActionPanel`
- `ReviewForm`

### 비고
- `PostListItem`, `MatchItem`, `AppliedItem` 분리 대신 `PostCard variant` 통합으로 중복 제거
- 예상 효과: 화면별 아이템 코드량 약 40% 절감

## Data contracts (Supabase)

### posts
- `id`
- `title`
- `category`
- `status`
- `meet_at`
- `author_user_id`

### post_applications
- `id`
- `post_id`
- `applicant_user_id`
- `status`
- `phone_visibility_state`

## Server actions summary
- `createUserProfile`
- `insertCatCard`
- `createPostApplication`
- `acceptMatching`
- `createPost` (신규)
- `selectMatchingCandidate` (신규)
- `confirmMatchingCompleted` (신규)
- `createReview` (신규)
