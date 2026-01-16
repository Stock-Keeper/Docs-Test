---
type: api
phase: P1
endpoint: /api/announcements/popup
method: GET
related:
  db:
    - announcements.md
  ui: []
---

# 팝업 공지 조회

## 개요
앱 실행 시 표시할 팝업 공지 조회 API

## 접근 권한
- 로그인 사용자만

## 요청

```
GET /api/announcements/popup
```

## 응답

```json
{
  "hasPopup": true,
  "announcements": [
    {
      "id": 5,
      "type": "MAINTENANCE",
      "title": "서버 점검 안내",
      "content": "1월 20일 02:00-04:00 서버 점검...",
      "startAt": "2026-01-20T02:00:00Z",
      "endAt": "2026-01-20T04:00:00Z"
    }
  ]
}
```

## 비즈니스 로직
- `is_popup = true` AND 현재 시각이 `start_at ~ end_at` 범위 내
- 여러 팝업이 있으면 모두 반환 (프론트에서 순차 표시)

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
