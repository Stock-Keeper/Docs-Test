---
type: db
phase: P3
table: badges, user_badges
related:
  api:
    - ../../api/community/badges.md
  ui:
    - ../../ui/community/badges.md
---

# badges, user_badges 테이블

## 개요

뱃지 마스터 및 사용자 획득 뱃지 관리 (P3)

## 스키마

```sql
-- 뱃지 마스터 (기존 badge_types 대체)
CREATE TABLE badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,               -- 뱃지 코드 (예: 'FIRST_POST')
  name VARCHAR(100) NOT NULL,                     -- 표시명
  description TEXT,                               -- 획득 조건 설명
  icon_url VARCHAR(500),                          -- 뱃지 아이콘 URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE INDEX idx_badges_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 사용자 획득 뱃지
CREATE TABLE user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 사용자
  badge_id INT NOT NULL,                          -- 뱃지
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 획득 일시
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id),
  UNIQUE INDEX idx_user_badges_user_badge (user_id, badge_id),
  INDEX idx_user_badges_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

### badges

| 컬럼        | 타입         | 필수 | 설명               |
| ----------- | ------------ | ---- | ------------------ |
| id          | INT          | Y    | PK, AUTO_INCREMENT |
| code        | VARCHAR(50)  | Y    | 뱃지 코드 (UNIQUE) |
| name        | VARCHAR(100) | Y    | 표시명             |
| description | TEXT         | N    | 획득 조건 설명     |
| icon_url    | VARCHAR(500) | N    | 아이콘 URL         |
| created_at  | TIMESTAMP    | Y    | 생성일             |

### user_badges

| 컬럼      | 타입      | 필수 | 설명               |
| --------- | --------- | ---- | ------------------ |
| id        | INT       | Y    | PK, AUTO_INCREMENT |
| user_id   | INT       | Y    | 사용자 ID (FK)     |
| badge_id  | INT       | Y    | 뱃지 ID (FK)       |
| earned_at | TIMESTAMP | Y    | 획득 일시          |

## 초기 데이터 (예시)

```sql
INSERT INTO badges (code, name, description, icon_url) VALUES
('FIRST_POST', '첫 게시물', '첫 번째 게시물을 작성했습니다', '/badges/first_post.png'),
('LIKE_10', '첫 좋아요', '좋아요 10개를 받았습니다', '/badges/like_10.png'),
('LIKE_100', '인기 게시물', '좋아요 100개를 받았습니다', '/badges/like_100.png'),
('COPY_10', '첫 복사', '포트폴리오가 10회 복사되었습니다', '/badges/copy_10.png'),
('FOLLOWER_100', '인플루언서', '팔로워 100명을 달성했습니다', '/badges/follower_100.png');
```

## 비즈니스 규칙

- 뱃지 획득 조건은 애플리케이션 레벨에서 구현
- 관리자가 뱃지 추가/수정 가능
- 사용자당 동일 뱃지는 1회만 획득 가능 (UNIQUE 제약)
- 뱃지 획득 시 알림 발송

## 관련 스펙

- API: `../../api/community/badges.md`
- UI: `../../ui/community/badges.md`
