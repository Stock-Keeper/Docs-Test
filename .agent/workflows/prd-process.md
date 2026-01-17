---
description: _staging/의 정형화된 초안을 최종 specs/에 반영
---

// turbo-all

# /prd-process 워크플로우

PRD `_staging/` 디렉토리의 정형화된 초안들을 최종 스펙 파일로 변환하여 `specs/`에 반영합니다.

> ⚠️ 이 워크플로우 실행 전에 `/prd-prepare`를 먼저 실행하세요.

## 파이프라인
```
_inbox/ → [/prd-prepare] → _staging/ → [/prd-process] → specs/
                              ↑ 여기서 읽음   ↓ 완료된 파일
                                        _processed/{datetime}/staging/
                                              ↓ staging 모두 완료 시
                                        _processed/{datetime}/ (inbox 파일 이동)
```

## 실행 옵션

1. `/prd-process {domain}` : 특정 도메인의 staging 파일만 처리 **(권장)**
2. `/prd-process` : 모든 staging 파일 일괄 처리

### 처리 흐름

```
/prd-process community-profile
  ↓
[NEW] db-community-profile.md 처리
  ↓
specs/db/community/ 에 반영
  ↓
_processed/{datetime}/staging/ 으로 이동

... 다른 도메인 반복 ...

/prd-process community-search (마지막 도메인)
  ↓
_staging/ 이 비었는지 확인
  ↓ (비었으면)
_inbox/ 내용물 → _processed/{datetime}/ 으로 이동
  ↓
CHANGELOG.md 생성
```

---

## 워크플로우 단계 (도메인 지정 시)

### 1. Staging 스캔 및 필터링

```
1. AI_PRD/_staging/ 디렉토리의 모든 파일 목록 확인 (README.md 제외)
2. 빈 경우 "처리할 파일이 없습니다. /prd-prepare를 먼저 실행하세요" 알림 후 종료
3. 도메인 지정 시: 해당 도메인 파일만 필터링
   - 예: /prd-process community-profile
   - 매칭: [NEW] db-community-profile.md, [UPDATE] api-community-profile.md 등
```

### 2. 파일별 분석

```
- 파일명 접두어([NEW], [UPDATE], [DELETE])에 따른 작업 유형 분류
- 스펙 유형(api, db, ui) 및 Phase(P1, P2) 추론
- 타겟 경로(specs/...) 결정
```

### 3. 분석 결과 보고 (사용자 승인)

```
📋 처리 대상 ({domain} 도메인)

| 원본 파일 | 작업 | 대상 위치 | 비고 |
|----------|------|----------|------|
| [NEW] db-community-profile.md | 생성 | specs/db/community/ | 3개 테이블 |

사용자 승인 후 진행
```

### 4. 파일 처리 (Processing)

> **Note**: 이 단계에서는 파일 생성/수정/삭제만 수행하며, `related` 연결은 다음 단계에서 일괄 처리합니다.

#### 4-A. 신규 ([NEW])
```
1. 프론트매터 생성 (related 필드는 빈 배열 []로 초기화)
2. 본문 정리 및 파일 생성
3. 하위 도메인이 포함된 경우 (예: db-community-profile.md):
   - 해당 하위 디렉토리 자동 생성 (예: specs/db/community/)
   - 파일을 하위 디렉토리에 저장
```

#### 하위 디렉토리 생성 규칙
```
파일명 패턴: [NEW] {type}-{domain}-{subdomain}.md
  ↓ 변환
경로: specs/{type}/{domain}/{table-name}.md

예시:
- [NEW] db-community-profile.md의 community_profiles
  → specs/db/community/community-profiles.md
- [UPDATE] db-community-article.md의 community_articles
  → specs/db/community/community-articles.md (기존 posts.md 대체 또는 업데이트)
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
   - **[삭제/정리]** 삭제된 파일이나 더 이상 유효하지 않은 참조 제거

3. 검증:
   - 모든 `related` 경로의 유효성 체크

### 6. INDEX.md 업데이트
```
- specs/INDEX.md의 spec_count 업데이트
- 목록 테이블 업데이트
```

### 7. Staging 파일 이동 (도메인별)

> **핵심**: 처리된 staging 파일만 _processed로 이동

**Windows (PowerShell):**

```powershell
# Step 1: 아카이브 폴더 구조 확인/생성
$datetime = Get-Date -Format "yyyy-MM-dd_HHmm"
$archivePath = "Docs/AI_PRD/_processed/$datetime"
$stagingArchive = "$archivePath/staging"

