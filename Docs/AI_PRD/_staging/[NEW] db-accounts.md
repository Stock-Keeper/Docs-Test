---
# P1 계좌(Account) DB 스키마

## 원본 내용
> AI_PRD/_inbox/sk_p1.md (Account 관련 테이블)
> - accounts, account_stock_entries, account_cash_entries
> - Phase 1 연동 기능

## AI 분석 결과
- 추론 유형: db
- 추론 작업: NEW
- 추론 Phase: P1
- 연관 도메인: 증권사 연동, 자산

## 정형화된 초안

```dbml
// 연동 계좌
Table accounts {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  brokerage_name varchar
  account_number varchar // 암호화 저장
  // access_token 등은 token_vault 참조
  is_connected boolean [default: false]
  created_at timestamp
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    user_id [name: 'idx_accounts_user_id']
  }
}

// 계좌 내 종목 항목들 (실제 보유)
Table account_stock_entries {
  id integer [primary key, increment]
  account_id integer [not null, ref: > accounts.id]
  group varchar
  ticker varchar [not null]
  current_quantity decimal
  bought_price decimal
  currency enum ('KRW', 'USD', 'JPY') [default: 'KRW']
  exchange varchar
  created_at timestamp
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    (account_id, ticker) [unique, name: 'idx_ase_account_ticker']
    account_id [name: 'idx_ase_account_id']
  }
}

// 계좌 내 실제 현금 잔고
Table account_cash_entries {
  id integer [primary key, increment]
  account_id integer [not null, ref: > accounts.id]
  currency enum('KRW', 'USD', 'JPY') [not null, default: 'KRW']
  amount decimal [default: 0]
  created_at timestamp
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    (account_id, currency) [unique, name: 'idx_ace_account_currency']
  }
}
```

## 확인 필요 사항
- [ ] 토큰 저장은 `token_vault` 테이블(Users 스펙)을 사용합니다.
---
