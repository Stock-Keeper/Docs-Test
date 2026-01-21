# Community-Feed 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-community.md` (community-feed 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| feed-list.md | UPDATE | specs/api/community/feed-list.md | 경로 수정 + Dead Link |
| feed.md | UPDATE | specs/ui/community/feed.md | 경로 수정 |
| search.md (api) | - | specs/api/community/search.md | ✅ 검증 통과 |
| search.md (ui) | - | specs/ui/community/search.md | ✅ 검증 통과 |

## AI 분석 결과

- **추론 유형**: api/ui
- **추론 Phase**: P2
- **비교한 기존 스펙 파일**: 4개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. feed-list.md 경로 + Dead Link 수정

**현재:**

```yaml
related:
  db:
    - ../../db/posts.md
    - ../../db/portfolios.md
  ui:
    - ../../ui/community/feed.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/community/articles.md
    - specs/db/portfolio/portfolios.md
  ui:
    - specs/ui/community/feed.md
```

> [!NOTE]
>
> - `posts.md` → `articles.md` (파일명 변경 반영)
> - `portfolios.md`는 portfolio 도메인에 위치 (크로스 도메인 참조)

### 2. feed.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/community/feed-list.md
  ui:
    - search.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/feed-list.md
  ui:
    - specs/ui/community/search.md
```

### 3. 구현 로직 내 테이블명 수정 (feed-list.md)

**현재 (L101):**

```
3. posts와 portfolios(is_public=true) 테이블 UNION 조회
```

**수정 후:**

```
3. community_articles와 portfolios(is_public=true) 테이블 UNION 조회
```

### 4. 관련 스펙 섹션 수정 (feed-list.md)

**현재 (L112-115):**

```markdown
## 관련 스펙
- DB: `../db/posts.md`
- DB: `../db/portfolios.md`
- UI: `../ui/community/feed.md`
```

**수정 후:**

```markdown
## 관련 스펙
- DB: `specs/db/community/articles.md`
- DB: `specs/db/portfolio/portfolios.md`
- UI: `specs/ui/community/feed.md`
```

---

## 크로스 도메인 참조 확인

| 참조 | 도메인 | 파일 존재 |
|------|--------|----------|
| portfolios.md | portfolio | ⚠️ 확인 필요 |

> [!WARNING]
> `specs/db/portfolio/portfolios.md` 파일 존재 여부를 확인해야 합니다.
> 없다면 portfolio 도메인 스펙 생성이 필요합니다.

---

## 검증 통과 항목

- ✅ search.md (api): Phase P2 일관, 경로 올바름
- ✅ search.md (ui): Phase P2 일관, 경로 올바름
- ✅ 파일 네이밍: kebab-case 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (상대경로 → specs/ 절대경로)
   - `posts.md` → `articles.md` 참조 변경
   - 테이블명 `posts` → `community_articles` 수정

2. 확인 필요:
   - `specs/db/portfolio/portfolios.md` 파일 존재 여부