# staging 폴더가 아직 없으면 생성
if (-not (Test-Path $stagingArchive)) {
    New-Item -ItemType Directory -Force -Path $stagingArchive
}
```

```powershell
# Step 2: 처리된 staging 파일만 이동 (도메인별)
# 예: community-profile 도메인 처리 후
Move-Item "Docs/AI_PRD/_staging/*community-profile*" -Destination $stagingArchive -Force
```

### 8. Staging 완료 확인 및 Inbox 이동

```powershell
# Step 3: staging이 비었는지 확인 (README.md 제외)
$remaining = Get-ChildItem "Docs/AI_PRD/_staging/" -Exclude "README.md"

if ($remaining.Count -eq 0) {
    # staging이 비었으면 inbox 파일들도 이동
    Write-Host "✅ 모든 staging 처리 완료. inbox 파일 이동 중..."
    
    # inbox 파일들을 아카이브 루트로 이동
    Get-ChildItem "Docs/AI_PRD/_inbox/" -Exclude "README.md" | Move-Item -Destination $archivePath -Force
    
    # staging 폴더 내용물을 아카이브 루트로 병합 (선택적)
    # Get-ChildItem $stagingArchive | Move-Item -Destination $archivePath -Force
    # Remove-Item $stagingArchive -Force
    
    Write-Host "✅ 처리 완료! 아카이브 위치: $archivePath"
} else {
    Write-Host "⏳ 남은 staging 파일: $($remaining.Count)개"
    Write-Host "다음 도메인을 처리하세요: /prd-process {domain}"
}
```

### 9. 수정 내역 저장 (CHANGELOG)

> **Note**: 모든 staging이 처리되고 inbox가 이동될 때 최종 생성

아카이브 폴더에 `CHANGELOG.md` 생성:

```markdown
# 처리 내역 - {datetime}

## 원본 파일
- sk_p2.dbml

## 처리된 도메인
| 도메인 | staging 파일 | 생성/수정된 스펙 |
|--------|-------------|----------------|
| community-profile | [NEW] db-community-profile.md | 3개 |
| community-article | [UPDATE] db-community-article.md | 4개 |
...

## 생성된 스펙 (합계)
| 파일 | 테이블 | 작업 |
|------|--------|------|
| specs/db/community/community-profiles.md | community_profiles | NEW |
...

## 업데이트된 스펙
| 파일 | 변경 내용 |
|------|----------|
| specs/db/community/posts.md | community_articles로 대체 |
...

## 처리 시각
- 시작: {시작시간}
- 완료: {완료시간}
```

### 10. 완료 보고

#### 도메인 처리 완료 시
```
✅ {domain} 도메인 처리 완료

처리된 파일: [NEW] db-community-profile.md
생성된 스펙: specs/db/community/community-profiles.md 외 2개
이동: _processed/{datetime}/staging/

남은 staging 파일: N개
다음: /prd-process {다음 도메인}
```

#### 전체 완료 시 (staging 모두 비움)
```
🎉 전체 처리 완료!

처리된 도메인: 8개
생성/수정된 스펙: 22개
아카이브 위치: _processed/{datetime}/
CHANGELOG: _processed/{datetime}/CHANGELOG.md

다음 작업:
- /prd-sync-tasks (태스크 동기화)
- /prd-validate (검증)
```

---

## 전체 처리 시 (/prd-process without domain)

도메인 없이 실행하면 모든 staging 파일을 순차 처리:

```
1. staging 파일 목록 수집
2. 도메인별로 그룹핑
3. 각 도메인 순차 처리
4. 완료 후 inbox 이동
5. CHANGELOG 생성
```

---

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

---

## 주의사항

- **도메인별 처리 권장**: 대량의 staging 파일을 한 번에 처리하면 정확도 저하
- **순차 실행 필수**: 명령어들을 병렬 실행하지 말 것
- **아카이브 구조**: staging이 완료되기 전까지는 `_processed/{datetime}/staging/`에 보관
