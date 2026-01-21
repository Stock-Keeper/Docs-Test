---
type: db
phase: P1
table: notification_settings
related:
  api:
    - ../api/notification/settings.md
---

# notification_settings 테이블

## 개요
포트폴리오별 알림 설정 (포트폴리오와 1:1 관계)

> **변경 이력**: 기존 사용자별+포트폴리오별 2테이블 구조에서 포트폴리오별 단일 테이블로 통합  
> 전역 알림 ON/OFF는 `settings.is_notification`으로 이동

## 스키마

```sql
-- 알림 설정 (포트폴리오별)
CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT NOT NULL,                      -- 포트폴리오와 1:1 관계
  is_enabled BOOLEAN DEFAULT FALSE,               -- 알림 활성화
  alert_cycle ENUM('WEEKLY', 'MONTHLY'),          -- 알림 주기
  alert_time TIME,                                -- 알림 발송 시간
  threshold_percentage DECIMAL DEFAULT 20.0,      -- 임계값 (±20%)
  updated_at TIMESTAMP,

  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_notif_settings_portfolio (portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P1 |
| portfolio_id | INT | Y | 포트폴리오 ID (FK, UNIQUE) | P1 |
| is_enabled | BOOLEAN | Y | 알림 활성화 여부 | P1 |
| alert_cycle | ENUM | N | 알림 주기 (WEEKLY/MONTHLY) | P1 |
| alert_time | TIME | N | 알림 발송 시간 | P1 |
| threshold_percentage | DECIMAL | Y | 리밸런싱 임계값 (%) | P1 |
| updated_at | TIMESTAMP | N | 수정일 | P1 |

## 비즈니스 규칙

- 포트폴리오 생성 시 기본 설정 레코드 자동 생성
- 전역 알림 ON/OFF는 별도 `settings` 테이블의 `is_notification`으로 관리
- 임계값 기본값 20% (기존 5%에서 변경)

## 관련 스펙
- API: `../api/notification/settings.md`
