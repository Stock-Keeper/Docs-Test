---
type: db
phase: P2
table: user_follows
related:
  api:
    - ../../api/community/follow.md
  ui: []
---

# user_follows 테이블

## 개요

팔로우 관계 저장 (P2)

## 스키마

```sql
-- 팔로우 관계 (기존 follows 대체)
CREATE TABLE user_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL,                       -- 팔로우 하는 사람
  following_id INT NOT NULL,                      -- 팔로우 당하는 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_follows_follower_following (follower_id, following_id),
  INDEX idx_follows_follower (follower_id),
  INDEX idx_follows_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼         | 타입      | 필수 | 설명                    |
| ------------ | --------- | ---- | ----------------------- |
| id           | INT       | Y    | PK, AUTO_INCREMENT      |
| follower_id  | INT       | Y    | 팔로우 하는 사람 (FK)   |
| following_id | INT       | Y    | 팔로우 당하는 사람 (FK) |
| created_at   | TIMESTAMP | Y    | 팔로우 일시             |

## 비즈니스 규칙

- 자기 자신 팔로우 불가 (애플리케이션 레벨 검증)
- 팔로우/언팔로우 시 `community_profiles.follower_count`, `following_count` 캐시 업데이트
- 팔로우 시 알림 발송 (`community_settings.notify_new_follower = TRUE`인 경우)

## 유용한 쿼리

```sql
-- 내 팔로잉 수
SELECT COUNT(*) FROM user_follows WHERE follower_id = ?;

-- 내 팔로워 수
SELECT COUNT(*) FROM user_follows WHERE following_id = ?;

-- 팔로우 여부 확인
SELECT EXISTS(
  SELECT 1 FROM user_follows 
  WHERE follower_id = ? AND following_id = ?
) as is_following;

-- 팔로잉 목록
SELECT u.* FROM user_follows f
JOIN users u ON f.following_id = u.id
WHERE f.follower_id = ?
ORDER BY f.created_at DESC;
```

## 관련 스펙

- API: `../../api/community/follow.md`
