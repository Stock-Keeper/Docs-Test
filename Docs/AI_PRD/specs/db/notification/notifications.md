---
type: db
phase: P1
table: notifications
related:
    api:
        - specs/api/notification/list.md
        - specs/api/notification/read.md
    db:
        - notification-types.md
---

# notifications 테이블

## 개요

앱 내 알림 저장 (notification_types 테이블과 FK 연결)

> **변경 이력**: type ENUM → notification_type_id FK로 정규화, 논리적 삭제 필드 추가

## 스키마

```sql
-- 알림 스택
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 수신 대상자
  notification_type_id INT NOT NULL,              -- 알림 종류 (FK)
  title VARCHAR(255) NOT NULL,                    -- 알림 제목
  message TEXT NOT NULL,                          -- 알림 본문
  related_entity_id INT,                          -- 관련 포트폴리오 ID 등 (클릭 시 이동용)
  is_read BOOLEAN DEFAULT FALSE,                  -- 읽음 여부
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,                -- 논리적 삭제 여부
  delete_at TIMESTAMP,                            -- 논리적 삭제 일시

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (notification_type_id) REFERENCES notification_types(id),
  FOREIGN KEY (related_entity_id) REFERENCES portfolios(id) ON DELETE SET NULL,
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼                 | 타입         | 필수 | 설명                                | Phase |
| -------------------- | ------------ | ---- | ----------------------------------- | ----- |
| id                   | INT          | Y    | PK, AUTO_INCREMENT                  | P1    |
| user_id              | INT          | Y    | 수신자 ID (FK)                      | P1    |
| notification_type_id | INT          | Y    | 알림 종류 (FK → notification_types) | P1    |
| title                | VARCHAR(255) | Y    | 알림 제목                           | P1    |
| message              | TEXT         | Y    | 알림 본문                           | P1    |
| related_entity_id    | INT          | N    | 관련 엔티티 ID (포트폴리오 등)      | P1    |
| is_read              | BOOLEAN      | Y    | 읽음 여부                           | P1    |
| created_at           | TIMESTAMP    | Y    | 생성일                              | P1    |
| is_delete            | BOOLEAN      | Y    | 논리적 삭제 여부                    | P1    |
| delete_at            | TIMESTAMP    | N    | 논리적 삭제 일시                    | P1    |

## 비즈니스 규칙

- 알림 만료 정책: 30일 후 배치로 is_delete=TRUE 처리
- 알림 종류는 notification_types 테이블에서 관리 (정규화)
- related_entity_id로 클릭 시 이동할 대상 지정

## 유용한 쿼리

```sql
-- 미읽음 알림 개수
SELECT COUNT(*) FROM notifications
WHERE user_id = ? AND is_read = FALSE AND is_delete = FALSE;

-- 30일 경과 알림 논리적 삭제 (배치)
UPDATE notifications
SET is_delete = TRUE, delete_at = NOW()
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_delete = FALSE;
```

## 관련 스펙

- API: `../../api/notification/list.md`
- API: `../../api/notification/read.md`
- DB: `notification-types.md`
