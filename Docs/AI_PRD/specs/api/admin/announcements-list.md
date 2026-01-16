---
type: api
phase: P1
endpoint: /api/announcements
method: GET
related:
  db:
    - announcements.md
  ui: []
---

# 공지사항 목록 조회

## 개요
공지사항 목록 조회 API

## 접근 권한
- 로그인 사용자만

## 요청

```
GET /api/announcements?type={type}&page={page}&size={size}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| type | string | N | NOTICE, PATCH_NOTE, EVENT, MAINTENANCE |
| page | number | N | 페이지 번호 (기본: 0) |
| size | number | N | 페이지 크기 (기본: 20, 최대: 50) |

## 응답

```json
{
  "content": [
    {
      "id": 1,
      "type": "NOTICE",
      "title": "서비스 업데이트 안내",
      "isPinned": true,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45,
  "totalPages": 3
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
