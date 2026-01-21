---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/stats/portfolios
auth: admin
related:
    db:
        - specs/db/portfolio/portfolios.md
    api:
        - specs/api/admin/stats-overview.md
---

# GET /api/admin/stats/portfolios

## 개요

포트폴리오 통계 상세 조회

## 스펙

### Request

- **URL**: `/api/admin/stats/portfolios`
- **Method**: GET
- **Auth**: Admin Bearer Token 필수
- **Query Params**:
    - `period`: day | week | month (기본: week)

## Response

### 성공 (200)

```json
{
  "total_portfolios": 5678,
  "active_portfolios": 4500,
  "new_portfolios_period": 120,
  "chart_data": [...]
}
```

### 에러

| 코드 | 상황      | 메시지                     |
| ---- | --------- | -------------------------- |
| 401  | 인증 실패 | "로그인이 필요합니다"      |
| 403  | 권한 없음 | "관리자 권한이 필요합니다" |

## 관련 스펙

- DB: `specs/db/portfolio/portfolios.md`
- API: `specs/api/admin/stats-overview.md`
