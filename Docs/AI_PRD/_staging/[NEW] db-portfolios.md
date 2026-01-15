---
# P1 포트폴리오(Portfolio) DB 스키마

## 원본 내용
> AI_PRD/_inbox/sk_p1.md (Portfolio 관련 테이블)
> - portfolios, portfolio_snapshots, portfolio_stock_entries, portfolio_cash_entries
> - Phase 1 핵심 기능

## AI 분석 결과
- 추론 유형: db
- 추론 작업: NEW
- 추론 Phase: P1
- 연관 도메인: 자산 관리

## 정형화된 초안

```dbml
// 포트폴리오
Table portfolios {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  name varchar
  description text
  account_id integer [ref: - accounts.id]
  banner_color varchar [default: '#4CAF93']
  created_at timestamp
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    user_id [name: 'idx_portfolios_user_id']
  }
}

// 포트폴리오 스냅샷 (히스토리)
Table portfolio_snapshots {
  id integer [primary key, increment]
  portfolio_id integer [ref: > portfolios.id]
  snapshot_type enum('MANUAL', 'AUTO', 'REBALANCE')
  total_value decimal
  total_invested decimal
  profit_loss decimal
  profit_loss_rate decimal
  cash_ratio decimal
  stock_entries text // JSON
  cash_entries text // JSON
  exchange_rates text // JSON
  note text
  created_at timestamp [default: `now()`]
}

// 포트폴리오 내 종목 항목들
Table portfolio_stock_entries {
  id integer [primary key, increment]
  portfolio_id integer [not null, ref: > portfolios.id]
  group varchar
  ticker varchar [not null]
  target_weight decimal
  created_at timestamp
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    (portfolio_id, ticker) [unique, name: 'idx_pse_portfolio_ticker']
    portfolio_id [name: 'idx_pse_portfolio_id']
  }
}

// 포트폴리오 내 현금 목표 비중
Table portfolio_cash_entries {
  id integer [primary key, increment]
  portfolio_id integer [not null, ref: > portfolios.id]
  currency enum('KRW', 'USD', 'JPY') [not null, default: 'KRW']
  target_weight decimal
  created_at timestamp
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    (portfolio_id, currency) [unique, name: 'idx_pce_portfolio_currency']
  }
}
```

## 확인 필요 사항
- [ ] `users`, `accounts` 테이블과 관계가 있으므로 해당 스펙 참조가 필요합니다.
---
