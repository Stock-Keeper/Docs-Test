---
type: db
phase: P2
table: user_blocks
related:
  api:
    - ../../api/community/block.md
  ui: []
---

# user_blocks 테이블

## 개요

사용자 차단 관계 저장 (P2)

## 스키마

```sql
-- 사용자 차단 (사용자가 타 사용자를 차단)
CREATE TABLE user_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blocker_id INT NOT NULL,                        -- 차단한 사람
  blocked_id INT NOT NULL,                        -- 차단당한 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_blocks_blocker_blocked (blocker_id, blocked_id),
  INDEX idx_blocks_blocker (blocker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼       | 타입      | 필수 | 설명                 |
| ---------- | --------- | ---- | -------------------- |
| id         | INT       | Y    | PK, AUTO_INCREMENT   |
| blocker_id | INT       | Y    | 차단한 사용자 (FK)   |
| blocked_id | INT       | Y    | 차단당한 사용자 (FK) |
| created_at | TIMESTAMP | Y    | 차단 일시            |

## 비즈니스 규칙

- 차단 시 자동 언팔로우 (양방향)
- 차단된 사용자는:
  - 차단한 사용자의 게시글/댓글 볼 수 없음
  - 차단한 사용자 검색 결과에서 제외
  - 차단한 사용자를 팔로우할 수 없음
- 차단 해제 시 레코드 DELETE

## 유용한 쿼리

```sql
-- 특정 사용자가 나를 차단했는지 확인
SELECT EXISTS(
  SELECT 1 FROM user_blocks 
  WHERE blocker_id = ? AND blocked_id = ?
) as is_blocked;

-- 차단 또는 차단당한 관계 확인 (양방향)
SELECT EXISTS(
  SELECT 1 FROM user_blocks 
  WHERE (blocker_id = ? AND blocked_id = ?) 
     OR (blocker_id = ? AND blocked_id = ?)
) as has_block_relation;

-- 내가 차단한 사용자 목록
SELECT u.* FROM user_blocks b
JOIN users u ON b.blocked_id = u.id
WHERE b.blocker_id = ?
ORDER BY b.created_at DESC;
```

## 관련 스펙

- API: `../../api/community/block.md`
