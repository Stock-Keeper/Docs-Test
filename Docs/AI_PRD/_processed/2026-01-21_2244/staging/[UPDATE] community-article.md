# Community-Article 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-community.md` (community-article 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| articles.md | UPDATE | specs/db/community/articles.md | 경로 표기 수정 |
| comments.md | UPDATE | specs/db/community/comments.md | 경로 표기 수정 |
| likes.md | UPDATE | specs/db/community/likes.md | 경로 표기 수정 |
| bookmarks.md | - | specs/db/community/bookmarks.md | API 누락 확인 필요 |
| article-images.md | - | specs/db/community/article-images.md | 검증 통과 |
| article-categories.md | - | specs/db/community/article-categories.md | Task 미참조 (고아) |
| reply-likes.md | - | specs/db/community/reply-likes.md | Task 미참조 (고아) |

## AI 분석 결과

- **추론 유형**: db (수정 위주)
- **추론 Phase**: P2
- **비교한 기존 스펙 파일**: 7개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. articles.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../api/community/post-create.md
    - ../api/community/feed-list.md
  db:
    - community/comments.md
    - community/article-images.md
    - community/article-categories.md
    - community/bookmarks.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/post-create.md
    - specs/api/community/feed-list.md
  db:
    - specs/db/community/comments.md
    - specs/db/community/article-images.md
    - specs/db/community/article-categories.md
    - specs/db/community/bookmarks.md
```

### 2. comments.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../api/community/comment-create.md
    - ../api/community/reply-create.md
  db:
    - community/articles.md
    - community/reply-likes.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/comment-create.md
    - specs/api/community/reply-create.md
  db:
    - specs/db/community/articles.md
    - specs/db/community/reply-likes.md
```

### 3. likes.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../api/community/like.md
  db:
    - community/articles.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/like.md
  db:
    - specs/db/community/articles.md
```

---

## API Dead Link 수정 (관련 항목)

`posts.md` 참조를 `articles.md`로 일괄 변경 (원본에서 선택됨)

| API 파일 | 현재 참조 | 수정 후 |
|----------|----------|--------|
| feed-list.md | `../../db/posts.md` | `../../db/community/articles.md` |
| post-create.md | `../../db/posts.md` | `../../db/community/articles.md` |
| comment-create.md | `../../db/comments.md` | `../../db/community/comments.md` |
| reply-create.md | `../../db/comments.md` | `../../db/community/comments.md` |
| like.md | `../../db/likes.md` | `../../db/community/likes.md` |

---

## 누락 API 확인

| DB 스펙 | 테이블 | 현재 API | 상태 |
|---------|-------|---------|------|
| bookmarks.md | community_bookmarks | `related.api: []` | ⚠️ API 필요 |

> [!NOTE]
> 북마크 기능에 대한 API 스펙 생성이 필요할 수 있습니다.
>
> - `POST /api/community/bookmarks` - 북마크 추가
> - `DELETE /api/community/bookmarks/{id}` - 북마크 제거
> - `GET /api/community/bookmarks` - 내 북마크 목록

---

## 고아 스펙 (Task 미참조)

| 스펙 파일 | Phase | 권장 |
|----------|-------|------|
| article-categories.md | P2 | Task 추가 필요 |
| reply-likes.md | P2 | Task 추가 필요 |

---

## 검증 통과 항목

- ✅ Phase 일관성: 모든 article 관련 스펙이 P2
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (상대경로 → specs/ 절대경로)
   - posts.md → articles.md 참조 변경
   - API Dead Link 수정

2. 추가 작업 (선택):
   - 북마크 API 스펙 생성
   - 고아 스펙 Task 할당
