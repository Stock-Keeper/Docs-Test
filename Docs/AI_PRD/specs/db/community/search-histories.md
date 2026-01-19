---
type: db
phase: P2
table: search_histories
related:
  api:
    - specs/api/community/search.md
  ui:
    - specs/ui/community/search.md
  db:
    - specs/db/auth/users.md
---

# search_histories

검색 이력 테이블. 사용자별 검색 기록 및 인기 검색어 집계에 활용.

## 스키마

```sql
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

## 컬럼 상세

| 컬럼        | 타입         | 필수 | 기본값            | 설명                                |
| ----------- | ------------ | ---- | ----------------- | ----------------------------------- |
| id          | INT          | Y    | AUTO_INCREMENT    | PK                                  |
| user_id     | INT          | Y    | -                 | 사용자 ID (FK)                      |
| query       | VARCHAR(100) | Y    | -                 | 검색어                              |
| search_type | ENUM         | Y    | ALL               | 검색 유형 (ALL/USER/ARTICLE/TICKER) |
| created_at  | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 검색 일시                           |

## 인덱스

| 인덱스명              | 컬럼              | 타입  | 용도               |
| --------------------- | ----------------- | ----- | ------------------ |
| idx_search_user       | user_id           | INDEX | 사용자별 검색 조회 |
| idx_search_query_time | query, created_at | INDEX | 인기 검색어 집계   |

## 비즈니스 규칙

- 동일 사용자가 동일 검색어를 재검색해도 **새 레코드로 기록** (중복 허용)
- 사용자별 **최근 검색어 조회**에 활용
- 전체 기준 **인기 검색어 집계**에 활용
- **90일 후 자동 삭제** (배치 작업)

## 유용한 쿼리

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

-- 90일 이상 된 기록 삭제 (배치)
DELETE FROM search_histories WHERE created_at < NOW() - INTERVAL 90 DAY;
```
