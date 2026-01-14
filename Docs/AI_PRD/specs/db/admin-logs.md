# admin_logs 테이블

## 개요
관리자 활동 로그 기록

## 스키마

```sql
CREATE TABLE admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user_id VARCHAR(36) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(36),
  before_value JSON,
  after_value JSON,
  reason TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (admin_user_id) REFERENCES users(id),
  INDEX idx_admin_logs_action (action),
  INDEX idx_admin_logs_created_at (created_at),
  INDEX idx_admin_logs_admin_user (admin_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P1 |
| admin_user_id | UUID | Y | 행위자 관리자 ID | P1 |
| action | VARCHAR(100) | Y | 수행한 액션 | P1 |
| target_type | VARCHAR(50) | N | 대상 유형 (USER, PORTFOLIO 등) | P1 |
| target_id | UUID | N | 대상 ID | P1 |
| before_value | JSON | N | 변경 전 값 | P1 |
| after_value | JSON | N | 변경 후 값 | P1 |
| reason | TEXT | N | 변경 사유 | P1 |
| ip_address | VARCHAR(45) | N | 요청 IP 주소 | P1 |
| user_agent | TEXT | N | 브라우저 정보 | P1 |
| created_at | TIMESTAMP | Y | 기록 시각 | P1 |

## Action 유형

| action | 설명 | target_type |
|--------|------|-------------|
| ROLE_CHANGE | 사용자 역할 변경 | USER |
| STATUS_CHANGE | 사용자 상태 변경 | USER |
| MEMBERSHIP_CHANGE | 멤버십 변경 (P2) | USER |
| SEND_NOTIFICATION | 알림 발송 (P2) | NOTIFICATION |

## 예시 데이터

```json
{
  "id": 1,
  "admin_user_id": "admin-uuid",
  "action": "STATUS_CHANGE",
  "target_type": "USER",
  "target_id": "user-uuid",
  "before_value": {"isActive": true},
  "after_value": {"isActive": false},
  "reason": "이용약관 위반",
  "ip_address": "192.168.1.1",
  "created_at": "2026-01-13T15:00:00Z"
}
```

## 관련 스펙
- API: `../api/admin/users-role.md`
- API: `../api/admin/users-status.md`
