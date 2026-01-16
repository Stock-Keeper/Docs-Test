---
type: db
phase: P1
table: accounts
related:
  db:
    - auth/users.md
    - auth/token-vault.md
    - account/account-stock-entries.md
    - account/account-cash-entries.md
  api: []
---

# accounts 테이블

## 개요
증권사 연동 계좌 정보 관리

> [!NOTE]
> - **P1**: 증권사 연동 없이 사용자가 수동으로 계좌 정보 입력 (`is_connected = FALSE`)
> - **P2**: 증권사 API 연동을 통한 자동 동기화
> - access_token, refresh_token은 token_vault 테이블로 분리하여 암호화 저장합니다.

## 스키마

```sql
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  brokerage_name VARCHAR(50),
  account_number VARCHAR(255),
  is_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_accounts_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| user_id | INTEGER | Y | FK → users.id | P1 |
| brokerage_name | VARCHAR(50) | N | 증권사 명 | P1 |
| account_number | VARCHAR(255) | N | AES-256 암호화된 계좌번호 | P1 |
| is_connected | BOOLEAN | Y | 연결 상태 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 관련 스펙
- DB: `users.md`
- DB: `token-vault.md`
- DB: `account-stock-entries.md`
- DB: `account-cash-entries.md`
