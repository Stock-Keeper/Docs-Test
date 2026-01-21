---
type: db
phase: P1
table: error_logs
related:
    api:
        - specs/api/admin/monitoring-errors.md
---

# error_logs 테이블

## 개요

시스템 에러 로그 저장 및 모니터링

## 스키마

| 컬럼        | 타입         | 필수 | 설명                |
| ----------- | ------------ | ---- | ------------------- |
| id          | INTEGER      | Y    | PK, AUTO_INCREMENT  |
| error_type  | VARCHAR(50)  | Y    | 에러 유형           |
| message     | TEXT         | Y    | 에러 메시지         |
| stack_trace | TEXT         | N    | 스택 트레이스       |
| user_id     | INTEGER      | N    | 발생 사용자 (FK)    |
| endpoint    | VARCHAR(255) | N    | 발생 API 엔드포인트 |
| created_at  | TIMESTAMP    | Y    | 발생 시간           |

## 관련 스펙

- API: `specs/api/admin/monitoring-errors.md`
