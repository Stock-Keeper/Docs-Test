---
type: db
phase: P1
table: device_tokens
related:
  db:
    - auth/users.md
  api: []
---

# device_tokens 테이블

## 개요
푸시 알림용 디바이스 토큰 관리

## 스키마

```sql
CREATE TABLE device_tokens (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  token VARCHAR(500) NOT NULL,
  platform ENUM('IOS', 'ANDROID', 'WEB') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE INDEX idx_device_tokens_token (token),
  INDEX idx_device_tokens_user_platform (user_id, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| user_id | INTEGER | Y | FK → users.id | P1 |
| token | VARCHAR(500) | Y | 디바이스 토큰, UNIQUE | P1 |
| platform | ENUM | Y | IOS/ANDROID/WEB | P1 |
| is_active | BOOLEAN | Y | 활성화 여부 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |

## 관련 스펙
- DB: `users.md`
