---
type: db
phase: P2
table: nickname_histories
related:
  api: []
  ui: []
  db:
    - specs/db/auth/users.md
    - specs/db/community/profiles.md
---

# nickname_histories

닉네임 변경 이력 테이블 (분쟁 방지용).

## 스키마

```sql
CREATE TABLE nickname_histories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  old_nickname VARCHAR(50),                       -- 이전 닉네임
  new_nickname VARCHAR(50),                       -- 새 닉네임
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_nickname_histories_user (user_id),
  INDEX idx_nickname_histories_old (old_nickname),
  INDEX idx_nickname_histories_new (new_nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼         | 타입        | 필수 | 기본값            | 설명          |
| ------------ | ----------- | ---- | ----------------- | ------------- |
| id           | INT         | Y    | AUTO_INCREMENT    | PK            |
| user_id      | INT         | Y    | -                 | users.id (FK) |
| old_nickname | VARCHAR(50) | N    | NULL              | 이전 닉네임   |
| new_nickname | VARCHAR(50) | N    | NULL              | 새 닉네임     |
| changed_at   | TIMESTAMP   | Y    | CURRENT_TIMESTAMP | 변경 일시     |

## 인덱스

| 인덱스명                   | 컬럼         | 타입  | 용도              |
| -------------------------- | ------------ | ----- | ----------------- |
| idx_nickname_histories_user| user_id      | INDEX | 사용자별 이력조회 |
| idx_nickname_histories_old | old_nickname | INDEX | 이전 닉네임 검색  |
| idx_nickname_histories_new | new_nickname | INDEX | 새 닉네임 검색    |

## 비즈니스 규칙

- 분쟁 발생 시 **이전 사용자 추적 가능**
- 닉네임 변경 시 **자동 기록**
