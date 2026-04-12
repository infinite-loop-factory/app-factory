# cat-meetup 초보자 개발 가이드

`cat-meetup`을 처음 만드는 사람 기준으로, 이 앱을 어떤 규칙으로 만들면 되는지 쉽게 정리한 문서입니다.

## 1. 한 줄 요약

이 앱은 `app/`에 화면을 만들고, `src/`에 화면이 쓰는 재료를 넣고, `docs/`에 설계 메모를 남기면서 개발하면 됩니다.

## 2. `app-factory`와 `cat-meetup`의 차이

- `app-factory/`
  - 여러 앱을 같이 관리하는 큰 작업장
  - 공통 실행 규칙, 공통 패키지, 공통 개발 환경을 들고 있음
- `apps/cat-meetup/`
  - 실제로 우리가 만들고 있는 고양이 모임 앱
  - 화면, 타입, 목업 데이터, 앱 전용 문서를 여기에 둠

쉽게 말하면:

- `app-factory` = 건물 전체
- `cat-meetup` = 그 안의 한 개 앱

## 3. 지금 내가 지켜야 하는 가장 중요한 규칙

현재 작업 범위는 `apps/cat-meetup` 안으로만 제한합니다.

- `apps/cat-meetup` 밖은 수정하지 않기
- 새 문서는 `apps/cat-meetup/docs` 아래에만 만들기
- 화면은 `app/`에 만들기
- 화면에서 쓰는 타입, 목업 데이터, 재사용 컴포넌트는 `src/`에 두기
- 이미지, 아이콘, 폰트는 `assets/`에 두기
- 화면 파일 안에 모든 로직을 몰아넣지 않기

## 4. 폴더별 역할

### `app/`

사용자가 실제로 보는 화면을 두는 곳입니다.

예시:

- `app/index.tsx`
  - 앱 첫 화면
- `app/_layout.tsx`
  - 전체 네비게이션, 헤더, 공통 레이아웃
- `app/(auth)/login.tsx`
  - 로그인 화면
- `app/(auth)/signup.tsx`
  - 회원가입 화면
- `app/(posts)/list.tsx`
  - 게시물 목록 화면
- `app/(posts)/[id].tsx`
  - 게시물 상세 화면

규칙:

- 화면처럼 보이는 것은 `app/`
- 파일 하나가 보통 화면 하나
- `[id].tsx`처럼 대괄호 파일은 상세 페이지
- `(auth)`, `(posts)` 같은 괄호 폴더는 정리용 그룹

### `src/`

화면이 쓰는 재료를 두는 곳입니다.

예시:

- `src/domain/types.ts`
  - 앱 데이터 규칙
- `src/domain/mock.ts`
  - 가짜 데이터
- `src/features/posts/components/PostCard.tsx`
  - 게시물 카드 공통 UI
- `src/types/contracts.ts`
  - 서버와 주고받는 데이터 계약 타입

규칙:

- 여러 화면에서 같이 쓰는 것은 `src/`
- 재사용 UI는 `src/features/.../components`
- 타입은 `src/domain` 또는 `src/types`
- 나중에 API 연결 함수는 `src/features/.../api`

### `assets/`

이미지, 아이콘, 폰트 같은 정적 파일을 두는 곳입니다.

예시:

- `assets/images/icon.png`
- `assets/images/splash.png`
- `assets/fonts/SpaceMono-Regular.ttf`

### `docs/`

기획, 와이어프레임, ERD, 개발 메모를 두는 곳입니다.

예시:

- `docs/cat-meetup_prd_user_flow.md`
- `docs/cat-meetup_ui_wireframe.md`
- `docs/cat-meetup_erd.md`

## 5. 파일을 어디에 둘지 헷갈릴 때 판단법

### 이 코드가 화면인가?

그러면 `app/`에 둡니다.

예:

- 로그인 페이지
- 게시물 목록 페이지
- 게시물 상세 페이지

### 이 코드가 화면에서 재사용하는 조각인가?

그러면 `src/features/.../components`에 둡니다.

예:

- 게시물 카드
- 상태 배지
- 공통 입력 폼 조각

### 이 코드가 데이터 규칙인가?

그러면 `src/domain`이나 `src/types`에 둡니다.

예:

- `PostStatus`
- `UserProfile`
- `CatCard`

### 이 코드가 서버 호출인가?

그러면 `src/features/.../api`에 둡니다.

예:

- 로그인 요청
- 게시물 목록 조회
- 게시물 작성
- 신청/취소 요청

### 이 코드가 화면 전용 상태 처리나 검증인가?

그러면 `src/features/.../hooks` 또는 `src/features/.../validators`에 둡니다.

예:

- 회원가입 입력 검증
- 로그인 에러 처리
- 게시물 작성 폼 검증

## 6. `cat-meetup`에서 추천하는 구조

현재 구조를 유지하면서 아래처럼 키우면 관리가 쉬워집니다.

