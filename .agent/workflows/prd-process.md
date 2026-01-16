---
description: _staging/의 정형화된 초안을 최종 specs/에 반영
---

# /prd-process 워크플로우

PRD `_staging/` 디렉토리의 정형화된 초안들을 최종 스펙 파일로 변환하여 `specs/`에 반영합니다.

> ⚠️ 이 워크플로우 실행 전에 `/prd-prepare`를 먼저 실행하세요.

## 파이프라인
```
_inbox/ → [/prd-prepare] → _staging/ → [/prd-process] → specs/
                              ↑ 여기서 읽음
```

## 실행 방법
```
/prd-process
```

## 워크플로우 단계

### 1. Staging 스캔
```
- AI_PRD/_staging/ 디렉토리의 모든 파일 목록 확인 (README.md 제외)
- 빈 경우 "처리할 파일이 없습니다. /prd-prepare를 먼저 실행하세요" 알림 후 종료
```

### 2. 파일별 분석
```
- 파일명 접두어([NEW], [UPDATE], [DELETE])에 따른 작업 유형 분류
- 스펙 유형(api, db, ui) 및 Phase(P1, P2) 추론
- 타겟 경로(specs/...) 결정
```

### 3. 분석 결과 보고 (사용자 승인)
```
| 원본 파일 | 작업 | 대상 위치 | 비고 |
|----------|------|----------|------|
| [NEW] accounts.md | 생성 | specs/db/accounts.md | - |

사용자 승인 후 진행
```

### 4. 파일 처리 (Processing)
> **Note**: 이 단계에서는 파일 생성/수정/삭제만 수행하며, `related` 연결은 다음 단계에서 일괄 처리합니다.

#### 4-A. 신규 ([NEW])
```
1. 프론트매터 생성 (related 필드는 빈 배열 []로 초기화)
2. 본문 정리 및 파일 생성
```

#### 4-B. 수정 ([UPDATE])
```
1. 기존 파일 로드
2. 변경 사항 적용 (프론트매터 유지)
3. 파일 저장
```

#### 4-C. 삭제 ([DELETE])
```
1. 대상 파일 삭제
```

### 5. 관계(Related) 조정 (Linking & Cleanup)
> **목적**: 파일 생성/수정/삭제로 인한 상호 참조 관계를 최신 상태로 동기화

1. 대상 파일 식별:
   - 이번 실행에서 변경(생성/수정/삭제)된 파일
   - 그 파일들을 참조하고 있는 모든 기존 파일들

2. 관계(Related) 업데이트 수행:
   - **[추가/수정]** 신규 생성되거나 수정된 파일이 참조하는 대상 연결 (누락된 링크 추가)
     - DB <-> API, DB <-> DB (FK), UI <-> API, UI <-> UI (Flow), Reference 연결
   - **[삭제/정리]** 삭제된 파일이나 더 이상 유효하지 않은 참조 제거 (Dead Link 제거)
     - 삭제된 파일(`[DELETE]`)을 가리키는 다른 파일들의 `related` 필드에서 해당 경로 삭제
     - 수정으로 인해 더 이상 참조하지 않는 관계 제거

3. 검증:
   - 모든 `related` 경로의 유효성 체크 (File Existence Check)

### 6. INDEX.md 업데이트
```
- specs/INDEX.md의 spec_count 업데이트
- 목록 테이블 업데이트
```

### 7. 정리 (Cleanup)
> **중요**: 각 명령어를 순차적으로 실행하고, 이전 명령이 완료된 후 다음 명령 실행

**Windows (PowerShell) - 반드시 순차 실행:**

```powershell
# Step 1: 아카이브 폴더 생성 (먼저 실행하고 완료 확인)
$datetime = Get-Date -Format "yyyy-MM-dd_HHmm"
$archivePath = "Docs/AI_PRD/_processed/$datetime"
New-Item -ItemType Directory -Force -Path $archivePath
```

```powershell
# Step 2: Step 1 완료 후 inbox 파일 이동
Get-ChildItem "Docs/AI_PRD/_inbox/" -Exclude "README.md" | Move-Item -Destination $archivePath -Force
```

```powershell
# Step 3: Step 2 완료 후 staging 정리
Get-ChildItem "Docs/AI_PRD/_staging/" -Exclude "README.md" | Remove-Item -Force
```

> ⚠️ **AI 주의**: 위 명령어들을 **한 번에 병렬 실행하지 말 것**! 폴더 생성 전에 파일 이동 시 파일명이 폴더명으로 변경되는 버그 발생.

**검증 (필수):**
```powershell
# 아카이브 폴더 구조 확인
Get-ChildItem $archivePath
```
- 폴더가 생성되고 그 안에 원본 파일들이 있어야 함
- 파일이 폴더명으로 이름만 변경된 경우 수정 필요

### 8. 수정 내역 저장 (CHANGELOG)

아카이브 폴더에 `CHANGELOG.md` 생성:

```markdown
# 처리 내역 - {datetime}

## 원본 파일
- sk_p1.dbml

## 생성된 스펙 (14개)
| 파일 | 테이블 | 작업 |
|------|--------|------|
| specs/db/user-consents.md | user_consents | NEW |
| specs/db/token-vault.md | token_vault | NEW |
...

## 업데이트된 스펙 (4개)
| 파일 | 변경 내용 |
|------|----------|
| specs/db/users.md | related 섹션에 6개 신규 테이블 링크 추가 |
| specs/db/portfolios.md | related 섹션에 5개 신규 테이블 링크 추가 |
...

## 처리 시각
- 시작: 2026-01-16 00:15
- 완료: 2026-01-16 00:20
```

### 9. 완료 보고
```
- 처리 완료된 파일 목록
- 아카이브 위치 안내 (날짜_시분 형식)
- CHANGELOG.md 생성 완료 안내
```

## 프론트매터 템플릿 (참고용)

### DB 스펙
```yaml
---
type: db
phase: P1
table: users
related:
  api: []
---
```
