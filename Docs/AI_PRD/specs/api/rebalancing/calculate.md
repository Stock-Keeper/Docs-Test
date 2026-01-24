---
type: api
phase: P1
category: rebalancing
method: GET
endpoint: /api/portfolios/{portfolioId}/rebalancing
auth: required
related:
  db:
    - specs/db/portfolio/portfolios.md
  ui:
    - specs/ui/rebalancing/check.md
  api:
    - specs/api/notification/list.md
---

# GET /api/portfolios/{portfolioId}/rebalancing

## 개요

리밸런싱 제안 계산 (목표 비율 대비 현재 비율 분석)

## 스펙

### Request

- **URL**: `/api/portfolios/{portfolioId}/rebalancing`
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

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| threshold | int | N | 임계값 (3, 5, 10) | 5 |

## Response

### 성공 (200)

```json
{
  "totalValue": 10000000,
  "needsRebalancing": true,
  "threshold": 5,
  "summary": {
    "totalSellAmount": 200000,
    "totalBuyAmount": 200000,
    "netAmount": 0,
    "netLabel": "균형 상태"
  },
  "suggestions": [
    {
      "stockCode": "035720",
      "stockName": "카카오",
      "currentRatio": 16.67,
      "targetRatio": 30.0,
      "diff": -13.33,
      "action": "BUY",
      "quantity": 4,
      "estimatedAmount": 200000
    },
    {
      "stockCode": "035420",
      "stockName": "NAVER",
      "currentRatio": 26.67,
      "targetRatio": 20.0,
      "diff": 6.67,
      "action": "SELL",
      "quantity": 1,
      "estimatedAmount": 200000
    }
  ],
  "balanced": [
    {
      "stockCode": "005930",
      "stockName": "삼성전자",
      "currentRatio": 46.67,
      "targetRatio": 50.0,
      "diff": -3.33
    }
  ]
}
```

### summary 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| totalSellAmount | number | 매도 총액 |
| totalBuyAmount | number | 매수 총액 |
| netAmount | number | 순수 필요 자금 (Buy - Sell, 양수=입금 필요, 음수=현금 확보) |
| netLabel | string | 동적 라벨 ("추가 필요 자금" / "예상 현금 확보" / "균형 상태") |

### 에러

| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 평가금액 0원 | "리밸런싱을 계산할 수 없습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "접근 권한이 없습니다" |
| 404 | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직 (알고리즘)

```
1. JWT 토큰에서 user_id 추출
2. portfolioId 유효성 및 소유권 검증
3. 종목 목록 및 현재가 조회
4. 각 종목에 대해:
   a. 평가금액 = quantity × currentPrice
   b. 현재 비율 = (평가금액 / 총평가) × 100
   c. 괴리율 = 현재 비율 - 목표 비율
5. 임계값 초과 종목 필터링 (|diff| > threshold)
6. 매수/매도 제안 계산:
   a. 목표 금액 = 총평가 × 목표비율 / 100
   b. 차이 금액 = 목표 금액 - 현재 평가금액
   c. 수량 = ROUND(차이 금액 / 현재가)
   d. action = 차이 > 0 ? BUY : SELL
7. summary 계산:
   a. totalSellAmount = SUM(SELL 종목들의 estimatedAmount)
   b. totalBuyAmount = SUM(BUY 종목들의 estimatedAmount)
   c. netAmount = totalBuyAmount - totalSellAmount
   d. netLabel = netAmount > 0 ? "추가 필요 자금" : netAmount < 0 ? "예상 현금 확보" : "균형 상태"
8. 괴리율 절댓값 기준 내림차순 정렬
9. 응답 반환
```

## 관련 스펙

- DB: `specs/db/portfolio/portfolios.md`
- UI: `specs/ui/rebalancing/check.md`
- API: `specs/api/notification/list.md`
