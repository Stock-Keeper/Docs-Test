---
type: db
phase: P1
table: audit_logs
related:
  db:
    - specs/db/auth/users.md
  api: []
---

# audit_logs 테이블

## 개요

보안 및 감사 추적 로그 (CRUD 작업, 로그인 등)

> [!IMPORTANT]
> 보안/감사 목적의 테이블로, 데이터 삭제가 필요한 경우 보존 기간 정책을 별도로 정의해야 합니다.

## 스키마

```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER,
  action ENUM('LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT') NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_audit_logs_user_id (user_id),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  INDEX idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| user_id | INTEGER | N | FK → users.id (NULL = 시스템) | P1 |
| action | ENUM | Y | LOGIN/LOGIN_FAILED/LOGOUT/CREATE/UPDATE/DELETE/VIEW/EXPORT | P1 |
| entity_type | VARCHAR(50) | Y | 대상 테이블명 | P1 |
| entity_id | INTEGER | N | 대상 레코드 ID | P1 |
| old_value | JSON | N | 변경 전 값 | P1 |
| new_value | JSON | N | 변경 후 값 (LOGIN_FAILED 시 reason 포함) | P1 |
| ip_address | VARCHAR(45) | N | 접속 IP | P1 |
| user_agent | TEXT | N | 앱/브라우저 정보 | P1 |
| created_at | TIMESTAMP | Y | 로그 생성일 | P1 |

## 관련 스펙

- DB: `specs/db/auth/users.md`
