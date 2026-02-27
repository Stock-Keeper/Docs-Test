---
type: db
phase: P3
table: post_detail_unlocks
related:
    api:
        - specs/api/community/unlock-detail.md
    db:
        - specs/db/auth/users.md
        - specs/db/community/posts.md
        - specs/db/bm/token-histories.md
---

# post_detail_unlocks 테이블

## 개요

커뮤니티 게시글에 첨부된 포트폴리오의 프리미엄 상세 지표(Lv.2/Lv.3) 열람 해제 이력.
`token_histories`는 순수 금전 거래 로그로 유지하고, 접근 권한은 이 테이블로 분리 관리.

## 스키마

```sql
CREATE TABLE post_detail_unlocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 해제한 사용자 (FK)
  article_id INT NOT NULL,                        -- 해제된 게시글 (FK)
  cost_type ENUM('TOKEN', 'MEMBERSHIP') NOT NULL, -- 소모 방식
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES community_articles(id) ON DELETE CASCADE,
  UNIQUE INDEX uk_unlock_user_article (user_id, article_id), -- 중복 해제 방지 (DB 레벨)
  INDEX idx_unlock_article (article_id)                      -- 게시글별 해제 수 집계용
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼        | 타입      | 필수 | 기본값            | 설명                  | Phase |
| ----------- | --------- | ---- | ----------------- | --------------------- | ----- |
| id          | INT       | Y    | AUTO_INCREMENT    | PK                    | P3    |
| user_id     | INT       | Y    | -                 | 해제한 사용자 ID (FK) | P3    |
| article_id  | INT       | Y    | -                 | 해제된 게시글 ID (FK) | P3    |
| cost_type   | ENUM      | Y    | -                 | TOKEN / MEMBERSHIP    | P3    |
| unlocked_at | TIMESTAMP | Y    | CURRENT_TIMESTAMP | 해제 일시             | P3    |

## 인덱스

| 인덱스명               | 컬럼                  | 타입   | 용도                          |
| ---------------------- | --------------------- | ------ | ----------------------------- |
| uk_unlock_user_article | (user_id, article_id) | UNIQUE | 중복 해제 방지 (DB 레벨 보장) |
| idx_unlock_article     | article_id            | INDEX  | 게시글별 열람 수 집계         |

## 비즈니스 규칙

- **중복 해제 불가**: `(user_id, article_id)` UNIQUE 제약으로 DB 레벨에서 보장
- **게시글 삭제 시 자동 정리**: `community_articles` ON DELETE CASCADE
- **토큰 소모 2개** (Free/한도초과 시), 멤버십 한도 차감 시에는 `cost_type = 'MEMBERSHIP'`
- 해제 후 재접근 시 이 테이블에서 조회 → 무조건 반환 (추가 차감 없음)

## 열람 해제 트랜잭션 순서

```sql
BEGIN;
-- 1. 중복 확인 (이미 있으면 COMMIT 후 바로 반환)
SELECT id FROM post_detail_unlocks
WHERE user_id = ? AND article_id = ?;

-- 2. 비용 차감 (TOKEN인 경우만)
UPDATE users SET token_balance = token_balance - 2 WHERE id = ?;
INSERT INTO token_histories (user_id, amount, balance_after, type, feature_type, reference_id)
VALUES (?, -2, ?, 'USE', 'DETAIL', ?);  -- reference_id = article_id

-- 3. 해제 이력 등록
INSERT INTO post_detail_unlocks (user_id, article_id, cost_type)
VALUES (?, ?, 'TOKEN');
COMMIT;
```

## 관련 스펙

- API: `specs/api/community/unlock-detail.md`
- DB: `specs/db/bm/token-histories.md`
- DB: `specs/db/community/posts.md`
