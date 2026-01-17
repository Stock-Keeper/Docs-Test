# Community Portfolio Share DB 스펙

## 원본 출처
> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 |
|------|------|----------|
| community_copied_portfolios | NEW | - |
| community_copied_portfolio_cash_entries | NEW | - |
| community_copied_portfolio_stock_entries | NEW | - |
| portfolio_copy_history | NEW | - |

## AI 분석 결과
- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 핵심 기능)
- **연관 기존 스펙**: 
  - `specs/api/community/portfolio-copy.md` (API 스펙 존재)
  - `specs/db/portfolio/portfolios.md` (원본 포트폴리오)
- **비교한 기존 스펙 파일**: 
  - `specs/db/community/*.md` (5개 파일) - 해당 테이블 없음
  - `specs/api/community/portfolio-copy.md` ⭐ 참조

---

## community_copied_portfolios [NEW]

### 정형화된 초안

```sql
-- 커뮤니티 게시용 포트폴리오 사본
CREATE TABLE community_copied_portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_portfolio_id INT NOT NULL,               -- 원본 포트폴리오 (FK)
  user_id INT NOT NULL,                           -- 사본 소유자/게시자
  name VARCHAR(100),                              -- 포트폴리오명
  description TEXT,                               -- 포트폴리오 설명
  banner_color VARCHAR(10) DEFAULT '#4CAF93',     -- 배너 색상
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (source_portfolio_id) REFERENCES portfolios(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_copied_portfolios_user (user_id),
  INDEX idx_copied_portfolios_source (source_portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| source_portfolio_id | INT | Y | 원본 포트폴리오 ID (FK) | P2 |
| user_id | INT | Y | 사본 소유자 ID (FK) | P2 |
| name | VARCHAR(100) | N | 포트폴리오명 | P2 |
| description | TEXT | N | 설명 | P2 |
| banner_color | VARCHAR(10) | Y | 배너 색상 | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

### 비즈니스 규칙
- 게시글 작성 시 포트폴리오를 첨부하면 해당 시점의 스냅샷이 이 테이블에 저장됨
- 원본 포트폴리오가 변경되어도 사본은 유지됨
- `community_articles.copied_portfolio_id`로 참조됨

---

## community_copied_portfolio_cash_entries [NEW]

### 정형화된 초안

```sql
-- 커뮤니티 게시용 포트폴리오 사본 - 현금 비중
CREATE TABLE community_copied_portfolio_cash_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  copied_portfolio_id INT NOT NULL,               -- 사본 포트폴리오 (FK)
  currency ENUM('KRW', 'USD', 'JPY') NOT NULL DEFAULT 'KRW', -- 통화
  target_weight DECIMAL(5,2),                     -- 목표 비중 (%)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (copied_portfolio_id) REFERENCES community_copied_portfolios(id) ON DELETE CASCADE,
  INDEX idx_copied_cash_portfolio (copied_portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| copied_portfolio_id | INT | Y | 사본 포트폴리오 ID (FK) | P2 |
| currency | ENUM | Y | 통화 (KRW/USD/JPY) | P2 |
| target_weight | DECIMAL(5,2) | N | 목표 비중 (%) | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

---

## community_copied_portfolio_stock_entries [NEW]

### 정형화된 초안

```sql
-- 커뮤니티 게시용 포트폴리오 사본 - 종목 항목
CREATE TABLE community_copied_portfolio_stock_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  copied_portfolio_id INT NOT NULL,               -- 사본 포트폴리오 (FK)
  group_name VARCHAR(50),                         -- 분류 그룹명
  ticker VARCHAR(20) NOT NULL,                    -- 종목 티커
  target_weight DECIMAL(5,2),                     -- 목표 비중 (%)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (copied_portfolio_id) REFERENCES community_copied_portfolios(id) ON DELETE CASCADE,
  INDEX idx_copied_stock_portfolio (copied_portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| copied_portfolio_id | INT | Y | 사본 포트폴리오 ID (FK) | P2 |
| group_name | VARCHAR(50) | N | 분류 그룹명 | P2 |
| ticker | VARCHAR(20) | Y | 종목 티커 | P2 |
| target_weight | DECIMAL(5,2) | N | 목표 비중 (%) | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

---

## portfolio_copy_history [NEW]

### 정형화된 초안

```sql
-- 포트폴리오 복사 이력
CREATE TABLE portfolio_copy_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_copied_portfolio_id INT NOT NULL,        -- 원본 (커뮤니티 사본)
  target_portfolio_id INT NOT NULL,               -- 복사해서 만들어진 내 포트폴리오
  user_id INT NOT NULL,                           -- 복사한 사용자
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (source_copied_portfolio_id) REFERENCES community_copied_portfolios(id),
  FOREIGN KEY (target_portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_copy_history_user (user_id),
  INDEX idx_copy_history_source (source_copied_portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| source_copied_portfolio_id | INT | Y | 커뮤니티 사본 포트폴리오 ID (FK) | P2 |
| target_portfolio_id | INT | Y | 복사된 내 포트폴리오 ID (FK) | P2 |
| user_id | INT | Y | 복사한 사용자 ID (FK) | P2 |
| created_at | TIMESTAMP | Y | 복사 일시 | P2 |

### 비즈니스 규칙
- 사용자가 커뮤니티에서 공유된 포트폴리오를 "내 포트폴리오로 복사" 시 기록
- 복사 카운트 집계, 인기 포트폴리오 랭킹에 활용
- 원본 작성자에게 알림 발송

### 복사 통계 쿼리

```sql
-- 특정 커뮤니티 사본의 복사 횟수
SELECT COUNT(*) as copy_count 
FROM portfolio_copy_history 
WHERE source_copied_portfolio_id = ?;

-- 사용자별 복사해 온 포트폴리오 목록
SELECT 
  pch.*,
  ccp.name as source_name,
  u.nickname as original_author
FROM portfolio_copy_history pch
JOIN community_copied_portfolios ccp ON pch.source_copied_portfolio_id = ccp.id
JOIN users u ON ccp.user_id = u.id
WHERE pch.user_id = ?
ORDER BY pch.created_at DESC;
```

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **기존 API 스펙과의 정합성**
   - `specs/api/community/portfolio-copy.md` 존재
   - API 스펙에서 참조하는 `portfolio-copies.md` DB 스펙은 없음
   - 테이블 구조 정렬 필요

2. **Phase 불일치**
   - 기존 API 스펙: P3
   - inbox 분석 기반 제안: P2
   - Phase 결정 필요

3. **복사 카운트 캐시**
   - API 스펙에서 `원본의 copy_count += 1` 언급
   - 어느 테이블에 캐시할지 결정 필요 (community_copied_portfolios? community_articles?)

### 사용자 결정 필요

**1. Phase 결정**
- [ ] 옵션 A (추천) - P2로 변경 (커뮤니티 핵심 기능)
- [ ] 옵션 B - P3 유지 (기존 API 스펙과 동일)

**2. 복사 카운트 캐시 위치**
- [ ] 옵션 A (추천) - `community_copied_portfolios.copy_count` 추가
- [ ] 옵션 B - `community_articles.copy_count` 추가 (게시글 단위)
- [ ] 옵션 C - 캐시 없이 매번 COUNT 쿼리

---

## 관련 스펙 (수정/생성 예정)

### API (수정 필요)
- `specs/api/community/portfolio-copy.md` → DB 참조 경로 수정, Phase 변경

### API (신규)
- `specs/api/community/portfolio-share.md` - 게시글 작성 시 포트폴리오 사본 생성

### UI
- `specs/ui/community/portfolio-share.md` - 포트폴리오 공유 선택 화면
- `specs/ui/community/portfolio-detail.md` - 공유된 포트폴리오 상세 화면
