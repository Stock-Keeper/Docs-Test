---
# P1 알림(Notification) DB 스키마

## 원본 내용
> AI_PRD/_inbox/sk_p1.md (Notification 관련 테이블)
> - notifications, notification_types, notification_settings, device_tokens

## AI 분석 결과
- 추론 유형: db
- 추론 작업: NEW
- 추론 Phase: P1
- 연관 도메인: 알림 시스템

## 정형화된 초안

```dbml
// 알림 스택
Table notifications {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  notification_type_id integer [ref: > notification_types.id]
  title varchar [not null]
  message text [not null]
  related_entity_id integer [ref: > portfolios.id]
  is_read boolean [default: false]
  created_at timestamp [default: `now()`]
  is_delete boolean [default: false]
  delete_at timestamp

  Indexes {
    user_id [name: 'idx_notifications_user_id']
    (user_id, is_read) [name: 'idx_notifications_user_read']
  }
}

// 알림 종류
Table notification_types {
  id integer [primary key, increment]
  code varchar [not null, unique]
  name varchar [not null]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

// 알림 설정 (포트폴리오별)
Table notification_settings {
  id integer [primary key, increment]
  portfolio_id integer [ref: - portfolios.id]
  is_enabled boolean [default: false]
  alert_cycle enum('WEEKLY', 'MONTHLY')
  alert_time time
  threshold_percentage decimal [default: 20.0]
  updated_at timestamp
}

// 푸시 알림 토큰
Table device_tokens {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  token varchar [not null]
  platform enum('IOS', 'ANDROID', 'WEB') [not null]
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp

  Indexes {
    token [unique, name: 'idx_device_tokens_token']
    (user_id, platform) [name: 'idx_device_tokens_user_platform']
  }
}
```
---
