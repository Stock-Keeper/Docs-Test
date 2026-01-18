# Portfolio DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목                    | 작업   | 기존 스펙                        |
| ----------------------- | ------ | -------------------------------- |
| portfolios              | UPDATE | specs/db/portfolio/portfolios.md |
| portfolio_stock_entries | SKIP   | ⏭️ 기존 스펙과 거의 동일         |
| portfolio_cash_entries  | SKIP   | ⏭️ 기존 스펙과 거의 동일         |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P1 (핵심 기능)
- **연관 기존 스펙**:
    - `specs/db/portfolio/portfolios.md`
    - `specs/db/portfolio/portfolio-stock-entries.md`
    - `specs/db/portfolio/portfolio-cash-entries.md`
- **비교한 기존 스펙 파일**:
    - `specs/db/portfolio/portfolios.md` ⭐ 정밀 비교 완료

---

## portfolios [UPDATE]

> **구조 간소화**: 커뮤니티/공유 관련 컬럼 제거, 계좌 연동 추가

### 기존 스펙 요약 (portfolios.md)

```sql
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

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 변경 사항

| 구분           | 기존               | 변경               | 비고                          |
| -------------- | ------------------ | ------------------ | ----------------------------- |
| PK 타입        | VARCHAR(36) (UUID) | INT AUTO_INCREMENT | 타입 변경                     |
| is_default     | BOOLEAN            | 삭제됨             | **제거**                      |
| display_order  | INT                | 삭제됨             | **제거**                      |
| cash_krw       | DECIMAL            | 삭제됨             | portfolio_cash_entries로 이동 |
| cash_usd       | DECIMAL            | 삭제됨             | portfolio_cash_entries로 이동 |
| is_public      | BOOLEAN            | 삭제됨             | 커뮤니티 분리                 |
| share_token    | VARCHAR            | 삭제됨             | 커뮤니티 분리                 |
| color_tag      | VARCHAR            | 삭제됨             | banner_color로 대체           |
| like_count     | INT                | 삭제됨             | 커뮤니티 분리                 |
| copy_count     | INT                | 삭제됨             | 커뮤니티 분리                 |
| copied_from_id | VARCHAR(36)        | 삭제됨             | 커뮤니티 분리                 |
| account_id     | 없음               | INT (FK)           | **신규 추가**                 |
| banner_color   | 없음               | VARCHAR            | **신규 추가**                 |
| is_delete      | 없음               | BOOLEAN            | **논리적 삭제**               |
| delete_at      | 없음               | TIMESTAMP          | **논리적 삭제**               |

### 변경된 스키마

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

### 컬럼 상세

| 컬럼         | 타입         | 필수 | 설명                   | Phase | 변경      |
| ------------ | ------------ | ---- | ---------------------- | ----- | --------- |
| id           | INT          | Y    | PK, AUTO_INCREMENT     | P1    | 타입 변경 |
| user_id      | INT          | Y    | 사용자 ID (FK)         | P1    | 타입 변경 |
| name         | VARCHAR(100) | Y    | 포트폴리오명           | P1    | 길이 확장 |
| description  | TEXT         | N    | 설명                   | P1    | 타입 확장 |
| account_id   | INT          | N    | 연동 계좌 ID (FK, 1:1) | P1    | **신규**  |
| banner_color | VARCHAR(10)  | Y    | 배너 색상 (HEX)        | P1    | **신규**  |
| created_at   | TIMESTAMP    | Y    | 생성일                 | P1    | 유지      |
| updated_at   | TIMESTAMP    | N    | 수정일                 | P1    | 유지      |
| is_delete    | BOOLEAN      | Y    | 논리적 삭제            | P1    | **신규**  |
| delete_at    | TIMESTAMP    | N    | 삭제 일시              | P1    | **신규**  |

### 비즈니스 규칙

- 사용자당 포트폴리오 개수 제한: 최대 5개
- 포트폴리오 삭제 시 논리적 삭제 (is_delete = TRUE)
- account_id는 1:1 관계 (단 계정당 하나의 포트폴리오만 연동 가능)

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **커뮤니티 관련 컬럼 제거**
    - 기존: `is_public`, `share_token`, `like_count`, `copy_count`, `copied_from_id`
    - inbox: 해당 컬럼 없음
    - 커뮤니티 공유 기능이 `community_copied_portfolios` 테이블로 분리됨

2. **is_default, display_order 제거**
    - 기존: 기본 포트폴리오 여부, 표시 순서 관리
    - inbox: 해당 컬럼 없음
    - 대체 로직 필요 여부 확인

3. **현금 관리 방식 변경**
    - 기존: portfolios 테이블에 `cash_krw`, `cash_usd` 직접 저장
    - inbox: `portfolio_cash_entries` 테이블로 완전 분리
    - 기존 컬럼 삭제 확인

4. **portfolio_items vs portfolio_stock_entries**
    - 기존 portfolios.md에 portfolio_items 포함
    - inbox에서는 portfolio_stock_entries로 분리
    - 테이블명 통일 필요

### 사용자 결정 필요

**1. 커뮤니티 관련 컬럼 처리**

- [x] 옵션 A (추천) - 삭제 (커뮤니티 도메인으로 완전 분리)
- [ ] 옵션 B - 유지 (기존 방식)

**2. is_default / display_order 컬럼**

- [ ] 옵션 A (추천) - 삭제 (가장 오래된 포트폴리오를 기본으로)
- [x] 옵션 B - 유지 (사용자가 기본 포트폴리오 지정 가능)

**3. portfolio_items 테이블명**

- [x] 옵션 A (추천) - `portfolio_stock_entries`로 통일
- [ ] 옵션 B - `portfolio_items` 유지

---

## 관련 스펙 (수정 필요)

### DB

- `specs/db/portfolio/portfolios.md` → 스키마 업데이트, portfolio_items 분리

### API

- `specs/api/portfolio/list.md` → 응답 스키마 업데이트
- `specs/api/portfolio/detail.md` → 응답 스키마 업데이트
- `specs/api/portfolio/create.md` → 요청 스키마 업데이트
