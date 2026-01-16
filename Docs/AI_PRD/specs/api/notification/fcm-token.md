---
type: api
phase: P1
category: notification
method: POST
endpoint: /api/notifications/fcm-token
auth: required
related:
  db:
    - ../../db/fcm-tokens.md
---

# POST /api/notifications/fcm-token

## 개요
FCM 토큰 등록/갱신

## 스펙

### Request
- **URL**: `/api/notifications/fcm-token`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Body
```json
{
  "token": "string (FCM 토큰)",
  "deviceType": "IOS | ANDROID",
  "deviceId": "string (선택)"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| token | string | Y | FCM 디바이스 토큰 |
| deviceType | enum | Y | IOS 또는 ANDROID |
| deviceId | string | N | 디바이스 고유 ID |

## Response

### 성공 (200)
```json
{
  "registered": true,
  "deviceType": "IOS"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 토큰 누락 | "FCM 토큰이 필요합니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. Request Body 검증
3. fcm_tokens 테이블에서 기존 토큰 확인
   - 같은 device_id가 있으면 UPDATE
   - 없으면 INSERT
4. 토큰은 암호화하여 저장
5. 응답 반환
```

## FCM 토큰 삭제 (로그아웃 시)

### URL: `DELETE /api/notifications/fcm-token`

```
1. 로그아웃 시 호출
2. 해당 사용자의 현재 디바이스 FCM 토큰 삭제
3. 더 이상 푸시 알림 수신 안 됨
```

## 관련 스펙
- DB: `../db/fcm-tokens.md`
