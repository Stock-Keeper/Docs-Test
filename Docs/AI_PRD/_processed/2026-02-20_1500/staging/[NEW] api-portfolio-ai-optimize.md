---
type: api
phase: P3
category: portfolio
method: POST
endpoint: /api/portfolio/{portfolioId}/optimize
auth: verified
related:
    db:
        - specs/db/bm/token-histories.md
        - specs/db/auth/users.md
---

# POST /api/portfolio/{portfolioId}/optimize

## 개요

AI 비중 추천 (프리미엄 기능).
토큰 5개 소모 또는 멤버십 한도 차감.

## 스펙

### Request

- **URL**: `/api/portfolio/{portfolioId}/optimize`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Body

```json
{
    "mode": "BALANCED" // MAX_PROFIT, BALANCED, MIN_RISK
}
```

### Response

#### 성공 (200 OK)

```json
{
    "original": [{ "stockCode": "005930", "ratio": 0.4 }],
    "optimized": [{ "stockCode": "005930", "ratio": 0.35 }],
    "improvement": {
        "expectedReturn": "+2.5%",
        "riskReduction": "-5.0%"
    },
    "costType": "TOKEN",
    "remaining": 145
}
```

## 구현 로직

1. 권한/토큰 확인 및 차감 (5개)
2. AI 엔진 호출 (MPT 기반 최적화)
3. 결과 반환
