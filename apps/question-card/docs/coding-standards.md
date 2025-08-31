# 코딩 표준 (Coding Standards)

EasyTalking 프로젝트의 코드 품질과 일관성을 유지하기 위한 코딩 표준입니다.

## 📋 목차
- [TypeScript 규칙](#typescript-규칙)
- [Import/Export 규칙](#importexport-규칙)
- [함수 작성 규칙](#함수-작성-규칙)
- [에러 처리](#에러-처리)
- [복잡도 관리](#복잡도-관리)
- [Null Safety](#null-safety)
- [Biome 설정](#biome-설정)

## TypeScript 규칙

### ✅ 올바른 타입 사용
```typescript
// ❌ 피해야 할 패턴
function process(data: any) { ... }
const result: any = getData();

// ✅ 권장 패턴
function process(data: unknown) { ... }
const result: User | null = getData();

// ✅ 구체적인 인터페이스 정의
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### ✅ Union 타입과 Null 처리
```typescript
// ❌ undefined 허용
interface State {
  currentQuestion: Question | undefined;
}

// ✅ null 사용 (명시적 의도)
interface State {
  currentQuestion: Question | null;
}

// ✅ 안전한 null 처리
const question = questions[index] || null;
const result = data?.property ?? defaultValue;
```

## Import/Export 규칙

### ✅ Import 순서
```typescript
// 1. Node modules (라이브러리)
import { createContext, useContext } from 'react';
import type React from 'react';

// 2. 내부 모듈 (상위 → 하위)
import { categories, difficulties } from '../constants/designSystem';

// 3. 타입 임포트 (알파벳 순)
import type { 
  AppError,
  AppState, 
  Category,
  Question
} from '../types';
```

### ✅ Export 순서
```typescript
// 타입 먼저, 알파벳 순
export type {
  AppState,
  Category,
  Question
} from './types';

// 일반 export, 알파벳 순
export {
  createQuestion,
  updateQuestion,
  validateQuestion
} from './utils';
```

## 함수 작성 규칙

### ✅ Async 함수 규칙
```typescript
// ❌ await 없는 async
async function loadData() {
  return data;
}

// ✅ 실제 비동기 작업이 있을 때만
async function loadData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ 동기 함수로 충분한 경우
function loadData() {
  return require('./data.json');
}
```

### ✅ 복잡도 관리 (최대 15)
```typescript
// ❌ 복잡한 함수 (복잡도 > 15)
function validateQuestion(question: unknown): boolean {
  if (!question) return false;
  if (typeof question !== 'object') return false;
  // ... 많은 중첩 조건들
  return true;
}

// ✅ 함수 분리로 복잡도 감소
function validateQuestionStructure(question: unknown): boolean {
  return question && typeof question === 'object';
}

function validateQuestionFields(question: Record<string, unknown>): boolean {
  return Boolean(question.id && question.content);
}

function validateQuestion(question: unknown): boolean {
  if (!validateQuestionStructure(question)) return false;
  return validateQuestionFields(question as Record<string, unknown>);
}
```

## 에러 처리

### ✅ 타입 안전한 에러 처리
```typescript
// ✅ 구체적인 에러 타입
interface AppError {
  code: string;
  message: string;
  details?: unknown; // any 대신 unknown
}

// ✅ 안전한 에러 변환
try {
  // 작업
} catch (err) {
  const error = err instanceof Error ? err : new Error('알 수 없는 오류');
  setError(error);
}
```

### ✅ 에러 상태 관리
```typescript
// ✅ 명확한 에러 상태
interface State {
  data: Data | null;
  error: Error | null;
  isLoading: boolean;
}

// ✅ 에러 초기화
const resetError = () => setError(null);
```

## 복잡도 관리

### ✅ 인지 복잡도 줄이기
```typescript
// ❌ 높은 복잡도
function processData(items: Item[]) {
  const results = [];
  for (const item of items) {
    if (item.active) {
      if (item.type === 'A') {
        if (item.value > 0) {
          results.push(transform(item));
        }
      } else if (item.type === 'B') {
        // ...
      }
    }
  }
  return results;
}

// ✅ 낮은 복잡도 (함수 분리)
function shouldProcessItem(item: Item): boolean {
  return item.active && item.value > 0;
}

function processItemByType(item: Item): ProcessedItem | null {
  switch (item.type) {
    case 'A': return transformTypeA(item);
    case 'B': return transformTypeB(item);
    default: return null;
  }
}

function processData(items: Item[]): ProcessedItem[] {
  return items
    .filter(shouldProcessItem)
    .map(processItemByType)
    .filter(Boolean);
}
```

## Null Safety

### ✅ Non-null assertion 피하기
```typescript
// ❌ 위험한 non-null assertion
const item = map.get(key)!;
item.process();

// ✅ 안전한 null 체크
const item = map.get(key);
if (item) {
  item.process();
}

// ✅ 옵셔널 체이닝
const result = item?.property?.value;

// ✅ Nullish coalescing
const value = item?.value ?? defaultValue;
```

### ✅ 배열 접근 안전성
```typescript
// ❌ 위험한 배열 접근
const first = array[0];

// ✅ 안전한 배열 접근
const first = array[0] ?? null;
const first = array.length > 0 ? array[0] : null;

// ✅ 옵셔널 체이닝
const value = array?.[0]?.property;
```

## Biome 설정

### biome.json 주요 규칙
```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error",
        "useAwait": "error"
      },
      "style": {
        "noNonNullAssertion": "error"
      },
      "complexity": {
        "noExcessiveCognitiveComplexity": {
          "level": "error",
          "options": { "maxAllowedComplexity": 15 }
        }
      }
    }
  }
}
```

## 실용적인 체크리스트

### ✅ 코드 작성 전 체크
- [ ] 모든 타입이 명시적으로 정의되어 있는가?
- [ ] `any` 타입을 사용하지 않았는가?
- [ ] 함수의 인지 복잡도가 15 이하인가?
- [ ] non-null assertion (`!`)을 사용하지 않았는가?

### ✅ 코드 작성 후 체크
- [ ] `npm run lint`가 에러 없이 통과하는가?
- [ ] `npm run type-check`가 에러 없이 통과하는가?
- [ ] import/export가 올바른 순서로 정렬되어 있는가?
- [ ] 모든 Promise가 적절히 await 되고 있는가?

### ✅ 커밋 전 체크
```bash
# 린트 체크
npm run lint

# 타입 체크
npm run type-check

# 테스트 (있는 경우)
npm test
```

## 자주하는 실수들

### 1. Map/Set에서 non-null assertion
```typescript
// ❌ 
const item = map.get(key)!;

// ✅
const item = map.get(key);
if (item) {
  // use item
}
```

### 2. any 타입 남용
```typescript
// ❌
function handle(data: any) { }

// ✅
function handle(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // type guard 사용
  }
}
```

### 3. 불필요한 async
```typescript
// ❌
async function getData() {
  return staticData;
}

// ✅
function getData() {
  return staticData;
}
```

### 4. 복잡한 조건문
```typescript
// ❌
if (a && b && (c || d) && e.includes(f) && g !== null) {
  // ...
}

// ✅
const hasValidConditions = a && b && (c || d);
const isValidItem = e.includes(f) && g !== null;

if (hasValidConditions && isValidItem) {
  // ...
}
```

이 문서를 참조하여 일관된 코드 품질을 유지하고 Biome lint 오류를 사전에 방지할 수 있습니다.