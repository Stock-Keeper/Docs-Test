---
type: db
phase: P2
table: comments, replies
related:
  api:
    - ../api/community/comment-create.md
  db:
    - community/posts.md
---

# comments 테이블

## 개요
게시글 댓글 저장

## 스키마

```sql
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content VARCHAR(500) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_comments_post (post_id),
  INDEX idx_comments_user (user_id),
  INDEX idx_comments_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- P3: 대댓글 테이블
CREATE TABLE replies (
  id VARCHAR(36) PRIMARY KEY,
  comment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content VARCHAR(500) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_replies_comment (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세 (comments)

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | UUID | Y | PK | P2 |
| post_id | UUID | Y | 게시글 ID (FK) | P2 |
| user_id | UUID | Y | 작성자 ID (FK) | P2 |
| content | VARCHAR(500) | Y | 댓글 내용 | P2 |
| is_deleted | BOOLEAN | Y | 삭제 여부 (soft delete) | P2 |
| created_at | TIMESTAMP | Y | 작성일 | P2 |
| updated_at | TIMESTAMP | Y | 수정일 | P2 |

## 관련 스펙
- API: `../api/community/comment-create.md`
- DB: `posts.md`
