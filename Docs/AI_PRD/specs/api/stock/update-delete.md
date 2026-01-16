---
type: api
phase: P1
category: stock
method: PUT/DELETE
endpoint: /api/portfolios/{portfolioId}/items/{itemId}
auth: required
related:
  db:
    - ../../db/portfolios.md
---

# PUT/DELETE /api/portfolios/{portfolioId}/items/{itemId}

## 개요
종목 수정 및 삭제

---

## 수정 (PUT)

### Request
- **URL**: `/api/portfolios/{portfolioId}/items/{itemId}`
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
| itemId | uuid | Y | 종목 아이템 ID |

### Body
```json
{
  "quantity": 15,
  "targetRatio": 35.0
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| quantity | int | N | 보유 수량 |
| targetRatio | decimal | N | 목표 비율 |

### Response (200)
```json
{
  "id": "uuid",
  "stockCode": "005930",
  "stockName": "삼성전자",
  "quantity": 15,
  "targetRatio": 35.0,
  "updatedAt": "2026-01-15T14:00:00Z"
}
```

---

## 삭제 (DELETE)

### Request
- **URL**: `/api/portfolios/{portfolioId}/items/{itemId}`
- **Method**: `DELETE`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Response (200)
```json
{
  "message": "삭제되었습니다"
}
```

---

## 에러 (공통)
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 수량 검증 실패 | "보유 수량은 1주 이상이어야 합니다" |
| 400 | 비율 합계 초과 | "목표 비율 합계가 100%를 초과합니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "접근 권한이 없습니다" |
| 404 | 종목 없음 | "종목을 찾을 수 없습니다" |

## 구현 로직

### 수정
```
1. JWT 토큰에서 user_id 추출
2. portfolioId, itemId 유효성 및 소유권 검증
3. Request Body 검증
4. 비율 합계 재계산 (기존 비율 제외 후 새 비율 추가)
5. portfolio_items 테이블 UPDATE
6. 응답 반환
```

### 삭제
```
1. JWT 토큰에서 user_id 추출
2. portfolioId, itemId 유효성 및 소유권 검증
3. portfolio_items 테이블에서 DELETE
4. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
