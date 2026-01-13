# follows 테이블

## 개요
팔로우 관계 저장 (P3)

## 스키마

```sql
CREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id VARCHAR(36) NOT NULL,      -- 팔로우 하는 사람
  following_id VARCHAR(36) NOT NULL,     -- 팔로우 당하는 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_follows_unique (follower_id, following_id),
  INDEX idx_follows_follower (follower_id),
  INDEX idx_follows_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | INT | Y | PK |
| follower_id | UUID | Y | 팔로우 하는 사람 ID |
| following_id | UUID | Y | 팔로우 당하는 사람 ID |
| created_at | TIMESTAMP | Y | 팔로우 시각 |

## 유용한 쿼리

```sql
-- 내 팔로잉 수
SELECT COUNT(*) FROM follows WHERE follower_id = ?;

-- 내 팔로워 수
SELECT COUNT(*) FROM follows WHERE following_id = ?;

-- 팔로우 여부 확인
SELECT EXISTS(
  SELECT 1 FROM follows 
  WHERE follower_id = ? AND following_id = ?
) as is_following;

-- 팔로잉 목록
SELECT u.* FROM follows f
JOIN users u ON f.following_id = u.id
WHERE f.follower_id = ?
ORDER BY f.created_at DESC;
```

## users 테이블 캐시 컬럼 추가

```sql
ALTER TABLE users ADD COLUMN follower_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN following_count INT DEFAULT 0;
```

## 관련 스펙
- API: `../api/community/follow.md`
- API: `../api/community/profile.md`
