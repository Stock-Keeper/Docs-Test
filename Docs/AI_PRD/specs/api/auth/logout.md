---
type: api
phase: P1
category: auth
method: POST
endpoint: /api/auth/logout
auth: required
related:
  db:
    - ../../db/refresh-tokens.md
  ui:
    - ../../ui/auth/login-screen.md
---

# POST /api/auth/logout

## 개요
로그아웃 - Refresh Token 무효화

## 스펙

### Request
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Body
없음

## Response

### 성공 (200)
```json
{
  "message": "로그아웃 되었습니다"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 토큰 없음/유효하지 않음 | "인증이 필요합니다" |

## 구현 로직

```
1. Authorization 헤더에서 Access Token 추출
2. JWT 검증 (서명)
   - 만료되어도 로그아웃은 허용 (만료 검증 skip)
3. JWT payload에서 user_id 추출
4. refresh_tokens 테이블에서 해당 user_id의 토큰 삭제
5. 응답 반환
```

## 클라이언트 처리 로직

```javascript
async function logout() {
  try {
    const accessToken = await SecureStore.getItemAsync('access_token');
    await axios.post('/api/auth/logout', null, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  } catch (error) {
    // 서버 에러 발생해도 로컬 토큰 삭제 진행
    console.log('Logout API error:', error);
  } finally {
    // 로컬 토큰 삭제
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    // 로그인 화면으로 이동
    navigation.reset({ routes: [{ name: 'Login' }] });
  }
}
```

## 관련 스펙
- DB: `../db/refresh-tokens.md`
- UI: `../ui/auth/login-screen.md`
