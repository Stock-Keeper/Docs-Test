---
type: api
phase: P1
category: notification
method: GET/PUT
endpoint: /api/notifications/settings
auth: required
related:
  db:
    - ../../db/notification-settings.md
  ui:
    - ../../ui/notification/settings.md
---

# GET/PUT /api/notifications/settings

## 개요
알림 설정 조회/수정

## 스펙

### 조회 (GET)

#### Request
- **URL**: `/api/notifications/settings`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

#### Headers
```
Authorization: Bearer {access_token}
```

#### Response (200)
```json
{
  "globalEnabled": true,
  "frequency": "WEEKLY",
  "notificationTime": "16:00",
  "portfolios": [
    {
      "portfolioId": "uuid",
      "portfolioName": "내 포트폴리오",
      "enabled": true,
      "threshold": 5
    },
    {
      "portfolioId": "uuid",
      "portfolioName": "배당주",
      "enabled": false,
      "threshold": 10
    }
  ]
}
```

---

### 수정 (PUT)

#### Request
- **URL**: `/api/notifications/settings`
- **Method**: `PUT`
- **Auth**: Bearer Token 필수

#### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### Body
```json
{
  "globalEnabled": true,
  "frequency": "DAILY",
  "notificationTime": "09:00",
  "portfolios": [
    {
      "portfolioId": "uuid",
      "enabled": true,
      "threshold": 3
    }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| globalEnabled | boolean | N | 전체 알림 ON/OFF |
| frequency | enum | N | DAILY, WEEKLY, BIWEEKLY, MONTHLY |
| notificationTime | string | N | HH:MM (09:00~21:00) |
| portfolios | array | N | 포트폴리오별 설정 |
| portfolios[].portfolioId | uuid | Y | 포트폴리오 ID |
| portfolios[].enabled | boolean | Y | 알림 ON/OFF |
| portfolios[].threshold | int | Y | 임계값 (1~20%) |

#### Response (200)
```json
{
  "globalEnabled": true,
  "frequency": "DAILY",
  "notificationTime": "09:00",
  "updatedAt": "2026-01-15T14:30:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 잘못된 시간 형식 | "알림 시간은 09:00~21:00 사이입니다" |
| 400 | 잘못된 임계값 | "임계값은 1~20% 사이입니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. GET: notification_settings 테이블 조회
   - 없으면 기본값 반환 (ON, WEEKLY, 16:00)
3. PUT: 
   - 입력값 검증 (시간, 임계값 범위)
   - notification_settings 테이블 UPSERT
   - 포트폴리오별 설정도 함께 저장
4. 응답 반환
```

## 관련 스펙
- DB: `../db/notification-settings.md`
- UI: `../ui/notification/settings.md`
