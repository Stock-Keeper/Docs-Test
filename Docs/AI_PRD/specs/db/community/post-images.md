---
type: db
phase: P2
table: community_article_images
related:
  api: []
  db:
    - community/articles.md
---

# community_article_images 테이블

## 개요
커뮤니티 게시글 첨부 이미지 저장 (기존 `post_images` 테이블 대체)

## 스키마

```sql
CREATE TABLE community_article_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,                        -- 게시물 ID (FK)
  image_url VARCHAR(500) NOT NULL,                -- 이미지 경로
  sort_order INT DEFAULT 0,                       -- 이미지 순서
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,

  FOREIGN KEY (article_id) REFERENCES community_articles(id) ON DELETE CASCADE,
  INDEX idx_article_images_article_id (article_id),
  INDEX idx_article_images_article_delete (article_id, is_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| article_id | INT | Y | 게시물 ID (FK) | P2 |
| image_url | VARCHAR(500) | Y | 이미지 경로 | P2 |
| sort_order | INT | Y | 표시 순서 | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

## 마이그레이션 노트

> 기존 `post_images` 테이블에서 변경됨
> - 테이블명: `post_images` → `community_article_images`
> - FK: `post_id` → `article_id`
> - `display_order` → `sort_order`
> - 추가 컬럼: `updated_at`, `is_delete`, `delete_at`

## 관련 스펙
- DB: `articles.md`
