# Community Moderation DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목             | 작업 | 기존 스펙 |
| ---------------- | ---- | --------- |
| reports          | NEW  | -         |
| report_reasons   | NEW  | -         |
| user_suspensions | NEW  | -         |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P2 (커뮤니티 운영 필수 기능)
- **연관 기존 스펙**: 없음 (신규 도메인)
- **비교한 기존 스펙 파일**:
    - `specs/db/community/*.md` (5개 파일) - 해당 테이블 없음

---

## reports [NEW]

### 정형화된 초안

```sql
-- 신고
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,                       -- 신고자
  target_type ENUM('ARTICLE', 'REPLY', 'USER') NOT NULL, -- 신고 대상 종류
  target_id INT NOT NULL,                         -- 대상 ID (target_type에 따라 다른 테이블 참조)
  report_reason_id INT,                           -- 신고 사유 (FK)
  description TEXT,                               -- 상세 사유
  status ENUM('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED') DEFAULT 'PENDING', -- 처리 상태
  reviewed_by INT,                                -- 처리한 관리자 (FK)
  reviewed_at TIMESTAMP,                          -- 처리 날짜
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (report_reason_id) REFERENCES report_reasons(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_reports_reporter (reporter_id),
  INDEX idx_reports_target (target_type, target_id),
  INDEX idx_reports_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼             | 타입      | 필수 | 설명                                | Phase |
| ---------------- | --------- | ---- | ----------------------------------- | ----- |
| id               | INT       | Y    | PK, AUTO_INCREMENT                  | P2    |
| reporter_id      | INT       | Y    | 신고자 ID (FK)                      | P2    |
| target_type      | ENUM      | Y    | 신고 대상 종류 (ARTICLE/REPLY/USER) | P2    |
| target_id        | INT       | Y    | 대상 ID (다형성 참조)               | P2    |
| report_reason_id | INT       | N    | 신고 사유 (FK)                      | P2    |
| description      | TEXT      | N    | 상세 사유 (기타 선택 시)            | P2    |
| status           | ENUM      | Y    | 처리 상태                           | P2    |
| reviewed_by      | INT       | N    | 처리한 관리자 ID (FK)               | P2    |
| reviewed_at      | TIMESTAMP | N    | 처리 일시                           | P2    |
| created_at       | TIMESTAMP | Y    | 신고 일시                           | P2    |

### 비즈니스 규칙

- 동일 사용자가 동일 대상을 중복 신고 시 → 기존 신고에 추가 기록 또는 무시
- 신고 누적 N회 시 자동 숨김 처리 가능
- 관리자만 status 변경 가능
- `target_type`에 따른 `target_id` 참조:
    - ARTICLE → `community_articles.id`
    - REPLY → `community_article_replies.id`
    - USER → `users.id`

---

## report_reasons [NEW]

### 정형화된 초안

```sql
-- 신고 사유
CREATE TABLE report_reasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,               -- 코드 (예: 'SPAM', 'ABUSE')
  name VARCHAR(100) NOT NULL,                     -- 표시명
  is_active BOOLEAN DEFAULT TRUE,                 -- 활성화 여부

  UNIQUE INDEX idx_report_reasons_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼      | 타입         | 필수 | 설명                    | Phase |
| --------- | ------------ | ---- | ----------------------- | ----- |
| id        | INT          | Y    | PK, AUTO_INCREMENT      | P2    |
| code      | VARCHAR(50)  | Y    | 신고 사유 코드 (UNIQUE) | P2    |
| name      | VARCHAR(100) | Y    | 표시명                  | P2    |
| is_active | BOOLEAN      | Y    | 활성화 여부             | P2    |

### 초기 데이터 (권장)

```sql
INSERT INTO report_reasons (code, name) VALUES
('SPAM', '스팸/광고'),
('ABUSE', '욕설/비방'),
('SEXUAL', '음란물'),
('VIOLENCE', '폭력적 내용'),
('FRAUD', '사기/허위정보'),
('COPYRIGHT', '저작권 침해'),
('PERSONAL_INFO', '개인정보 노출'),
('OTHER', '기타');
```

### 비즈니스 규칙

- 관리자가 신고 사유 추가/수정/비활성화 가능
- `is_active = FALSE`인 사유는 신고 시 선택 불가

