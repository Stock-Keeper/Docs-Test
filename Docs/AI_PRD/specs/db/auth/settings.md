---
type: db
phase: P1
table: settings
related:
    db:
        - specs/db/auth/users.md
    api: []
---

# settings 테이블

## 개요

사용자별 개인 설정값 저장

## 스키마

```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  is_notification BOOLEAN DEFAULT TRUE,
  is_privacy BOOLEAN DEFAULT FALSE,
  is_tutorial_completed BOOLEAN DEFAULT FALSE,
  investment_type ENUM('STABLE', 'NEUTRAL', 'AGGRESSIVE') DEFAULT 'NEUTRAL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼                  | 타입      | 필수 | 설명                  | Phase |
| --------------------- | --------- | ---- | --------------------- | ----- |
| id                    | INTEGER   | Y    | PK, AUTO_INCREMENT    | P1    |
| user_id               | INTEGER   | Y    | FK → users.id, UNIQUE | P1    |
| is_notification       | BOOLEAN   | Y    | 알림 허용             | P1    |
| is_privacy            | BOOLEAN   | Y    | 개인정보 허용         | P1    |
| is_tutorial_completed | BOOLEAN   | Y    | 튜토리얼 완료         | P1    |
| investment_type       | ENUM      | Y    | 투자 성향 (STABLE/NEUTRAL/AGGRESSIVE) | P1 |
| created_at            | TIMESTAMP | Y    | 생성일                | P1    |
| updated_at            | TIMESTAMP | Y    | 수정일                | P1    |

## 관련 스펙

- DB: `users.md`
