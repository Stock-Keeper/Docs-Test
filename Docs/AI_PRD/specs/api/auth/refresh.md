---
type: api
phase: P1
category: auth
method: POST
endpoint: /api/auth/refresh
auth: none
related:
  api:
    - google-callback.md
    - logout.md
  db:
    - ../../db/refresh-tokens.md
---

# POST /api/auth/refresh

## 개요
Refresh Token으로 새 Access Token 발급

## 스펙

### Request
- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Auth**: 불필요 (Refresh Token으로 인증)

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "refresh_token": "string (필수)"
}
```

## Response

### 성공 (200)
```json
{
  "access_token": "string (JWT, 1시간)"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | refresh_token 누락 | "Refresh Token이 필요합니다" |
| 401 | 유효하지 않은 토큰 | "유효하지 않은 토큰입니다" |
| 401 | 만료된 토큰 | "토큰이 만료되었습니다. 다시 로그인해주세요" |
| 401 | DB에 없는 토큰 (로그아웃됨) | "유효하지 않은 토큰입니다" |

## 구현 로직

```
1. Request Body에서 refresh_token 추출
2. JWT 검증 (서명, 만료 시간)
3. refresh_tokens 테이블에서 토큰 해시값 조회
   - 없으면: 401 에러 (이미 로그아웃됨)
4. JWT payload에서 user_id 추출
5. users 테이블에서 사용자 정보 조회
   - is_active가 false면 401 에러
6. 새 Access Token 생성
   - payload: {user_id, email, name, role, iat, exp}
   - 만료: 1시간
7. 응답 반환
```

## 클라이언트 처리 로직

```javascript
// axios 인터셉터 예시
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', {
            refresh_token: refreshToken
          });
          await SecureStore.setItemAsync('access_token', data.access_token);
          // 원래 요청 재시도
          error.config.headers.Authorization = `Bearer ${data.access_token}`;
          return axios.request(error.config);
        } catch {
          // 갱신 실패 → 로그아웃
          await logout();
          navigation.navigate('Login');
        }
      }
    }
    return Promise.reject(error);
  }
);
```

## 관련 스펙
- API: `google-callback.md`
- API: `logout.md`
- DB: `../db/refresh-tokens.md`
