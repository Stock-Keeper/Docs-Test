---
type: db
phase: P1
table: api_call_logs
related:
  api:
    - ../api/admin/monitoring-api.md
---

# api_call_logs 테이블

## 개요
외부 API 호출 로그 (한투 API 모니터링용)

## 스키마

```sql
CREATE TABLE api_call_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  api_type VARCHAR(50) NOT NULL,
  endpoint VARCHAR(255),
  status_code INT,
  response_time_ms INT,
  user_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_api_logs_type_date (api_type, created_at),
  INDEX idx_api_logs_user (user_id),
  INDEX idx_api_logs_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P1 |
| api_type | VARCHAR(50) | Y | API 유형 (HANTOO_PRICE, HANTOO_SEARCH 등) | P1 |
| endpoint | VARCHAR(255) | N | 호출 엔드포인트 | P1 |
| status_code | INT | N | HTTP 응답 코드 | P1 |
| response_time_ms | INT | N | 응답 시간 (밀리초) | P1 |
| user_id | UUID | N | 호출한 사용자 ID | P1 |
| created_at | TIMESTAMP | Y | 호출 시각 | P1 |

## API 유형 (api_type)

| 값 | 설명 |
|----|------|
| HANTOO_PRICE | 한투 API - 시세 조회 |
| HANTOO_SEARCH | 한투 API - 종목 검색 |
| HANTOO_ACCOUNT | 한투 API - 계좌 정보 |

## 집계 쿼리 예시

```sql
-- 오늘 API 호출 횟수
SELECT COUNT(*) as today_count
FROM api_call_logs 
WHERE DATE(created_at) = CURDATE();

-- 최근 7일 일별 호출 횟수
SELECT DATE(created_at) as date, COUNT(*) as count
FROM api_call_logs
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY date;
```

## 관련 스펙
- API: `../api/admin/monitoring-api.md`
