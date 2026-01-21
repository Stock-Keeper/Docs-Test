---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/stats/users
auth: admin
related:
    db:
        - specs/db/auth/users.md
    api:
        - specs/api/admin/stats-overview.md
---

# GET /api/admin/stats/users

## 개요

사용자 통계 상세 조회

## 스펙

### Request

- **URL**: `/api/admin/stats/users`
- **Method**: GET
- **Auth**: Admin Bearer Token 필수
- **Query Params**:
    - `period`: day | week | month (기본: week)

## Response

### 성공 (200)

```json
{
  "total_users": 1234,
  "active_users": 890,
  "new_users_period": 45,
  "chart_data": [...]
}
```

### 에러

| 코드 | 상황      | 메시지                     |
| ---- | --------- | -------------------------- |
| 401  | 인증 실패 | "로그인이 필요합니다"      |
| 403  | 권한 없음 | "관리자 권한이 필요합니다" |

## 관련 스펙

- DB: `specs/db/auth/users.md`
- API: `specs/api/admin/stats-overview.md`
