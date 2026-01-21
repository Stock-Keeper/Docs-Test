# Community Social DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목                      | 작업   | 기존 스펙                                                 |
| ------------------------- | ------ | --------------------------------------------------------- |
| community_article_likes   | UPDATE | specs/db/community/likes.md (post_likes 테이블)           |
| community_article_replies | UPDATE | specs/db/community/comments.md (comments, replies 테이블) |
| community_reply_likes     | NEW    | -                                                         |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 핵심 기능)
- **연관 기존 스펙**:
  - `specs/db/community/likes.md`
  - `specs/db/community/comments.md`
  - `specs/api/community/like.md`
  - `specs/api/community/comment-create.md`
  - `specs/api/community/reply-create.md`
- **비교한 기존 스펙 파일**:
  - `specs/db/community/likes.md` ⭐ 정밀 비교 완료
  - `specs/db/community/comments.md` ⭐ 정밀 비교 완료

---

## community_article_likes [UPDATE]

> **기존 테이블명**: `post_likes` → **신규 테이블명**: `community_article_likes`

### 기존 스펙 요약 (likes.md)

```sql
CREATE TABLE post_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE INDEX idx_post_likes_unique (post_id, user_id),
  INDEX idx_post_likes_user (user_id)
);
```

### 변경 사항

| 구분     | 기존 (post_likes)         | 변경 (community_article_likes)       | 비고           |
| -------- | ------------------------- | ------------------------------------ | -------------- |
| 테이블명 | `post_likes`            | `community_article_likes`          | 명명 규칙 통일 |
| FK 참조  | `post_id → posts`      | `article_id → community_articles` | 테이블 변경    |
| 인덱스   | `idx_post_likes_unique` | `idx_article_likes_user_article`   | 명칭 변경      |

### 변경된 스키마

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

### 컬럼 상세

| 컬럼       | 타입      | 필수 | 설명                    | Phase | 변경      |
| ---------- | --------- | ---- | ----------------------- | ----- | --------- |
| id         | INT       | Y    | PK, AUTO_INCREMENT      | P2    | 유지      |
| user_id    | INT       | Y    | 좋아요 누른 사용자 (FK) | P2    | 타입 변경 |
| article_id | INT       | Y    | 게시물 ID (FK)          | P2    | 명칭 변경 |
| created_at | TIMESTAMP | Y    | 좋아요 일시             | P2    | 유지      |

### 비즈니스 규칙

- 사용자당 게시물당 1회만 좋아요 가능 (UNIQUE 제약)
- 좋아요 취소 시 레코드 DELETE

---

## community_article_replies [UPDATE]

> **기존 테이블명**: `comments`, `replies` → **신규 테이블명**: `community_article_replies`

### 기존 스펙 요약 (comments.md)

```sql
-- 댓글
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content VARCHAR(500) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 대댓글 (P3)
CREATE TABLE replies (
  id VARCHAR(36) PRIMARY KEY,
  comment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content VARCHAR(500) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 변경 사항

| 구분        | 기존 (comments + replies)  | 변경 (community_article_replies)     | 비고                |
| ----------- | -------------------------- | ------------------------------------ | ------------------- |
| 테이블 구조 | 댓글/대댓글 분리 (2개)     | 자기참조로 통합 (1개)                | **구조 변경** |
| 테이블명    | `comments`, `replies`  | `community_article_replies`        | 명명 규칙 통일      |
| FK 참조     | `post_id → posts`       | `article_id → community_articles` | 테이블 변경         |
| 대댓글 참조 | `comment_id → comments` | `parent_reply_id → self`          | 자기참조            |
| is_deleted  | `is_deleted`             | `is_delete`                        | 컬럼명 변경         |
| delete_at   | 없음                       | TIMESTAMP                            | **추가**      |

### 변경된 스키마

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

### 컬럼 상세

| 컬럼            | 타입      | 필수 | 설명                    | Phase | 변경           |
| --------------- | --------- | ---- | ----------------------- | ----- | -------------- |
| id              | INT       | Y    | PK, AUTO_INCREMENT      | P2    | 타입 변경      |
| user_id         | INT       | Y    | 작성자 ID (FK)          | P2    | 타입 변경      |
| article_id      | INT       | Y    | 게시물 ID (FK)          | P2    | 명칭 변경      |
| content         | TEXT      | Y    | 댓글 내용               | P2    | 타입 변경      |
| parent_reply_id | INT       | N    | 상위 댓글 ID (자기참조) | P2    | **신규** |
| created_at      | TIMESTAMP | Y    | 작성일                  | P2    | 유지           |
| updated_at      | TIMESTAMP | N    | 수정일                  | P2    | 유지           |
| is_delete       | BOOLEAN   | Y    | 논리적 삭제             | P2    | 명칭 변경      |
| delete_at       | TIMESTAMP | N    | 삭제 일시               | P2    | **신규** |

### 비즈니스 규칙

- `parent_reply_id = NULL` → 최상위 댓글
- `parent_reply_id = 다른 댓글 ID` → 대댓글
- 대댓글의 대댓글은 허용하지 않음 (1단계 깊이만)

---

## community_reply_likes [NEW]

### 정형화된 초안

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

### 컬럼 상세

| 컬럼       | 타입      | 필수 | 설명               | Phase |
| ---------- | --------- | ---- | ------------------ | ----- |
| id         | INT       | Y    | PK, AUTO_INCREMENT | P2    |
| user_id    | INT       | Y    | 사용자 ID (FK)     | P2    |
| reply_id   | INT       | Y    | 댓글 ID (FK)       | P2    |
| created_at | TIMESTAMP | Y    | 좋아요 일시        | P2    |

### 비즈니스 규칙

- 사용자당 댓글당 1회만 좋아요 가능 (UNIQUE 제약)
- 좋아요 취소 시 레코드 DELETE

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **댓글/대댓글 테이블 통합**

   - 기존: `comments` + `replies` 2개 테이블
   - 변경: `community_article_replies` 1개 테이블 + 자기참조
   - 마이그레이션 계획 필요
2. **portfolio_likes 테이블 유지 여부**

   - 기존 `likes.md`에 `portfolio_likes` 포함
   - inbox에서는 해당 테이블 언급 없음
   - 유지/삭제 결정 필요
3. **대댓글 깊이 제한**

   - 현재 구조상 무한 깊이 가능
   - 비즈니스 규칙으로 1단계만 허용 예정

### 사용자 결정 필요

**1. 댓글 테이블 구조 변경**

- [X] 옵션 A (추천) - 자기참조 단일 테이블 (`community_article_replies`)
- [ ] 옵션 B - 기존처럼 댓글/대댓글 분리 (2개 테이블)

**2. portfolio_likes 테이블 처리**

- [ ] 옵션 A - 그대로 유지
- [X] 옵션 B - 삭제 (community 도메인에서 제외)
- [ ] 옵션 C - `community_portfolio_likes`로 별도 처리 (portfolio-share 서브도메인)

---

## 관련 스펙 (수정/생성 예정)

### API (수정 필요)

- `specs/api/community/like.md` → 테이블명 변경 반영
- `specs/api/community/comment-create.md` → 테이블명 변경 반영
- `specs/api/community/reply-create.md` → 테이블명 변경 반영

### API (신규)

- `specs/api/community/reply-like.md` - 댓글 좋아요
