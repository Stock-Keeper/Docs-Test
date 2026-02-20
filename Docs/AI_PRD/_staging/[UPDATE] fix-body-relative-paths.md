---
type: multi
phase: all
category: all
related: {}
---

# [UPDATE] fix-body-relative-paths

## 1. 원본 출처

- `_inbox/[VALIDATE] all-2026-02-20-2.md` (전수 검사 결과)

## 2. 작업 요약

- **[UPDATE]** 본문 내 상대경로 Dead Link 수정 (약 35건)
- DB → API 참조 시 `../api/` → `../../api/` 계층 수정
- UI → API 참조 시 `../api/` → `../../api/` 계층 수정
- `ui/auth/login-screen.md`의 `google-callback.md` → `auth-google.md` 수정

## 3. AI 분석 결과

- `specs/db/{domain}/파일.md`에서 `../api/{domain}/파일.md` 형식은 **잘못된 경로**
    - `db/{domain}/` 기준으로 `../`는 `db/`를 가리킴 → `db/api/{domain}/`가 됨
    - 올바른 경로: `../../api/{domain}/파일.md`
- 동일한 패턴이 UI → API 참조에도 적용
- 총 45건 중 유효한 수정 대상은 ~35건 (나머지는 실제 미존재 API)

## 4. 변경 명세

### 패턴 A: DB → API 상대경로 (`../api/` → `../../api/`)

| 파일                               | 현재 (잘못된 경로)                  | 수정 후                                |
| ---------------------------------- | ----------------------------------- | -------------------------------------- |
| `db/admin/audit-logs.md`           | `../api/admin/monitoring-errors.md` | `../../api/admin/monitoring-errors.md` |
| `db/admin/error-logs.md`           | `../api/admin/monitoring-errors.md` | `../../api/admin/monitoring-errors.md` |
| `db/auth/settings.md`              | `../api/auth/settings.md`           | `../../api/auth/settings.md`           |
| `db/auth/settings.md`              | `../api/notification/settings.md`   | `../../api/notification/settings.md`   |
| `db/auth/user-consents.md`         | `../api/auth/consents-get.md`       | `../../api/auth/consents-get.md`       |
| `db/auth/user-consents.md`         | `../api/auth/consents-update.md`    | `../../api/auth/consents-update.md`    |
| `db/community/follows.md`          | `../api/community/follow.md`        | `../../api/community/follow.md`        |
| `db/community/post-categories.md`  | `../api/community/post-create.md`   | `../../api/community/post-create.md`   |
| `db/community/post-images.md`      | `../api/community/post-create.md`   | `../../api/community/post-create.md`   |
| `db/community/post-likes.md`       | `../api/community/like.md`          | `../../api/community/like.md`          |
| `db/community/rankings.md`         | `../api/community/ranking.md`       | `../../api/community/ranking.md`       |
| `db/community/search-histories.md` | `../api/community/search.md`        | `../../api/community/search.md`        |
| `db/notification/device-tokens.md` | `../api/notification/fcm-token.md`  | `../../api/notification/fcm-token.md`  |
| `db/notification/notifications.md` | `../api/notification/list.md`       | `../../api/notification/list.md`       |
| `db/notification/notifications.md` | `../api/notification/read.md`       | `../../api/notification/read.md`       |

### 패턴 B: UI → API 상대경로 (`../api/` → `../../api/`)

| 파일                          | 현재 (잘못된 경로)                | 수정 후                              |
| ----------------------------- | --------------------------------- | ------------------------------------ |
| `ui/admin/dashboard.md`       | `../api/admin/stats-overview.md`  | `../../api/admin/stats-overview.md`  |
| `ui/admin/users-list.md`      | `../api/admin/users-list.md`      | `../../api/admin/users-list.md`      |
| `ui/auth/profile-input.md`    | `../api/auth/profile-update.md`   | `../../api/auth/profile-update.md`   |
| `ui/community/search.md`      | `../api/community/search.md`      | `../../api/community/search.md`      |
| `ui/notification/center.md`   | `../api/notification/list.md`     | `../../api/notification/list.md`     |
| `ui/notification/center.md`   | `../api/notification/read.md`     | `../../api/notification/read.md`     |
| `ui/notification/settings.md` | `../api/notification/settings.md` | `../../api/notification/settings.md` |

### 패턴 C: 파일명 변경 반영

| 파일                      | 현재                             | 수정 후                         |
| ------------------------- | -------------------------------- | ------------------------------- |
| `ui/auth/login-screen.md` | `../api/auth/google-callback.md` | `../../api/auth/auth-google.md` |

### 제외 — 실제 미존재 API (수정 불가, 향후 생성 필요)

| 파일                            | 참조                                        | 비고                  |
| ------------------------------- | ------------------------------------------- | --------------------- |
| `db/auth/settings.md`           | `api/auth/settings.md`                      | 설정 API 미정의       |
| `db/community/bookmarks.md`     | `api/community/bookmarks.md`                | 북마크 API 미정의     |
| `db/community/comment-likes.md` | `api/community/comment-like.md`             | 댓글좋아요 API 미정의 |
| `db/community/profiles.md`      | `api/community/profile.md`                  | 프로필 API 미정의     |
| `db/community/reports.md`       | `api/community/report.md`                   | 신고 API 미정의       |
| `ui/auth/login-screen.md`       | `../../reference/pages/01_login.md`         | 참조 페이지 미존재    |
| `ui/stock/detail.md`            | `../../api/portfolio/update-delete-item.md` | API 미정의            |
