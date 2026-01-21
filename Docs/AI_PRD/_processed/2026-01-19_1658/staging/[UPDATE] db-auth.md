# Auth DB 스펙 업데이트

## 원본 출처

> 원본 파일: `sk_p2.dbml`

## 항목별 작업 요약

| 항목          | 작업   | 기존 스펙                                 |
| ------------- | ------ | ----------------------------------------- |
| users         | UPDATE | specs/db/auth/users.md                    |
| user_consents | UPDATE | specs/db/auth/user-consents.md            |
| token_vault   | -      | specs/db/auth/token-vault.md (동일, 스킵) |
| settings      | -      | specs/db/auth/settings.md (동일, 스킵)    |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P1 (핵심 인증 기능)
- **비교한 기존 스펙 파일**:
  - `specs/db/auth/users.md`
  - `specs/db/auth/user-consents.md`
  - `specs/db/auth/token-vault.md`
  - `specs/db/auth/settings.md`

---

## users [UPDATE]

### 기존 스펙 요약

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,           -- UUID
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  nickname VARCHAR(20),
  profile_picture VARCHAR(500),
  google_id VARCHAR(100) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  membership ENUM('NOT', 'PRO') DEFAULT 'NOT',
  is_active BOOLEAN DEFAULT TRUE,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  token_balance INT DEFAULT 0,
  profile_character INT,
  bio VARCHAR(200),
  last_login_at TIMESTAMP,
  login_count INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 변경 사항

#### 1. PK 타입 변경

| 변경 전                   | 변경 후                       |
| ------------------------- | ----------------------------- |
| `id VARCHAR(36)` (UUID) | `id INTEGER AUTO_INCREMENT` |

> [!WARNING]
> PK 타입 변경은 **대규모 마이그레이션**이 필요합니다. 기존 UUID 기반 → INTEGER 변경 시 모든 FK 참조 테이블 수정 필요.

#### 2. 새로운 컬럼 추가

| 컬럼                | 타입                             | 설명                                      |
| ------------------- | -------------------------------- | ----------------------------------------- |
| `provider`        | ENUM('GOOGLE', 'KAKAO', 'NAVER') | 소셜 로그인 제공자 (현재는 GOOGLE만 사용) |
| `is_suspended`    | BOOLEAN DEFAULT FALSE            | 현재 정지 상태                            |
| `suspended_until` | TIMESTAMP                        | 정지 해제 일시                            |
| `is_delete`       | BOOLEAN DEFAULT FALSE            | 논리적 삭제 여부                          |
| `delete_at`       | TIMESTAMP                        | 논리적 삭제 일시                          |

#### 3. 컬럼 변경/삭제

| 컬럼                    | 변경 내용                                                |
| ----------------------- | -------------------------------------------------------- |
| `email`               | UNIQUE 제약 해제 (탈퇴 후 재가입자 고려)                 |
| `membership`          | `ENUM('NOT','PRO')` → `ENUM('FREE','PRO','EXPERT')` |
| `name`                | ❌ inbox에서 제거됨                                      |
| `google_id`           | ❌ inbox에서 제거됨 (`provider`로 대체)                |
| `is_active`           | ❌ inbox에서 제거됨 (`is_suspended`로 대체)            |
| `is_profile_complete` | ❌ inbox에서 제거됨                                      |
| `token_balance`       | ❌ inbox에서 제거됨                                      |
| `profile_character`   | ❌ inbox에서 제거됨                                      |
| `bio`                 | ❌ inbox에서 제거됨                                      |

#### 4. 인덱스 변경

| 인덱스                  | 변경 내용          |
| ----------------------- | ------------------ |
| `idx_users_email`     | 유지 (UNIQUE 아님) |
| `idx_users_provider`  | 신규 추가          |
| `idx_users_google_id` | 삭제 예정          |
| `idx_users_nickname`  | 삭제 예정          |
| `idx_users_is_active` | 삭제 예정          |

### 정형화된 inbox 스키마

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  provider ENUM('GOOGLE', 'KAKAO', 'NAVER') NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  membership_type ENUM('FREE', 'PRO', 'EXPERT') DEFAULT 'FREE',
  is_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspended_until TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  INDEX idx_users_email (email),
  INDEX idx_users_provider (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## user_consents [UPDATE]

### 기존 스펙 요약

```sql
CREATE TABLE user_consents (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  consent_type ENUM('TERMS', 'PRIVACY', 'MARKETING') NOT NULL,
  is_agreed BOOLEAN DEFAULT FALSE,
  agreed_at TIMESTAMP,
  version VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_consents_user_id (user_id)
);
```

### 변경 사항

#### 1. 인덱스 추가

| 인덱스                          | 설명                                     |
| ------------------------------- | ---------------------------------------- |
| `idx_user_consents_user_type` | (user_id, consent_type) 복합 인덱스 추가 |

### 정형화된 inbox 스키마

```sql
CREATE TABLE user_consents (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  consent_type ENUM('TERMS', 'PRIVACY', 'MARKETING') NOT NULL,
  is_agreed BOOLEAN DEFAULT FALSE,
  agreed_at TIMESTAMP,
  version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_consents_user_id (user_id),
  INDEX idx_user_consents_user_type (user_id, consent_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **nickname 컬럼 삭제 여부 질문**

   - 원본 주석: `nickname varchar // 삭제해야 하나`
   - 현재 상태: 기존 스펙에 nickname 존재, inbox에도 존재하지만 삭제 고려 중
2. **email UNIQUE 해제 의도**

   - 원본 주석: `email varchar [not null] // 탈퇴 후 재가입자를 고려해 유니크 해제`
   - 영향: 같은 이메일로 여러 계정 생성 가능 → 보안/무결성 문제 검토 필요
3. **PK 타입 변경 (UUID → INTEGER)**

   - inbox는 INTEGER AUTO_INCREMENT 사용
   - 기존 스펙은 UUID 사용
   - 마이그레이션 전략 결정 필요
4. **기존 스펙에만 존재하는 컬럼들**

   - `name`, `google_id`, `is_active`, `is_profile_complete`, `token_balance`, `profile_character`, `bio`
   - 이들을 삭제할지, 유지할지 결정 필요

### 사용자 결정 필요

#### 1. nickname 컬럼

- [ ] **옵션 A (유지)** - 현재대로 유지
- [X] **옵션 B (삭제)** - users에서 삭제, community_profiles.nickname만 사용

#### 2. email UNIQUE 제약

- [X] **옵션 A (UNIQUE 해제)** - 탈퇴 후 재가입 허용 (추천하지 않음)
- [ ] **옵션 B (UNIQUE 유지 + 탈퇴 시 이메일 변경)** - 탈퇴 시 email을 `deleted_{id}@...` 형태로 변경 (추천)

#### 3. PK 타입

- [ ] **옵션 A (UUID 유지)** - 기존 시스템 호환성, 분산 환경 적합 (추천)
- [X] **옵션 B (INTEGER 변경)** - 대규모 마이그레이션 필요, 모든 FK 수정

#### 4. 기존 컬럼 처리

- [ ] **옵션 A (모두 유지)** - name, google_id 등 기존 컬럼 유지
- [X] **옵션 B (inbox 기준 정리)** - inbox에 없는 컬럼 삭제

---

## 비고

- `token_vault`: 기존 스펙과 inbox 내용 동일, 변경 없음
- `settings`: 기존 스펙과 inbox 내용 동일, 변경 없음
