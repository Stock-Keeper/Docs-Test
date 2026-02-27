---
type: db
phase: P3
table: event_participants
related:
  api:
    - specs/api/community/events-join.md
    - specs/api/community/events-leaderboard.md
  db:
    - specs/db/auth/users.md
    - specs/db/community/events.md
---

# event_participants

사용자의 이벤트 참여 내역 및 랭킹 점수 등을 관리하는 테이블.

## 스키마

```sql
CREATE TABLE event_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,                          -- 참여한 이벤트 ID
  user_id INT NOT NULL,                           -- 참여한 사용자 ID
  portfolio_id CHAR(36) DEFAULT NULL,             -- (수익률 대회 등) 출품한 포트폴리오 식별자
  score DECIMAL(10, 4) DEFAULT 0.0000,            -- 내부 집계 점수 (수익률 %, 커뮤니티 활동 점수 등)
  ranked INT DEFAULT NULL,                        -- 최종 순위 (이벤트 종료 후 계산)
  is_winner BOOLEAN DEFAULT FALSE,                -- 최종 당첨 여부
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 참여 일시

  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_event_user (event_id, user_id),   -- 1개 이벤트에 1회만 참여 가능
  INDEX idx_event_score (event_id, score DESC)    -- 리더보드 등 랭킹 출력용
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | INT | Y | AUTO_INCREMENT | PK |
| event_id | INT | Y | - | 이벤트 FK |
| user_id | INT | Y | - | 사용자 FK |
| portfolio_id | CHAR(36) | N | NULL | (포트폴리오 대회의 경우) 제출한 포트폴리오 |
| score | DECIMAL | Y | 0 | 랭킹 기준 점수. 대회 중 계속 업데이트됨. |
| ranked | INT | N | NULL | 대회 종료 후 계산되는 최종 등수 |
| is_winner | BOOLEAN | Y | FALSE | 보상 획득 당첨자 여부 |

## 비즈니스 규칙

- **1인 1회 참여**: 한 이벤트에는 계정당 1번만 참여(JOIN)할 수 있습니다 (유니크 키 적용).
- **점수(score) 갱신**: 예를 들어 '수익률 대회'라면, 등록된 `portfolio_id`의 수익률을 매일 배치로 집계하여 `score`에 덮어씌우는 방식으로 리더보드를 관리합니다.
- **종료 정산**: `events.end_at` 도달 시점을 기준으로 `score`를 바탕으로 `ranked` 값을 순차 부여하여 랭킹 및 당첨자를 확정합니다.
