---
type: db
phase: P2
table: community_profiles
related:
  api: []
  ui: []
  db:
    - specs/db/auth/users.md
    - specs/db/community/settings.md
    - specs/db/community/nickname-histories.md
---

# community_profiles

커뮤니티 프로필 테이블. users 테이블과 1:1 관계.

## 스키마

```sql
CREATE TABLE community_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,                    -- users와 1:1
  nickname VARCHAR(50) NOT NULL UNIQUE,           -- 커뮤니티 닉네임 (앱 내 닉네임과 별도)
  nickname_changed_at TIMESTAMP,                  -- 닉네임 변경일 (90일 쿨타임용)
  profile_image_url VARCHAR(500),                 -- 커뮤니티 전용 프로필 이미지
  bio VARCHAR(200),                               -- 자기소개 (200자)

  -- 공개 설정
  show_recent_activity BOOLEAN DEFAULT TRUE,      -- 최근활동 공개
  show_portfolio BOOLEAN DEFAULT FALSE,           -- 투자현황 공개 (P3 연기)

  -- 카운트 캐시 (성능용 반정규화)
  post_count INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,

  -- 상태
  is_terms_agreed BOOLEAN DEFAULT FALSE,          -- 커뮤니티 약관 동의
  terms_agreed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,                -- 논리적 삭제 여부
  delete_at TIMESTAMP,                            -- 논리적 삭제 일시

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_cp_nickname (nickname),
  UNIQUE INDEX idx_cp_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼                 | 타입         | 필수 | 기본값            | 설명                        |
| -------------------- | ------------ | ---- | ----------------- | --------------------------- |
| id                   | INT          | Y    | AUTO_INCREMENT    | PK                          |
| user_id              | INT          | Y    | -                 | users.id (1:1, UNIQUE)      |
| nickname             | VARCHAR(50)  | Y    | -                 | 커뮤니티 닉네임 (UNIQUE)    |
| nickname_changed_at  | TIMESTAMP    | N    | NULL              | 닉네임 변경일 (90일 쿨타임) |
| profile_image_url    | VARCHAR(500) | N    | NULL              | 커뮤니티 전용 프로필 이미지 |
| bio                  | VARCHAR(200) | N    | NULL              | 자기소개                    |
| show_recent_activity | BOOLEAN      | Y    | TRUE              | 최근활동 공개 여부          |
| show_portfolio       | BOOLEAN      | Y    | FALSE             | 투자현황 공개 여부 (P3)     |
| post_count           | INT          | Y    | 0                 | 게시글 수 (캐시)            |
| follower_count       | INT          | Y    | 0                 | 팔로워 수 (캐시)            |
| following_count      | INT          | Y    | 0                 | 팔로잉 수 (캐시)            |
| is_terms_agreed      | BOOLEAN      | Y    | FALSE             | 커뮤니티 약관 동의          |
| terms_agreed_at      | TIMESTAMP    | N    | NULL              | 약관 동의 일시              |
| is_active            | BOOLEAN      | Y    | TRUE              | 활성 상태                   |
| created_at           | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 생성일                      |
| updated_at           | TIMESTAMP    | N    | NULL              | 수정일                      |
| is_delete            | BOOLEAN      | Y    | FALSE             | 논리적 삭제 여부            |
| delete_at            | TIMESTAMP    | N    | NULL              | 삭제 일시                   |

## 인덱스

| 인덱스명        | 컬럼     | 타입   | 용도            |
| --------------- | -------- | ------ | --------------- |
| idx_cp_nickname | nickname | UNIQUE | 닉네임 중복체크 |
| idx_cp_user_id  | user_id  | UNIQUE | 사용자 조회     |

## 비즈니스 규칙

- 닉네임 변경은 **90일에 1회**만 가능
- users 테이블과 **1:1 관계**
- 커뮤니티 최초 진입 시 **약관 동의 필수** (is_terms_agreed)
- `show_portfolio` 기능은 **P3로 연기** (기본값 FALSE 유지)

## 결정 사항

- `users.nickname` 컬럼 삭제 예정 → 커뮤니티 닉네임만 사용
