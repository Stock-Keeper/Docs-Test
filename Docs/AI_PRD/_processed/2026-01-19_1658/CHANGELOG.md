# 처리 내역 - 2026-01-19_1658

## 원본 파일

- sk_p2.dbml

## 처리된 도메인

| 도메인 | staging 파일 | 생성/수정된 스펙 |
|--------|-------------|----------------|
| auth | [UPDATE] db-auth.md | 1개 (users.md 수정) |
| notification | [UPDATE] db-notification.md | 4개 |
| portfolio | [UPDATE] db-portfolio.md | 1개 |
| community-profile | [NEW] db-community-profile.md | 3개 |
| community-article | [UPDATE] db-community-article.md | 4개 |
| community-social | [UPDATE] db-community-social.md | 3개 |
| community-moderation | [NEW] db-community-moderation.md | 3개 |
| community-portfolio-share | [NEW] db-community-portfolio-share.md | 2개 |
| community-search | [NEW] db-community-search.md | 1개 |
| community-badge | [UPDATE] db-community-badge.md | 2개 |
| community-follow | [UPDATE] db-community-follow.md | 2개 |

## 생성된 스펙 (NEW)

| 파일 | 테이블 | 작업 |
|------|--------|------|
| specs/db/community/profiles.md | community_profiles | NEW |
| specs/db/community/settings.md | community_settings | NEW |
| specs/db/community/nickname-histories.md | nickname_histories | NEW |
| specs/db/community/reports.md | reports | NEW |
| specs/db/community/report-reasons.md | report_reasons | NEW |
| specs/db/community/user-suspensions.md | user_suspensions | NEW |
| specs/db/community/search-histories.md | search_histories | NEW |
| specs/db/community/user-blocks.md | user_blocks | NEW |

## 업데이트된 스펙 (UPDATE)

| 파일 | 변경 내용 |
|------|----------|
| specs/db/auth/users.md | is_suspended, suspended_until, suspension_reason 컬럼 추가 |
| specs/db/notification/notifications.md | 스키마 업데이트 |
| specs/db/portfolio/portfolios.md | 커뮤니티 관련 컬럼 제거, 계좌 연동 추가 |
| specs/db/community/articles.md | posts → community_articles 변경 |
| specs/db/community/article-images.md | post_images → community_article_images 변경 |
| specs/db/community/article-categories.md | community_article_categories 추가 |
| specs/db/community/bookmarks.md | community_bookmarks 추가 |
| specs/db/community/likes.md | community_article_likes 업데이트 |
| specs/db/community/comments.md | community_article_replies 업데이트 |
| specs/db/community/reply-likes.md | community_reply_likes 업데이트 |
| specs/db/community/follows.md | follows → user_follows, Phase P3→P2 |
| specs/db/community/badges.md | badge_types → badges, condition 컬럼 제거 |
| specs/db/community/rankings.md | rankings-badges.md에서 분리 |

## 삭제된 스펙

| 파일 | 사유 |
|------|------|
| specs/db/community/rankings-badges.md | rankings.md, badges.md로 분리됨 |

## 처리 시각

- 시작: 2026-01-19 16:58
- 완료: 2026-01-20 01:07
