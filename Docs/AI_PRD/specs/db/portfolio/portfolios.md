---
type: db
phase: P1
table: portfolios
related:
    api:
        - specs/api/portfolio/list.md
        - specs/api/portfolio/detail.md
        - specs/api/portfolio/create.md
    db:
        - specs/db/portfolio/portfolio-stock-entries.md
        - specs/db/portfolio/portfolio-cash-entries.md
        - specs/db/portfolio/portfolio-copies.md
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

  -- 커뮤니티 공개 관련 (P2)
  is_public BOOLEAN DEFAULT FALSE,                -- 공개 여부
  like_count INT DEFAULT 0,                       -- 좋아요 수 (캐시)
  copy_count INT DEFAULT 0,                       -- 복사된 수 (캐시)
  copied_from_id INT,                             -- 원본 포트폴리오 ID (FK, 커뮤니티에서 복사 시)
  is_anonymous BOOLEAN DEFAULT FALSE,             -- 익명 공개 여부

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,                -- 논리적 삭제 여부
  delete_at TIMESTAMP,                            -- 논리적 삭제 일시

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (copied_from_id) REFERENCES portfolios(id) ON DELETE SET NULL,
  INDEX idx_portfolios_user_id (user_id),
  UNIQUE INDEX idx_portfolios_account (account_id),
  INDEX idx_portfolios_public (is_public),
  INDEX idx_portfolios_like (like_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼           | 타입         | 필수 | 설명                              | Phase |
| -------------- | ------------ | ---- | --------------------------------- | ----- |
| id             | INT          | Y    | PK, AUTO_INCREMENT                | P1    |
| user_id        | INT          | Y    | 사용자 ID (FK)                    | P1    |
| name           | VARCHAR(100) | Y    | 포트폴리오명                      | P1    |
| description    | TEXT         | N    | 설명                              | P1    |
| account_id     | INT          | N    | 연동 계좌 ID (FK, 1:1)            | P1    |
| banner_color   | VARCHAR(10)  | Y    | 배너 색상 (HEX)                   | P1    |
| is_public      | BOOLEAN      | Y    | 커뮤니티 공개 여부                | P2    |
| like_count     | INT          | Y    | 좋아요 수 (캐시)                  | P2    |
| copy_count     | INT          | Y    | 복사된 수 (캐시)                  | P2    |
| copied_from_id | INT          | N    | 원본 포트폴리오 ID (FK, 자기참조) | P2    |
| is_anonymous   | BOOLEAN      | Y    | 익명 공개 여부                    | P2    |
| created_at     | TIMESTAMP    | Y    | 생성일                            | P1    |
| updated_at     | TIMESTAMP    | N    | 수정일                            | P1    |
| is_delete      | BOOLEAN      | Y    | 논리적 삭제                       | P1    |
| delete_at      | TIMESTAMP    | N    | 삭제 일시                         | P1    |

## 인덱스

| 인덱스명               | 컬럼       | 타입   | 용도                        |
| ---------------------- | ---------- | ------ | --------------------------- |
| idx_portfolios_user_id | user_id    | INDEX  | 사용자별 포트폴리오 조회    |
| idx_portfolios_account | account_id | UNIQUE | 계좌 1:1 관계 보장          |
| idx_portfolios_public  | is_public  | INDEX  | 공개 포트폴리오 필터링 (P2) |
| idx_portfolios_like    | like_count | INDEX  | 좋아요 순 정렬 (P2)         |

## 비즈니스 규칙

- 사용자당 포트폴리오 개수 제한: 최대 5개
- 포트폴리오 삭제 시 논리적 삭제 (is_delete = TRUE)
- account_id는 1:1 관계 (계정당 하나의 포트폴리오만 연동 가능)
- **커뮤니티 공개 (P2)**: `is_public = TRUE` 시 커뮤니티 피드노노에 노수
- **like_count / copy_count**: 커뮤니티 사용자 행위 시 업데이트 (DB 트리거 또는 애플리케이션 레이어)
- **copied_from_id**: 커뮤니티에서 포트폴리오를 복사해 생성할 때 원본 ID 기록
- **is_anonymous**: 커뮤니티 공개 시 닉명 처리 여부

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

-- 커뮤니티 공개 포트폴리오 좋아요순 조회 (P2)
SELECT * FROM portfolios
WHERE is_public = TRUE AND is_delete = FALSE
ORDER BY like_count DESC
LIMIT 20;
```

## 주요 변경 이력

| 버전 | 변경 내용                                                                                 |
| ---- | ----------------------------------------------------------------------------------------- |
| P1   | 최초 생성 (user_id, name, description, account_id, banner_color)                          |
| P2   | 커뮤니티 공개 콼럼 추가 (is_public, like_count, copy_count, copied_from_id, is_anonymous) |

## 관련 스펙

- DB: `specs/db/portfolio/portfolio-stock-entries.md` - 포트폴리오 종목 엔트리
- DB: `specs/db/portfolio/portfolio-cash-entries.md` - 포트폴리오 현금 엔트리
- DB: `specs/db/portfolio/portfolio-copies.md` - 커뮤니티 사본 및 복사 이력
- API: `specs/api/portfolio/list.md`
- API: `specs/api/portfolio/detail.md`
- API: `specs/api/portfolio/create.md`
