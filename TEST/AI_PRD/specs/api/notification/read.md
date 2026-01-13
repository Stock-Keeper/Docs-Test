# PATCH /api/notifications/{notificationId}/read

## 개요
알림 읽음 처리

## 스펙

### Request
- **URL**: `/api/notifications/{notificationId}/read`
- **Method**: `PATCH`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| notificationId | uuid | Y | 알림 ID |

## Response

### 성공 (200)
```json
{
  "id": "uuid",
  "isRead": true,
  "readAt": "2026-01-15T16:30:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 다른 사용자 알림 | "접근 권한이 없습니다" |
| 404 | 알림 없음 | "알림을 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. notifications 테이블에서 notificationId 조회
   - 없으면 404
   - user_id 불일치면 403
3. is_read = true, read_at = NOW() 업데이트
4. 응답 반환
```

## 전체 읽음 처리

### URL: `PATCH /api/notifications/read-all`

```json
// Response
{
  "updatedCount": 15
}
```

## 관련 스펙
- DB: `../db/notifications.md`
