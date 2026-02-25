---
type: api
phase: P3
category: portfolio
method: POST
endpoint: /api/portfolio/backtest
auth: verified
related:
    db:
        - specs/db/bm/token-histories.md
        - specs/db/auth/users.md
    ui:
        - specs/ui/portfolio/backtest.md
---

# POST /api/portfolio/backtest

## 개요

포트폴리오 백테스팅 실행 (프리미엄 기능). 토큰 5개 소모 또는 멤버십 한도 차감.

## 스펙

### Request

- **URL**: `/api/portfolio/backtest`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
```

### Body

```json
{
    "portfolioId": "uuid",
    "items": [
        { "stockCode": "005930", "ratio": 0.5 },
        { "stockCode": "035420", "ratio": 0.5 }
    ],
    "startDate": "2021-01-01",
    "endDate": "2025-12-31",
    "rebalancingInterval": "QUARTERLY"
}
```

> rebalancingInterval: `MONTHLY`, `QUARTERLY`, `YEARLY`, `NONE`

## Response

### 성공 (200)

```json
{
    "cagr": 12.5,
    "mdd": -15.2,
    "sharpeRatio": 0.8,
    "chartData": [
        { "date": "2021-01-31", "value": 1000000 },
        { "date": "2021-02-28", "value": 1020000 }
    ],
    "benchmarkComparison": {},
    "costType": "MEMBERSHIP",
    "remaining": 2
}
```

### 에러

| 코드 | 상황           | 메시지                                         |
| ---- | -------------- | ---------------------------------------------- |
| 402  | 잔액/한도 부족 | "토큰이 부족하거나 멤버십 한도를 초과했습니다" |
| 400  | 기간 오류      | "최대 10년까지만 가능합니다"                   |

## 구현 로직

```
1. 사용자 권한 확인 (멤버십 등급, 잔여 한도)
2. 한도 있으면 차감 (token_histories: USE, feature: BACKTEST)
3. 한도 없으면 토큰 잔액 확인 (5개)
4. 토큰 차감 (token_histories: USE, feature: BACKTEST)
5. 백테스팅 엔진 실행 (Python/External Service)
6. 결과 반환
```

## 관련 스펙

- DB: `../../db/bm/token-histories.md`
- DB: `../../db/auth/users.md`
- UI: `../../ui/portfolio/backtest.md`
