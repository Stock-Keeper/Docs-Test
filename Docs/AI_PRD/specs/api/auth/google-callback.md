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

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| authorization_code | string | Y | Google OAuth 인증 코드 |
| redirect_uri | string | Y | 리다이렉트 URI |

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
    "is_new_user": true
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | authorization_code 누락 | "인증 코드가 필요합니다" |
| 400 | redirect_uri 누락 | "리다이렉트 URI가 필요합니다" |
| 401 | 유효하지 않은 인증 코드 | "인증에 실패했습니다" |
| 500 | Google API 오류 | "일시적인 오류가 발생했습니다" |

## 구현 로직

```
1. Request Body 검증 (authorization_code, redirect_uri)
2. Google OAuth 서버에 access_token 요청
   - POST https://oauth2.googleapis.com/token
   - grant_type: authorization_code
   - code: {authorization_code}
   - client_id: {GOOGLE_CLIENT_ID}
   - client_secret: {GOOGLE_CLIENT_SECRET}
   - redirect_uri: {redirect_uri}
3. Google access_token으로 사용자 정보 조회
   - GET https://www.googleapis.com/oauth2/v2/userinfo
   - Authorization: Bearer {google_access_token}
4. users 테이블에서 email로 사용자 조회
   - 없으면: 신규 생성 (is_new_user = true)
   - 있으면: last_login_at 업데이트 (is_new_user = false)
5. JWT Access Token 생성
   - payload: {user_id, email, name, role, iat, exp}
   - 알고리즘: HS256
   - 만료: 1시간
6. JWT Refresh Token 생성
   - payload: {user_id, iat, exp}
   - 만료: 14일
7. refresh_tokens 테이블에 Refresh Token 해시값 저장
8. 응답 반환
```

## JWT 페이로드

### Access Token
```json
{
  "user_id": "uuid",
  "email": "string",
  "name": "string",
  "role": "USER | ADMIN",
  "iat": 1704067200,
  "exp": 1704070800
}
```

### Refresh Token
```json
{
  "user_id": "uuid",
  "iat": 1704067200,
  "exp": 1705276800
}
```

## 보안 고려사항
- Google Client Secret은 환경변수로 관리
- Refresh Token은 DB에 해시값으로 저장
- Rate Limiting: 10회/분 per IP

## 관련 스펙
- DB: `../db/users.md`
- DB: `../db/refresh-tokens.md`
- UI: `../ui/auth/login-screen.md`

## 📎 선택 참조
> 상세 UI/UX 시나리오가 필요하면 아래 파일을 참조 요청하세요.

- `../../reference/pages/01_login.md` - 로그인 플로우, 엣지케이스
