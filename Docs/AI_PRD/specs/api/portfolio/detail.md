---
type: api
phase: P1
category: portfolio
method: GET
endpoint: /api/portfolios/{portfolioId}
auth: required
related:
  db:
    - specs/db/portfolio/portfolios.md
    - specs/db/portfolio/portfolio-stock-entries.md
    - specs/db/portfolio/portfolio-cash-entries.md
  ui:
    - specs/ui/portfolio/detail.md
---

# GET /api/portfolios/{portfolioId}

## 개요

포트폴리오 상세 조회 (종목 목록 포함)

## 스펙

### Request

- **URL**: `/api/portfolios/{portfolioId}`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | uuid | Y | 포트폴리오 ID |

## Response

### 성공 (200)

```json
{
  "id": "uuid",
  "name": "내 포트폴리오",
  "description": "메인 포트폴리오",
  "isDefault": true,
  "displayOrder": 1,
  "cashKrw": 1000000,
  "cashUsd": 500.0,
  "totalValue": 10000000,
  "totalBuyAmount": 9000000,
  "totalProfit": 1000000,
  "totalProfitRate": 11.1,
  "stocks": [
    {
      "id": "uuid",
      "stockCode": "005930",
      "stockName": "삼성전자",
      "quantity": 10.0,
      "averagePrice": 70000,
      "currentPrice": 75000,
      "buyAmount": 700000,
      "value": 750000,
      "profit": 50000,
      "profitRate": 7.14,
      "currentRatio": 25.5,
      "targetRatio": 30.0,
      "change": 2.5,
      "changePercent": 1.2
    }
  ],
  "needsRebalancing": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-15T12:00:00Z"
}
```

### 에러

| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 다른 사용자 포트폴리오 | "접근 권한이 없습니다" |
| 404 | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolios 테이블에서 portfolioId 조회
   - 없으면 404
   - user_id 불일치면 403
3. portfolio_items 조회
4. 각 종목에 대해:
   - 외부 API로 현재가 조회 (캐시 활용)
   - 평가금액 계산 (quantity × currentPrice)
   - 매입금액 계산 (quantity × averagePrice)
   - 종목별 수익금/수익률 계산
   - 현재 비율 계산
5. 총 평가금액 = 종목 합계 + 현금
6. 총 매입금액 = 종목 매입금 합계 + 현금 (전체 자산 기준)
7. 총 수익금 = 총 평가금액 - 총 매입금액
8. 총 수익률 = (총 수익금 / 총 매입금액) × 100
9. 리밸런싱 필요 여부 확인 (임계값 초과 종목 있는지)
10. 응답 반환
```

## 관련 스펙

- DB: `specs/db/portfolio/portfolios.md`
- DB: `specs/db/portfolio/portfolio-stock-entries.md`
- DB: `specs/db/portfolio/portfolio-cash-entries.md`
- UI: `specs/ui/portfolio/detail.md`
