# error_logs 테이블

## 개요
에러 로그 기록 (모니터링용)

## 스키마

```sql
CREATE TABLE error_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level ENUM('ERROR', 'WARN', 'INFO') NOT NULL,
  error_code VARCHAR(50),
  message TEXT NOT NULL,
  stack_trace TEXT,
  request_path VARCHAR(255),
  request_method VARCHAR(10),
  request_body JSON,
  user_id VARCHAR(36),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_error_logs_level (level),
  INDEX idx_error_logs_created_at (created_at),
  INDEX idx_error_logs_level_date (level, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P1 |
| level | ENUM | Y | ERROR, WARN, INFO | P1 |
| error_code | VARCHAR(50) | N | HTTP 상태 코드 또는 커스텀 코드 | P1 |
| message | TEXT | Y | 에러 메시지 | P1 |
| stack_trace | TEXT | N | 스택 트레이스 (ERROR 레벨) | P1 |
| request_path | VARCHAR(255) | N | 요청 API 경로 | P1 |
| request_method | VARCHAR(10) | N | GET, POST, PUT, DELETE 등 | P1 |
| request_body | JSON | N | 요청 바디 (민감 정보 제외) | P1 |
| user_id | UUID | N | 에러 발생 사용자 ID | P1 |
| ip_address | VARCHAR(45) | N | 요청 IP 주소 | P1 |
| created_at | TIMESTAMP | Y | 에러 발생 시각 | P1 |

## 보관 정책

- **보관 기간**: 30일
- **자동 삭제**: 30일 경과 시 배치 작업으로 삭제

```sql
-- 30일 지난 로그 삭제 (매일 실행)
DELETE FROM error_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## 관련 스펙
- API: `../api/admin/monitoring-errors.md`
