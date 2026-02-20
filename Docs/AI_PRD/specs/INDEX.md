---
type: index
description: 모든 API, DB, UI 스펙 문서의 인덱스
role: 사람이 전체 구조를 파악하고, AI가 스펙 목록을 빠르게 조회하는 데 사용
spec_count:
    api: 53
    db: 40
    ui: 24
    total: 117
last_updated: 2026-02-20
---

# 스펙 인덱스

> 모든 API, DB, UI 스펙 문서의 목록입니다.
>
> **💡 참고**: 각 스펙 파일에는 YAML 프론트매터가 포함되어 있어 AI가 개별 파일의 메타데이터(type, phase, related 등)를 빠르게 파싱할 수 있습니다.

---

## API 스펙 (`specs/api/`)

### 인증 (Auth) - P1

| 파일                                            | 설명              |
| ----------------------------------------------- | ----------------- |
| [auth-google.md](api/auth/auth-google.md)       | Google OAuth 콜백 |
| [refresh.md](api/auth/refresh.md)               | 토큰 갱신         |
| [logout.md](api/auth/logout.md)                 | 로그아웃          |
| [profile-update.md](api/auth/profile-update.md) | 프로필 수정       |

### 포트폴리오 (Portfolio) - P1

| 파일                                   | 설명                 |
| -------------------------------------- | -------------------- |
| [list.md](api/portfolio/list.md)       | 포트폴리오 목록 조회 |
| [detail.md](api/portfolio/detail.md)   | 포트폴리오 상세 조회 |
| [create.md](api/portfolio/create.md)   | 포트폴리오 생성      |
| [update.md](api/portfolio/update.md)   | 포트폴리오 수정      |
| [delete.md](api/portfolio/delete.md)   | 포트폴리오 삭제      |
| [reorder.md](api/portfolio/reorder.md) | 포트폴리오 순서 변경 |

### 종목 (Stock) - P1/P2

| 파일                                           | 설명             | Phase |
| ---------------------------------------------- | ---------------- | :---: |
| [search.md](api/stock/search.md)               | 종목 검색        |  P1   |
| [add.md](api/stock/add.md)                     | 종목 추가        |  P1   |
| [update-delete.md](api/stock/update-delete.md) | 종목 수정/삭제   |  P1   |
| [price.md](api/stock/price.md)                 | 종목 현재가 조회 |  P1   |
| [history.md](api/stock/history.md)             | 종목 차트 조회   |  P2   |

### 리밸런싱 (Rebalancing) - P1

| 파일                                         | 설명          |
| -------------------------------------------- | ------------- |
| [calculate.md](api/rebalancing/calculate.md) | 리밸런싱 계산 |

### 알림 (Notification) - P1

| 파일                                          | 설명           |
| --------------------------------------------- | -------------- |
| [list.md](api/notification/list.md)           | 알림 목록 조회 |
| [read.md](api/notification/read.md)           | 알림 읽음 처리 |
| [settings.md](api/notification/settings.md)   | 알림 설정      |
| [fcm-token.md](api/notification/fcm-token.md) | FCM 토큰 등록  |

### 광고 (Ads) - P1

| 파일                           | 설명           |
| ------------------------------ | -------------- |
| [config.md](api/ads/config.md) | 광고 설정 조회 |

### 관리자 (Admin) - P1

| 파일                                                   | 설명             |
| ------------------------------------------------------ | ---------------- |
| [stats-overview.md](api/admin/stats-overview.md)       | 통계 개요        |
| [users-list.md](api/admin/users-list.md)               | 사용자 목록      |
| [users-detail.md](api/admin/users-detail.md)           | 사용자 상세      |
| [users-role.md](api/admin/users-role.md)               | 사용자 역할 변경 |
| [users-status.md](api/admin/users-status.md)           | 사용자 상태 변경 |
| [monitoring-errors.md](api/admin/monitoring-errors.md) | 에러 모니터링    |
| [stats-users.md](api/admin/stats-users.md)             | 사용자 통계      |
| [stats-portfolios.md](api/admin/stats-portfolios.md)   | 포트폴리오 통계  |
| [ads.md](api/admin/ads.md)                             | 광고 단위 관리   |

### 커뮤니티 (Community) - P2/P3

| 파일                                                 | 설명            | Phase |
| ---------------------------------------------------- | --------------- | :---: |
| [feed-list.md](api/community/feed-list.md)           | 피드 목록       |  P2   |
| [post-create.md](api/community/post-create.md)       | 게시글 작성     |  P2   |
| [post-detail.md](api/community/post-detail.md)       | 게시글 상세     |  P2   |
| [post-update.md](api/community/post-update.md)       | 게시글 수정     |  P2   |
| [comment-create.md](api/community/comment-create.md) | 댓글 작성       |  P2   |
| [comment-update.md](api/community/comment-update.md) | 댓글 수정       |  P2   |
| [comment-delete.md](api/community/comment-delete.md) | 댓글 삭제       |  P2   |
| [like.md](api/community/like.md)                     | 좋아요          |  P2   |
| [search.md](api/community/search.md)                 | 검색            |  P2   |
| [reply-create.md](api/community/reply-create.md)     | 대댓글 작성     |  P3   |
| [follow.md](api/community/follow.md)                 | 팔로우          |  P3   |
| [ranking.md](api/community/ranking.md)               | 랭킹            |  P3   |
| [portfolio-copy.md](api/community/portfolio-copy.md) | 포트폴리오 복사 |  P3   |

