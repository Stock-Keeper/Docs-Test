---
type: db
phase: P3
table: token_histories
related:
    api:
        - specs/api/bm/token-buy.md
        - specs/api/portfolio/backtest.md
        - specs/api/portfolio/ai-optimize.md
        - specs/api/community/portfolio-copy.md
---

# token_histories 테이블

## 개요

토큰의 적립(구매, 이벤트) 및 사용(기능 차감) 내역을 기록하여 잔액 무결성을 보장합니다.

## 스키마

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

## 컬럼 상세

| 컬럼          | 타입         | 필수 | 기본값            | 설명                                             |
| ------------- | ------------ | ---- | ----------------- | ------------------------------------------------ |
| id            | INT          | Y    | AUTO_INCREMENT    | PK                                               |
| user_id       | INT          | Y    | -                 | FK → users.id                                    |
| amount        | INT          | Y    | -                 | 변동량 (+적립, -사용)                            |
| balance_after | INT          | Y    | -                 | 변동 후 잔액                                     |
| type          | ENUM         | Y    | -                 | PURCHASE/MEMBERSHIP_GRANT/EVENT_GRANT/USE/REFUND |
| feature_type  | ENUM         | N    | NONE              | 사용처 (BACKTEST/COPY/DETAIL/AI_RECOMMEND/NONE)  |
| reference_id  | INT          | N    | NULL              | 관련 ID                                          |
| description   | VARCHAR(255) | N    | NULL              | 상세 설명                                        |
| created_at    | TIMESTAMP    | N    | CURRENT_TIMESTAMP | 생성일                                           |

## 인덱스

| 인덱스명          | 컬럼       | 용도          |
| ----------------- | ---------- | ------------- |
| idx_token_user    | user_id    | 사용자별 조회 |
| idx_token_created | created_at | 시간순 조회   |

## 관련 스펙

- API: `../../api/bm/token-buy.md`
- API: `../../api/portfolio/backtest.md`
- API: `../../api/portfolio/ai-optimize.md`
- API: `../../api/community/portfolio-copy.md`
