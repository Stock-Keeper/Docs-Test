---
type: api
phase: P1
endpoint: /api/announcements/{id}
method: GET
related:
  db:
    - announcements.md
  ui: []
---

# 공지사항 상세 조회

## 개요
공지사항 상세 조회 API

## 접근 권한
- 로그인 사용자만

## 요청

```
GET /api/announcements/{id}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | number | Y | 공지사항 ID |

## 응답

```json
{
  "id": 1,
  "type": "PATCH_NOTE",
  "title": "v1.2.0 업데이트",
  "content": "## 새로운 기능\n- 포트폴리오 스냅샷...",
  "version": "1.2.0",
  "isPinned": false,
  "isPopup": false,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 404 | 공지사항을 찾을 수 없음 |
