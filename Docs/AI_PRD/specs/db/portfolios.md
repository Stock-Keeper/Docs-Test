# portfolios, portfolio_items 테이블

## 개요
포트폴리오 및 포트폴리오 종목 저장

## 스키마

```sql
-- 포트폴리오 테이블
CREATE TABLE portfolios (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(20) NOT NULL,
  description VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  cash_krw DECIMAL(15,2) DEFAULT 0,
  cash_usd DECIMAL(15,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(255) UNIQUE,
  color_tag VARCHAR(20),
  like_count INT DEFAULT 0,
  copy_count INT DEFAULT 0,
  copied_from_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_portfolios_user (user_id),
  INDEX idx_portfolios_order (user_id, display_order),
  INDEX idx_portfolios_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 포트폴리오 종목 테이블
CREATE TABLE portfolio_items (
  id VARCHAR(36) PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL,
  stock_code VARCHAR(20) NOT NULL,
  stock_name VARCHAR(100) NOT NULL,
  quantity DECIMAL(15,4) NOT NULL,
  target_ratio DECIMAL(5,2) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  INDEX idx_items_portfolio (portfolio_id),
  UNIQUE INDEX idx_items_stock (portfolio_id, stock_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

### portfolios

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | UUID | Y | PK | P1 |
| user_id | UUID | Y | 소유자 ID | P1 |
| name | VARCHAR(20) | Y | 포트폴리오 이름 | P1 |
| description | VARCHAR(100) | N | 설명/메모 | P1 |
| is_default | BOOLEAN | Y | 기본 포트폴리오 여부 | P1 |
| display_order | INT | Y | 표시 순서 | P1 |
| cash_krw | DECIMAL | Y | 현금(원화) | P1 |
| cash_usd | DECIMAL | Y | 현금(달러) | P1 |
| is_public | BOOLEAN | Y | 공개 여부 | P2 |
| share_token | VARCHAR | N | 공유 링크 토큰 | P2 |
| color_tag | VARCHAR | N | 색상 태그 | P2 |
| like_count | INT | Y | 좋아요 수 (캐시) | P2 |
| copy_count | INT | Y | 복사 수 (캐시) | P2 |
| copied_from_id | UUID | N | 복사 원본 ID | P2 |

### portfolio_items

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | UUID | Y | PK | P1 |
| portfolio_id | UUID | Y | 포트폴리오 ID | P1 |
| stock_code | VARCHAR(20) | Y | 종목 코드 | P1 |
| stock_name | VARCHAR(100) | Y | 종목명 | P1 |
| quantity | DECIMAL | Y | 보유 수량 | P1 |
| target_ratio | DECIMAL | Y | 목표 비율 (%) | P1 |
| display_order | INT | Y | 표시 순서 | P1 |

## 유용한 쿼리

```sql
-- 회원가입 시 기본 포트폴리오 생성
INSERT INTO portfolios (id, user_id, name, is_default, display_order)
VALUES (UUID(), ?, '기본 포트폴리오', TRUE, 1);

-- 사용자 포트폴리오 개수
SELECT COUNT(*) FROM portfolios WHERE user_id = ?;

-- 목표 비율 합계 확인 (100% 검증)
SELECT SUM(target_ratio) FROM portfolio_items WHERE portfolio_id = ?;
```

## 관련 스펙
- API: `../api/portfolio/list.md`
- API: `../api/portfolio/detail.md`
