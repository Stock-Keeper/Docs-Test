---
type: db
phase: P1
table: user_consents
related:
  db:
    - auth/users.md
  api:
    - auth/consents-get.md
    - auth/consents-update.md
    - auth/terms.md
---

# user_consents 테이블

## 개요
사용자 동의 정보 저장 (이용약관, 개인정보, 마케팅)

## 스키마

```sql
CREATE TABLE user_consents (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  consent_type ENUM('TERMS', 'PRIVACY', 'MARKETING') NOT NULL,
  is_agreed BOOLEAN DEFAULT FALSE,
  agreed_at TIMESTAMP,
  version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_consents_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| user_id | INTEGER | Y | FK → users.id | P1 |
| consent_type | ENUM | Y | TERMS/PRIVACY/MARKETING | P1 |
| is_agreed | BOOLEAN | Y | 동의 여부 | P1 |
| agreed_at | TIMESTAMP | N | 동의 일시 | P1 |
| version | VARCHAR(20) | N | 약관 버전 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |

## 관련 스펙
- DB: `users.md`
