---
type: db
phase: P3
table: events, event_participants
related:
    api: []
    db:
        - specs/db/auth/users.md
---

# 이벤트 관련 테이블

커뮤니티 이벤트(출석, 챌린지 등) 관리. P3 신규.

## 테이블 구성

| 테이블명             | 역할                           |
| -------------------- | ------------------------------ |
| `events`             | 이벤트 기본 정보 (관리자 생성) |
| `event_participants` | 이벤트 참여 기록               |

---

## events 테이블

### 스키마

```sql
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,              -- 이벤트 제목
  description TEXT,                         -- 이벤트 설명
  start_at TIMESTAMP,                       -- 이벤트 시작 시간
  end_at TIMESTAMP,                         -- 이벤트 종료 시간
  is_active BOOLEAN DEFAULT TRUE,           -- 활성화 여부
  created_by INT NOT NULL,                  -- 생성한 관리자 (FK)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_events_period (start_at, end_at),
  INDEX idx_events_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼        | 타입         | 필수 | 기본값            | 설명                  | Phase |
| ----------- | ------------ | ---- | ----------------- | --------------------- | ----- |
| id          | INT          | Y    | AUTO_INCREMENT    | PK                    | P3    |
| title       | VARCHAR(200) | Y    | -                 | 이벤트 제목           | P3    |
| description | TEXT         | N    | NULL              | 이벤트 설명           | P3    |
| start_at    | TIMESTAMP    | N    | NULL              | 이벤트 시작 시간      | P3    |
| end_at      | TIMESTAMP    | N    | NULL              | 이벤트 종료 시간      | P3    |
| is_active   | BOOLEAN      | Y    | TRUE              | 활성화 여부           | P3    |
| created_by  | INT          | Y    | -                 | 생성한 관리자 ID (FK) | P3    |
| created_at  | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 생성일                | P3    |
| updated_at  | TIMESTAMP    | N    | NULL              | 수정일                | P3    |

### 인덱스

| 인덱스명          | 컬럼               | 타입  | 용도                  |
| ----------------- | ------------------ | ----- | --------------------- |
| idx_events_period | (start_at, end_at) | INDEX | 진행 중인 이벤트 조회 |
| idx_events_active | is_active          | INDEX | 활성 이벤트 필터링    |

---

## event_participants 테이블

### 스키마

```sql
CREATE TABLE event_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,                    -- 이벤트 (FK)
  user_id INT NOT NULL,                     -- 참여 사용자 (FK)
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 참여 일시

  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE INDEX idx_event_participants_event_user (event_id, user_id),
  INDEX idx_event_participants_event (event_id),
  INDEX idx_event_participants_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼      | 타입      | 필수 | 기본값            | 설명                | Phase |
| --------- | --------- | ---- | ----------------- | ------------------- | ----- |
| id        | INT       | Y    | AUTO_INCREMENT    | PK                  | P3    |
| event_id  | INT       | Y    | -                 | 이벤트 ID (FK)      | P3    |
| user_id   | INT       | Y    | -                 | 참여 사용자 ID (FK) | P3    |
| joined_at | TIMESTAMP | Y    | CURRENT_TIMESTAMP | 참여 일시           | P3    |

### 인덱스

| 인덱스명                          | 컬럼                | 타입   | 용도                    |
| --------------------------------- | ------------------- | ------ | ----------------------- |
| idx_event_participants_event_user | (event_id, user_id) | UNIQUE | 중복 참여 방지          |
| idx_event_participants_event      | event_id            | INDEX  | 이벤트별 참여자 조회    |
| idx_event_participants_user       | user_id             | INDEX  | 사용자별 참여 이력 조회 |

## 비즈니스 규칙

- 동일 이벤트에 중복 참여 불가 ((event_id, user_id) UNIQUE)
- 이벤트 생성/관리는 관리자(ADMIN role)만 가능
- `is_active = FALSE`인 이벤트는 참여 불가 처리

## 관련 스펙

- DB: `specs/db/auth/users.md`
- DB: `specs/db/admin/announcements.md` (이벤트 공지는 announcements 테이블 활용)
