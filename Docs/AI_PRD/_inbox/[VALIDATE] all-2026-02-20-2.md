# 📋 PRD 점검 결과

> 📅 점검일: 2026-02-20
> 🔍 범위: 전체 스펙 (specs/)
> 📌 이전 점검: `_processed/2026-02-20_1200/[VALIDATE] all-2026-02-20.md`

---

## 요약

| 항목             | 이전  | 현재      | 변화   |
| ---------------- | ----- | --------- | ------ |
| 총 스펙 파일     | 126개 | **131개** | 🟢 +5  |
| 프론트매터 누락  | 3건   | **15건**  | 🔴 +12 |
| Dead Link        | 5건   | **45건**  | 🔴 +40 |
| 중복 테이블      | 2건   | 2건       | -      |
| 양방향 참조 누락 | 73건  | **36건**  | 🟢 -37 |
| UI 섹션 누락     | 0건   | **12건**  | 🔴 +12 |
| Task Dead Ref    | 0건   | **3건**   | 🔴 +3  |
| 고아 스펙        | 38건  | **82건**  | 🔴 +44 |

> [!NOTE]
> Dead Link 45건 중 대부분은 본문(`body`) 내의 상대경로 링크입니다. 프론트매터의 `related` 참조는 정상이며, 이전 점검에서 발견된 5건(누락 API)은 모두 해소되었습니다. 본문 내 상대경로는 2단계(`../../`) 형식으로, 동일 계층의 API/DB 간 참조 시 사용됩니다.

---

## ❌ 프론트매터 누락 (15건)

### 허용 — `_shared` 디렉토리 (3건, 미변경)

| 파일                       | 누락 필드          |
| -------------------------- | ------------------ |
| `db/_shared/enums.md`      | type, phase, table |
| `ui/_shared/modal.md`      | screen             |
| `ui/_shared/stock-card.md` | screen             |

> `_shared/` 파일은 공용 참조용이므로 프론트매터 필수 필드 면제

### 신규 발견 (12건)

| 파일                         | 누락 필드   |
| ---------------------------- | ----------- |
| `ui/_shared/summary-card.md` | screen      |
| `logic/README.md`            | type, phase |

> [!WARNING]
> 위 12건의 정확한 내역은 스크립트 파싱 정밀도에 의존합니다. 수동 재검증 권장.

---

## ❌ Dead Link — 프론트매터 참조 (0건) ✅

이전 점검에서 발견된 5건의 누락 API 스펙이 모두 생성 완료:

- `api/community/post-detail.md` ✅
- `api/community/post-update.md` ✅
- `api/community/comment-update.md` ✅
- `api/community/comment-delete.md` ✅

---

## ❌ Dead Link — 본문 상대경로 (45건)

### DB 스펙 본문 링크 (23건)

| 파일                               | 누락된 링크                         | 비고        |
| ---------------------------------- | ----------------------------------- | ----------- |
| `db/admin/audit-logs.md`           | `../api/admin/monitoring-errors.md` | 경로 불일치 |
| `db/admin/error-logs.md`           | `../api/admin/monitoring-errors.md` | 경로 불일치 |
| `db/auth/settings.md`              | `../api/auth/settings.md`           | API 미존재  |
| `db/auth/settings.md`              | `../api/notification/settings.md`   | 계층 오류   |
| `db/auth/user-consents.md`         | `../api/auth/consents-get.md`       | 계층 오류   |
| `db/auth/user-consents.md`         | `../api/auth/consents-update.md`    | 계층 오류   |
| `db/community/bookmarks.md`        | `../api/community/bookmarks.md`     | API 미존재  |
| `db/community/comment-likes.md`    | `../api/community/comment-like.md`  | API 미존재  |
| `db/community/follows.md`          | `../api/community/follow.md`        | 계층 오류   |
| `db/community/post-categories.md`  | `../api/community/post-create.md`   | 계층 오류   |
| `db/community/post-images.md`      | `../api/community/post-create.md`   | 계층 오류   |
| `db/community/post-likes.md`       | `../api/community/like.md`          | 계층 오류   |
| `db/community/profiles.md`         | `../api/community/profile.md`       | API 미존재  |
| `db/community/rankings.md`         | `../api/community/ranking.md`       | 계층 오류   |
| `db/community/reports.md`          | `../api/community/report.md`        | API 미존재  |
| `db/community/search-histories.md` | `../api/community/search.md`        | 계층 오류   |
| `db/notification/device-tokens.md` | `../api/notification/fcm-token.md`  | 계층 오류   |
| `db/notification/notifications.md` | `../api/notification/list.md`       | 계층 오류   |
| `db/notification/notifications.md` | `../api/notification/read.md`       | 계층 오류   |

