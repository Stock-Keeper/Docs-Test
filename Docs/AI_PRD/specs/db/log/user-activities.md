---
type: db
phase: P1
table: user_activities
related:
  db:
    - auth/users.md
  api: []
---

# user_activities 테이블

## 개요
사용자 행동 추적 (분석, UX 개선용)

## 스키마

```sql
CREATE TABLE user_activities (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  activity_type ENUM('PAGE_VIEW', 'BUTTON_CLICK', 'FEATURE_USE', 'SEARCH', 'SHARE') NOT NULL,
  activity_name VARCHAR(100) NOT NULL,
  metadata JSON,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_activities_user_id (user_id),
  INDEX idx_user_activities_type (activity_type),
  INDEX idx_user_activities_created_at (created_at),
  INDEX idx_user_activities_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| user_id | INTEGER | Y | FK → users.id | P1 |
| activity_type | ENUM | Y | PAGE_VIEW/BUTTON_CLICK/FEATURE_USE/SEARCH/SHARE | P1 |
| activity_name | VARCHAR(100) | Y | 구체적인 활동명 | P1 |
| metadata | JSON | N | 추가 정보 | P1 |
| session_id | VARCHAR(100) | N | 세션 식별자 | P1 |
| created_at | TIMESTAMP | Y | 활동 일시 | P1 |

## 활용 사례

| activity_type | activity_name 예시 | metadata 예시 |
|---------------|-------------------|---------------|
| PAGE_VIEW | home, portfolio_detail | {"portfolio_id": 123} |
| BUTTON_CLICK | create_portfolio_btn | {"position": "header"} |
| FEATURE_USE | rebalancing | {"stock_count": 5} |
| SEARCH | stock_search | {"query": "삼성전자"} |
| SHARE | share_portfolio | {"platform": "kakao"} |

## 관련 스펙
- DB: `users.md`
