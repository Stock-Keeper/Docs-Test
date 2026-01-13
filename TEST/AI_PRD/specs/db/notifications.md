# notifications 테이블

## 개요
앱 내 알림 저장

## 스키마

```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('REBALANCING_NEEDED', 'PRICE_ALERT', 'SYSTEM') NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  portfolio_id VARCHAR(36),
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_created (created_at DESC),
  INDEX idx_notifications_unread (user_id, is_read),
  INDEX idx_notifications_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | UUID | Y | PK | P1 |
| user_id | UUID | Y | 대상 사용자 ID | P1 |
| type | ENUM | Y | 알림 유형 | P1 |
| title | VARCHAR(200) | Y | 알림 제목 | P1 |
| body | TEXT | Y | 알림 내용 | P1 |
| portfolio_id | UUID | N | 관련 포트폴리오 ID | P1 |
| data | JSON | N | 추가 데이터 (종목 수 등) | P1 |
| is_read | BOOLEAN | Y | 읽음 여부 | P1 |
| read_at | TIMESTAMP | N | 읽은 시각 | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| expires_at | TIMESTAMP | Y | 만료일 (30일 후) | P1 |

## 유용한 쿼리

```sql
-- 미읽음 알림 개수
SELECT COUNT(*) FROM notifications 
WHERE user_id = ? AND is_read = FALSE AND expires_at > NOW();

-- 30일 경과 알림 삭제 (배치)
DELETE FROM notifications WHERE expires_at < NOW();
```

## 관련 스펙
- API: `../api/notification/list.md`
- API: `../api/notification/read.md`
