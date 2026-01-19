---
type: db
phase: P2
table: community_article_categories
related:
  api: []
  db:
    - community/articles.md
---

# community_article_categories 테이블

## 개요
커뮤니티 게시글 카테고리(말머리) 관리 테이블. 기존 `posts.category` ENUM을 정규화.

## 스키마

```sql
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

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| code | VARCHAR(50) | Y | 카테고리 코드 (UNIQUE) | P2 |
| name | VARCHAR(50) | Y | 표시명 | P2 |
| sort_order | INT | N | 정렬 순서 | P2 |
| is_active | BOOLEAN | Y | 활성화 여부 | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

## 초기 데이터

```sql
INSERT INTO community_article_categories (code, name, sort_order) VALUES
('PORTFOLIO', '포트폴리오', 1),
('DISCUSS', '토론', 2),
('QUESTION', '질문', 3),
('KR_STOCK', '국내주식', 4),
('US_STOCK', '해외주식', 5),
('FREE', '자유', 6);
```

## 비즈니스 규칙

- 기존 `posts.category` ENUM 값을 정규화하여 별도 테이블로 분리
- 관리자가 카테고리 추가/수정/비활성화 가능
- `is_active = FALSE`인 카테고리는 신규 게시글 작성 시 선택 불가

## 관련 스펙
- DB: `articles.md`