---

## DB 스펙 (`specs/db/`)

### auth (인증)

| 파일                                         | 테이블명        | 설명          | Phase |
| -------------------------------------------- | --------------- | ------------- | :---: |
| [users.md](db/auth/users.md)                 | `users`         | 사용자        |  P1   |
| [user-consents.md](db/auth/user-consents.md) | `user_consents` | 사용자 동의   |  P1   |
| [token-vault.md](db/auth/token-vault.md)     | `token_vault`   | 토큰 저장소   |  P1   |
| [settings.md](db/auth/settings.md)           | `settings`      | 사용자 설정   |  P1   |
| [device-tokens.md](db/auth/device-tokens.md) | `device_tokens` | 디바이스 토큰 |  P1   |

### portfolio (포트폴리오)

| 파일                                                                  | 테이블명                  | 설명              | Phase |
| --------------------------------------------------------------------- | ------------------------- | ----------------- | :---: |
| [portfolios.md](db/portfolio/portfolios.md)                           | `portfolios`              | 포트폴리오        |  P1   |
| [portfolio-stock-entries.md](db/portfolio/portfolio-stock-entries.md) | `portfolio_stock_entries` | 포트폴리오 종목   |  P1   |
| [portfolio-cash-entries.md](db/portfolio/portfolio-cash-entries.md)   | `portfolio_cash_entries`  | 포트폴리오 현금   |  P1   |
| [portfolio-snapshots.md](db/portfolio/portfolio-snapshots.md)         | `portfolio_snapshots`     | 포트폴리오 스냅샷 |  P1   |
| [portfolio-copies.md](db/portfolio/portfolio-copies.md)               | `portfolio_copies`        | 포트폴리오 복사   |  P3   |

### account (계좌)

| 파일                                                            | 테이블명                | 설명           | Phase |
| --------------------------------------------------------------- | ----------------------- | -------------- | :---: |
| [accounts.md](db/account/accounts.md)                           | `accounts`              | 증권 계좌      |  P1   |
| [account-stock-entries.md](db/account/account-stock-entries.md) | `account_stock_entries` | 계좌 보유 종목 |  P1   |
| [account-cash-entries.md](db/account/account-cash-entries.md)   | `account_cash_entries`  | 계좌 현금 잔고 |  P1   |

### notification (알림)

| 파일                                                                 | 테이블명                | 설명      | Phase |
| -------------------------------------------------------------------- | ----------------------- | --------- | :---: |
| [notifications.md](db/notification/notifications.md)                 | `notifications`         | 알림      |  P1   |
| [notification-settings.md](db/notification/notification-settings.md) | `notification_settings` | 알림 설정 |  P1   |
| [notification-types.md](db/notification/notification-types.md)       | `notification_types`    | 알림 유형 |  P1   |

### community (커뮤니티)

| 파일                                                        | 테이블명                       | 설명             | Phase |
| ----------------------------------------------------------- | ------------------------------ | ---------------- | :---: |
| [profiles.md](db/community/profiles.md)                     | `community_profiles`           | 커뮤니티 프로필  |  P2   |
| [settings.md](db/community/settings.md)                     | `community_settings`           | 커뮤니티 설정    |  P2   |
| [nickname-histories.md](db/community/nickname-histories.md) | `nickname_histories`           | 닉네임 변경 이력 |  P2   |
| [articles.md](db/community/articles.md)                     | `community_articles`           | 게시글           |  P2   |
| [article-images.md](db/community/article-images.md)         | `community_article_images`     | 게시글 이미지    |  P2   |
| [article-categories.md](db/community/article-categories.md) | `community_article_categories` | 게시글 카테고리  |  P2   |
| [bookmarks.md](db/community/bookmarks.md)                   | `community_bookmarks`          | 북마크           |  P2   |
| [comments.md](db/community/comments.md)                     | `community_article_replies`    | 댓글             |  P2   |
| [likes.md](db/community/likes.md)                           | `community_article_likes`      | 좋아요           |  P2   |
| [reports.md](db/community/reports.md)                       | `reports`                      | 신고             |  P2   |
| [report-reasons.md](db/community/report-reasons.md)         | `report_reasons`               | 신고 사유        |  P2   |
| [user-suspensions.md](db/community/user-suspensions.md)     | `user_suspensions`             | 사용자 정지 이력 |  P2   |
| [follows.md](db/community/follows.md)                       | `user_follows`                 | 팔로우           |  P2   |
| [user-blocks.md](db/community/user-blocks.md)               | `user_blocks`                  | 사용자 차단      |  P2   |
| [rankings.md](db/community/rankings.md)                     | `rankings`                     | 랭킹 스냅샷      |  P3   |
| [badges.md](db/community/badges.md)                         | `badges`, `user_badges`        | 뱃지             |  P3   |
| [reply-likes.md](db/community/reply-likes.md)               | `community_reply_likes`        | 대댓글 좋아요    |  P2   |
| [search-histories.md](db/community/search-histories.md)     | `search_histories`             | 검색 기록        |  P2   |

