---
type: db
phase: P3
table: payment_histories
related:
    api:
        - specs/api/bm/token-buy.md
        - specs/api/bm/membership-subscribe.md
---

# payment_histories 테이블

## 개요

사용자의 결제 내역(토큰 구매, 멤버십 구독)을 기록합니다. PG사 결제 연동 로그 역할을 겸합니다.

## 스키마

```sql
CREATE TABLE payment_histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('TOKEN', 'MEMBERSHIP') NOT NULL,
    item_id INT NOT NULL,                  -- token_packages.id 또는 membership_products.id
    amount DECIMAL(10, 2) NOT NULL,        -- 결제 금액
    currency VARCHAR(3) DEFAULT 'KRW',
    status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    pg_provider VARCHAR(50),               -- 결제 PG사 (toss, kakao 등)
    pg_transaction_id VARCHAR(100),        -- PG사 거래 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_payment_user (user_id),
    INDEX idx_payment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼              | 타입          | 필수 | 기본값            | 설명                         |
| ----------------- | ------------- | ---- | ----------------- | ---------------------------- |
| id                | INT           | Y    | AUTO_INCREMENT    | PK                           |
| user_id           | INT           | Y    | -                 | FK → users.id                |
| item_type         | ENUM          | Y    | -                 | TOKEN/MEMBERSHIP             |
| item_id           | INT           | Y    | -                 | 상품 ID                      |
| amount            | DECIMAL(10,2) | Y    | -                 | 결제 금액                    |
| currency          | VARCHAR(3)    | N    | KRW               | 통화                         |
| status            | ENUM          | N    | PENDING           | PENDING/PAID/FAILED/REFUNDED |
| pg_provider       | VARCHAR(50)   | N    | NULL              | PG사                         |
| pg_transaction_id | VARCHAR(100)  | N    | NULL              | PG사 거래 ID                 |
| created_at        | TIMESTAMP     | N    | CURRENT_TIMESTAMP | 생성일                       |
| updated_at        | TIMESTAMP     | N    | CURRENT_TIMESTAMP | 수정일                       |

## 인덱스

| 인덱스명           | 컬럼    | 용도          |
| ------------------ | ------- | ------------- |
| idx_payment_user   | user_id | 사용자별 조회 |
| idx_payment_status | status  | 상태별 조회   |

## 관련 스펙

- API: `../../api/bm/token-buy.md`
- API: `../../api/bm/membership-subscribe.md`
