---
type: db
phase: P1
table: portfolio_cash_entries
related:
  db:
    - portfolio/portfolios.md
  api: []
---

# portfolio_cash_entries 테이블

## 개요
포트폴리오 내 현금 목표 비중 관리 (통화별)

## 스키마

```sql
CREATE TABLE portfolio_cash_entries (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INTEGER NOT NULL,
  currency ENUM('KRW', 'USD', 'JPY') NOT NULL DEFAULT 'KRW',
  target_weight DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
  UNIQUE INDEX idx_pce_portfolio_currency (portfolio_id, currency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| portfolio_id | INTEGER | Y | FK → portfolios.id | P1 |
| currency | ENUM | Y | KRW/USD/JPY | P1 |
| target_weight | DECIMAL(5,2) | N | 목표 비중 (%) | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 관련 스펙
- DB: `portfolios.md`
