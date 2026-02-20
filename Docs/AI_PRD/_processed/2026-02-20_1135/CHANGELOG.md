# CHANGELOG - 2026-02-20_1135

> 📅 처리 완료: 2026-02-20
> 📥 원본: `_inbox/[VALIDATE] all-2026-02-20.md`

---

## 변경 요약

| 작업   | 파일             | 대상 위치                            |
| ------ | ---------------- | ------------------------------------ |
| UPDATE | `users.md`       | `specs/db/auth/users.md`             |
| UPDATE | `feed-list.md`   | `specs/api/community/feed-list.md`   |
| UPDATE | `like.md`        | `specs/api/community/like.md`        |
| UPDATE | `post-create.md` | `specs/api/community/post-create.md` |
| UPDATE | `comments.md`    | `specs/db/community/comments.md`     |
| UPDATE | `post-likes.md`  | `specs/db/community/post-likes.md`   |
| UPDATE | `posts.md`       | `specs/db/community/posts.md`        |

## 상세 내역

### [UPDATE] specs/db/auth/users.md

- `related.api`: `google-callback.md` → `auth-google.md`

### [UPDATE] specs/api/community/feed-list.md

- `related.db`: `articles.md` → `posts.md`

### [UPDATE] specs/api/community/like.md

- `related.db`: `likes.md` → `post-likes.md`

### [UPDATE] specs/api/community/post-create.md

- `related.db`: `articles.md` → `posts.md`

### [UPDATE] specs/db/community/comments.md

- `related.db`: `articles.md` → `posts.md`
- `related.db`: `reply-likes.md` → `comment-likes.md`

### [UPDATE] specs/db/community/post-likes.md

- `related.db`: `articles.md` → `posts.md`

### [UPDATE] specs/db/community/posts.md

- `related.db`: `article-images.md` → `post-images.md`
- `related.db`: `article-categories.md` → `post-categories.md`

## INDEX.md 갱신

> 변경 없음 (파일 추가/삭제 없이 참조만 수정)
