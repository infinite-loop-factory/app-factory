# App Factory 개발 가이드

이 문서는 App Factory 모노레포 프로젝트의 설정, 실행 및 주요 개발 작업에 대한 지침을 제공합니다.

## AI 개발 지침

### 코딩 스타일 및 컨벤션

- **파일명**: kebab-case 사용 (예: `user-profile.tsx`, `api-client.ts`)
- **컴포넌트명**: PascalCase 사용
- **함수/변수명**: camelCase 사용
- **상수명**: UPPER_SNAKE_CASE 사용
- **타입/인터페이스**: PascalCase, Interface는 `I` 접두사 없이 작성

### 폴더 구조 패턴

```
app/                    # Expo Router 기반 페이지
components/            # 재사용 가능한 UI 컴포넌트
  ui/                 # 기본 UI 컴포넌트
  forms/              # 폼 관련 컴포넌트
  layout/             # 레이아웃 컴포넌트
hooks/                # 커스텀 React 훅
constants/            # 상수 정의
types/                # TypeScript 타입 정의
utils/                # 유틸리티 함수
services/             # API 호출 및 외부 서비스
stores/               # 상태 관리 (Jotai atoms, Zustand stores)
```

### 필수 사용 패턴

- **스타일링**: NativeWind 클래스명 사용 (Tailwind CSS 문법)
- **라우팅**: Expo Router의 파일 기반 라우팅
- **상태 관리**: 글로벌 상태는 Jotai 또는 zustand, 로컬 상태는 useState
- **폼 처리**: React Hook Form + Zod 스키마 검증
- **국제화**: i18n-js 사용, 모든 텍스트는 번역 키로 작성

## 1. 프로젝트 개요

