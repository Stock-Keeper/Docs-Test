---
type: db
phase: P2
table: community_article_likes
related:
  api:
    - ../api/community/like.md
  db:
    - community/articles.md
---

# community_article_likes 테이블

> 기존 `post_likes` 테이블을 대체

## 개요

커뮤니티 게시물에 대한 좋아요 기록

## 스키마

```sql
-- 커뮤니티 게시물 좋아요 (기존 post_likes 대체)
CREATE TABLE community_article_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 좋아요 누른 사용자
  article_id INT NOT NULL,                        -- 게시물
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES community_articles(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_article_likes_user_article (user_id, article_id),
  INDEX idx_article_likes_article (article_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | 좋아요 누른 사용자 (FK) | P2 |
| article_id | INT | Y | 게시물 ID (FK) | P2 |
| created_at | TIMESTAMP | Y | 좋아요 일시 | P2 |

## UNIQUE 제약

- `(user_id, article_id)` - 사용자당 게시물당 1회만 좋아요 가능

## 비즈니스 규칙

- 좋아요 취소 시 레코드 DELETE

## 좋아요 여부 확인 쿼리

```sql
SELECT EXISTS(
  SELECT 1 FROM community_article_likes 
  WHERE article_id = ? AND user_id = ?
) as is_liked;
```

## 관련 스펙

- API: `../api/community/like.md`
- DB: `community/community-articles.md`