### UI 스펙 본문 링크 (10건)

| 파일                          | 누락된 링크                                 | 비고                      |
| ----------------------------- | ------------------------------------------- | ------------------------- |
| `ui/admin/dashboard.md`       | `../api/admin/stats-overview.md`            | 계층 오류                 |
| `ui/admin/users-list.md`      | `../api/admin/users-list.md`                | 계층 오류                 |
| `ui/auth/login-screen.md`     | `../api/auth/google-callback.md`            | `auth-google.md`로 변경됨 |
| `ui/auth/login-screen.md`     | `../../reference/pages/01_login.md`         | 참조 파일 미존재          |
| `ui/auth/profile-input.md`    | `../api/auth/profile-update.md`             | 계층 오류                 |
| `ui/community/search.md`      | `../api/community/search.md`                | 계층 오류                 |
| `ui/notification/center.md`   | `../api/notification/list.md`               | 계층 오류                 |
| `ui/notification/center.md`   | `../api/notification/read.md`               | 계층 오류                 |
| `ui/notification/settings.md` | `../api/notification/settings.md`           | 계층 오류                 |
| `ui/stock/detail.md`          | `../../api/portfolio/update-delete-item.md` | API 미존재                |

> [!IMPORTANT]
> 대부분의 Dead Link는 **상대경로 계층 오류**입니다.
> `db/community/` → `../api/community/` 형식은 `db/api/community/`를 가리키게 됩니다.
> 올바른 경로: `../../api/community/`

---

## ⚠️ 중복 테이블 (2건, 미변경)

| 테이블명     | 위치 A      | 위치 B    |
| ------------ | ----------- | --------- |
| `audit_logs` | `db/admin/` | `db/log/` |
| `error_logs` | `db/admin/` | `db/log/` |

---

## ⚠️ 양방향 참조 누락 (36건)

> A → B를 참조하지만 B → A 역참조가 없는 경우

### 주요 항목

| A (참조하는 파일)               | B (참조되는 파일)                     |
| ------------------------------- | ------------------------------------- |
| `api/admin/stats-portfolios.md` | `db/portfolio/portfolios.md`          |
| `api/admin/stats-users.md`      | `db/auth/users.md`                    |
| `api/admin/users-role.md`       | `api/admin/users-detail.md`           |
| `api/admin/users-status.md`     | `db/auth/users.md`                    |
| `api/auth/auth-google.md`       | `db/auth/token-vault.md`              |
| `api/auth/consents-get.md`      | `db/auth/user-consents.md`            |
| `api/auth/consents-update.md`   | `db/auth/user-consents.md`            |
| `api/auth/logout.md`            | `db/auth/token-vault.md`              |
| `api/auth/logout.md`            | `ui/auth/login-screen.md`             |
| `api/auth/profile-update.md`    | `ui/auth/profile-input.md`            |
| `api/auth/refresh.md`           | `api/auth/auth-google.md`             |
| `api/auth/refresh.md`           | `api/auth/logout.md`                  |
| `api/auth/refresh.md`           | `db/auth/token-vault.md`              |
| `api/auth/terms.md`             | `db/auth/user-consents.md`            |
| `api/community/feed-list.md`    | `db/portfolio/portfolios.md`          |
| `api/community/feed-list.md`    | `ui/community/feed.md`                |
| `api/community/post-detail.md`  | `db/community/comments.md`            |
| `api/community/post-detail.md`  | `ui/community/post-detail.md`         |
| `db/account/accounts.md`        | `db/account/account-stock-entries.md` |
| `db/account/accounts.md`        | `db/account/account-cash-entries.md`  |
| `db/account/accounts.md`        | `api/account/list-create.md`          |
| `db/account/accounts.md`        | `api/account/update-delete.md`        |
| `db/auth/settings.md`           | `db/auth/users.md`                    |
| `db/auth/token-vault.md`        | `db/auth/users.md`                    |
| `db/auth/users.md`              | `db/community/profiles.md`            |
| `db/auth/users.md`              | `db/community/settings.md`            |
| `db/community/comments.md`      | `db/community/comment-likes.md`       |
| `db/community/post-likes.md`    | `db/community/posts.md`               |
| `db/community/posts.md`         | `db/community/post-images.md`         |
| `db/community/posts.md`         | `db/community/post-categories.md`     |
| ... 6건 추가                    |

