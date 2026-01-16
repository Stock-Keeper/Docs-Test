---
type: db
phase: P1
table: token_vault
related:
  db:
    - auth/users.md
    - account/accounts.md
  api: []
---

# token_vault 테이블

## 개요
사용자/계좌 토큰 암호화 저장소 (보안 강화)

> [!IMPORTANT]
> access_token, refresh_token을 AES-256-GCM으로 암호화하여 저장합니다.

## 스키마

```sql
CREATE TABLE token_vault (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  owner_type ENUM('USER', 'ACCOUNT') NOT NULL,
  owner_id INTEGER NOT NULL,
  token_type ENUM('ACCESS', 'REFRESH') NOT NULL,
  encrypted_token TEXT NOT NULL,
  iv VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_revoked BOOLEAN DEFAULT FALSE,
  
  INDEX idx_token_vault_owner (owner_type, owner_id),
  INDEX idx_token_vault_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| owner_type | ENUM | Y | USER/ACCOUNT | P1 |
| owner_id | INTEGER | Y | users.id 또는 accounts.id | P1 |
| token_type | ENUM | Y | ACCESS/REFRESH | P1 |
| encrypted_token | TEXT | Y | AES-256-GCM 암호화 | P1 |
| iv | VARCHAR(50) | Y | 초기화 벡터 | P1 |
| expires_at | TIMESTAMP | N | 만료 시간 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_revoked | BOOLEAN | Y | 폐기 여부 | P1 |

## 관련 스펙
- DB: `users.md`
- DB: `accounts.md`
