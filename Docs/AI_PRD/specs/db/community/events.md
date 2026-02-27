---
type: db
phase: P3
table: events
related:
  api:
    - specs/api/community/events-list.md
    - specs/api/community/events-join.md
  ui:
    - specs/ui/community/events-list.md
    - specs/ui/community/events-detail.md
---

# events

커뮤니티 내 진행되는 각종 이벤트, 대회(포트폴리오 수익률 대회 등) 정보를 관리하는 테이블.

## 스키마

```sql
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,                    -- 이벤트 제목
  description TEXT NOT NULL,                      -- 상세 설명
  banner_image_url VARCHAR(255),                  -- 배너 이미지 URL
  status ENUM('UPCOMING', 'ONGOING', 'ENDED') DEFAULT 'UPCOMING', -- 진행 상태
  event_type ENUM('PORTFOLIO_CONTEST', 'ACTIVITY', 'GENERAL') NOT NULL, -- 이벤트 종류
  start_at DATETIME NOT NULL,                     -- 시작 일시
  end_at DATETIME NOT NULL,                       -- 종료 일시
  winner_announced_at DATETIME,                   -- 당첨자 발표일
  max_participants INT DEFAULT NULL,              -- 최대 참여 인원 (NULL이면 무제한)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_events_status (status),
  INDEX idx_events_dates (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | INT | Y | AUTO_INCREMENT | PK |
| title | VARCHAR(100) | Y | - | 이벤트 타이틀 (예: 제1회 스마일 수익률 대회) |
| description | TEXT | Y | - | 이벤트 상세 내용, 보상 조건 등 |
| banner_image_url | VARCHAR(255) | N | NULL | 이벤트 목록/상세에 쓰일 배너 이미지 |
| status | ENUM | Y | UPCOMING | 상태 (시작전/진행중/종료) |
| event_type | ENUM | Y | - | 이벤트 종류 (수익률 대회, 단순 활동 등) |
| start_at | DATETIME | Y | - | 시작 시각 |
| end_at | DATETIME | Y | - | 종료 시각 |
| winner_announced_at | DATETIME | N | NULL | 당첨자 발표 예정 시각 |
| max_participants | INT | N | NULL | 선착순 제한 인원 등 기입용 |

## 비즈니스 규칙

- **상태 변경**: 백그라운드 배치 작업 등을 통해 `start_at` 과 `end_at` 시간에 맞춰 `status`가 `UPCOMING` -> `ONGOING` -> `ENDED` 로 변경됩니다.
- **이벤트 타입**: 시스템 상 자동화된 랭킹 집계나 특성(예: 포트폴리오 첨부 필수 여부) 등을 `event_type`으로 구분합니다.
