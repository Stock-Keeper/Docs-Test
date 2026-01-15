---
type: db
phase: P3
table: rankings, badge_types, user_badges
related:
  api:
    - ../api/community/ranking.md
---

# rankings, badges 테이블

## 개요
랭킹 스냅샷 및 배지 시스템 (P3)

## 스키마

```sql
-- 랭킹 스냅샷 (주간/월간)
CREATE TABLE rankings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  period_type ENUM('WEEKLY', 'MONTHLY', 'ALL_TIME') NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  like_count INT DEFAULT 0,
  copy_count INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  score INT DEFAULT 0,
  rank_position INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_rankings_user (user_id),
  INDEX idx_rankings_period (period_type, period_start),
  INDEX idx_rankings_rank (period_type, rank_position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 배지 정의
CREATE TABLE badge_types (
  id VARCHAR(50) PRIMARY KEY,        -- LIKE_100, COPY_50 등
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  icon_url VARCHAR(500),
  condition_type ENUM('LIKE', 'COPY', 'DURATION', 'EVENT') NOT NULL,
  condition_value INT NOT NULL,       -- 조건 수치 (100, 50 등)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 사용자 보유 배지
CREATE TABLE user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  badge_id VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badge_types(id),
  UNIQUE INDEX idx_user_badges_unique (user_id, badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 배지 유형 예시

| badge_id | name | condition_type | condition_value |
|----------|------|----------------|-----------------|
| LIKE_10 | 첫 좋아요 | LIKE | 10 |
| LIKE_100 | 인기 포트폴리오 | LIKE | 100 |
| LIKE_1000 | 스타 투자자 | LIKE | 1000 |
| COPY_10 | 첫 복사 | COPY | 10 |
| COPY_50 | 트렌드세터 | COPY | 50 |
| COPY_100 | 인플루언서 | COPY | 100 |
| DURATION_30 | 한달 유지 | DURATION | 30 |
| DURATION_365 | 1년 유지 | DURATION | 365 |

## 배지 획득 로직

```
1. 좋아요/복사 발생 시:
   - 해당 사용자의 총 좋아요/복사 수 계산
   - badge_types에서 조건 충족 배지 확인
   - 미보유 배지면 user_badges에 INSERT
   - 알림 발송: "🎖 'XX' 배지를 획득했습니다!"
```

## 관련 스펙
- API: `../api/community/ranking.md`
- API: `../api/community/badges.md`
