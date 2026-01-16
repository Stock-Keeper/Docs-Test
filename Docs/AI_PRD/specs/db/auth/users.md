---
type: db
phase: P1
table: users
related:
  api:
    - ../api/auth/google-callback.md
    - ../api/auth/profile-update.md
---

# users 테이블

## 개요
사용자 기본 정보 저장

## 스키마

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,           -- UUID
  email VARCHAR(255) NOT NULL UNIQUE,   -- Google 이메일
  name VARCHAR(100),                    -- Google 표시명
  nickname VARCHAR(20),                 -- 앱 내 닉네임
  profile_picture VARCHAR(500),         -- 프로필 이미지 URL
  google_id VARCHAR(100) NOT NULL,      -- Google User ID
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  membership ENUM('NOT', 'PRO') DEFAULT 'NOT',
  is_active BOOLEAN DEFAULT TRUE,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,    -- 본인인증 여부 (P2)
  token_balance INT DEFAULT 0,          -- 토큰 잔액 (P2)
  profile_character INT,                -- 캐릭터 선택 (P2)
  bio VARCHAR(200),                     -- 자기소개 (P2)
  last_login_at TIMESTAMP,
  login_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_users_email (email),
  INDEX idx_users_google_id (google_id),
  INDEX idx_users_role (role),
  INDEX idx_users_is_active (is_active),
  INDEX idx_users_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | UUID | Y | PK | P1 |
| email | VARCHAR(255) | Y | Google 이메일, UNIQUE | P1 |
| name | VARCHAR(100) | N | Google 표시명 | P1 |
| nickname | VARCHAR(20) | N | 앱 내 닉네임 | P1 |
| profile_picture | VARCHAR(500) | N | 프로필 이미지 URL | P1 |
| google_id | VARCHAR(100) | Y | Google User ID | P1 |
| role | ENUM | Y | USER/ADMIN | P1 |
| membership | ENUM | Y | NOT/PRO | P1 |
| is_active | BOOLEAN | Y | 계정 활성화 상태 | P1 |
| is_profile_complete | BOOLEAN | Y | 프로필 입력 완료 여부 | P1 |
| is_verified | BOOLEAN | Y | 본인인증 완료 | P2 |
| token_balance | INT | Y | 보유 토큰 | P2 |
| profile_character | INT | N | 캐릭터 선택 | P2 |
| bio | VARCHAR(200) | N | 자기소개 | P2 |
| last_login_at | TIMESTAMP | N | 마지막 로그인 | P1 |
| login_count | INT | Y | 로그인 횟수 | P1 |
| created_at | TIMESTAMP | Y | 가입일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |

## 신규 사용자 생성

```sql
INSERT INTO users (id, email, name, profile_picture, google_id, role, is_profile_complete)
VALUES (UUID(), ?, ?, ?, ?, 'USER', FALSE);
```

## 로그인 시 업데이트

```sql
UPDATE users 
SET last_login_at = NOW(), login_count = login_count + 1
WHERE id = ?;
```

## 관련 스펙
- API: `../api/auth/google-callback.md`
- API: `../api/auth/profile-update.md`
