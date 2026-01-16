---
type: db
phase: P1
table: account_cash_entries
related:
  db:
    - account/accounts.md
  api: []
---

# account_cash_entries 테이블

## 개요
계좌 내 실제 현금 잔고 관리 (통화별)

> [!NOTE]
> - **P1**: 사용자가 직접 현금 잔고 수동 입력
> - **P2**: 증권사 API 연동을 통한 자동 동기화

## 스키마

```sql
CREATE TABLE account_cash_entries (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  account_id INTEGER NOT NULL,
  currency ENUM('KRW', 'USD', 'JPY') NOT NULL DEFAULT 'KRW',
  amount DECIMAL(18,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  UNIQUE INDEX idx_ace_account_currency (account_id, currency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| account_id | INTEGER | Y | FK → accounts.id | P1 |
| currency | ENUM | Y | KRW/USD/JPY | P1 |
| amount | DECIMAL(18,2) | Y | 보유 금액 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 관련 스펙
- DB: `accounts.md`
