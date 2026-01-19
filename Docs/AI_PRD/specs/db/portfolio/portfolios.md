---
type: db
phase: P1
table: portfolios
related:
  api:
    - ../api/portfolio/list.md
    - ../api/portfolio/detail.md
    - ../api/portfolio/create.md
  db:
    - ./portfolio-stock-entries.md
    - ./portfolio-cash-entries.md
---

# portfolios 테이블

## 개요

포트폴리오 기본 정보 저장. 종목/현금 엔트리는 별도 테이블로 분리됨.

## 스키마

```sql
-- 포트폴리오
CREATE TABLE portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 어떤 사용자의 포트폴리오인지
  name VARCHAR(100) NOT NULL,                     -- 포트폴리오명
  description TEXT,                               -- 포폴 설명
  account_id INT,                                 -- 한 계좌의 메인으로 설정된 포트폴리오인지 (1:1)
  banner_color VARCHAR(10) DEFAULT '#4CAF93',     -- 포트폴리오 배너 색상
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,                -- 논리적 삭제 여부
  delete_at TIMESTAMP,                            -- 논리적 삭제 일시

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  INDEX idx_portfolios_user_id (user_id),
  UNIQUE INDEX idx_portfolios_account (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P1 |
| user_id | INT | Y | 사용자 ID (FK) | P1 |
| name | VARCHAR(100) | Y | 포트폴리오명 | P1 |
| description | TEXT | N | 설명 | P1 |
| account_id | INT | N | 연동 계좌 ID (FK, 1:1) | P1 |
| banner_color | VARCHAR(10) | Y | 배너 색상 (HEX) | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | N | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 비즈니스 규칙

- 사용자당 포트폴리오 개수 제한: 최대 5개
- 포트폴리오 삭제 시 논리적 삭제 (is_delete = TRUE)
- account_id는 1:1 관계 (계정당 하나의 포트폴리오만 연동 가능)

## 유용한 쿼리

```sql
-- 사용자의 활성 포트폴리오 목록
SELECT * FROM portfolios 
WHERE user_id = ? AND is_delete = FALSE
ORDER BY created_at;

-- 사용자 포트폴리오 개수
SELECT COUNT(*) FROM portfolios 
WHERE user_id = ? AND is_delete = FALSE;

-- 논리적 삭제
UPDATE portfolios 
SET is_delete = TRUE, delete_at = CURRENT_TIMESTAMP 
WHERE id = ?;
```

## 관련 스펙

- DB: `./portfolio-stock-entries.md` - 포트폴리오 종목 엔트리
- DB: `./portfolio-cash-entries.md` - 포트폴리오 현금 엔트리
- API: `../api/portfolio/list.md`
- API: `../api/portfolio/detail.md`
- API: `../api/portfolio/create.md`
