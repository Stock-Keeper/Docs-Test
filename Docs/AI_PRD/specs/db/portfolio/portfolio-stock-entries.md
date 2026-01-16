---
type: db
phase: P1
table: portfolio_stock_entries
related:
  db:
    - portfolio/portfolios.md
  api: []
---

# portfolio_stock_entries 테이블

## 개요
포트폴리오 내 개별 종목 항목 관리 (목표 비중 설정)

## 스키마

```sql
CREATE TABLE portfolio_stock_entries (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INTEGER NOT NULL,
  group_name VARCHAR(50),
  ticker VARCHAR(20) NOT NULL,
  target_weight DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
  UNIQUE INDEX idx_pse_portfolio_ticker (portfolio_id, ticker),
  INDEX idx_pse_portfolio_id (portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| portfolio_id | INTEGER | Y | FK → portfolios.id | P1 |
| group_name | VARCHAR(50) | N | 분류 그룹 | P1 |
| ticker | VARCHAR(20) | Y | 주식 ticker | P1 |
| target_weight | DECIMAL(5,2) | N | 목표 비중 (%) | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 관련 스펙
- DB: `portfolios.md`
