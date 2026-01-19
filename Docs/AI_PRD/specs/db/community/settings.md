---
type: db
phase: P2
table: community_settings
related:
  api: []
  ui: []
  db:
    - specs/db/auth/users.md
    - specs/db/community/profiles.md
---

# community_settings

커뮤니티 설정 테이블 (알림, 공개범위 등). users 테이블과 1:1 관계.

## 스키마

```sql
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

## 컬럼 상세

| 컬럼                     | 타입      | 필수 | 기본값            | 설명                         |
| ------------------------ | --------- | ---- | ----------------- | ---------------------------- |
| id                       | INT       | Y    | AUTO_INCREMENT    | PK                           |
| user_id                  | INT       | Y    | -                 | users.id (1:1, UNIQUE)       |
| notify_new_follower      | BOOLEAN   | Y    | TRUE              | 새 팔로워 알림               |
| notify_new_like          | BOOLEAN   | Y    | TRUE              | 새 좋아요 알림               |
| notify_new_comment       | BOOLEAN   | Y    | TRUE              | 새 댓글 알림                 |
| notify_following_post    | BOOLEAN   | Y    | TRUE              | 팔로잉 사용자 새 게시글 알림 |
| skip_follow_confirmation | BOOLEAN   | Y    | FALSE             | 팔로우 확인 바텀시트 스킵    |
| created_at               | TIMESTAMP | Y    | CURRENT_TIMESTAMP | 생성일                       |
| updated_at               | TIMESTAMP | N    | NULL              | 수정일                       |

## 인덱스

| 인덱스명                    | 컬럼    | 타입   | 용도        |
| --------------------------- | ------- | ------ | ----------- |
| idx_community_settings_user | user_id | UNIQUE | 사용자 조회 |

## 비즈니스 규칙

- users 테이블과 **1:1 관계**
- **community_profiles 생성 시 함께 생성** 권장
