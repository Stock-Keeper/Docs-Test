# 📋 PRD 점검 결과

> 📅 점검일: 2026-02-20
> 🔍 범위: 전체 스펙 (specs/)

---

## 요약

| 항목         | 수량  |
| ------------ | ----- |
| 총 스펙 파일 | 126개 |
| 문제 발견    | 19건  |
| 경고 (참고)  | 74건  |

| 유형 | 파일 수 |
| ---- | ------- |
| DB   | 42      |
| API  | 53      |
| UI   | 31      |

---

## ⚠️ 잠재적 중복 (2건)

동일한 테이블명이 서로 다른 도메인 폴더에 존재합니다.

| 테이블명     | 파일 A                   | 파일 B                 | 권장 조치                           |
| ------------ | ------------------------ | ---------------------- | ----------------------------------- |
| `audit_logs` | `db/admin/audit-logs.md` | `db/log/audit-logs.md` | `admin/` 쪽 제거 또는 `log/`로 통합 |
| `error_logs` | `db/admin/error-logs.md` | `db/log/error-logs.md` | `admin/` 쪽 제거 또는 `log/`로 통합 |

- [ ] 통합 (db/admin/ 쪽 제거, db/log/ 유지)
- [ ] 유지 (의도적 분리 — admin은 관리자 뷰, log는 시스템 뷰)
- [ ] 기타: ******\_\_\_\_******

---

## ❌ Dead Link (14건)

스펙 파일의 `related` 필드가 존재하지 않는 파일을 가리킵니다.

### 잘못된 파일명 (파일명 변경 후 미갱신) — 9건

| 출처 파일                      | 잘못된 참조                                | 올바른 경로 (추정)                      |
| ------------------------------ | ------------------------------------------ | --------------------------------------- |
| `api/community/feed-list.md`   | `specs/db/community/articles.md`           | `specs/db/community/posts.md`           |
| `api/community/like.md`        | `specs/db/community/likes.md`              | `specs/db/community/post-likes.md`      |
| `api/community/post-create.md` | `specs/db/community/articles.md`           | `specs/db/community/posts.md`           |
| `db/auth/users.md`             | `specs/api/auth/google-callback.md`        | `specs/api/auth/auth-google.md`         |
| `db/community/comments.md`     | `specs/db/community/articles.md`           | `specs/db/community/posts.md`           |
| `db/community/comments.md`     | `specs/db/community/reply-likes.md`        | `specs/db/community/comment-likes.md`   |
| `db/community/post-likes.md`   | `specs/db/community/articles.md`           | `specs/db/community/posts.md`           |
| `db/community/posts.md`        | `specs/db/community/article-images.md`     | `specs/db/community/post-images.md`     |
| `db/community/posts.md`        | `specs/db/community/article-categories.md` | `specs/db/community/post-categories.md` |

### 누락된 API 스펙 — 5건

| 출처 파일                         | 누락된 파일                             | 필요 여부         |
| --------------------------------- | --------------------------------------- | ----------------- |
| `api/community/comment-create.md` | `specs/api/community/comment-update.md` | 💡 신규 생성 검토 |
| `api/community/comment-create.md` | `specs/api/community/comment-delete.md` | 💡 신규 생성 검토 |
| `api/community/post-create.md`    | `specs/api/community/post-detail.md`    | 💡 신규 생성 검토 |
| `api/community/post-create.md`    | `specs/api/community/post-update.md`    | 💡 신규 생성 검토 |
| `ui/community/post-detail.md`     | `specs/api/community/post-detail.md`    | 💡 신규 생성 검토 |

> [!IMPORTANT]
> 커뮤니티 게시글/댓글의 **수정(update), 삭제(delete), 상세(detail)** API 스펙이 존재하지 않습니다.
> 작성(create) API만 있고 CRUD가 불완전합니다.

---

## 🔗 양방향 참조 누락 (74건, 참고)

A→B 참조는 있으나 B→A 역참조가 없는 경우입니다. 기능에는 영향 없으나 문서 네비게이션 시 불편할 수 있습니다.

> 주요 패턴: API가 DB를 참조하지만, DB의 related에 해당 API가 없는 경우가 대부분입니다.
> 예: `api/auth/auth-google.md` → `db/auth/users.md` (O), `db/auth/users.md` → `api/auth/auth-google.md` (X — `google-callback.md`로 잘못 기재됨)

---

## 📝 프론트매터 누락 (3건)

| 파일                         | 누락 필드 | 비고                 |
| ---------------------------- | --------- | -------------------- |
| `ui/_shared/modal.md`        | screen    | 공유 컴포넌트 (허용) |
| `ui/_shared/stock-card.md`   | screen    | 공유 컴포넌트 (허용) |
| `ui/_shared/summary-card.md` | screen    | 공유 컴포넌트 (허용) |

> ✅ `_shared/` 폴더의 공유 컴포넌트이므로 `screen` 필드 생략은 정상입니다.

---

## ✅ 정상 항목

| 검증 항목                                           | 결과                                           |
| --------------------------------------------------- | ---------------------------------------------- |
| UI 필수 섹션 (개요/레이아웃/컴포넌트/상호작용/상태) | ✅ 모든 UI 파일 통과                           |
| DB 테이블 → API 연결                                | ✅ 모든 DB 파일 API 참조 있음 (로그/토큰 제외) |
| Task 프론트매터 유효성                              | ✅ 모든 task 파일 정상                         |
| Task Phase ↔ 폴더 일치                              | ✅ 모든 task 파일 정상                         |

---

## 📂 고아 스펙 — Task에 미할당 (38건, 참고)

아래 스펙은 `tasks/` 내 어떤 task 파일에도 참조되지 않습니다.

| 도메인         | 고아 스펙 수 | 비고                           |
| -------------- | ------------ | ------------------------------ |
| ads            | 2            | 신규 도메인 (task 미생성 상태) |
| community (DB) | 10+          | 커뮤니티 일부 DB/API 미할당    |
| account (API)  | 4            | 계좌 API 미할당                |
| admin (API)    | 2            | 관리자 API 일부 미할당         |

> [!TIP]
> `/prd-sync-tasks`로 최근 CHANGELOG 기반 task 동기화를 수행하면 일부 해소될 수 있습니다.

---

## 🔧 AI 자동 수정 가능 항목

아래 9건의 Dead Link는 파일명 변경 후 미갱신된 것으로, 자동 수정이 가능합니다.

| #   | 수정 대상 파일                  | 변경 내용                                                                              |
| --- | ------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | `api/community/feed-list.md`    | `articles.md` → `posts.md`                                                             |
| 2   | `api/community/like.md`         | `likes.md` → `post-likes.md`                                                           |
| 3   | `api/community/post-create.md`  | `articles.md` → `posts.md`                                                             |
| 4   | `db/auth/users.md`              | `google-callback.md` → `auth-google.md`                                                |
| 5   | `db/community/comments.md` (×2) | `articles.md` → `posts.md`, `reply-likes.md` → `comment-likes.md`                      |
| 6   | `db/community/post-likes.md`    | `articles.md` → `posts.md`                                                             |
| 7   | `db/community/posts.md` (×2)    | `article-images.md` → `post-images.md`, `article-categories.md` → `post-categories.md` |

- [ ] 자동 수정 실행
- [ ] 수동 검토 후 진행
- [ ] 무시
