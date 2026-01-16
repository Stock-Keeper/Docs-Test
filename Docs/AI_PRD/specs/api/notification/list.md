---
type: api
phase: P1
category: notification
method: GET
endpoint: /api/notifications
auth: required
related:
  db:
    - ../../db/notifications.md
  ui:
    - ../../ui/notification/center.md
---

# GET /api/notifications

## 개요
알림 목록 조회 (최근 30일, 100개 제한)

## 스펙

### Request
- **URL**: `/api/notifications`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| page | int | N | 페이지 번호 | 1 |
| limit | int | N | 페이지당 건수 | 20 |
| unreadOnly | boolean | N | 미읽음만 조회 | false |

## Response

### 성공 (200)
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "REBALANCING_NEEDED",
      "title": "[내 포트폴리오] 리밸런싱이 필요합니다",
      "body": "3개 종목의 비율 조정이 필요합니다",
      "portfolioId": "uuid",
      "portfolioName": "내 포트폴리오",
      "isRead": false,
      "createdAt": "2026-01-15T16:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "limit": 20
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. notifications 테이블에서 해당 사용자 알림 조회
   - created_at > NOW() - 30DAYS
   - ORDER BY created_at DESC
   - unreadOnly면 is_read = false 조건 추가
3. 미읽음 알림 개수 카운트 (unreadCount)
4. 페이지네이션 적용
5. 응답 반환
```

## 관련 스펙
- DB: `../db/notifications.md`
- UI: `../ui/notification/center.md`