App Factory는 여러 애플리케이션과 공유 패키지를 관리하는 모노레포입니다. [pnpm](https://pnpm.io/) 워크스페이스와 [Turborepo](https://turbo.build/repo)를 사용하여 빌드 시스템과 의존성 관리를 효율적으로 처리합니다.

### 1.1. 주요 기술 스택

이 프로젝트의 애플리케이션들은 주로 다음과 같은 기술 스택을 기반으로 구축됩니다:

- **Core Framework**: React Native, Expo SDK 52+
- **Language**: TypeScript 5.0+
- **Styling**: NativeWind (Tailwind CSS), Gluestack UI v2
- **Navigation**: Expo Router v4 (파일 기반 라우팅)
- **State Management**: Jotai (아토믹 상태), Zustand (복잡한 스토어)
- **Data Fetching/Caching**: TanStack Query (React Query) v5
- **Backend Integration**: Supabase (인증, 데이터베이스, 스토리지)
- **Forms**: React Hook Form + Zod 스키마 검증
- **Internationalization**: i18n-js v4
- **Testing**: Jest + React Native Testing Library
- **Build & Dev**: Expo CLI, EAS Build

### 1.2. 현재 애플리케이션 목록

- **cafe**: 카페 관리 앱
- **country-tracker**: 여행 국가 추적 앱
- **delivery**: 배달 서비스 앱
- **dog-walk**: 반려동물 산책 앱
- **playlist**: 음악 플레이리스트 앱
- **reaction-speed-test**: 반응속도 테스트 게임

각 `apps/*` 내의 `package.json` 파일을 참조하면 해당 애플리케이션의 구체적인 의존성을 확인할 수 있습니다.

## 2. 사전 준비 사항

개발 환경에 다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js**: 버전 24 이상 (`>=24`)
- **pnpm**: 버전 10 이상 (`>=10`)

루트 `package.json`의 `engines` 필드에서 정확한 버전 요구사항을 확인할 수 있습니다.

## 3. 프로젝트 설정

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 모든 의존성을 설치합니다:

```bash
pnpm install
```

이 명령어는 pnpm 워크스페이스 설정을 기반으로 루트 및 `apps/`와 `packages/` 내의 모든 하위 프로젝트의 의존성을 설치합니다.

## 4. 애플리케이션 실행

### 4.1. 통합 시작 스크립트

프로젝트 루트에서 다음 명령어를 사용하여 개발 서버 또는 선택된 애플리케이션을 시작할 수 있습니다:

```bash
pnpm start
```

이 명령어는 `scripts/start.ts` 파일을 실행합니다. 이 스크립트는 실행할 애플리케이션을 선택하거나 특정 작업을 수행하는 로직을 포함할 수 있습니다.

### 4.2. 개별 애플리케이션 실행

`apps/` 디렉토리 내의 특정 애플리케이션을 실행하려면 해당 애플리케이션의 `package.json`에 정의된 스크립트를 사용합니다. Turborepo를 통해 다음과 같이 실행할 수 있습니다:

```bash
# 예시: cafe 앱의 dev 또는 start 스크립트 실행
turbo run dev --filter=cafe
# 또는
turbo run start --filter=cafe
```

현재 `apps/` 디렉토리에는 다음과 같은 애플리케이션들이 있습니다:

- `cafe`
- `country-tracker`
- `delivery`
- `dog-walk`
- `playlist`
- `reaction-speed-test`

각 애플리케이션의 `package.json`에서 사용 가능한 스크립트를 확인하세요.

## 5. 주요 개발 스크립트

프로젝트 루트 `package.json`에는 다음과 같은 유용한 스크립트들이 정의되어 있습니다:

- **Linting**: 코드 스타일 및 정적 분석 오류를 검사합니다.

  ```bash
  pnpm lint
  ```

  (내부적으로 `turbo run lint` 실행)

- **Testing**: 단위 테스트 또는 통합 테스트를 실행합니다.

  ```bash
  pnpm test
  ```

  (내부적으로 `turbo run test` 실행)

- **Clean**: `node_modules` 디렉토리 및 빌드 아티팩트를 정리합니다.

  ```bash
  pnpm run clean
  ```

  (내부적으로 `git clean -xdf node_modules` 실행)

- **Generate**: Turborepo의 `gen` 스크립트를 실행합니다 (예: 새 컴포넌트나 패키지 생성).

  ```bash
  pnpm gen
  ```

  (내부적으로 `turbo gen` 실행)

- **Sort package.json**: 모든 `package.json` 파일의 내용을 정렬합니다.
  ```bash
  pnpm run sort-package-json
  ```

## 6. 프로젝트 구조

- `apps/`: 개별 애플리케이션들이 위치합니다. 각 애플리케이션은 자체 설정과 의존성을 가질 수 있습니다.
- `packages/`: 여러 애플리케이션에서 공유되는 라이브러리, UI 컴포넌트, 설정 파일 등이 위치합니다.
  - `common/`: 공통 유틸리티 또는 타입
  - `config-typescript/`: 공유 TypeScript 설정
  - `ui/`: 공유 UI 컴포넌트
- `scripts/`: 프로젝트 레벨의 자동화 스크립트 (예: `start.ts`)가 위치합니다.
- `turbo/generators/`: `turbo gen` 명령을 위한 템플릿 및 설정이 위치합니다.

## 7. 중요 설정 파일

- `pnpm-workspace.yaml`: pnpm 워크스페이스를 정의하여 모노레포 내 패키지들을 연결합니다.
- `turbo.json`: Turborepo의 파이프라인을 설정하여 빌드, 테스트, 린트 등의 작업을 최적화합니다.
- `biome.json`: Biome 포맷터 및 린터 설정.
- `commitlint.config.ts`: Commitlint 설정을 통해 커밋 메시지 컨벤션을 관리합니다.
- `lint-staged.config.mjs`: Lint-staged 설정을 통해 커밋 전 코드 품질을 검사합니다.

## 8. 커밋 및 코드 품질

이 프로젝트는 커밋 컨벤션과 코드 품질을 유지하기 위해 다음 도구들을 사용합니다:

- **Husky**: Git hooks를 관리합니다. (`.husky/` 디렉토리)
- **Commitlint**: 커밋 메시지가 Conventional Commits 스펙을 따르도록 강제합니다.
- **Lint-Staged**: 커밋할 파일에 대해 자동으로 린터와 포맷터를 실행합니다.
- **Biome**: 코드 포맷팅 및 린팅을 담당합니다.

커밋 시 자동으로 코드 검사 및 포맷팅이 이루어지며, 커밋 메시지 규칙을 준수해야 합니다.

## 9. 추가 정보

- 각 애플리케이션 및 패키지 내의 `README.md` 파일에서 더 자세한 정보를 확인할 수 있습니다.
- 새로운 기능을 추가하거나 버그를 수정할 때는 관련 테스트 코드를 작성하거나 업데이트하는 것이 권장됩니다.
