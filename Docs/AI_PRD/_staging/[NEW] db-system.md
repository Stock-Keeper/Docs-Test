---
# P1 시스템/감사(System) DB 스키마

## 원본 내용
> AI_PRD/_inbox/sk_p1.md (System 관련 테이블)
> - audit_logs, user_activities, announcements

## AI 분석 결과
- 추론 유형: db
- 추론 작업: NEW
- 추론 Phase: P1
- 연관 도메인: 관리자, 로깅

## 정형화된 초안

```dbml
// 감사 추적 (보안 로그)
Table audit_logs {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  action enum('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT') [not null]
  entity_type varchar [not null]
  entity_id integer
  old_value text // JSON
  new_value text // JSON
  ip_address varchar
  user_agent text
  created_at timestamp [default: `now()`]
}

// 사용자 활동 추적 (분석용)
Table user_activities {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  activity_type enum('PAGE_VIEW', 'BUTTON_CLICK', 'FEATURE_USE', 'SEARCH', 'SHARE') [not null]
  activity_name varchar [not null]
  metadata text // JSON
  session_id varchar
  created_at timestamp [default: `now()`]
}

// 공지사항 및 패치노트
Table announcements {
  id integer [primary key, increment]
  type enum('NOTICE', 'PATCH_NOTE', 'EVENT', 'MAINTENANCE') [not null]
  title varchar [not null]
  content text [not null]
  version varchar
  is_pinned boolean [default: false]
  is_popup boolean [default: false]
  start_at timestamp
  end_at timestamp
  created_by integer [ref: > users.id]
  created_at timestamp [default: `now()`]
  updated_at timestamp
  is_delete boolean [default: false]
  delete_at timestamp
}
```
---
