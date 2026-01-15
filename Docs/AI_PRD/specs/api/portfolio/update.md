---
type: api
phase: P1
category: portfolio
method: PUT
endpoint: /api/portfolios/{portfolioId}
auth: required
related:
  db:
    - ../../db/portfolios.md
---

# PUT /api/portfolios/{portfolioId}

## 개요
포트폴리오 수정

## 스펙

### Request
- **URL**: `/api/portfolios/{portfolioId}`
- **Method**: `PUT`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | uuid | Y | 포트폴리오 ID |

### Body
```json
{
  "name": "string (필수)",
  "description": "string (선택)",
  "cashKrw": 1000000,
  "cashUsd": 500.0
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | Y | 포트폴리오 이름 |
| description | string | N | 설명/메모 |
| cashKrw | number | N | 현금(원화) |
| cashUsd | number | N | 현금(달러) |

## Response

### 성공 (200)
```json
{
  "id": "uuid",
  "name": "수정된 이름",
  "description": "수정된 설명",
  "cashKrw": 1000000,
  "cashUsd": 500.0,
  "updatedAt": "2026-01-15T14:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 이름 검증 실패 | "포트폴리오 이름은 1~20자여야 합니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "접근 권한이 없습니다" |
| 404 | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolios 테이블에서 portfolioId 조회
   - 없으면 404
   - user_id 불일치면 403
3. Request Body 검증
4. portfolios 테이블 UPDATE
5. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
