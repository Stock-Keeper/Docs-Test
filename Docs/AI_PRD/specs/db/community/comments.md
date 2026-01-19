---
type: db
phase: P2
table: community_article_replies
related:
  api:
    - ../api/community/comment-create.md
    - ../api/community/reply-create.md
  db:
    - community/articles.md
    - community/reply-likes.md
---

# community_article_replies 테이블

> 기존 `comments` + `replies` 테이블을 통합 대체

## 개요

커뮤니티 게시물의 댓글과 대댓글을 자기참조 구조로 통합 관리

## 스키마

```sql
-- 커뮤니티 댓글 (기존 comments + replies 통합 대체)
CREATE TABLE community_article_replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 작성자
  article_id INT NOT NULL,                        -- 게시물
  content TEXT NOT NULL,                          -- 댓글 내용
  parent_reply_id INT,                            -- 대댓글 자기참조 (NULL이면 최상위 댓글)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES community_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_reply_id) REFERENCES community_article_replies(id) ON DELETE CASCADE,
  INDEX idx_replies_article_id (article_id),
  INDEX idx_replies_article_delete (article_id, is_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | 작성자 ID (FK) | P2 |
| article_id | INT | Y | 게시물 ID (FK) | P2 |
| content | TEXT | Y | 댓글 내용 | P2 |
| parent_reply_id | INT | N | 상위 댓글 ID (자기참조) | P2 |
| created_at | TIMESTAMP | Y | 작성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

## 자기참조 구조

- `parent_reply_id = NULL` → 최상위 댓글
- `parent_reply_id = 다른 댓글 ID` → 대댓글

## 비즈니스 규칙

- 대댓글의 대댓글은 허용하지 않음 (1단계 깊이만)
- 삭제 시 soft delete (`is_delete = TRUE`, `delete_at` 기록)

## 댓글 조회 쿼리

```sql
-- 게시물의 모든 댓글 조회 (최상위 댓글만)
SELECT * FROM community_article_replies 
WHERE article_id = ? AND parent_reply_id IS NULL AND is_delete = FALSE
ORDER BY created_at;

-- 특정 댓글의 대댓글 조회
SELECT * FROM community_article_replies 
WHERE parent_reply_id = ? AND is_delete = FALSE
ORDER BY created_at;
```

## 관련 스펙

- API: `../api/community/comment-create.md`, `../api/community/reply-create.md`
- DB: `community/community-articles.md`, `community/reply-likes.md`
