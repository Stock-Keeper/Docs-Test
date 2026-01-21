---
description: CHANGELOG 기반으로 변경된 specs를 tasks에 동기화
---

// turbo-all

## 기본 경로 (⚠️ 필수 확인)

```
PRD_ROOT = Docs/AI_PRD
├── _inbox/          # 원본 입력
├── _staging/        # 정형화된 초안
├── _processed/      # 처리 완료 아카이브
├── specs/           # 최종 스펙
│   ├── api/
│   ├── db/
│   └── ui/
└── tasks/           # Task 파일
    ├── P1/
    ├── P2/
    └── P3/
```

> **워크스페이스 루트가 아닌 `Docs/AI_PRD/` 하위에서 작업해야 함!**

---

# /prd-sync-tasks 워크플로우

`/prd-process` 완료 후 생성된 CHANGELOG를 읽고, 관련 task 파일의 스펙 참조를 업데이트합니다.

## 파이프라인
```
/prd-process → CHANGELOG.md 생성
                    ↓
/prd-sync-tasks → CHANGELOG 읽고 → tasks/ 업데이트
```

## 실행 방법

### 기본 (CHANGELOG 기반)
```
/prd-sync-tasks                    # 가장 최근 CHANGELOG 자동 감지
/prd-sync-tasks 2026-01-16_0028    # 특정 아카이브 지정
```

### Phase별 처리 (토큰 최적화) ⭐
```
/prd-sync-tasks P1                 # P1 task 파일만 스펙 참조 검증/업데이트
/prd-sync-tasks P2                 # P2 task 파일만 처리
/prd-sync-tasks P3                 # P3 task 파일만 처리
```

### 빠른 검증 모드
```
/prd-sync-tasks --verify           # 전체 tasks 스펙 참조 유효성만 빠르게 체크
/prd-sync-tasks --verify P1        # P1만 빠르게 체크
```

### 모드별 동작 차이

| 모드 | CHANGELOG | Task 스캔 | 스펙 수정 | 사용 시점 |
|------|-----------|----------|----------|----------|
| 기본 | ✅ 읽음 | 관련 task만 | ✅ 참조 추가/삭제 | /prd-process 완료 후 |
| Phase별 | ❌ 불필요 | 해당 Phase만 | ✅ 참조 추가/삭제 | 특정 Phase 집중 작업 |
| --verify | ❌ 불필요 | 전체/지정 | ❌ 읽기만 | 빠른 무결성 검사 |

## 워크플로우 단계

### 모드 분기

```
인자 확인:
- 없음 또는 날짜패턴 → 기본 모드 (CHANGELOG 기반)
- P1/P2/P3 → Phase별 모드
- --verify → 검증 모드
```

---

### [기본 모드] CHANGELOG 기반 처리

#### 1. CHANGELOG 찾기
```
- _processed/ 디렉토리에서 가장 최근 폴더 찾기
- 또는 사용자가 지정한 아카이브 폴더 사용
- CHANGELOG.md 읽기
```

#### 2. 변경된 스펙 파싱
```
CHANGELOG에서 추출:
- 생성된 스펙 (NEW)
- 업데이트된 스펙 (UPDATE)
- 삭제된 스펙 (DELETE)
```

---

### [Phase별 모드] 직접 스캔 처리 ⭐

#### 1. Task 파일 스캔
```
/prd-sync-tasks P1 실행 시:
- tasks/P1/*.md 파일만 로드
- 각 파일의 specs 필드 추출
```

#### 2. 스펙 참조 검증
```
각 task의 specs 참조에 대해:
- specs/db/{path} 존재 확인
- specs/api/{path} 존재 확인
- specs/ui/{path} 존재 확인
```

#### 3. 누락된 스펙 탐지
```
specs/db/{domain}/, specs/api/{domain}/ 스캔:
- 해당 Phase의 스펙 중 task에서 참조되지 않은 것 찾기
- 사용자에게 할당 여부 확인
```

---

### [--verify 모드] 빠른 검증

```
/prd-sync-tasks --verify [P1|P2|P3] 실행 시:

1. 지정된 범위의 task 파일 로드 (없으면 전체)
2. 각 task의 specs 참조 존재 여부만 확인
3. 문제 있으면 보고, 수정하지 않음

결과:
✅ task-auth.md: 모든 참조 유효
❌ task-portfolio.md: specs/db/accounts.md 없음
```

---

### 3. 관련 Task 식별

#### 도메인 → Task 동적 매핑

