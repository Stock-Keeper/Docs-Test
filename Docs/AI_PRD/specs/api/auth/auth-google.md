---
type: api
phase: P1
category: auth
method: POST
endpoint: /api/auth/google/callback
auth: none
related:
    db:
        - specs/db/auth/users.md
        - specs/db/auth/token-vault.md
---

# POST /api/auth/google/callback

## 개요

Google OAuth 인증 후 JWT 토큰 발급

## 스펙

### Request

- **URL**: `/api/auth/google/callback`
- **Method**: `POST`
- **Auth**: 불필요

### Headers

```
Content-Type: application/json
```

### Body

```json
{
    "authorization_code": "string (필수)",
    "redirect_uri": "string (필수)"
}
```

## Response

### 성공 (200)

```json
{
  "access_token": "string (JWT, 1시간)",
  "refresh_token": "string (JWT, 14일)",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "is_new_user": boolean
  }
}
```

### 에러

| 코드 | 상황                    | 메시지                         |
| ---- | ----------------------- | ------------------------------ |
| 400  | authorization_code 누락 | "인증 코드가 필요합니다"       |
| 401  | 유효하지 않은 인증 코드 | "인증에 실패했습니다"          |
| 500  | Google API 오류         | "일시적인 오류가 발생했습니다" |

## 구현 로직

```
1. authorization_code로 Google에 access_token 요청
2. access_token으로 Google 사용자 정보 조회 (email, name, picture)
3. users 테이블에서 email로 사용자 조회
   - 없으면: 신규 생성 (is_new_user = true)
   - 있으면: last_login_at 업데이트 (is_new_user = false)
4. JWT Access Token 생성 (payload: user_id, email, name, role)
5. JWT Refresh Token 생성 및 DB 저장
6. 응답 반환
```

## JWT Payload

### Access Token

```json
{
  "user_id": "uuid",
  "email": "string",
  "name": "string",
  "role": "USER | ADMIN",
  "iat": timestamp,
  "exp": timestamp (iat + 1시간)
}
```

### Refresh Token

```json
{
  "user_id": "uuid",
  "iat": timestamp,
  "exp": timestamp (iat + 14일)
}
```

## 관련 스펙

- DB: `../db/users.md`
- DB: `../db/refresh-tokens.md`
