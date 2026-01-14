# 스펙 인덱스

> 모든 API, DB, UI 스펙 문서의 목록입니다.

---

## API 스펙 (`specs/api/`)

### 인증 (Auth) - P1

| 파일 | 설명 |
|------|------|
| [auth-google.md](api/auth/auth-google.md) | Google OAuth 로그인 시작 |
| [google-callback.md](api/auth/google-callback.md) | Google OAuth 콜백 |
| [refresh.md](api/auth/refresh.md) | 토큰 갱신 |
| [logout.md](api/auth/logout.md) | 로그아웃 |
| [profile-update.md](api/auth/profile-update.md) | 프로필 수정 |

### 포트폴리오 (Portfolio) - P1

| 파일 | 설명 |
|------|------|
| [list.md](api/portfolio/list.md) | 포트폴리오 목록 조회 |
| [detail.md](api/portfolio/detail.md) | 포트폴리오 상세 조회 |
| [create.md](api/portfolio/create.md) | 포트폴리오 생성 |
| [update.md](api/portfolio/update.md) | 포트폴리오 수정 |
| [delete.md](api/portfolio/delete.md) | 포트폴리오 삭제 |
| [reorder.md](api/portfolio/reorder.md) | 포트폴리오 순서 변경 |

### 종목 (Stock) - P1

| 파일 | 설명 |
|------|------|
| [search.md](api/stock/search.md) | 종목 검색 |
| [add.md](api/stock/add.md) | 종목 추가 |
| [update-delete.md](api/stock/update-delete.md) | 종목 수정/삭제 |
| [price.md](api/stock/price.md) | 종목 현재가 조회 |

### 리밸런싱 (Rebalancing) - P1

| 파일 | 설명 |
|------|------|
| [calculate.md](api/rebalancing/calculate.md) | 리밸런싱 계산 |

### 알림 (Notification) - P1

| 파일 | 설명 |
|------|------|
| [list.md](api/notification/list.md) | 알림 목록 조회 |
| [read.md](api/notification/read.md) | 알림 읽음 처리 |
| [settings.md](api/notification/settings.md) | 알림 설정 |
| [fcm-token.md](api/notification/fcm-token.md) | FCM 토큰 등록 |

### 관리자 (Admin) - P1

| 파일 | 설명 |
|------|------|
| [stats-overview.md](api/admin/stats-overview.md) | 통계 개요 |
| [users-list.md](api/admin/users-list.md) | 사용자 목록 |
| [users-detail.md](api/admin/users-detail.md) | 사용자 상세 |
| [users-role.md](api/admin/users-role.md) | 사용자 역할 변경 |
| [users-status.md](api/admin/users-status.md) | 사용자 상태 변경 |
| [monitoring-errors.md](api/admin/monitoring-errors.md) | 에러 모니터링 |

### 커뮤니티 (Community) - P2/P3

| 파일 | 설명 | Phase |
|------|------|:-----:|
| [feed-list.md](api/community/feed-list.md) | 피드 목록 | P2 |
| [post-create.md](api/community/post-create.md) | 게시글 작성 | P2 |
| [comment-create.md](api/community/comment-create.md) | 댓글 작성 | P2 |
| [like.md](api/community/like.md) | 좋아요 | P2 |
| [search.md](api/community/search.md) | 검색 | P2 |
| [reply-create.md](api/community/reply-create.md) | 대댓글 작성 | P3 |
| [follow.md](api/community/follow.md) | 팔로우 | P3 |
| [ranking.md](api/community/ranking.md) | 랭킹 | P3 |
| [portfolio-copy.md](api/community/portfolio-copy.md) | 포트폴리오 복사 | P3 |

---

## DB 스펙 (`specs/db/`)

### P1 테이블

| 파일 | 테이블명 | 설명 |
|------|----------|------|
| [users.md](db/users.md) | `users` | 사용자 |
| [refresh-tokens.md](db/refresh-tokens.md) | `refresh_tokens` | 리프레시 토큰 |
| [portfolios.md](db/portfolios.md) | `portfolios`, `portfolio_items` | 포트폴리오 |
| [notifications.md](db/notifications.md) | `notifications` | 알림 |
| [notification-settings.md](db/notification-settings.md) | `notification_settings` | 알림 설정 |

### P2/P3 테이블

| 파일 | 테이블명 | 설명 | Phase |
|------|----------|------|:-----:|
| [posts.md](db/posts.md) | `posts` | 게시글 | P2 |
| [comments.md](db/comments.md) | `comments` | 댓글 | P2 |
| [likes.md](db/likes.md) | `post_likes` | 좋아요 | P2 |
| [follows.md](db/follows.md) | `follows` | 팔로우 | P3 |
| [rankings-badges.md](db/rankings-badges.md) | `rankings`, `badges` | 랭킹/배지 | P3 |
| [portfolio-copies.md](db/portfolio-copies.md) | `portfolio_copies` | 포트폴리오 복사 | P3 |

### 관리자/로그

| 파일 | 테이블명 | 설명 |
|------|----------|------|
| [admin-logs.md](db/admin-logs.md) | `admin_logs` | 관리자 활동 로그 |
| [api-call-logs.md](db/api-call-logs.md) | `api_call_logs` | API 호출 로그 |
| [error-logs.md](db/error-logs.md) | `error_logs` | 에러 로그 |

---

## UI 스펙 (`specs/ui/`)

### 인증

| 파일 | 화면 |
|------|------|
| [login-screen.md](ui/auth/login-screen.md) | 로그인 화면 |
| [profile-input.md](ui/auth/profile-input.md) | 프로필 입력 화면 |

### 포트폴리오

| 파일 | 화면 |
|------|------|
| [list.md](ui/portfolio/list.md) | 포트폴리오 목록 |
| [detail.md](ui/portfolio/detail.md) | 포트폴리오 상세 |

### 알림

| 파일 | 화면 |
|------|------|
| [center.md](ui/notification/center.md) | 알림 센터 |
| [settings.md](ui/notification/settings.md) | 알림 설정 |

### 커뮤니티 - P2/P3

| 파일 | 화면 |
|------|------|
| [feed.md](ui/community/feed.md) | 피드 화면 |
| [search.md](ui/community/search.md) | 검색 화면 |

---

## 로직 스펙 (`specs/logic/`)

| 파일 | 설명 |
|------|------|
| [README.md](logic/README.md) | 로직 스펙 개요 |

> 리밸런싱 계산 로직, 알림 발송 조건 등 비즈니스 로직 문서화 예정
