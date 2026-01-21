---
type: db
phase: P2
table: user_suspensions
related:
  api: []
  db:
    - specs/db/auth/users.md
---

# user_suspensions

> 사용자 정지 이력 테이블

## 스키마

```sql
-- 정지 이력
CREATE TABLE user_suspensions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 정지된 사용자
  admin_id INT,                                   -- 처리한 관리자
  reason TEXT NOT NULL,                           -- 정지 사유
  suspended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 정지 일시
  suspended_until TIMESTAMP,                      -- 정지 해제 예정 (NULL = 영구정지)
  lifted_at TIMESTAMP,                            -- 조기 해제 시 해제 일시
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_suspensions_user (user_id),
  INDEX idx_suspensions_user_until (user_id, suspended_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼            | 타입      | 필수 | 설명                         | Phase |
| --------------- | --------- | ---- | ---------------------------- | ----- |
| id              | INT       | Y    | PK, AUTO_INCREMENT           | P2    |
| user_id         | INT       | Y    | 정지된 사용자 ID (FK)        | P2    |
| admin_id        | INT       | N    | 처리한 관리자 ID (FK)        | P2    |
| reason          | TEXT      | Y    | 정지 사유                    | P2    |
| suspended_at    | TIMESTAMP | Y    | 정지 시작 일시               | P2    |
| suspended_until | TIMESTAMP | N    | 정지 해제 예정 (NULL = 영구) | P2    |
| lifted_at       | TIMESTAMP | N    | 조기 해제 일시               | P2    |
| created_at      | TIMESTAMP | Y    | 레코드 생성일                | P2    |

## 비즈니스 규칙

- 정지 시 `users.is_suspended = TRUE`, `users.suspended_until` 설정
- `suspended_until = NULL`이면 영구정지
- 조기 해제 시 `lifted_at` 설정 + `users.is_suspended = FALSE`
- 정지 기간은 관리자 재량으로 설정
- 정지 이력은 삭제하지 않고 보관 (감사 목적)

## 정지 상태 확인 쿼리

```sql
-- 현재 정지 상태 확인
SELECT
  u.is_suspended,
  u.suspended_until,
  CASE
    WHEN u.is_suspended = FALSE THEN '정상'
    WHEN u.suspended_until IS NULL THEN '영구정지'
    WHEN u.suspended_until > NOW() THEN CONCAT('정지중 (~', u.suspended_until, ')')
    ELSE '정지 만료'
  END as status
FROM users u
WHERE u.id = ?;

-- 정지 해제 예정자 목록 (배치 처리용)
SELECT user_id FROM users
WHERE is_suspended = TRUE
  AND suspended_until IS NOT NULL
  AND suspended_until <= NOW();
```

> [!IMPORTANT]
> 이 테이블과 연동하려면 `users` 테이블에 `is_suspended`, `suspended_until` 컬럼 추가 필요 (auth 도메인)
