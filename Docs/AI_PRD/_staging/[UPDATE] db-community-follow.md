# Community Follow DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목         | 작업   | 기존 스펙                     |
| ------------ | ------ | ----------------------------- |
| user_follows | UPDATE | specs/db/community/follows.md |
| user_blocks  | NEW    | -                             |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 핵심 기능)
- **연관 기존 스펙**:
  - `specs/db/community/follows.md`
  - `specs/api/community/follow.md`
- **비교한 기존 스펙 파일**:
  - `specs/db/community/follows.md` ⭐ 정밀 비교 완료

---

## user_follows [UPDATE]

> **기존 테이블명**: `follows` → **신규 테이블명**: `user_follows`

### 기존 스펙 요약 (follows.md)

```sql
CREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id VARCHAR(36) NOT NULL,      -- 팔로우 하는 사람
  following_id VARCHAR(36) NOT NULL,     -- 팔로우 당하는 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_follows_unique (follower_id, following_id),
  INDEX idx_follows_follower (follower_id),
  INDEX idx_follows_following (following_id)
);
```

### 변경 사항

| 구분     | 기존 (follows)    | 변경 (user_follows)                   | 비고           |
| -------- | ----------------- | ------------------------------------- | -------------- |
| 테이블명 | `follows`       | `user_follows`                      | 명명 규칙 통일 |
| FK 타입  | VARCHAR(36)       | INT                                   | 타입 정규화    |
| 인덱스명 | `idx_follows_*` | `idx_follows_follower_following` 등 | 명칭 변경      |
| Phase    | P3                | P2                                    | Phase 앞당김   |

### 변경된 스키마

```sql
-- 팔로우 관계 (기존 follows 대체)
CREATE TABLE user_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL,                       -- 팔로우 하는 사람
  following_id INT NOT NULL,                      -- 팔로우 당하는 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_follows_follower_following (follower_id, following_id),
  INDEX idx_follows_follower (follower_id),
  INDEX idx_follows_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼         | 타입      | 필수 | 설명                    | Phase | 변경      |
| ------------ | --------- | ---- | ----------------------- | ----- | --------- |
| id           | INT       | Y    | PK, AUTO_INCREMENT      | P2    | 유지      |
| follower_id  | INT       | Y    | 팔로우 하는 사람 (FK)   | P2    | 타입 변경 |
| following_id | INT       | Y    | 팔로우 당하는 사람 (FK) | P2    | 타입 변경 |
| created_at   | TIMESTAMP | Y    | 팔로우 일시             | P2    | 유지      |

### 비즈니스 규칙

- 자기 자신 팔로우 불가 (애플리케이션 레벨 검증)
- 팔로우/언팔로우 시 `community_profiles.follower_count`, `following_count` 캐시 업데이트
- 팔로우 시 알림 발송 (community_settings.notify_new_follower = TRUE인 경우)

---

## user_blocks [NEW]

### 정형화된 초안

```sql
-- 사용자 차단 (사용자가 타 사용자를 차단)
CREATE TABLE user_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blocker_id INT NOT NULL,                        -- 차단한 사람
  blocked_id INT NOT NULL,                        -- 차단당한 사람
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_blocks_blocker_blocked (blocker_id, blocked_id),
  INDEX idx_blocks_blocker (blocker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼       | 타입      | 필수 | 설명                 | Phase |
| ---------- | --------- | ---- | -------------------- | ----- |
| id         | INT       | Y    | PK, AUTO_INCREMENT   | P2    |
| blocker_id | INT       | Y    | 차단한 사용자 (FK)   | P2    |
| blocked_id | INT       | Y    | 차단당한 사용자 (FK) | P2    |
| created_at | TIMESTAMP | Y    | 차단 일시            | P2    |

### 비즈니스 규칙

- 차단 시 자동 언팔로우 (양방향)
- 차단된 사용자는:
  - 차단한 사용자의 게시글/댓글 볼 수 없음
  - 차단한 사용자 검색 결과에서 제외
  - 차단한 사용자를 팔로우할 수 없음
- 차단 해제 시 레코드 DELETE

### 차단 여부 확인 쿼리

```sql
-- 특정 사용자가 나를 차단했는지 확인
SELECT EXISTS(
  SELECT 1 FROM user_blocks 
  WHERE blocker_id = ? AND blocked_id = ?
) as is_blocked;

-- 차단 또는 차단당한 관계 확인 (양방향)
SELECT EXISTS(
  SELECT 1 FROM user_blocks 
  WHERE (blocker_id = ? AND blocked_id = ?) 
     OR (blocker_id = ? AND blocked_id = ?)
) as has_block_relation;
```

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **Phase 변경**

   - 기존 `follows.md`는 P3로 지정
   - inbox에서는 커뮤니티 핵심 기능으로 보임 → P2 제안
2. **캐시 컬럼 위치**

   - 기존: `users` 테이블에 `follower_count`, `following_count` 추가 제안
   - inbox: `community_profiles` 테이블에 해당 컬럼 포함
   - 중복 방지 필요

### 사용자 결정 필요

**1. Phase 결정**

- [ ] 옵션 A (추천) - P2로 앞당김 (커뮤니티 핵심 기능)
- [ ] 옵션 B - P3 유지

**2. 팔로우 카운트 캐시 위치**

- [X] 옵션 A (추천) - `community_profiles` 테이블만 사용 (inbox 방식)
- [ ] 옵션 B - `users` 테이블만 사용 (기존 방식)
- [ ] 옵션 C - 양쪽 모두 유지 (중복)

---

## 관련 스펙 (수정/생성 예정)

### API (수정 필요)

- `specs/api/community/follow.md` → 테이블명 변경 반영

### API (신규)

- `specs/api/community/block.md` - 사용자 차단/해제
- `specs/api/community/block-list.md` - 차단 목록 조회
