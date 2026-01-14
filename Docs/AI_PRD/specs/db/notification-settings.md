# notification_settings, fcm_tokens 테이블

## 개요
알림 설정 및 FCM 토큰 저장

## 스키마

```sql
-- 사용자 알림 설정
CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  global_enabled BOOLEAN DEFAULT TRUE,
  frequency ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY') DEFAULT 'WEEKLY',
  notification_time TIME DEFAULT '16:00:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 포트폴리오별 알림 설정
CREATE TABLE portfolio_notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  threshold INT DEFAULT 5,
  last_notification_at TIMESTAMP NULL,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_portfolio_notif (portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FCM 디바이스 토큰
CREATE TABLE fcm_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  token_encrypted TEXT NOT NULL,
  device_type ENUM('IOS', 'ANDROID') NOT NULL,
  device_id VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_fcm_user (user_id),
  UNIQUE INDEX idx_fcm_device (user_id, device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

### notification_settings

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK | P1 |
| user_id | UUID | Y | 사용자 ID (UNIQUE) | P1 |
| global_enabled | BOOLEAN | Y | 전체 알림 ON/OFF | P1 |
| frequency | ENUM | Y | 알림 주기 | P1 |
| notification_time | TIME | Y | 알림 시간 | P1 |

### portfolio_notification_settings

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| portfolio_id | UUID | Y | 포트폴리오 ID | P1 |
| enabled | BOOLEAN | Y | 알림 ON/OFF | P1 |
| threshold | INT | Y | 임계값 (기본 5%) | P1 |
| last_notification_at | TIMESTAMP | N | 마지막 알림 발송 시각 | P1 |

### fcm_tokens

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| user_id | UUID | Y | 사용자 ID | P1 |
| token_hash | VARCHAR(64) | Y | 토큰 해시 (검색용) | P1 |
| token_encrypted | TEXT | Y | 암호화된 토큰 | P1 |
| device_type | ENUM | Y | IOS/ANDROID | P1 |
| device_id | VARCHAR(100) | N | 디바이스 고유 ID | P1 |
| is_active | BOOLEAN | Y | 활성 상태 | P1 |

## 관련 스펙
- API: `../api/notification/settings.md`
- API: `../api/notification/fcm-token.md`
