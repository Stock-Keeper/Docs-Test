# Community Article DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목                         | 작업   | 기존 스펙                                        |
| ---------------------------- | ------ | ------------------------------------------------ |
| community_articles           | UPDATE | specs/db/community/posts.md (posts 테이블)       |
| community_article_images     | UPDATE | specs/db/community/posts.md (post_images 테이블) |
| community_article_categories | NEW    | -                                                |
| community_bookmarks          | NEW    | -                                                |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 핵심 기능)
- **연관 기존 스펙**:
  - `specs/db/community/posts.md`
  - `specs/db/community/comments.md`
  - `specs/api/community/post-create.md`
  - `specs/api/community/feed-list.md`
- **비교한 기존 스펙 파일**:
  - `specs/db/community/posts.md` ⭐ 정밀 비교 완료

---

## community_articles [UPDATE]

> **기존 테이블명**: `posts` → **신규 테이블명**: `community_articles`

### 기존 스펙 요약 (posts.md)

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 변경 사항

| 구분                | 기존 (posts)    | 변경 (community_articles)                                      | 비고           |
| ------------------- | --------------- | -------------------------------------------------------------- | -------------- |
| 테이블명            | `posts`       | `community_articles`                                         | 명명 규칙 통일 |
| category            | ENUM (6종) 컬럼 | FK →`community_article_categories.id`                       | 정규화         |
| views               | `view_count`  | `views`                                                      | 컬럼명 변경    |
| copied_portfolio_id | 없음            | FK →`community_copied_portfolios.id`                        | **추가** |
| visibility_status   | 없음            | ENUM('PUBLIC', 'PRIVATE', 'FOLLOWERS_ONLY', 'HIDDEN_BY_ADMIN') | **추가** |
| is_delete           | `is_deleted`  | `is_delete`                                                  | 컬럼명 변경    |
| delete_at           | 없음            | TIMESTAMP                                                      | **추가** |

### 변경된 스키마

```sql
-- 커뮤니티 게시물 (기존 posts 대체)
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

### 컬럼 상세

| 컬럼                | 타입         | 필수 | 설명                      | Phase | 변경           |
| ------------------- | ------------ | ---- | ------------------------- | ----- | -------------- |
| id                  | INT          | Y    | PK, AUTO_INCREMENT        | P2    | 타입 변경      |
| user_id             | INT          | Y    | 작성자 ID (FK)            | P2    | 유지           |
| category_id         | INT          | N    | 말머리 카테고리 (FK)      | P2    | **신규** |
| title               | VARCHAR(100) | Y    | 제목                      | P2    | 유지           |
| content             | TEXT         | Y    | 본문                      | P2    | 유지           |
| copied_portfolio_id | INT          | N    | 공유 포트폴리오 사본 (FK) | P2    | **신규** |
| views               | INT          | Y    | 조회수                    | P2    | 명칭 변경      |
| like_count          | INT          | Y    | 좋아요 수 (캐시)          | P2    | 유지           |
| comment_count       | INT          | Y    | 댓글 수 (캐시)            | P2    | 유지           |
| visibility_status   | ENUM         | Y    | 공개 상태                 | P2    | **신규** |
| created_at          | TIMESTAMP    | Y    | 작성일                    | P2    | 유지           |
| updated_at          | TIMESTAMP    | N    | 수정일                    | P2    | 유지           |
| is_delete           | BOOLEAN      | Y    | 논리적 삭제               | P2    | 명칭 변경      |
| delete_at           | TIMESTAMP    | N    | 삭제 일시                 | P2    | **신규** |

---

## community_article_images [UPDATE]

> **기존 테이블명**: `post_images` → **신규 테이블명**: `community_article_images`

### 기존 스펙 요약 (posts.md 내 post_images)

```sql
CREATE TABLE post_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 변경 사항

| 구분          | 기존 (post_images)   | 변경 (community_article_images)      | 비고           |
| ------------- | -------------------- | ------------------------------------ | -------------- |
| 테이블명      | `post_images`      | `community_article_images`         | 명명 규칙 통일 |
| FK 참조       | `post_id → posts` | `article_id → community_articles` | 테이블 변경    |
| display_order | `display_order`    | `sort_order`                       | 컬럼명 변경    |
| updated_at    | 없음                 | TIMESTAMP                            | **추가** |
| is_delete     | 없음                 | BOOLEAN                              | **추가** |
| delete_at     | 없음                 | TIMESTAMP                            | **추가** |

### 변경된 스키마

