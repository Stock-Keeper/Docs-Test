# Community Badge DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목        | 작업   | 기존 스펙                                           |
| ----------- | ------ | --------------------------------------------------- |
| badges      | UPDATE | specs/db/community/rankings-badges.md (badge_types) |
| user_badges | UPDATE | specs/db/community/rankings-badges.md               |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P3 (고급 기능)
- **연관 기존 스펙**:
  - `specs/db/community/rankings-badges.md`
  - `specs/api/community/ranking.md`
- **비교한 기존 스펙 파일**:
  - `specs/db/community/rankings-badges.md` ⭐ 정밀 비교 완료

---

## badges [UPDATE]

> **기존 테이블명**: `badge_types` → **신규 테이블명**: `badges`

### 기존 스펙 요약 (rankings-badges.md)

```sql
CREATE TABLE badge_types (
  id VARCHAR(50) PRIMARY KEY,        -- LIKE_100, COPY_50 등
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  icon_url VARCHAR(500),
  condition_type ENUM('LIKE', 'COPY', 'DURATION', 'EVENT') NOT NULL,
  condition_value INT NOT NULL,       -- 조건 수치 (100, 50 등)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 변경 사항

| 구분            | 기존 (badge_types)   | 변경 (badges)           | 비고           |
| --------------- | -------------------- | ----------------------- | -------------- |
| 테이블명        | `badge_types`      | `badges`              | 명명 단순화    |
| PK 타입         | VARCHAR(50)          | INT AUTO_INCREMENT      | 타입 변경      |
| code 컬럼       | id 역할 (VARCHAR PK) | 별도 code 컬럼 (UNIQUE) | 분리           |
| condition_type  | ENUM                 | 삭제                    | **제거** |
| condition_value | INT                  | 삭제                    | **제거** |

### 변경된 스키마

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
```

### 컬럼 상세

| 컬럼        | 타입         | 필수 | 설명               | Phase | 변경           |
| ----------- | ------------ | ---- | ------------------ | ----- | -------------- |
| id          | INT          | Y    | PK, AUTO_INCREMENT | P3    | 타입 변경      |
| code        | VARCHAR(50)  | Y    | 뱃지 코드 (UNIQUE) | P3    | **신규** |
| name        | VARCHAR(100) | Y    | 표시명             | P3    | 유지           |
| description | TEXT         | N    | 획득 조건 설명     | P3    | 타입 확장      |
| icon_url    | VARCHAR(500) | N    | 아이콘 URL         | P3    | 유지           |
| created_at  | TIMESTAMP    | Y    | 생성일             | P3    | 유지           |

### 초기 데이터 (예시)

```sql
INSERT INTO badges (code, name, description, icon_url) VALUES
('FIRST_POST', '첫 게시물', '첫 번째 게시물을 작성했습니다', '/badges/first_post.png'),
('LIKE_10', '첫 좋아요', '좋아요 10개를 받았습니다', '/badges/like_10.png'),
('LIKE_100', '인기 게시물', '좋아요 100개를 받았습니다', '/badges/like_100.png'),
('COPY_10', '첫 복사', '포트폴리오가 10회 복사되었습니다', '/badges/copy_10.png'),
('FOLLOWER_100', '인플루언서', '팔로워 100명을 달성했습니다', '/badges/follower_100.png');
```

### 비즈니스 규칙

- condition_type/value가 제거되어 배지 획득 로직은 애플리케이션 레벨에서 구현
- 관리자가 뱃지 추가/수정 가능

---

## user_badges [UPDATE]

> **테이블명 유지**: `user_badges`

### 기존 스펙 요약 (rankings-badges.md)

```sql
CREATE TABLE user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  badge_id VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badge_types(id),
  UNIQUE INDEX idx_user_badges_unique (user_id, badge_id)
);
```

### 변경 사항

| 구분     | 기존                   | 변경                       | 비고        |
| -------- | ---------------------- | -------------------------- | ----------- |
| user_id  | VARCHAR(36)            | INT                        | 타입 변경   |
| badge_id | VARCHAR(50)            | INT                        | 타입 변경   |
| FK 참조  | badge_types            | badges                     | 테이블 변경 |
| 인덱스명 | idx_user_badges_unique | idx_user_badges_user_badge | 명칭 변경   |

### 변경된 스키마

```sql
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

### 컬럼 상세

| 컬럼      | 타입      | 필수 | 설명               | Phase | 변경      |
| --------- | --------- | ---- | ------------------ | ----- | --------- |
| id        | INT       | Y    | PK, AUTO_INCREMENT | P3    | 유지      |
| user_id   | INT       | Y    | 사용자 ID (FK)     | P3    | 타입 변경 |
| badge_id  | INT       | Y    | 뱃지 ID (FK)       | P3    | 타입 변경 |
| earned_at | TIMESTAMP | Y    | 획득 일시          | P3    | 유지      |

### 비즈니스 규칙

- 사용자당 동일 뱃지는 1회만 획득 가능 (UNIQUE 제약)
- 뱃지 획득 시 알림 발송

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **condition_type/value 제거**

   - 기존 스펙: 배지 획득 조건을 DB에 저장 (condition_type, condition_value)
   - inbox: 해당 컬럼 없음 → 애플리케이션 레벨 로직으로 이동
   - 기존 배지 획득 로직 재검토 필요
2. **rankings 테이블 분리**

   - 기존 스펙: rankings-badges.md에 rankings 포함
   - inbox badge 서브도메인: rankings 미포함
   - rankings는 별도 처리 필요 (community-ranking 서브도메인?)

### 사용자 결정 필요

**1. 배지 획득 조건 저장 방식**

- [ ] 옵션 A (추천) - 애플리케이션 레벨에서 로직 구현 (inbox 방식)
- [X] 옵션 B - DB에 condition_type/value 유지 (기존 방식)

**2. rankings 테이블 처리**

- [X] 옵션 A (추천) - 별도 서브도메인으로 분리 (community-ranking)
- [ ] 옵션 B - 현재 rankings-badges.md 그대로 유지
- [ ] 옵션 C - badges만 분리, rankings는 rankings-badges.md에 유지

---

## 관련 스펙 (수정/생성 예정)

### DB (수정 필요)

- `specs/db/community/rankings-badges.md` → badges 부분 분리 또는 업데이트

### API

- `specs/api/community/badges.md` - 뱃지 목록/상세
- `specs/api/community/user-badges.md` - 사용자 보유 뱃지

### UI

- `specs/ui/community/badges.md` - 뱃지 컬렉션 화면
- `specs/ui/community/badge-popup.md` - 뱃지 획득 알림 팝업