```
매핑 방식 (자동 추론):

1. tasks/{Phase}/*.md 파일 스캔
2. 각 task 파일의 프론트매터에서 domain 필드 추출
3. 스펙의 도메인과 task의 domain 매칭

예시:
- specs/db/auth/users.md → domain: auth
- task-auth.md (domain: auth) 와 매칭

매칭 실패 시:
- 사용자에게 확인 요청 (4-D 참조)
```

### 4. Task 파일 업데이트

#### 4-A. 신규 스펙 ([NEW])
```
1. task 파일의 "## 스펙 참조" 섹션 찾기
2. 적절한 카테고리(API/DB/UI)에 새 참조 추가
3. "## 구현 체크리스트" 섹션에 관련 항목 추가 (선택)
```

#### 4-B. 삭제된 스펙 ([DELETE])
```
1. task 파일에서 해당 스펙 참조 제거
2. 관련 체크리스트 항목 제거 또는 표시
```

#### 4-C. 수정된 스펙 ([UPDATE])
```
- 참조 경로가 변경되지 않았으면 별도 조치 불필요
- 필요시 사용자에게 확인 요청
```

#### 4-D. 매핑 없는 스펙 (사용자 결정 필요)

> 도메인 매핑 테이블에 없는 스펙이 발견되면 사용자에게 확인 요청

**처리 흐름:**
```
1. 매핑 없는 스펙 목록 표시
2. 기존 task 목록 제시
3. 사용자에게 선택 요청:
   - 기존 task에 포함
   - 새 task 파일 생성
   - 무시 (로그 테이블 등)
```

**사용자 확인 예시:**
```markdown
## 📌 매핑 없는 스펙 발견

다음 스펙들은 어디에 추가해야 할지 결정이 필요합니다:

### {domain} 도메인 ({n}개)
- {spec1}.md
- {spec2}.md
- ...

**기존 Task 목록:**
(tasks/ 디렉토리에서 동적으로 스캔)

**선택:**
- [ ] 기존 task에 포함 → 번호 입력: ___
- [ ] 새 task 생성: task-{domain}.md ⭐ (추천)
- [ ] 무시 (task 불필요)
```

**AI 추천 기준:**
| 조건 | 추천 |
|------|------|
| 스펙 3개 이상 + 독립된 기능 | ⭐ 새 task 생성 |
| 스펙 1-2개 + 기존 task와 연관 | 기존 task에 포함 |
| 로그/내부 테이블 | 무시 |
| FK로 강하게 연결된 경우 | 부모 테이블의 task에 포함 |

**새 Task 파일 생성 시 템플릿:**
```markdown
# Task: {도메인} 기능 구현

## 목표
{간단한 설명}

## 스펙 참조

### API
-   (추후 추가)

### DB
-   `../../specs/db/{파일명}.md`

### UI
-   (추후 추가)

## 구현 체크리스트

### Backend
-   [ ] 엔티티 생성
-   [ ] Repository 생성
-   [ ] Service 생성
-   [ ] Controller 생성

### Frontend
-   [ ] UI 구현
-   [ ] API 연동

### Database
-   [ ] 테이블 생성
```

### 5. 결과 보고

```markdown
# Task 동기화 결과

## 변경 소스
- 📁 CHANGELOG: _processed/{datetime}/CHANGELOG.md

## 업데이트된 Task 파일 ({n}개)

| Task | 추가된 스펙 | 제거된 스펙 |
|------|------------|------------|
| task-{domain}.md | {추가된 스펙 목록} | {제거된 스펙 목록} |

## 관련 Task 없음 ({n}개)
- {spec}.md → 로그 테이블 (task 불필요)
- {spec}.md → 💡 새 task 생성 검토 필요
```

## Task 파일 형식 참고

### 스펙 참조 섹션
```markdown
## 스펙 참조

### API
-   `../../specs/api/{domain}/{endpoint}.md`

### DB
-   `../../specs/db/{domain}/{table}.md`

### UI
-   `../../specs/ui/{domain}/{screen}.md`
```

### 체크리스트 섹션 (선택적 업데이트)
```markdown
### Database
-   [ ] `users` 테이블 생성
-   [ ] `user_consents` 테이블 생성    ← 새로 추가
```

## 자동 생성 제외 대상

| 패턴 | 이유 |
|------|------|
| *-logs.md | 로그 테이블은 별도 task 불필요 |
| token-vault.md | 내부 보안 테이블 |

## 주의사항

- task 파일의 기존 체크박스 상태([ ], [x])는 유지
- 상대 경로(`../../specs/...`) 형식 사용
- 매핑 테이블에 없는 스펙은 사용자에게 확인 요청
- 이 워크플로우는 스펙 참조만 업데이트, 체크리스트는 선택적
