# DBML

> 🗃️ 주식 리밸런싱 포트폴리오 앱 - 데이터베이스 스키마 정의

---

## 📖 개요

DBML(Database Markup Language)을 사용한 데이터베이스 스키마 설계 문서입니다.
Phase별로 분리하여 단계적 개발을 지원합니다.

---

## 🗂 폴더 구조

```
DBML/
├── README.md           # 이 파일
├── sk_p1.dbml          # Phase 1 스키마 (MVP)
└── sk_p2.dbml          # Phase 2 스키마 (확장)
```

---

## 📋 Phase별 스키마 현황

### Phase 1 (MVP) - `sk_p1.dbml`

| 도메인     | 테이블                    | 설명                      |
| ---------- | ------------------------- | ------------------------- |
| 사용자     | `users`                   | 사용자 정보 (소셜 로그인) |
|            | `user_consents`           | 약관 동의 관리            |
| 보안       | `token_vault`             | 토큰 암호화 저장소        |
|            | `audit_logs`              | 감사 추적 (보안 로그)     |
| 분석       | `user_activities`         | 사용자 활동 추적          |
|            | `portfolio_snapshots`     | 포트폴리오 히스토리       |
| 포트폴리오 | `portfolios`              | 포트폴리오                |
|            | `portfolio_stock_entries` | 포트폴리오 내 종목        |
|            | `portfolio_cash_entries`  | 포트폴리오 내 현금 비중   |
| 계좌       | `accounts`                | 연동 계좌                 |
|            | `account_stock_entries`   | 계좌 내 종목              |
|            | `account_cash_entries`    | 계좌 내 현금 잔고         |
| 알림       | `notifications`           | 알림 스택                 |
|            | `notification_types`      | 알림 종류                 |
|            | `notification_settings`   | 포트폴리오별 알림 설정    |
| 설정       | `settings`                | 사용자 설정값             |
| 운영       | `announcements`           | 공지사항/패치노트         |
|            | `device_tokens`           | 푸시 알림 토큰            |
| **합계**   | **18개**                  |                           |

### Phase 2 (확장) - `sk_p2.dbml`

| 도메인    | 테이블                                     | 설명              |
| --------- | ------------------------------------------ | ----------------- |
| P1 포함   | 18개                                       | Phase 1 전체 포함 |
| 커뮤니티  | `community_articles`                       | 게시물            |
|           | `community_article_categories`             | 게시물 카테고리   |
|           | `community_article_images`                 | 게시물 이미지     |
|           | `community_article_likes`                  | 게시물 좋아요     |
|           | `community_article_replies`                | 댓글              |
|           | `community_reply_likes`                    | 댓글 좋아요       |
|           | `community_copied_portfolios`              | 포트폴리오 사본   |
|           | `community_copied_portfolio_cash_entries`  | 사본 현금         |
|           | `community_copied_portfolio_stock_entries` | 사본 종목         |
|           | `portfolio_copy_history`                   | 복사 이력         |
| 소셜      | `user_follows`                             | 팔로우            |
|           | `user_blocks`                              | 차단              |
| 배지      | `badges`                                   | 배지 마스터       |
|           | `user_badges`                              | 사용자 배지       |
| 신고/정지 | `reports`                                  | 신고              |
|           | `report_reasons`                           | 신고 사유         |
|           | `user_suspensions`                         | 정지 이력         |
| 결제(P3)  | `token_wallet`                             | 토큰 지갑         |
|           | `payment_history`                          | 결제 내역         |
| **합계**  | **37개**                                   |                   |

---

## 🔐 스키마 특징

### 보안

-   **토큰 암호화**: `token_vault`에서 AES-256-GCM으로 통합 관리
-   **감사 추적**: `audit_logs`로 사용자 행동 로깅
-   **계좌 암호화**: `account_number`는 AES-256 암호화 저장

### 인덱스 전략

| 유형        | 적용 예시                                    |
| ----------- | -------------------------------------------- |
| Unique      | `(portfolio_id, ticker)`, `email`            |
| FK 인덱스   | `user_id`, `portfolio_id` 등                 |
| 복합 인덱스 | `(user_id, is_read)`, `(user_id, is_delete)` |

### 공통 패턴

-   **논리적 삭제**: `is_delete`, `delete_at` 컬럼
-   **타임스탬프**: `created_at`, `updated_at`
-   **Primary Key**: `id integer [primary key, increment]`

---

## 🚀 빠른 시작

### 1. 스키마 확인

```
@DBML/sk_p1.dbml 이 스키마 확인해줘
```

### 2. DB 문서 생성

```
@DBML/sk_p1.dbml 기반으로 db-schema.md 만들어줘
```

### 3. API 문서 생성

```
@DBML/sk_p1.dbml 기반으로 api-spec.md 만들어줘
```

### 4. DDL 생성

```
@DBML/sk_p1.dbml MySQL DDL 만들어줘
```

---

## 🔗 관련 문서

| 문서             | 경로                                  | 용도          |
| ---------------- | ------------------------------------- | ------------- |
| DB 스키마 (원본) | `Docs/new_PRD/reference/db-schema.md` | 기존 DB 문서  |
| API 스펙 (원본)  | `Docs/new_PRD/reference/api-spec.md`  | 기존 API 문서 |

---

## 📊 Phase 1 ERD

```
users (1) ──< (N) portfolios (1) ──< (N) portfolio_stock_entries
  │                   │
  │                   └──< (N) portfolio_cash_entries
  │                   │
  │                  (1)
  │                   │
  │           notification_settings
  │
  ├──< (N) user_consents
  │
  ├──< (N) user_activities
  │
 (1)
  │
 (N)
  │
accounts (1) ──< (N) account_stock_entries
  │
  └──< (N) account_cash_entries

users (1) ─── (1) settings
users (1) ──< (N) notifications (N) >── (1) notification_types

token_vault: users, accounts의 토큰 통합 저장
audit_logs: 시스템 전체 보안 로그
portfolio_snapshots: 포트폴리오 히스토리
device_tokens: 푸시 알림용 FCM 토큰
announcements: 공지사항/패치노트
```

---

## 📊 Phase 2 ERD

### 커뮤니티

```
users (1) ──< (N) community_articles (1) ──< (N) community_article_images
                      │
                      ├──< (N) community_article_likes
                      │
                      └──< (N) community_article_replies (1) ──< (N) community_reply_likes
                                      │
                                      └── (자기참조) parent_reply_id

community_articles (N) >── (1) community_article_categories
community_articles (N) >── (1) community_copied_portfolios
```

### 포트폴리오 사본/복사

```
portfolios (1) ──< (N) community_copied_portfolios (1) ──< (N) community_copied_portfolio_stock_entries
                              │
                              └──< (N) community_copied_portfolio_cash_entries

community_copied_portfolios (1) ──< (N) portfolio_copy_history (N) >── (1) portfolios (target)
                                              │
                                              └── (N) >── (1) users
```

### 소셜 (팔로우/차단)

```
users (1) ──< (N) user_follows (팔로워)
users (1) ──< (N) user_follows (팔로잉)

users (1) ──< (N) user_blocks (차단한 사람)
users (1) ──< (N) user_blocks (차단당한 사람)
```

### 배지

```
badges (1) ──< (N) user_badges (N) >── (1) users
```

### 신고/정지

```
users (1) ──< (N) reports (신고자)
users (1) ──< (N) reports (처리 관리자)
reports (N) >── (1) report_reasons

users (1) ──< (N) user_suspensions (정지된 사용자)
users (1) ──< (N) user_suspensions (처리 관리자)
```

---

> 📅 최종 수정: 2026-01-15
