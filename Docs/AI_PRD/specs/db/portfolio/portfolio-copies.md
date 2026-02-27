---
type: db
phase: P2
table: community_copied_portfolios, portfolio_copy_history
related:
    api:
        - specs/api/community/portfolio-copy.md
    db:
        - specs/db/portfolio/portfolios.md
        - specs/db/auth/users.md
        - specs/db/community/posts.md
---

# 포트폴리오 복사 관련 테이블

> P2 기준 재설계. 기존 단순 `portfolio_copies` 구조 → 커뮤니티 게시용 사본 + 복사 이력으로 분리.

## 테이블 구성

| 테이블명                      | 역할                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `community_copied_portfolios` | 커뮤니티 게시물에 첨부되는 포트폴리오 사본 (원본 스냅샷) |
| `portfolio_copy_history`      | 사용자가 커뮤니티 사본을 자신의 포트폴리오로 복사한 이력 |

---

## community_copied_portfolios 테이블

### 스키마

```sql
CREATE TABLE community_copied_portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_portfolio_id INT NOT NULL,               -- 원본 포트폴리오 (FK)
  user_id INT NOT NULL,                           -- 작성자 (FK)
  name VARCHAR(100),                              -- 포트폴리오명 (스냅샷)
  description TEXT,                               -- 설명 (스냅샷)
  banner_color VARCHAR(10) DEFAULT '#4CAF93',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,

  FOREIGN KEY (source_portfolio_id) REFERENCES portfolios(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_copied_portfolios_user (user_id),
  INDEX idx_copied_portfolios_source (source_portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼                | 타입         | 필수 | 설명                    | Phase |
| ------------------- | ------------ | ---- | ----------------------- | ----- |
| id                  | INT          | Y    | PK, AUTO_INCREMENT      | P2    |
| source_portfolio_id | INT          | Y    | 원본 포트폴리오 ID (FK) | P2    |
| user_id             | INT          | Y    | 작성자 ID (FK)          | P2    |
| name                | VARCHAR(100) | N    | 포트폴리오명 스냅샷     | P2    |
| description         | TEXT         | N    | 설명 스냅샷             | P2    |
| banner_color        | VARCHAR(10)  | N    | 배너 색상               | P2    |
| created_at          | TIMESTAMP    | Y    | 생성일                  | P2    |
| updated_at          | TIMESTAMP    | N    | 수정일                  | P2    |
| is_delete           | BOOLEAN      | Y    | 논리적 삭제             | P2    |
| delete_at           | TIMESTAMP    | N    | 삭제 일시               | P2    |

### 연관 테이블

- `community_copied_portfolio_stock_entries` — 사본 종목 항목
- `community_copied_portfolio_cash_entries` — 사본 현금 항목
- `community_articles.copied_portfolio_id` — 게시물과 연결

---

## portfolio_copy_history 테이블

사용자가 커뮤니티에 공유된 포트폴리오 사본을 자신의 포트폴리오로 복사한 이력.

### 스키마

```sql
CREATE TABLE portfolio_copy_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_copied_portfolio_id INT NOT NULL,        -- 원본 (커뮤니티 사본) (FK)
  target_portfolio_id INT NOT NULL,               -- 복사해서 만들어진 내 포트폴리오 (FK)
  user_id INT NOT NULL,                           -- 복사한 사용자 (FK)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (source_copied_portfolio_id) REFERENCES community_copied_portfolios(id),
  FOREIGN KEY (target_portfolio_id) REFERENCES portfolios(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_copy_history_user (user_id),
  INDEX idx_copy_history_source (source_copied_portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼                       | 타입      | 필수 | 설명                         | Phase |
| -------------------------- | --------- | ---- | ---------------------------- | ----- |
| id                         | INT       | Y    | PK, AUTO_INCREMENT           | P2    |
| source_copied_portfolio_id | INT       | Y    | 커뮤니티 사본 ID (FK)        | P2    |
| target_portfolio_id        | INT       | Y    | 복사된 내 포트폴리오 ID (FK) | P2    |
| user_id                    | INT       | Y    | 복사한 사용자 ID (FK)        | P2    |
| created_at                 | TIMESTAMP | Y    | 복사 시각                    | P2    |

---

## portfolios 테이블 추가 컬럼 (P2)

커뮤니티 공개 기능을 위해 portfolios 테이블에 추가:

```sql
ALTER TABLE portfolios ADD COLUMN is_public BOOLEAN DEFAULT FALSE;        -- 공개 여부
ALTER TABLE portfolios ADD COLUMN like_count INT DEFAULT 0;               -- 좋아요 수
ALTER TABLE portfolios ADD COLUMN copy_count INT DEFAULT 0;               -- 복사된 수
ALTER TABLE portfolios ADD COLUMN copied_from_id INT NULL;                -- 원본 포트폴리오 ID
ALTER TABLE portfolios ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE;     -- 익명 공개 여부

ALTER TABLE portfolios ADD INDEX idx_portfolios_public (is_public);
ALTER TABLE portfolios ADD INDEX idx_portfolios_like (like_count);
```

## 관련 스펙

- DB: `specs/db/portfolio/portfolios.md`
- API: `specs/api/community/portfolio-copy.md`
