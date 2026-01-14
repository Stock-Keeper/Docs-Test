# 좋아요 테이블 (post_likes, portfolio_likes)

## 개요
게시글/포트폴리오 좋아요 기록

## 스키마

```sql
-- 게시글 좋아요
CREATE TABLE post_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE INDEX idx_post_likes_unique (post_id, user_id),
  INDEX idx_post_likes_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 포트폴리오 좋아요
CREATE TABLE portfolio_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE INDEX idx_portfolio_likes_unique (portfolio_id, user_id),
  INDEX idx_portfolio_likes_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | INT | Y | PK, AUTO_INCREMENT |
| post_id / portfolio_id | UUID | Y | 대상 ID (FK) |
| user_id | UUID | Y | 좋아요 한 사용자 ID (FK) |
| created_at | TIMESTAMP | Y | 좋아요 시각 |

## UNIQUE 제약

- `(post_id, user_id)` - 사용자당 게시글별 1회
- `(portfolio_id, user_id)` - 사용자당 포트폴리오별 1회

## 좋아요 여부 확인 쿼리

```sql
SELECT EXISTS(
  SELECT 1 FROM post_likes 
  WHERE post_id = ? AND user_id = ?
) as is_liked;
```

## 관련 스펙
- API: `../api/community/like.md`
