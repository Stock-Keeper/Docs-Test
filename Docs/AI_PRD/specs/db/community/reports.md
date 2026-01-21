---
type: db
phase: P2
table: reports
related:
  api: []
  db:
    - specs/db/community/report-reasons.md
    - specs/db/auth/users.md
---

# reports

> 커뮤니티 신고 테이블

## 스키마

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

## 컬럼 상세

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

## 비즈니스 규칙

- 동일 사용자가 동일 대상을 중복 신고 시 → 기존 신고에 추가 기록 또는 무시
- 관리자만 status 변경 가능 (관리자 수동 처리만)
- `target_type`에 따른 `target_id` 참조:
    - ARTICLE → `community_articles.id`
    - REPLY → `community_article_replies.id`
    - USER → `users.id`

> [!NOTE]
> `target_id`는 다형성 참조로 DB 레벨 FK 설정 불가. 애플리케이션 레벨 검증 필요.
