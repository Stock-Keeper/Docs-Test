---
type: db
phase: P1
table: notification_types
related:
  db:
    - notification/notifications.md
  api: []
---

# notification_types 테이블

## 개요
알림 종류 마스터 테이블

## 스키마

```sql
CREATE TABLE notification_types (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| code | VARCHAR(50) | Y | 알림 코드, UNIQUE | P1 |
| name | VARCHAR(100) | Y | 알림 종류명 | P1 |
| is_active | BOOLEAN | Y | 활성화 여부 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |

## 초기 데이터

| code | name |
|------|------|
| REBALANCE_ALERT | 리밸런싱 알림 |
| PRICE_ALERT | 가격 알림 |
| SYSTEM_NOTICE | 시스템 공지 |
| PORTFOLIO_UPDATE | 포트폴리오 업데이트 |

## 관련 스펙
- DB: `notifications.md`
