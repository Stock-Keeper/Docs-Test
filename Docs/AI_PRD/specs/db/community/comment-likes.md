---
type: db
phase: P2
table: community_reply_likes
related:
  api: []
  db:
    - community/comments.md
---

# community_reply_likes 테이블

## 개요

커뮤니티 댓글에 대한 좋아요 기록

## 스키마

```sql
-- 댓글 좋아요
CREATE TABLE community_reply_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 좋아요 누른 사용자
  reply_id INT NOT NULL,                          -- 댓글
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_id) REFERENCES community_article_replies(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_reply_likes_user_reply (user_id, reply_id),
  INDEX idx_reply_likes_reply (reply_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | 사용자 ID (FK) | P2 |
| reply_id | INT | Y | 댓글 ID (FK) | P2 |
| created_at | TIMESTAMP | Y | 좋아요 일시 | P2 |

## UNIQUE 제약

- `(user_id, reply_id)` - 사용자당 댓글당 1회만 좋아요 가능

## 비즈니스 규칙

- 좋아요 취소 시 레코드 DELETE

## 좋아요 여부 확인 쿼리

```sql
SELECT EXISTS(
  SELECT 1 FROM community_reply_likes 
  WHERE reply_id = ? AND user_id = ?
) as is_liked;
```

## 관련 스펙

- DB: `community/comments.md`
