---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/monitoring/errors
auth: admin
related:
  db:
    - ../../db/error-logs.md
  api:
    - monitoring-errors-detail.md
---

# GET /api/admin/monitoring/errors

## 개요
관리자 - 에러 로그 조회

## 스펙

### Request
- **URL**: `/api/admin/monitoring/errors`
- **Method**: `GET`
- **Auth**: Bearer Token (ADMIN role 필수)

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| period | enum | N | TODAY, WEEK, MONTH, CUSTOM | TODAY |
| startDate | date | period=CUSTOM 시 필수 | 시작일 (YYYY-MM-DD) | - |
| endDate | date | period=CUSTOM 시 필수 | 종료일 (YYYY-MM-DD) | - |
| level | enum | N | ERROR, WARN, INFO, ALL | ALL |
| search | string | N | 에러 메시지 키워드 검색 | - |
| page | int | N | 페이지 번호 | 1 |
| limit | int | N | 페이지당 건수 | 50 |

## Response

### 성공 (200)
```json
{
  "data": [
    {
      "id": 123,
      "level": "ERROR",
      "errorCode": "500",
      "message": "NullPointerException in RebalancingService",
      "requestPath": "/api/portfolios/123/rebalance",
      "requestMethod": "POST",
      "userId": "uuid",
      "createdAt": "2026-01-13T14:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 234,
    "limit": 50
  },
  "summary": {
    "totalErrors": 150,
    "totalWarns": 84,
    "totalInfos": 0
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "관리자 권한이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 role 확인 (ADMIN 아니면 403)
2. 기간 조건 생성:
   - TODAY: created_at >= CURDATE()
   - WEEK: created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
   - MONTH: created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
   - CUSTOM: created_at BETWEEN startDate AND endDate
3. error_logs 테이블에서 조건에 맞는 로그 조회
4. 레벨별 집계 (summary)
5. 페이지네이션 적용
6. 응답 반환
```

## 관련 스펙
- DB: `../db/error-logs.md`
- API: `monitoring-errors-detail.md`
