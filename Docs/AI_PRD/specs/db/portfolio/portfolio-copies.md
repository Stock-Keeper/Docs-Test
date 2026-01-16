---
type: db
phase: P3
table: portfolio_copies
related:
  api:
    - ../api/community/portfolio-copy.md
---

# portfolio_copies 테이블

## 개요
포트폴리오 복사 기록

## 스키마

```sql
CREATE TABLE portfolio_copies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_portfolio_id VARCHAR(36) NOT NULL,
  copied_portfolio_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (original_portfolio_id) REFERENCES portfolios(id),
  FOREIGN KEY (copied_portfolio_id) REFERENCES portfolios(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_copies_original (original_portfolio_id),
  INDEX idx_copies_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | INT | Y | PK, AUTO_INCREMENT |
| original_portfolio_id | UUID | Y | 원본 포트폴리오 ID |
| copied_portfolio_id | UUID | Y | 복사된 포트폴리오 ID |
| user_id | UUID | Y | 복사한 사용자 ID |
| created_at | TIMESTAMP | Y | 복사 시각 |

## portfolios 테이블 추가 컬럼

```sql
ALTER TABLE portfolios ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE portfolios ADD COLUMN like_count INT DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN copy_count INT DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN copied_from_id VARCHAR(36) NULL;
ALTER TABLE portfolios ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE;

ALTER TABLE portfolios ADD INDEX idx_portfolios_public (is_public);
ALTER TABLE portfolios ADD INDEX idx_portfolios_like (like_count DESC);
```

## 관련 스펙
- API: `../api/community/portfolio-copy.md`
