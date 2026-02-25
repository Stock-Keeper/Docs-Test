---
type: db
phase: P3
table: token_packages
related:
    api:
        - specs/api/bm/products.md
        - specs/api/bm/token-buy.md
---

# token_packages 테이블

## 개요

토큰 상품(패키지) 정보를 관리합니다. 관리자가 가격이나 구성을 변경할 수 있습니다.

## 스키마

```sql
CREATE TABLE token_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,          -- 패키지명 (소량, 기본, 인기 등)
    token_count INT NOT NULL,            -- 토큰 지급량
    price DECIMAL(10, 2) NOT NULL,       -- 가격 (KRW)
    currency VARCHAR(3) DEFAULT 'KRW',   -- 통화
    is_active BOOLEAN DEFAULT TRUE,      -- 판매 중 여부
    is_best BOOLEAN DEFAULT FALSE,       -- 추천(인기) 상품 태그
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼        | 타입          | 필수 | 기본값            | 설명           |
| ----------- | ------------- | ---- | ----------------- | -------------- |
| id          | INT           | Y    | AUTO_INCREMENT    | PK             |
| name        | VARCHAR(100)  | Y    | -                 | 패키지명       |
| token_count | INT           | Y    | -                 | 토큰 지급량    |
| price       | DECIMAL(10,2) | Y    | -                 | 가격 (KRW)     |
| currency    | VARCHAR(3)    | N    | KRW               | 통화           |
| is_active   | BOOLEAN       | N    | TRUE              | 판매 중 여부   |
| is_best     | BOOLEAN       | N    | FALSE             | 추천 상품 태그 |
| created_at  | TIMESTAMP     | N    | CURRENT_TIMESTAMP | 생성일         |
| updated_at  | TIMESTAMP     | N    | CURRENT_TIMESTAMP | 수정일         |

## 초기 데이터 (시딩)

| name | token_count | price | is_best |
| ---- | ----------- | ----- | ------- |
| 소량 | 10          | 1900  | false   |
| 기본 | 30          | 4900  | false   |
| 인기 | 60          | 8900  | true    |
| 대량 | 120         | 14900 | false   |

## 관련 스펙

- API: `../../api/bm/products.md`
- API: `../../api/bm/token-buy.md`
