---
type: db
phase: P1
table: users
related:
    api:
        - specs/api/auth/auth-google.md
        - specs/api/auth/profile-update.md
    db:
        - specs/db/community/profiles.md
        - specs/db/community/settings.md
        - specs/db/account/accounts.md
        - specs/db/admin/audit-logs.md
        - specs/db/auth/device-tokens.md
---

# users 테이블

## 개요

사용자 기본 정보 저장. 소셜 로그인 기반 인증.

## 스키마

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,              -- 소셜 이메일 (UNIQUE 해제 - 탈퇴 후 재가입 허용)
  nickname VARCHAR(50),                     -- 앱 닉네임 (deprecated, community_profiles.nickname 사용)
  provider ENUM('GOOGLE', 'KAKAO', 'NAVER') NOT NULL,  -- 소셜 로그인 제공자
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  profile_image_url VARCHAR(500),           -- 프로필 이미지 URL
  membership_type ENUM('FREE', 'PRO', 'EXPERT') DEFAULT 'FREE',
  is_verified BOOLEAN DEFAULT FALSE,        -- 본인인증 여부
  last_login_at TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  is_suspended BOOLEAN DEFAULT FALSE,       -- 정지 상태
  suspended_until TIMESTAMP,                -- 정지 해제 일시
  is_delete BOOLEAN DEFAULT FALSE,          -- 논리적 삭제
  delete_at TIMESTAMP,                      -- 삭제 일시
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_provider (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼              | 타입         | 필수 | 기본값            | 설명                   |
| ----------------- | ------------ | ---- | ----------------- | ---------------------- |
| id                | INTEGER      | Y    | AUTO_INCREMENT    | PK                     |
| email             | VARCHAR(255) | Y    | -                 | 소셜 이메일            |
| nickname          | VARCHAR(50)  | N    | NULL              | 앱 닉네임 (deprecated) |
| provider          | ENUM         | Y    | -                 | GOOGLE/KAKAO/NAVER     |
| role              | ENUM         | Y    | USER              | USER/ADMIN             |
| profile_image_url | VARCHAR(500) | N    | NULL              | 프로필 이미지 URL      |
| membership_type   | ENUM         | Y    | FREE              | FREE/PRO/EXPERT        |
| is_verified       | BOOLEAN      | Y    | FALSE             | 본인인증 여부          |
| last_login_at     | TIMESTAMP    | N    | NULL              | 마지막 로그인          |
| login_count       | INTEGER      | Y    | 0                 | 로그인 횟수            |
| is_suspended      | BOOLEAN      | Y    | FALSE             | 정지 상태              |
| suspended_until   | TIMESTAMP    | N    | NULL              | 정지 해제 일시         |
| is_delete         | BOOLEAN      | Y    | FALSE             | 논리적 삭제 여부       |
| delete_at         | TIMESTAMP    | N    | NULL              | 삭제 일시              |
| created_at        | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 가입일                 |
| updated_at        | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 수정일                 |

## 인덱스

| 인덱스명           | 컬럼     | 타입  | 용도          |
| ------------------ | -------- | ----- | ------------- |
| idx_users_email    | email    | INDEX | 이메일 조회   |
| idx_users_provider | provider | INDEX | 제공자별 조회 |

## 비즈니스 규칙

- **email UNIQUE 해제**: 탈퇴 후 재가입자 허용 (탈퇴 시 is_delete=TRUE)
- **nickname deprecated**: `community_profiles.nickname` 사용 권장
- **is_suspended**: 커뮤니티 정지 상태 관리 (user_suspensions 테이블과 연동)
- **논리적 삭제**: is_delete=TRUE 시 데이터 보존, delete_at에 삭제 시각 기록

## 주요 변경 이력

| 버전 | 변경 내용                                                                                   |
| ---- | ------------------------------------------------------------------------------------------- |
| P2   | PK 타입 UUID→INTEGER 변경                                                                   |
| P2   | provider 컬럼 추가 (google_id 대체)                                                         |
| P2   | membership ENUM 확장 (FREE/PRO/EXPERT)                                                      |
| P2   | is_suspended, suspended_until 추가                                                          |
| P2   | is_delete, delete_at 추가                                                                   |
| P2   | name, google_id, is_active, is_profile_complete, token_balance, profile_character, bio 삭제 |

## 신규 사용자 생성

```sql
INSERT INTO users (email, provider, role)
VALUES (?, 'GOOGLE', 'USER');
```

## 로그인 시 업데이트

```sql
UPDATE users
SET last_login_at = NOW(), login_count = login_count + 1
WHERE id = ?;
```
