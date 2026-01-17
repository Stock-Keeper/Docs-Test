# Community Profile DB 스펙

## 원본 출처
> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 |
|------|------|----------|
| community_profiles | NEW | - |
| community_settings | NEW | - |
| nickname_histories | NEW | - |

## AI 분석 결과
- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 핵심 기능)
- **연관 기존 스펙**: `specs/db/auth/users.md` (users 테이블 참조)
- **비교한 기존 스펙 파일**: 
  - `specs/db/community/*.md` (5개 파일) - 해당 테이블 없음
  - `specs/db/auth/settings.md` - 다른 도메인 (auth)
  - `specs/db/notification/notification-settings.md` - 다른 도메인 (notification)

---

## community_profiles [NEW]

### 정형화된 초안

```sql
-- 커뮤니티 프로필 (users와 1:1)
CREATE TABLE community_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,                    -- users와 1:1
  nickname VARCHAR(50) NOT NULL UNIQUE,           -- 커뮤니티 닉네임 (앱 내 닉네임과 별도)
  nickname_changed_at TIMESTAMP,                  -- 닉네임 변경일 (90일 쿨타임용)
  profile_image_url VARCHAR(500),                 -- 커뮤니티 전용 프로필 이미지
  bio VARCHAR(200),                               -- 자기소개 (200자)
  
  -- 공개 설정
  show_recent_activity BOOLEAN DEFAULT TRUE,      -- 최근활동 공개
  show_portfolio BOOLEAN DEFAULT FALSE,           -- 투자현황 공개
  
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

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | users.id (1:1, UNIQUE) | P2 |
| nickname | VARCHAR(50) | Y | 커뮤니티 닉네임 (UNIQUE) | P2 |
| nickname_changed_at | TIMESTAMP | N | 닉네임 변경일 (90일 쿨타임) | P2 |
| profile_image_url | VARCHAR(500) | N | 커뮤니티 전용 프로필 이미지 | P2 |
| bio | VARCHAR(200) | N | 자기소개 | P2 |
| show_recent_activity | BOOLEAN | Y | 최근활동 공개 여부 | P2 |
| show_portfolio | BOOLEAN | Y | 투자현황 공개 여부 | P2 |
| post_count | INT | Y | 게시글 수 (캐시) | P2 |
| follower_count | INT | Y | 팔로워 수 (캐시) | P2 |
| following_count | INT | Y | 팔로잉 수 (캐시) | P2 |
| is_terms_agreed | BOOLEAN | Y | 커뮤니티 약관 동의 | P2 |
| terms_agreed_at | TIMESTAMP | N | 약관 동의 일시 | P2 |
| is_active | BOOLEAN | Y | 활성 상태 | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |
| is_delete | BOOLEAN | Y | 논리적 삭제 여부 | P2 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P2 |

### 비즈니스 규칙
- 닉네임 변경은 90일에 1회만 가능
- users 테이블과 1:1 관계
- 커뮤니티 최초 진입 시 약관 동의 필수 (is_terms_agreed)

---

## community_settings [NEW]

### 정형화된 초안

```sql
-- 커뮤니티 설정 (알림, 공개범위 등)
CREATE TABLE community_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  
  -- 알림 설정
  notify_new_follower BOOLEAN DEFAULT TRUE,       -- 새 팔로워 알림
  notify_new_like BOOLEAN DEFAULT TRUE,           -- 새 좋아요 알림
  notify_new_comment BOOLEAN DEFAULT TRUE,        -- 새 댓글 알림
  notify_following_post BOOLEAN DEFAULT TRUE,     -- 팔로잉 사용자 새 게시글 알림
  
  -- 팔로우 바텀시트 스킵 설정
  skip_follow_confirmation BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_community_settings_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | users.id (1:1, UNIQUE) | P2 |
| notify_new_follower | BOOLEAN | Y | 새 팔로워 알림 | P2 |
| notify_new_like | BOOLEAN | Y | 새 좋아요 알림 | P2 |
| notify_new_comment | BOOLEAN | Y | 새 댓글 알림 | P2 |
| notify_following_post | BOOLEAN | Y | 팔로잉 사용자 새 게시글 알림 | P2 |
| skip_follow_confirmation | BOOLEAN | Y | 팔로우 확인 바텀시트 스킵 | P2 |
| created_at | TIMESTAMP | Y | 생성일 | P2 |
| updated_at | TIMESTAMP | N | 수정일 | P2 |

### 비즈니스 규칙
- users 테이블과 1:1 관계
- community_profiles 생성 시 함께 생성 권장

---

## nickname_histories [NEW]

### 정형화된 초안

```sql
-- 닉네임 변경 이력 (분쟁 방지)
CREATE TABLE nickname_histories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  old_nickname VARCHAR(50),                       -- 이전 닉네임
  new_nickname VARCHAR(50),                       -- 새 닉네임
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_nickname_histories_user (user_id),
  INDEX idx_nickname_histories_old (old_nickname),
  INDEX idx_nickname_histories_new (new_nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INT | Y | PK, AUTO_INCREMENT | P2 |
| user_id | INT | Y | users.id (FK) | P2 |
| old_nickname | VARCHAR(50) | N | 이전 닉네임 | P2 |
| new_nickname | VARCHAR(50) | N | 새 닉네임 | P2 |
| changed_at | TIMESTAMP | Y | 변경 일시 | P2 |

### 비즈니스 규칙
- 분쟁 발생 시 이전 사용자 추적 가능
- 닉네임 변경 시 자동 기록

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **`show_portfolio` 컬럼 관련 질문**
   - 원본 주석: `// 투자현황 공개 - 이거 진행할 건가요`
   - 해당 기능의 구현 여부 확인 필요

2. **`nickname` 컬럼 중복 가능성**
   - `users` 테이블에도 `nickname` 컬럼이 존재
   - 원본 주석: `// 삭제해야 하나`
   - `users.nickname`과 `community_profiles.nickname`의 역할 구분 필요

### 사용자 결정 필요

**1. `show_portfolio` (투자현황 공개) 기능**
- [ ] 옵션 A (추천) - P2에서 구현하되 기본값 FALSE로 유지
- [ ] 옵션 B - P3로 연기
- [ ] 옵션 C - 기능 제외

**2. `users.nickname` vs `community_profiles.nickname`**
- [ ] 옵션 A (추천) - `users.nickname` 삭제, 커뮤니티 닉네임만 사용
- [ ] 옵션 B - 양쪽 모두 유지 (앱/커뮤니티 별도 닉네임)
- [ ] 옵션 C - `users.nickname` 유지, `community_profiles.nickname` 제거 (통합 닉네임)

---

## 관련 스펙 (생성 예정)

### API
- `specs/api/community/profile-get.md` - 프로필 조회
- `specs/api/community/profile-update.md` - 프로필 수정
- `specs/api/community/nickname-change.md` - 닉네임 변경
- `specs/api/community/settings-update.md` - 커뮤니티 설정 변경

### UI
- `specs/ui/community/profile.md` - 프로필 화면
- `specs/ui/community/profile-edit.md` - 프로필 수정 화면
- `specs/ui/community/settings.md` - 커뮤니티 설정 화면