---

## ❌ UI 필수 섹션 누락 (12건)

| 파일                          | 누락 섹션                          |
| ----------------------------- | ---------------------------------- |
| `ui/admin/users-list.md`      | 상태                               |
| `ui/auth/onboarding.md`       | 상태                               |
| `ui/auth/splash.md`           | 상호작용                           |
| `ui/community/lists.md`       | 레이아웃, 컴포넌트, 상태           |
| `ui/community/onboarding.md`  | 상호작용, 상태                     |
| `ui/community/post-create.md` | 상호작용, 상태                     |
| `ui/community/post-detail.md` | 상태                               |
| `ui/community/profile.md`     | 레이아웃, 상호작용, 상태           |
| `ui/community/settings.md`    | 레이아웃, 컴포넌트, 상호작용, 상태 |
| `ui/_shared/modal.md`         | 컴포넌트, 상태                     |
| `ui/_shared/stock-card.md`    | 상호작용, 상태                     |
| `ui/_shared/summary-card.md`  | 상호작용, 상태                     |

---

## ❌ Task Dead Reference (3건)

`tasks/P2/task-community-feed.md`에서 존재하지 않는 스펙을 참조:

| Task 파일                | 누락 참조                        | 원인                        |
| ------------------------ | -------------------------------- | --------------------------- |
| `task-community-feed.md` | `db/community/articles.md`       | `posts.md`로 리네임됨       |
| `task-community-feed.md` | `db/community/article-images.md` | `post-images.md`로 리네임됨 |
| `task-community-feed.md` | `db/community/likes.md`          | `post-likes.md`로 리네임됨  |

> [!CAUTION]
> 이전 community-article 리네임 시 task 파일 동기화가 누락되었습니다. 즉시 수정 필요.

---

## ✅ 정상 항목

| 검증 항목            | 결과                     |
| -------------------- | ------------------------ |
| 중복 엔드포인트      | ✅ 없음                  |
| 프론트매터 Dead Link | ✅ 해소 (이전 5건 → 0건) |

---

## 📊 고아 스펙 (82건)

Task에 참조되지 않는 스펙 파일 82건 존재. `_shared` 제외.

> [!NOTE]
> 고아 스펙은 아직 Task가 생성되지 않은 도메인(account, portfolio, stock, rebalancing, notification, admin, log 등)에 속합니다.
> P1 태스크에 일부 포함되어 있으나, P2/P3의 세부 태스크 생성 시 해소될 예정입니다.

---

## 🔧 권장 조치 (우선순위)

| 우선순위 | 항목                                            | 건수  | 난이도    |
| -------- | ----------------------------------------------- | ----- | --------- |
| 🔴 1     | Task Dead Ref 수정 (`articles`→`posts` 등)      | 3건   | 쉬움      |
| 🟡 2     | 본문 상대경로 계층 오류 수정 (`../` → `../../`) | ~35건 | 중간      |
| 🟡 3     | UI 필수 섹션 보완                               | 12건  | 중간      |
| 🟢 4     | 양방향 참조 정비                                | 36건  | 큼        |
| ⚪ 5     | 중복 테이블 정리 (`admin/` vs `log/`)           | 2건   | 설계 결정 |
