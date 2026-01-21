---
type: db
phase: P2
table: community_bookmarks
related:
  api: []
  db:
    - community/articles.md
---

# community_bookmarks 테이블

## 개요
사용자별 게시글 북마크(저장) 기능

## 스키마

```sql
CREATE TABLE community_bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 북마크한 사용자
  article_id INT NOT NULL,                        -- 북마크한 게시물
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES community_articles(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_bookmarks_user_article (user_id, article_id),
  INDEX idx_bookmarks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | 사용자 ID (FK) | P2 |
| article_id | INT | Y | 게시물 ID (FK) | P2 |
| created_at | TIMESTAMP | Y | 북마크 일시 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

## 비즈니스 규칙

- 사용자당 게시물당 1회만 북마크 가능 (UNIQUE 제약)
- 북마크 취소는 DELETE 또는 `is_delete = TRUE`

## 관련 스펙
- DB: `articles.md`
