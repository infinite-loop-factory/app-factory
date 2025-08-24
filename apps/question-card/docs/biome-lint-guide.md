# Biome Lint 가이드

EasyTalking 프로젝트의 Biome lint 규칙 준수를 위한 실용적 가이드입니다.

## 📋 빠른 체크리스트

### ✅ 커밋 전 필수 체크
```bash
npm run lint        # 에러 없이 통과해야 함
npm run type-check  # TypeScript 에러 없이 통과해야 함
```

## 🚨 자주 발생하는 lint 오류들

### 1. `noExplicitAny` - any 타입 사용 금지
```typescript
// ❌ 에러 발생
function handle(data: any) { }
interface Props { details?: any; }

// ✅ 올바른 수정
function handle(data: unknown) { }
interface Props { details?: unknown; }

// ✅ 더 구체적인 타입
function handle(data: User | Product) { }
interface Props { details?: Record<string, unknown>; }
```

### 2. `noNonNullAssertion` - Non-null assertion 금지
```typescript
// ❌ 에러 발생
const item = map.get(key)!;
const first = array[0]!;

// ✅ 올바른 수정
const item = map.get(key);
if (item) {
  // use item safely
}

const first = array.length > 0 ? array[0] : null;

// ✅ 옵셔널 체이닝 사용
const value = item?.property?.value;
```

### 3. `useAwait` - async 함수에서 await 누락
```typescript
// ❌ 에러 발생
async function loadData() {
  return staticData; // await 없음
}

// ✅ 수정 방법 1: async 제거
function loadData() {
  return staticData;
}

// ✅ 수정 방법 2: 실제 비동기 작업 추가
async function loadData() {
  const data = await fetch('/api/data');
  return data.json();
}
```

### 4. `noExcessiveCognitiveComplexity` - 복잡도 초과 (15 이상)
```typescript
// ❌ 에러 발생 (복잡도 > 15)
function validateQuestion(question: unknown): boolean {
  if (!question) return false;
  if (typeof question !== 'object') return false;
  const q = question as Record<string, unknown>;
  if (!q.id) return false;
  if (typeof q.id !== 'string' && typeof q.id !== 'number') return false;
  if (!q.content) return false;
  if (typeof q.content !== 'string') return false;
  if (q.content.length < 5) return false;
  if (q.content.length > 500) return false;
  if (!q.difficulty) return false;
  if (!['easy', 'medium', 'hard'].includes(q.difficulty as string)) return false;
  // ... 더 많은 조건들
  return true;
}

// ✅ 올바른 수정 (함수 분리)
function validateQuestionStructure(question: unknown): boolean {
  return question && typeof question === 'object';
}

function validateQuestionFields(q: Record<string, unknown>): boolean {
  if (!q.id || (typeof q.id !== 'string' && typeof q.id !== 'number')) {
    return false;
  }
  if (!q.content || typeof q.content !== 'string') {
    return false;
  }
  return true;
}

function validateQuestionContent(q: Record<string, unknown>): boolean {
  const content = q.content as string;
  return content.length >= 5 && content.length <= 500;
}

function validateQuestionDifficulty(q: Record<string, unknown>): boolean {
  return Boolean(q.difficulty && ['easy', 'medium', 'hard'].includes(q.difficulty as string));
}

function validateQuestion(question: unknown): boolean {
  if (!validateQuestionStructure(question)) return false;
  
  const q = question as Record<string, unknown>;
  return validateQuestionFields(q) && 
         validateQuestionContent(q) && 
         validateQuestionDifficulty(q);
}
```

### 5. Import/Export 정렬 오류
```typescript
// ❌ 에러 발생 (잘못된 순서)
import type React from 'react';
import { createContext } from 'react';
import type { AppState } from '../types';
import { categories } from '../constants';

// ✅ 올바른 수정 (정렬된 순서)
import { createContext } from 'react';
import type React from 'react';
import { categories } from '../constants';
import type { AppState } from '../types';
```

## 💡 lint 오류 해결 전략

### 1. 단계별 접근
```bash
# 1. 현재 오류 확인
npm run lint

# 2. 하나씩 수정하며 진행
npm run lint 2>&1 | head -20  # 처음 20줄만 보기

# 3. 타입 체크도 함께 실행
npm run type-check
```

### 2. 일반적인 수정 패턴

**Map/Set 안전 접근**:
```typescript
// 패턴: map.get()을 안전하게 사용
const getValue = (map: Map<string, Item>, key: string): Item | null => {
  return map.get(key) ?? null;
};

// 패턴: forEach에서 안전 접근
map.forEach((value, key) => {
  // value는 이미 존재함이 보장됨
  processValue(value);
});

// 패턴: 조건부 처리
categories.forEach(categoryId => {
  const questions = grouped.get(categoryId);
  if (questions) {
    // 안전하게 사용
    processQuestions(questions);
  }
});
```

**타입 가드 패턴**:
```typescript
// 패턴: 타입 가드 함수
function isValidQuestion(data: unknown): data is Question {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'content' in data
  );
}

// 패턴: 사용
function processQuestion(data: unknown) {
  if (isValidQuestion(data)) {
    // data는 이제 Question 타입
    console.log(data.content);
  }
}
```

**에러 처리 패턴**:
```typescript
// 패턴: 안전한 JSON 파싱
function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed as T;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('JSON parse failed');
    console.error('JSON parsing failed:', err.message);
    return fallback;
  }
}
```

## 🔧 Biome 설정 커스터마이징

프로젝트 루트의 `biome.json`에서 규칙을 조정할 수 있습니다:

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

## 🚀 VS Code 통합

VS Code에서 Biome 확장을 설치하면 실시간으로 오류를 확인할 수 있습니다:

1. Biome VS Code 확장 설치
2. 설정에서 기본 formatter로 Biome 설정
3. 저장시 자동 수정 활성화

## 📚 추가 자료

- [Biome 공식 문서](https://biomejs.dev/)
- [프로젝트 코딩 표준](./coding-standards.md)
- TypeScript 엄격 모드 가이드