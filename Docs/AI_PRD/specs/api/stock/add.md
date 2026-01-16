---
type: api
phase: P1
category: stock
method: POST
endpoint: /api/portfolios/{portfolioId}/items
auth: required
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/stock/add.md
---

# POST /api/portfolios/{portfolioId}/items

## 개요
포트폴리오에 종목 추가 (최대 50종목)

## 스펙

### Request
- **URL**: `/api/portfolios/{portfolioId}/items`
- **Method**: `POST`
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
  "stockCode": "005930",
  "stockName": "삼성전자",
  "quantity": 10,
  "targetRatio": 30.0
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| stockCode | string | Y | 종목 코드 |
| stockName | string | Y | 종목명 |
| quantity | int | Y | 보유 수량 (1 이상 정수) |
| targetRatio | decimal | Y | 목표 비율 (0~100%) |

## Response

### 성공 (201)
```json
{
  "id": "uuid",
  "stockCode": "005930",
  "stockName": "삼성전자",
  "quantity": 10,
  "targetRatio": 30.0,
  "displayOrder": 1,
  "createdAt": "2026-01-15T12:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 수량 0 이하 | "보유 수량은 1주 이상이어야 합니다" |
| 400 | 비율 범위 초과 | "목표 비율은 0~100% 사이여야 합니다" |
| 400 | 비율 합계 초과 | "목표 비율 합계가 100%를 초과합니다" |
| 400 | 50종목 초과 | "최대 50개 종목까지 추가할 수 있습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "접근 권한이 없습니다" |
| 409 | 중복 종목 | "이미 추가된 종목입니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolioId 유효성 및 소유권 검증
3. Request Body 검증
   - quantity: 1 이상 정수
   - targetRatio: 0~100
4. 중복 종목 확인 (동일 stockCode)
   - 있으면 409
5. 현재 종목 수 확인 (50개 제한)
6. 기존 목표 비율 합계 + 새 비율 ≤ 100% 검증
7. portfolio_items 테이블에 INSERT
8. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
- UI: `../ui/stock/add.md`
