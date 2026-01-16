---
type: db
phase: P1
table: account_stock_entries
related:
  db:
    - account/accounts.md
  api: []
---

# account_stock_entries 테이블

## 개요
계좌 내 실제 보유 종목 정보 관리

> [!NOTE]
> - **P1**: 사용자가 직접 종목(ticker)과 수량(current_quantity) 수동 입력
> - **P2**: 증권사 API 연동을 통한 자동 동기화

## 스키마

```sql
CREATE TABLE account_stock_entries (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  account_id INTEGER NOT NULL,
  group_name VARCHAR(50),
  ticker VARCHAR(20) NOT NULL,
  current_quantity DECIMAL(18,8),
  bought_price DECIMAL(18,2),
  currency ENUM('KRW', 'USD', 'JPY') DEFAULT 'KRW',
  exchange VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  UNIQUE INDEX idx_ase_account_ticker (account_id, ticker),
  INDEX idx_ase_account_id (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| account_id | INTEGER | Y | FK → accounts.id | P1 |
| group_name | VARCHAR(50) | N | 분류 그룹 | P1 |
| ticker | VARCHAR(20) | Y | 주식 ticker | P1 |
| current_quantity | DECIMAL(18,8) | N | 보유 수량 | P1 |
| bought_price | DECIMAL(18,2) | N | 평균 매수가 | P1 |
| currency | ENUM | Y | KRW/USD/JPY | P1 |
| exchange | VARCHAR(20) | N | 거래소 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 관련 스펙
- DB: `accounts.md`
