---
type: db
phase: P3
table: membership_products
related:
    api:
        - specs/api/bm/products.md
        - specs/api/bm/membership-subscribe.md
---

# membership_products 테이블

## 1. 원본 출처

- `_inbox/bm-token-membership.md` (멤버십 등급 체계)

## 2. 개요

멤버십 구독 상품 정보를 관리합니다. 등급별 가격, 혜택(토큰 지급량, 기능 제한)을 정의합니다.

## 3. 스키마

```sql
CREATE TABLE membership_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier ENUM('FREE', 'BASIC', 'PRO', 'PREMIUM') NOT NULL, -- 등급 코드
    name VARCHAR(50) NOT NULL,          -- 표시명 (Basic, Pro 등)
    price DECIMAL(10, 2) NOT NULL,      -- 월 구독료
    currency VARCHAR(3) DEFAULT 'KRW',
    duration_days INT DEFAULT 30,       -- 구독 기간 (일)
    monthly_token_count INT DEFAULT 0,  -- 월 지급 토큰

    -- 기능 제한 (NULL = 무제한)
    limit_backtest INT DEFAULT 0,       -- 월 백테스팅 횟수
    limit_copy INT DEFAULT 0,           -- 월 카피 횟수
    limit_detail INT DEFAULT 0,         -- 월 상세 열람 횟수
    limit_ai_recommend INT DEFAULT 0,   -- 월 AI 추천 횟수

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_tier (tier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 4. 초기 데이터 (시딩)

| tier    | price | monthly_token | limit_backtest | limit_copy | limit_detail | limit_ai_recommend |
| ------- | ----- | ------------- | -------------- | ---------- | ------------ | ------------------ |
| FREE    | 0     | 0             | 0              | 0          | 0            | 0                  |
| BASIC   | 4900  | 10            | 3              | 1          | 5            | 2                  |
| PRO     | 9900  | 30            | 15             | 5          | 20           | 10                 |
| PREMIUM | 19900 | 50            | NULL           | NULL       | NULL         | NULL               |
