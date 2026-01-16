# DB 스키마 (Draft)

> 커뮤니티 기능을 위한 신규 테이블 설계

---

## community_profiles

커뮤니티 프로필 정보 (users 테이블과 분리)

```sql
CREATE TABLE community_profiles (
  user_id VARCHAR(36) PRIMARY KEY,        -- users.id FK
  nickname VARCHAR(20) NOT NULL UNIQUE,   -- 커뮤니티 닉네임
  nickname_changed_at TIMESTAMP,          -- 닉변 쿨타임용
  profile_picture VARCHAR(500),           -- 커뮤니티 프사 (별도)
  bio VARCHAR(200),                       -- 자기소개
  
  -- 공개 설정
  show_recent_activity BOOLEAN DEFAULT TRUE,  -- 최근활동 공개
  show_portfolio BOOLEAN DEFAULT FALSE,       -- 투자현황 공개
  show_trade BOOLEAN DEFAULT FALSE,           -- 거래 정보 공개 (팔로워에게 알림)
  
  -- 알림 설정
  notify_post_like BOOLEAN DEFAULT TRUE,      -- 내 글에 좋아요
  notify_post_comment BOOLEAN DEFAULT TRUE,   -- 내 글에 댓글
  notify_post_repost BOOLEAN DEFAULT TRUE,    -- 내 글 리포스트
  notify_new_follower BOOLEAN DEFAULT TRUE,   -- 새 팔로워
  notify_following_post BOOLEAN DEFAULT TRUE, -- 팔로우 유저 새 글
  notify_following_trade BOOLEAN DEFAULT TRUE,-- 팔로우 유저 거래
  
  -- 상태
  is_terms_agreed BOOLEAN DEFAULT FALSE,  -- 약관 동의
  terms_agreed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 카운트 캐시
  post_count INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 컬럼 설명

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | VARCHAR(36) | PK, users.id FK |
| nickname | VARCHAR(20) | 커뮤니티 닉네임 (UNIQUE) |
| nickname_changed_at | TIMESTAMP | 닉네임 변경일 (90일 쿨타임) |
| profile_picture | VARCHAR(500) | 프로필 이미지 URL |
| bio | VARCHAR(200) | 자기소개 |
| show_recent_activity | BOOLEAN | 최근활동 공개 여부 |
| show_portfolio | BOOLEAN | 투자현황 공개 여부 |
| show_trade | BOOLEAN | 거래 정보 공개 여부 (기본: OFF) |
| notify_* | BOOLEAN | 알림 설정 (기본: ON) |
| is_terms_agreed | BOOLEAN | 약관 동의 여부 |
| is_active | BOOLEAN | 활성화 상태 (탈퇴 시 false) |

---

## community_blocks

차단 관계

```sql
CREATE TABLE community_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blocker_id VARCHAR(36) NOT NULL,        -- 차단한 사람
  blocked_id VARCHAR(36) NOT NULL,        -- 차단당한 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_block_unique (blocker_id, blocked_id)
);
```

---

## community_reports

신고 내역

```sql
CREATE TABLE community_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id VARCHAR(36) NOT NULL,
  target_type ENUM('POST', 'COMMENT', 'USER'),
  target_id VARCHAR(36) NOT NULL,
  reason ENUM('SPAM', 'ABUSE', 'INAPPROPRIATE', 'HATE', 'PRIVACY', 'OTHER'),
  description VARCHAR(500),
  status ENUM('PENDING', 'REVIEWED', 'REJECTED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_report_status (status),
  INDEX idx_report_target (target_type, target_id)
);
```

### 신고 사유 (reason)

| 값 | 설명 |
|------|------|
| SPAM | 스팸, 광고 |
| ABUSE | 비속어, 욕설 |
| INAPPROPRIATE | 허위 정보 |
| HATE | 혐오 발언 |
| PRIVACY | 개인정보 노출 |
| OTHER | 기타 |

---

## community_bookmarks (추가 예정)

북마크 기능용 테이블

```sql
CREATE TABLE community_bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36) NOT NULL,           -- posts.id FK
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_bookmark_unique (user_id, post_id)
);
```

---

> 📅 최종 수정: 2026-01-16
