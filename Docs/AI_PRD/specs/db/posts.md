# posts 테이블

## 개요
커뮤니티 게시글 저장

## 스키마

```sql
CREATE TABLE posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category ENUM('포트폴리오', '토론', '질문', '국내주식', '해외주식', '자유') NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_posts_user (user_id),
  INDEX idx_posts_category (category),
  INDEX idx_posts_created (created_at DESC),
  INDEX idx_posts_like (like_count DESC),
  FULLTEXT INDEX idx_posts_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 게시글 이미지 테이블
CREATE TABLE post_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_post_images_post (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | UUID | Y | PK | P2 |
| user_id | UUID | Y | 작성자 ID (FK) | P2 |
| category | ENUM | Y | 카테고리 (6종) | P2 |
| title | VARCHAR(100) | Y | 제목 | P2 |
| content | TEXT | Y | 내용 (최대 3000자) | P2 |
| like_count | INT | Y | 좋아요 수 (캐시) | P2 |
| comment_count | INT | Y | 댓글 수 (캐시) | P2 |
| view_count | INT | Y | 조회 수 | P2 |
| is_deleted | BOOLEAN | Y | 삭제 여부 (soft delete) | P2 |
| created_at | TIMESTAMP | Y | 작성일 | P2 |
| updated_at | TIMESTAMP | Y | 수정일 | P2 |

## 관련 스펙
- API: `../api/community/post-create.md`
- API: `../api/community/feed-list.md`
- DB: `comments.md`
- DB: `post-likes.md`