```text
apps/cat-meetup/
  app/
    (auth)/
      login.tsx
      signup.tsx
    (cat)/
      register.tsx
    (posts)/
      list.tsx
      [id].tsx
      applied.tsx
    (host)/
      create.tsx
      manage/[id].tsx
    (applicant)/
      matches.tsx

  src/
    domain/
      types.ts
      mock.ts
    features/
      auth/
        api/
        components/
        validators/
      cats/
        api/
        components/
        validators/
      posts/
        api/
        components/
        hooks/
      matching/
        api/
        components/
      reviews/
        api/
    shared/
      components/
      utils/
      constants/

  assets/
  docs/
```

## 7. 가장 쉬운 개발 순서

처음부터 서버까지 한 번에 하지 말고, 아래 순서로 가면 훨씬 쉽습니다.

### 1단계. 화면 이동부터 확인

먼저 `app/` 화면들이 서로 잘 이동하는지 확인합니다.

우선 확인할 화면:

- `app/index.tsx`
- `app/(auth)/login.tsx`
- `app/(auth)/signup.tsx`
- `app/(cat)/register.tsx`
- `app/(posts)/list.tsx`
- `app/(posts)/[id].tsx`

### 2단계. 타입 먼저 정리

데이터 모양을 먼저 정해야 나중에 덜 흔들립니다.

우선 정리할 파일:

- `src/domain/types.ts`
- `src/types/contracts.ts`

예:

- 게시물은 어떤 값을 가져야 하는가
- 신청 상태는 어떤 값만 가능한가
- 전화번호 공개 상태는 어떻게 표현할까

### 3단계. 목업 데이터로 화면 완성

서버가 없어도 `mock.ts`로 화면은 먼저 만들 수 있습니다.

우선 쓸 파일:

- `src/domain/mock.ts`

이 단계 목표:

- 게시물 목록 보이기
- 게시물 상세 보이기
- 신청 상태 보이기
- 매칭 상태 보이기

### 4단계. 재사용 UI 분리

같은 UI를 두 번 이상 쓰게 되면 컴포넌트로 뺍니다.

예:

- `src/features/posts/components/PostCard.tsx`
- `src/features/posts/components/PostStatusBadge.tsx`
- `src/features/auth/components/AuthHeader.tsx`

### 5단계. API 연결

화면이 다 보이고 데이터 모양이 안정되면 실제 서버 연결을 붙입니다.

예상 구조:

```text
src/features/auth/api/login.ts
src/features/auth/api/signup.ts
src/features/posts/api/getPosts.ts
src/features/posts/api/getPostDetail.ts
src/features/posts/api/createPost.ts
src/features/posts/api/applyPost.ts
src/features/posts/api/cancelPostApplication.ts
src/features/cats/api/createCatCard.ts
```

## 8. 화면 파일에서 하지 말아야 할 것

아래처럼 되면 파일이 너무 빨리 복잡해집니다.

- API 호출 코드와 UI를 한 파일에 모두 몰아넣기
- 타입을 화면 파일마다 중복 선언하기
- 같은 카드 UI를 여러 화면에 복붙하기
- 임시 문자열 상태를 화면마다 제각각 쓰기

좋은 방향:

- 화면 파일은 최대한 "보여주기 + 연결하기" 역할만 하기
- 타입은 한곳에 모으기
- 재사용 UI는 컴포넌트로 빼기
- 상태 문자열은 타입으로 관리하기

## 9. 지금 앱에서 우선 만들 기능 순서

초보자 기준으로는 아래 순서가 가장 안전합니다.

1. 로그인 화면 동작 정리
2. 회원가입 화면 정리
3. 고양이 카드 등록 화면 정리
4. 게시물 목록 화면 정리
5. 게시물 상세 화면 정리
6. 게시물 신청/취소 흐름 정리
7. 작성자용 게시물 작성 화면 정리
8. 작성자용 신청자 관리 화면 정리
9. 신청자용 매칭 수락 화면 정리

## 10. 문서 읽는 추천 순서

개발 전에 아래 문서를 이 순서대로 읽으면 이해가 빨라집니다.

1. `docs/cat-meetup_prd_user_flow.md`
2. `docs/cat-meetup_ui_wireframe.md`
3. `docs/cat-meetup_erd.md`

읽는 이유:

- `PRD/User Flow` = 무엇을 만들지
- `UI Wireframe` = 어떤 화면이 필요한지
- `ERD` = 데이터가 어떻게 연결되는지

## 11. 작업 전에 스스로 체크할 것

- 이 코드는 화면인가
- 이 코드는 재사용 가능한가
- 이 타입은 이미 어딘가에 정의돼 있나
- 이 화면은 지금 목업으로 먼저 만들 수 있나
- 이 변경이 `cat-meetup` 밖으로 나가지는 않나
- 새 문서가 필요하면 `docs/` 아래에 만들고 있나

## 12. 아주 짧은 결론

`cat-meetup`은 아래 순서로 만들면 됩니다.

1. `docs`로 요구사항 이해
2. `app`에 화면 만들기
3. `src/domain`에 타입 정리
4. `src/domain/mock.ts`로 가짜 데이터 붙이기
5. `src/features`에 재사용 코드 분리
6. 마지막에 API 연결

막히면 가장 먼저 이렇게 생각하면 됩니다:

"이건 화면인가, 재사용 재료인가, 데이터 규칙인가?"

이 질문만 잘 구분해도 폴더 위치가 거의 정해집니다.
