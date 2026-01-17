# Community Search DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목             | 작업 | 기존 스펙 |
| ---------------- | ---- | --------- |
| search_histories | NEW  | -         |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 핵심 기능)
- **연관 기존 스펙**:
  - `specs/api/community/search.md` (API 스펙 존재)
  - `specs/ui/community/search.md` (UI 스펙 존재)
- **비교한 기존 스펙 파일**:
  - `specs/db/community/*.md` (5개 파일) - 해당 테이블 없음

---

## search_histories [NEW]

### 정형화된 초안

```sql
-- 검색 이력
CREATE TABLE search_histories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 검색한 사용자
  query VARCHAR(100) NOT NULL,                    -- 검색어
  search_type ENUM('ALL', 'USER', 'ARTICLE', 'TICKER') DEFAULT 'ALL', -- 검색 유형
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_search_user (user_id),
  INDEX idx_search_query_time (query, created_at)  -- 인기 검색어 집계용
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼        | 타입         | 필수 | 설명                              | Phase |
| ----------- | ------------ | ---- | --------------------------------- | ----- |
| id          | INT          | Y    | PK, AUTO_INCREMENT                | P2    |
| user_id     | INT          | Y    | 사용자 ID (FK)                    | P2    |
| query       | VARCHAR(100) | Y    | 검색어                            | P2    |
| search_type | ENUM         | Y    | 검색 유형 (ALL/USER/ARTICLE/TICKER) | P2    |
| created_at  | TIMESTAMP    | Y    | 검색 일시                         | P2    |

### 비즈니스 규칙

- 동일 사용자가 동일 검색어를 재검색해도 새 레코드로 기록 (중복 허용)
- 사용자별 최근 검색어 조회에 활용
- 전체 기준 인기 검색어 집계에 활용

### 유용한 쿼리

```sql
-- 사용자별 최근 검색어 (중복 제거, 최신 10개)
SELECT DISTINCT query, MAX(created_at) as last_searched
FROM search_histories
WHERE user_id = ?
GROUP BY query
ORDER BY last_searched DESC
LIMIT 10;

-- 전체 인기 검색어 (최근 24시간)
SELECT query, COUNT(*) as search_count
FROM search_histories
WHERE created_at >= NOW() - INTERVAL 24 HOUR
GROUP BY query
ORDER BY search_count DESC
LIMIT 10;

-- 사용자 검색 기록 삭제
DELETE FROM search_histories WHERE user_id = ?;

-- 특정 검색어 기록 삭제
DELETE FROM search_histories WHERE user_id = ? AND query = ?;
```

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **기존 API 스펙과의 정합성**
   - `specs/api/community/search.md`에서 type 파라미터: `STOCK, POST, USER`
   - inbox의 search_type: `ALL, USER, ARTICLE, TICKER`
   - 용어 통일 필요 (STOCK vs TICKER, POST vs ARTICLE)

2. **검색 기록 보관 정책**
   - 무한 보관 시 데이터 증가
   - 보관 기간 정책 필요 (예: 90일 후 자동 삭제)

### 사용자 결정 필요

**1. search_type ENUM 값 통일**

- [ ] 옵션 A (추천) - inbox 방식 유지: `ALL, USER, ARTICLE, TICKER`
- [ ] 옵션 B - API 스펙에 맞춤: `ALL, USER, POST, STOCK`
- [ ] 옵션 C - 둘 다 지원: `ALL, USER, ARTICLE, POST, TICKER, STOCK`

**2. 검색 기록 보관 정책**

- [ ] 옵션 A (추천) - 90일 후 자동 삭제 (배치)
- [ ] 옵션 B - 무기한 보관
- [ ] 옵션 C - 사용자당 최대 100개 유지

---

## 관련 스펙 (수정/생성 예정)

### API (수정 필요)

- `specs/api/community/search.md` → DB 참조 추가, type 용어 통일

### API (신규)

- `specs/api/community/search-history.md` - 사용자 검색 기록 조회/삭제
- `specs/api/community/popular-search.md` - 인기 검색어 조회

---

## ✅ Community 도메인 처리 완료 요약

| 서브도메인         | 생성된 파일                                | 항목 수 |
| ------------------ | ------------------------------------------ | ------- |
| profile            | `[NEW] db-community-profile.md`            | 3개     |
| article            | `[UPDATE] db-community-article.md`         | 4개     |
| social             | `[UPDATE] db-community-social.md`          | 3개     |
| follow             | `[UPDATE] db-community-follow.md`          | 2개     |
| moderation         | `[NEW] db-community-moderation.md`         | 3개     |
| portfolio-share    | `[NEW] db-community-portfolio-share.md`    | 4개     |
| badge              | `[UPDATE] db-community-badge.md`           | 2개     |
| search             | `[NEW] db-community-search.md`             | 1개     |
| **합계**           |                                            | **22개**|