### admin (관리자)

| 파일                                          | 테이블명        | 설명      | Phase |
| --------------------------------------------- | --------------- | --------- | :---: |
| [audit-logs.md](db/admin/audit-logs.md)       | `audit_logs`    | 감사 로그 |  P1   |
| [announcements.md](db/admin/announcements.md) | `announcements` | 공지사항  |  P1   |
| [error-logs.md](db/admin/error-logs.md)       | `error_logs`    | 에러 로그 |  P1   |

### ads (광고)

| 파일                              | 테이블명   | 설명              | Phase |
| --------------------------------- | ---------- | ----------------- | :---: |
| [ad-units.md](db/ads/ad-units.md) | `ad_units` | 광고 단위 및 정책 |  P1   |

### log (로그)

| 파일                                            | 테이블명          | 설명          | Phase |
| ----------------------------------------------- | ----------------- | ------------- | :---: |
| [audit-logs.md](db/log/audit-logs.md)           | `audit_logs`      | 감사 로그     |  P1   |
| [api-call-logs.md](db/log/api-call-logs.md)     | `api_call_logs`   | API 호출 로그 |  P1   |
| [error-logs.md](db/log/error-logs.md)           | `error_logs`      | 에러 로그     |  P1   |
| [user-activities.md](db/log/user-activities.md) | `user_activities` | 사용자 활동   |  P1   |

---

## UI 스펙 (`specs/ui/`)

### 인증

| 파일                                         | 화면             |
| -------------------------------------------- | ---------------- |
| [login-screen.md](ui/auth/login-screen.md)   | 로그인 화면      |
| [splash.md](ui/auth/splash.md)               | 스플래시 화면    |
| [profile-input.md](ui/auth/profile-input.md) | 프로필 입력 화면 |
| [profile-edit.md](ui/auth/profile-edit.md)   | 프로필 편집 화면 |

### 포트폴리오

| 파일                                | 화면            |
| ----------------------------------- | --------------- |
| [list.md](ui/portfolio/list.md)     | 포트폴리오 목록 |
| [detail.md](ui/portfolio/detail.md) | 포트폴리오 상세 |

### 알림

| 파일                                       | 화면      |
| ------------------------------------------ | --------- |
| [center.md](ui/notification/center.md)     | 알림 센터 |
| [settings.md](ui/notification/settings.md) | 알림 설정 |

### 종목 - P1/P2

| 파일                            | 화면           | Phase |
| ------------------------------- | -------------- | :---: |
| [add.md](ui/stock/add.md)       | 종목 추가 화면 |  P1   |
| [search.md](ui/stock/search.md) | 종목 검색 화면 |  P1   |
| [detail.md](ui/stock/detail.md) | 종목 상세 화면 |  P2   |

### 설정

| 파일                           | 화면           |
| ------------------------------ | -------------- |
| [main.md](ui/settings/main.md) | 설정 메인 화면 |

### 커뮤니티 - P2/P3

| 파일                                          | 화면             | Phase |
| --------------------------------------------- | ---------------- | :---: |
| [feed.md](ui/community/feed.md)               | 피드 화면        |  P2   |
| [search.md](ui/community/search.md)           | 검색 화면        |  P2   |
| [onboarding.md](ui/community/onboarding.md)   | 온보딩 화면      |  P2   |
| [post-detail.md](ui/community/post-detail.md) | 게시글 상세 화면 |  P2   |
| [profile.md](ui/community/profile.md)         | 프로필 화면      |  P2   |
| [post-create.md](ui/community/post-create.md) | 게시글 작성 화면 |  P2   |
| [lists.md](ui/community/lists.md)             | 참조 목록 화면   |  P2   |
| [settings.md](ui/community/settings.md)       | 커뮤니티 설정    |  P2   |

### 광고 (Ads) - P1

| 파일                                        | 화면          |
| ------------------------------------------- | ------------- |
| [ad-components.md](ui/ads/ad-components.md) | 광고 컴포넌트 |

---

## 로직 스펙 (`specs/logic/`)

| 파일                         | 설명           |
| ---------------------------- | -------------- |
| [README.md](logic/README.md) | 로직 스펙 개요 |

> 리밸런싱 계산 로직, 알림 발송 조건 등 비즈니스 로직 문서화 예정
