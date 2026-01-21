---
type: db
phase: P2
table: community_articles
related:
  api:
    - ../api/community/post-create.md
    - ../api/community/feed-list.md
  db:
    - community/comments.md
    - community/article-images.md
    - community/article-categories.md
    - community/bookmarks.md
---

# community_articles 테이블

## 개요
커뮤니티 게시글 저장 (기존 `posts` 테이블 대체)

## 스키마

```sql
CREATE TABLE community_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 작성자
  category_id INT,                                -- 게시물 말머리 (FK)
  title VARCHAR(100) NOT NULL,                    -- 제목
  content TEXT NOT NULL,                          -- 본문
  copied_portfolio_id INT,                        -- 공유된 포트폴리오 사본 (FK)
  views INT DEFAULT 0,                            -- 조회수
  like_count INT DEFAULT 0,                       -- 좋아요 수 (캐시)
  comment_count INT DEFAULT 0,                    -- 댓글 수 (캐시)
  visibility_status ENUM('PUBLIC', 'PRIVATE', 'FOLLOWERS_ONLY', 'HIDDEN_BY_ADMIN') DEFAULT 'PUBLIC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES community_article_categories(id),
  FOREIGN KEY (copied_portfolio_id) REFERENCES community_copied_portfolios(id),
  INDEX idx_articles_user_id (user_id),
  INDEX idx_articles_user_delete (user_id, is_delete),
  INDEX idx_articles_user_visibility (user_id, visibility_status),
  INDEX idx_articles_user_visibility_delete (user_id, visibility_status, is_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | 작성자 ID (FK) | P2 |
| category_id | INT | N | 말머리 카테고리 (FK) | P2 |
| title | VARCHAR(100) | Y | 제목 | P2 |
| content | TEXT | Y | 본문 | P2 |
| copied_portfolio_id | INT | N | 공유 포트폴리오 사본 (FK) | P2 |
| views | INT | Y | 조회수 | P2 |
| like_count | INT | Y | 좋아요 수 (캐시) | P2 |
| comment_count | INT | Y | 댓글 수 (캐시) | P2 |
| visibility_status | ENUM | Y | 공개 상태 | P2 |
| created_at | TIMESTAMP | Y | 작성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

## 마이그레이션 노트

> 기존 `posts` 테이블에서 변경됨
> - 테이블명: `posts` → `community_articles`
> - `category` ENUM → `category_id` FK (정규화)
> - `view_count` → `views`
> - `is_deleted` → `is_delete`
> - 추가 컬럼: `copied_portfolio_id`, `visibility_status`, `delete_at`

## 관련 스펙
- API: `../api/community/post-create.md`
- API: `../api/community/feed-list.md`
- DB: `comments.md`, `article-images.md`, `article-categories.md`, `bookmarks.md`
