---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/users/{id}
auth: admin
related:
  api:
    - users-list.md
    - users-role.md
    - users-status.md
---

# GET /api/admin/users/{id}

## 개요
관리자 - 사용자 상세 조회

## 스펙

### Request
- **URL**: `/api/admin/users/{id}`
- **Method**: `GET`
- **Auth**: Bearer Token (ADMIN role 필수)

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | uuid | Y | 사용자 ID |

## Response

### 성공 (200)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nickname": "사용자1",
  "profilePicture": "https://...",
  "role": "USER",
  "membership": "NOT",
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "lastLoginAt": "2026-01-13T10:00:00Z",
  "loginCount": 42,
  "stats": {
    "portfolioCount": 3,
    "totalStockCount": 15,
    "connectedAccountCount": 1
  },
  "portfolios": [
    {
      "id": "uuid",
      "name": "내 포트폴리오",
      "stockCount": 5,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "관리자 권한이 필요합니다" |
| 404 | 사용자 없음 | "사용자를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 role 확인 (ADMIN 아니면 403)
2. users 테이블에서 id로 사용자 조회
3. 사용자 없으면 404
4. 통계 정보 조회:
   - portfolioCount: portfolios 테이블 COUNT
   - totalStockCount: portfolio_items 테이블 COUNT
   - connectedAccountCount: connected_accounts 테이블 COUNT
5. 포트폴리오 목록 조회 (이름, 종목수, 생성일만 - 개인정보 보호)
6. 응답 반환
```

## 관련 스펙
- API: `users-list.md`
- API: `users-role.md`
- API: `users-status.md`
