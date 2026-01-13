# GET /api/admin/users

## 개요
관리자 - 사용자 목록 조회 (검색, 필터링, 페이지네이션)

## 스펙

### Request
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Auth**: Bearer Token (ADMIN role 필수)

### Headers
```
Authorization: Bearer {access_token}
```

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| search | string | N | 이메일/닉네임 검색 | - |
| role | enum | N | USER, ADMIN, ALL | ALL |
| membership | enum | N | NOT, PRO, ALL | ALL |
| status | enum | N | ACTIVE, INACTIVE, ALL | ALL |
| sortBy | enum | N | created_at, last_login_at, nickname | created_at |
| sortOrder | enum | N | ASC, DESC | DESC |
| page | int | N | 페이지 번호 (1부터) | 1 |
| limit | int | N | 페이지당 건수 (20/50/100) | 20 |

## Response

### 성공 (200)
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "사용자1",
      "role": "USER",
      "membership": "NOT",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z",
      "lastLoginAt": "2026-01-13T10:00:00Z",
      "portfolioCount": 3
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 195,
    "limit": 20
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "관리자 권한이 필요합니다" |
| 400 | 잘못된 파라미터 | "유효하지 않은 파라미터입니다" |

## 구현 로직

```
1. JWT 토큰에서 role 확인 (ADMIN 아니면 403)
2. Query Parameter 파싱 및 검증
3. users 테이블에서 조건에 맞는 사용자 조회
   - search: email LIKE '%{search}%' OR nickname LIKE '%{search}%'
   - role: role = {role} (ALL이면 조건 없음)
   - membership: membership = {membership}
   - status: is_active = {status == 'ACTIVE'}
4. 정렬 및 페이지네이션 적용
5. 각 사용자의 포트폴리오 개수 카운트 (LEFT JOIN)
6. 응답 반환
```

## 관련 스펙
- DB: `../db/users.md`
- API: `users-detail.md`
