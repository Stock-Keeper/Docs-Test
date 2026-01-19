---
type: db
phase: P3
table: rankings
related:
  api:
    - ../../api/community/ranking.md
---

# rankings 테이블

## 개요

랭킹 스냅샷 (주간/월간) (P3)

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
```

## 컬럼 상세

| 컬럼           | 타입         | 필수 | 설명                     |
| -------------- | ------------ | ---- | ------------------------ |
| id             | INT          | Y    | PK, AUTO_INCREMENT       |
| user_id        | VARCHAR(36)  | Y    | 사용자 ID (FK)           |
| period_type    | ENUM         | Y    | 기간 유형                |
| period_start   | DATE         | Y    | 기간 시작일              |
| period_end     | DATE         | Y    | 기간 종료일              |
| like_count     | INT          | N    | 좋아요 수                |
| copy_count     | INT          | N    | 복사 수                  |
| follower_count | INT          | N    | 팔로워 수                |
| score          | INT          | N    | 종합 점수                |
| rank_position  | INT          | N    | 랭킹 순위                |
| created_at     | TIMESTAMP    | Y    | 생성일                   |

## 관련 스펙

- API: `../../api/community/ranking.md`
