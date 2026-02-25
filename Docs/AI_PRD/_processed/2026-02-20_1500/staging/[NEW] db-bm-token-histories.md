---
type: db
phase: P3
table: token_histories
related:
    api:
        - specs/api/portfolio/backtest.md
        - specs/api/community/portfolio-copy.md
---

# token_histories 테이블

## 1. 원본 출처

- `_inbox/bm-token-membership.md`

## 2. 개요

토큰의 적립(구매, 이벤트) 및 사용(기능 차감) 내역을 기록하여 잔액 무결성을 보장합니다.

## 3. 스키마

```sql
CREATE TABLE token_histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount INT NOT NULL,                   -- 변동량 (+구매/적립, -사용)
    balance_after INT NOT NULL,            -- 변동 후 잔액 (스냅샷)
    type ENUM('PURCHASE', 'MEMBERSHIP_GRANT', 'EVENT_GRANT', 'USE', 'REFUND') NOT NULL,
    feature_type ENUM('BACKTEST', 'COPY', 'DETAIL', 'AI_RECOMMEND', 'NONE') DEFAULT 'NONE', -- 사용처
    reference_id INT,                      -- 관련 ID (payment_id, portfolio_id 등)
    description VARCHAR(255),              -- 상세 설명
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_token_user (user_id),
    INDEX idx_token_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