```sql
-- 커뮤니티 게시물 이미지 (기존 post_images 대체)
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

---

## community_article_categories [NEW]

### 정형화된 초안

```sql
-- 커뮤니티 게시물 카테고리 (관리자 설정용)
CREATE TABLE community_article_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,               -- 코드 (예: 'PORTFOLIO', 'DISCUSS')
  name VARCHAR(50) NOT NULL,                      -- 표시명 (예: '포트폴리오', '토론')
  sort_order INT,                                 -- 정렬 순서 (UI 표시용)
  is_active BOOLEAN DEFAULT TRUE,                 -- 활성화 여부
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  UNIQUE INDEX idx_article_categories_code (code),
  INDEX idx_article_categories_code_delete (code, is_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼       | 타입        | 필수 | 설명                   | Phase |
| ---------- | ----------- | ---- | ---------------------- | ----- |
| id         | INT         | Y    | PK, AUTO_INCREMENT     | P2    |
| code       | VARCHAR(50) | Y    | 카테고리 코드 (UNIQUE) | P2    |
| name       | VARCHAR(50) | Y    | 표시명                 | P2    |
| sort_order | INT         | N    | 정렬 순서              | P2    |
| is_active  | BOOLEAN     | Y    | 활성화 여부            | P2    |
| created_at | TIMESTAMP   | Y    | 생성일                 | P2    |
| updated_at | TIMESTAMP   | N    | 수정일                 | P2    |
| is_delete  | BOOLEAN     | Y    | 논리적 삭제            | P2    |
| delete_at  | TIMESTAMP   | N    | 삭제 일시              | P2    |

### 초기 데이터 (기존 ENUM 값 기반)

```sql
INSERT INTO community_article_categories (code, name, sort_order) VALUES
('PORTFOLIO', '포트폴리오', 1),
('DISCUSS', '토론', 2),
('QUESTION', '질문', 3),
('KR_STOCK', '국내주식', 4),
('US_STOCK', '해외주식', 5),
('FREE', '자유', 6);
```

### 비즈니스 규칙

- 기존 `posts.category` ENUM 값을 정규화하여 별도 테이블로 분리
- 관리자가 카테고리 추가/수정/비활성화 가능
- `is_active = FALSE`인 카테고리는 신규 게시글 작성 시 선택 불가

---

## community_bookmarks [NEW]

### 정형화된 초안

```sql
-- 게시글 북마크
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

### 컬럼 상세

| 컬럼       | 타입      | 필수 | 설명               | Phase |
| ---------- | --------- | ---- | ------------------ | ----- |
| id         | INT       | Y    | PK, AUTO_INCREMENT | P2    |
| user_id    | INT       | Y    | 사용자 ID (FK)     | P2    |
| article_id | INT       | Y    | 게시물 ID (FK)     | P2    |
| created_at | TIMESTAMP | Y    | 북마크 일시        | P2    |
| updated_at | TIMESTAMP | N    | 수정일             | P2    |
| is_delete  | BOOLEAN   | Y    | 논리적 삭제        | P2    |
| delete_at  | TIMESTAMP | N    | 삭제 일시          | P2    |

### 비즈니스 규칙

- 사용자당 게시물당 1회만 북마크 가능 (UNIQUE 제약)
- 북마크 취소는 DELETE 또는 is_delete = TRUE

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **테이블명 변경 (`posts` → `community_articles`)**

   - 기존 스펙과 테이블명이 다름
   - 마이그레이션 스크립트 필요
2. **카테고리 정규화**

   - 기존: ENUM 타입으로 하드코딩
   - 변경: 별도 테이블 (`community_article_categories`)로 분리
   - 장점: 런타임에 카테고리 추가/수정 가능
3. **`visibility_status` 필드 추가**

   - 기존 `is_deleted`만으로는 팔로워 전용 공개, 관리자 숨김 표현 불가
   - 새로운 ENUM 추가: 'PUBLIC', 'PRIVATE', 'FOLLOWERS_ONLY', 'HIDDEN_BY_ADMIN'

### 사용자 결정 필요

**1. 테이블명 변경 전략**

- [X] 옵션 A (추천) - `posts` → `community_articles` 마이그레이션 진행
- [ ] 옵션 B - 기존 `posts` 유지, 신규 컬럼만 추가

**2. 카테고리 정규화 적용**

- [X] 옵션 A (추천) - 별도 테이블로 정규화 (`community_article_categories`)
- [ ] 옵션 B - 기존 ENUM 유지

---

## 관련 스펙 (수정/생성 예정)

### API (수정 필요)

- `specs/api/community/post-create.md` → 테이블명 변경 반영
- `specs/api/community/feed-list.md` → 테이블명 변경 반영

### API (신규)

- `specs/api/community/bookmark.md` - 북마크 추가/삭제

### UI

- `specs/ui/community/post-write.md` - 게시글 작성 화면
- `specs/ui/community/post-detail.md` - 게시글 상세 화면
