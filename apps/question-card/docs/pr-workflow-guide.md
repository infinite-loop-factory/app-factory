# PR 작성 및 워크플로우 가이드

EasyTalking 프로젝트의 Pull Request 작성 가이드

## PR 제목 작성 규칙

### 기본 패턴
```
{type}(question-card): {description} - {details}
```

### Type 분류
- `feat`: 새로운 기능 추가
- `refactor`: 코드 리팩토링 (기능 변경 없음)
- `fix`: 버그 수정
- `chore`: 설정, 문서 등 기타 작업
- `docs`: 문서화 작업

### 제목 예시
```
feat(question-card): project init and add docs for claude code
feat(question-card): Phase 1 Foundation - 핵심 아키텍처 및 기초 화면 구현
refactor(question-card): 🔧 컴포넌트 구조 개선 및 import 경로 최적화
```

### 제목 작성 가이드라인
- **한글 사용 가능**: 구체적인 작업 내용은 한글로 작성
- **이모지 사용**: 선택사항이며, 작업 유형을 시각적으로 표현
- **간결성**: 50자 내외로 핵심 내용만 포함
- **구체성**: 무엇을 했는지 명확하게 표현

## PR 본문 작성 템플릿

### 기본 구조
```markdown
## 설명 (Description)

{프로젝트명} 앱의 {작업 내용 요약}

## 주요 작업 내용

- 📋 **{카테고리}**: {구체적 작업 내용}
- 🏗️ **{카테고리}**: {구체적 작업 내용}
- 🎨 **{카테고리}**: {구체적 작업 내용}

## 변경 사항 (Changes)

### {섹션명}
- {변경 내용 1}
- {변경 내용 2}

### {섹션명}
- {변경 내용 1}
- {변경 내용 2}

## 체크리스트 (Checklist)

- [x] TypeScript 컴파일 오류 없음
- [x] Biome lint 통과
- [x] 기존 기능 정상 작동 확인
- [ ] iOS에서 테스트 완료
- [ ] Android에서 테스트 완료
- [ ] 웹에서 테스트 완료
- [ ] 관련 문서 업데이트 완료 (필요시)

## 리뷰 가이드라인 (Review Guidelines)

- **P1 (Priority 1)**: 반드시 바로 수정해야 할 항목입니다.
- **P2 (Priority 2)**: 수정하면 코드가 더 개선될 수 있는 사항입니다.
- **P3 (Priority 3)**: 당장 수정하지 않아도 괜찮은 개선 사항입니다.
```

## PR 생성 명령어

### GitHub CLI 사용 (권장)
```bash
gh pr create --title "제목" --body "$(cat <<'EOF'
본문 내용
EOF
)" --base main
```

### GitHub CLI로 PR 수정
```bash
# 제목 수정
gh pr edit {PR번호} --title "새로운 제목"

# 본문 수정
gh pr edit {PR번호} --body "$(cat <<'EOF'
새로운 본문 내용
EOF
)"
```

## 작업 단위별 PR 전략

### Single Commit PR
- **작업 범위**: 1-2시간 작업량
- **예시**: 단일 화면 구현, 버그 수정, 설정 변경
- **장점**: 빠른 리뷰 및 머지

### Feature Phase PR (추천)
- **작업 범위**: 관련된 여러 커밋을 묶어서 하나의 기능 완성
- **예시**: Phase 1 Foundation (6개 커밋), Phase 2 UI Components
- **장점**: 완전한 기능 단위로 리뷰 가능

### Multiple Feature PR (신중히 사용)
- **작업 범위**: 여러 독립적 기능을 포함
- **주의사항**: 리뷰가 복잡해질 수 있음
- **사용 시점**: 긴급한 배포나 관련성이 높은 작업들

## 커밋 히스토리 기반 PR 작성

### 커밋 히스토리 확인
```bash
git log --oneline -10
```

### 전체 커밋 반영 원칙
- **모든 커밋 요약**: PR 본문에서 각 커밋의 기여도 명시
- **시간순 정리**: 작업 진행 순서대로 변경사항 설명
- **누적 효과**: 최종 결과물이 어떻게 완성되었는지 설명

### 예시: Phase 1 Foundation PR
```
1. TypeScript Types - 완전한 타입 시스템 구축
2. Core Infrastructure - 핵심 시스템 구현  
3. Design System - 디자인 토큰 시스템
4. Navigation Structure - 라우팅 구조 개선
5. Screen Implementation - 화면 컴포넌트 구현
6. Code Quality - 개발 환경 최적화
```

## PR 리뷰 및 머지 가이드라인

### 리뷰 요청 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] Lint 규칙 준수
- [ ] TypeScript 컴파일 오류 없음
- [ ] 관련 문서 업데이트
- [ ] PR 본문 작성 완료

### 리뷰 우선순위
- **P1**: 기능 동작, 보안, 성능 이슈
- **P2**: 코드 품질, 가독성 개선
- **P3**: 스타일, 네이밍, 문서화

### 머지 조건
- 모든 P1 이슈 해결 완료
- CI/CD 파이프라인 통과
- 최소 1명의 승인 (팀 규칙에 따라 조정)

## 자주 사용하는 이모지

### 작업 유형별 이모지
- ✨ `:sparkles:` - 새로운 기능
- 🔧 `:wrench:` - 설정, 리팩토링
- 🐛 `:bug:` - 버그 수정
- 📚 `:books:` - 문서화
- 🎨 `:art:` - 디자인, UI 개선
- ⚡ `:zap:` - 성능 개선
- 🧹 `:broom:` - 코드 정리
- 🏗️ `:building_construction:` - 아키텍처 변경

### 카테고리별 이모지
- 📋 `:clipboard:` - 기획, 요구사항
- 🏗️ `:building_construction:` - 아키텍처
- 🎨 `:art:` - 디자인 시스템
- 📱 `:iphone:` - 모바일 앱
- 🔧 `:wrench:` - 개발환경, 설정
- 📁 `:file_folder:` - 파일 구조

## 트러블슈팅

### 일반적인 문제들

#### GitHub CLI 인증 문제
```bash
gh auth login
gh auth status
```

#### 브랜치 push 문제 (rebase 후)
```bash
git push --force-with-lease origin [branch-name]
```

#### PR 생성 실패
1. 브랜치가 push되었는지 확인
2. GitHub CLI 인증 상태 확인
3. 리포지토리 권한 확인

## 베스트 프랙티스

### DO ✅
- 관련된 커밋들을 하나의 PR로 묶기
- 명확하고 구체적인 제목 작성
- 모든 커밋의 기여도를 PR 본문에 반영
- 리뷰어를 위한 상세한 설명 제공
- 체크리스트로 완료도 확인

### DON'T ❌
- 너무 많은 무관한 변경사항을 하나의 PR에 포함
- 모호하거나 일반적인 제목 사용
- 최신 커밋만 반영하고 전체 맥락 누락
- 테스트 없이 PR 생성
- 문서 업데이트 누락