---

## user_suspensions [NEW]

### 정형화된 초안

```sql
-- 정지 이력
CREATE TABLE user_suspensions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 정지된 사용자
  admin_id INT,                                   -- 처리한 관리자
  reason TEXT NOT NULL,                           -- 정지 사유
  suspended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 정지 일시
  suspended_until TIMESTAMP,                      -- 정지 해제 예정 (NULL = 영구정지)
  lifted_at TIMESTAMP,                            -- 조기 해제 시 해제 일시
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_suspensions_user (user_id),
  INDEX idx_suspensions_user_until (user_id, suspended_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼            | 타입      | 필수 | 설명                         | Phase |
| --------------- | --------- | ---- | ---------------------------- | ----- |
| id              | INT       | Y    | PK, AUTO_INCREMENT           | P2    |
| user_id         | INT       | Y    | 정지된 사용자 ID (FK)        | P2    |
| admin_id        | INT       | N    | 처리한 관리자 ID (FK)        | P2    |
| reason          | TEXT      | Y    | 정지 사유                    | P2    |
| suspended_at    | TIMESTAMP | Y    | 정지 시작 일시               | P2    |
| suspended_until | TIMESTAMP | N    | 정지 해제 예정 (NULL = 영구) | P2    |
| lifted_at       | TIMESTAMP | N    | 조기 해제 일시               | P2    |
| created_at      | TIMESTAMP | Y    | 레코드 생성일                | P2    |

### 비즈니스 규칙

- 정지 시 `users.is_suspended = TRUE`, `users.suspended_until` 설정
- `suspended_until = NULL`이면 영구정지
- 조기 해제 시 `lifted_at` 설정 + `users.is_suspended = FALSE`
- 정지 이력은 삭제하지 않고 보관 (감사 목적)

### 정지 상태 확인 쿼리

```sql
-- 현재 정지 상태 확인
SELECT
  u.is_suspended,
  u.suspended_until,
  CASE
    WHEN u.is_suspended = FALSE THEN '정상'
    WHEN u.suspended_until IS NULL THEN '영구정지'
    WHEN u.suspended_until > NOW() THEN CONCAT('정지중 (~', u.suspended_until, ')')
    ELSE '정지 만료'
  END as status
FROM users u
WHERE u.id = ?;

-- 정지 해제 예정자 목록 (배치 처리용)
SELECT user_id FROM users
WHERE is_suspended = TRUE
  AND suspended_until IS NOT NULL
  AND suspended_until <= NOW();
```

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **users 테이블 연관 컬럼**
    - inbox에서 `users.is_suspended`, `users.suspended_until` 컬럼 언급
    - users 테이블 수정 필요 (auth 도메인)

2. **target_id 다형성 참조**
    - `target_type`에 따라 다른 테이블 참조
    - DB 레벨 FK 설정 불가 → 애플리케이션 레벨 검증 필요

### 사용자 결정 필요

**1. 신고 누적 시 자동 처리**

- [ ] 옵션 A (추천) - 신고 N회 누적 시 자동 숨김 (visibility_status = 'HIDDEN_BY_ADMIN')
- [x] 옵션 B - 관리자 수동 처리만
- [ ] 옵션 C - 자동 숨김 + 관리자 알림

**2. 정지 단계화**

- [ ] 옵션 A (추천) - 경고 → 1일 → 7일 → 30일 → 영구 단계적 적용
- [x] 옵션 B - 관리자 재량으로 기간 설정

---

## 관련 스펙 (생성 예정)

### API

- `specs/api/community/report.md` - 신고 접수
- `specs/api/admin/report-list.md` - 신고 목록 조회 (관리자)
- `specs/api/admin/report-review.md` - 신고 처리 (관리자)
- `specs/api/admin/suspension.md` - 사용자 정지/해제 (관리자)

### UI

- `specs/ui/community/report.md` - 신고 팝업/바텀시트
- `specs/ui/admin/report-management.md` - 신고 관리 화면
- `specs/ui/admin/user-suspension.md` - 사용자 정지 관리 화면

### DB (수정 필요)

- `specs/db/auth/users.md` - `is_suspended`, `suspended_until` 컬럼 추가
