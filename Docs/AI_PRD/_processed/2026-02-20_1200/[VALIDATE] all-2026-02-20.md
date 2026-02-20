# 📋 PRD 점검 결과 (2차)

> 📅 점검일: 2026-02-20
> 🔍 범위: 전체 스펙 (specs/)
> 📌 이전 점검: `_processed/2026-02-20_1135/[VALIDATE] all-2026-02-20.md`

---

## 요약

| 항목             | 이전  | 현재    | 변화  |
| ---------------- | ----- | ------- | ----- |
| 총 스펙 파일     | 126개 | 126개   | -     |
| Dead Link        | 14건  | **5건** | 🟢 -9 |
| 중복 테이블      | 2건   | 2건     | -     |
| 양방향 참조 누락 | 74건  | 73건    | 🟢 -1 |
| FM 누락 (허용)   | 3건   | 3건     | -     |
| UI 섹션 누락     | 0건   | 0건     | ✅    |
| Task 이슈        | 0건   | 0건     | ✅    |
| 고아 스펙        | 38건  | 38건    | -     |

---

## ✅ 수정 완료 (9건)

이전 점검에서 발견된 Dead Link 9건이 모두 수정되었습니다.

| 파일                           | 수정 내용                                                              |
| ------------------------------ | ---------------------------------------------------------------------- |
| `db/auth/users.md`             | `google-callback` → `auth-google`                                      |
| `api/community/feed-list.md`   | `articles` → `posts`                                                   |
| `api/community/like.md`        | `likes` → `post-likes`                                                 |
| `api/community/post-create.md` | `articles` → `posts`                                                   |
| `db/community/comments.md`     | `articles`→`posts`, `reply-likes`→`comment-likes`                      |
| `db/community/post-likes.md`   | `articles` → `posts`                                                   |
| `db/community/posts.md`        | `article-images`→`post-images`, `article-categories`→`post-categories` |

---

## ❌ 잔존 Dead Link (5건) — 누락 API 스펙

이 5건은 **아직 존재하지 않는 API 스펙**입니다. 파일 생성이 필요합니다.

| 참조하는 파일                     | 누락된 스펙                       | 필요 API    |
| --------------------------------- | --------------------------------- | ----------- |
| `api/community/comment-create.md` | `api/community/comment-update.md` | 댓글 수정   |
| `api/community/comment-create.md` | `api/community/comment-delete.md` | 댓글 삭제   |
| `api/community/post-create.md`    | `api/community/post-detail.md`    | 게시글 상세 |
| `api/community/post-create.md`    | `api/community/post-update.md`    | 게시글 수정 |
| `ui/community/post-detail.md`     | `api/community/post-detail.md`    | 게시글 상세 |

> [!IMPORTANT]
> 커뮤니티 CRUD가 불완전합니다. `post-detail`, `post-update`, `comment-update`, `comment-delete` 4개 API 스펙 생성을 검토하세요.

---

## ⚠️ 잠재적 중복 (2건, 미변경)

| 테이블명     | 위치 A      | 위치 B    |
| ------------ | ----------- | --------- |
| `audit_logs` | `db/admin/` | `db/log/` |
| `error_logs` | `db/admin/` | `db/log/` |

---

## ✅ 정상 항목

| 검증 항목    | 결과                     |
| ------------ | ------------------------ |
| UI 필수 섹션 | ✅ 통과                  |
| Task 유효성  | ✅ 통과                  |
| FM 필수 필드 | ✅ 통과 (`_shared` 제외) |
