---
type: db
phase: P1
table: portfolio_snapshots
related:
  db:
    - portfolio/portfolios.md
  api:
    - portfolio/snapshots-list.md
    - portfolio/snapshots-detail.md
    - portfolio/snapshots-create.md
    - portfolio/snapshots-compare.md
---

# portfolio_snapshots 테이블

## 개요
포트폴리오 상태 스냅샷 저장 (히스토리 추적, 리밸런싱 기록)

## 스키마

```sql
CREATE TABLE portfolio_snapshots (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INTEGER NOT NULL,
  snapshot_type ENUM('MANUAL', 'AUTO', 'REBALANCE') NOT NULL,
  total_value DECIMAL(18,2),
  total_invested DECIMAL(18,2),
  profit_loss DECIMAL(18,2),
  profit_loss_rate DECIMAL(5,2),
  cash_ratio DECIMAL(5,2),
  stock_entries JSON,
  cash_entries JSON,
  exchange_rates JSON,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
  INDEX idx_snapshots_portfolio_id (portfolio_id),
  INDEX idx_snapshots_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| portfolio_id | INTEGER | Y | FK → portfolios.id | P1 |
| snapshot_type | ENUM | Y | MANUAL/AUTO/REBALANCE | P1 |
| total_value | DECIMAL(18,2) | N | 총 평가금액 | P1 |
| total_invested | DECIMAL(18,2) | N | 총 투자금액 | P1 |
| profit_loss | DECIMAL(18,2) | N | 손익 | P1 |
| profit_loss_rate | DECIMAL(5,2) | N | 수익률 | P1 |
| cash_ratio | DECIMAL(5,2) | N | 현금 비율 | P1 |
| stock_entries | JSON | N | 종목별 상태 | P1 |
| cash_entries | JSON | N | 통화별 현금 | P1 |
| exchange_rates | JSON | N | 환율 정보 | P1 |
| note | TEXT | N | 메모 | P1 |
| created_at | TIMESTAMP | Y | 스냅샷 일시 | P1 |

## 관련 스펙
- DB: `portfolios.md`
