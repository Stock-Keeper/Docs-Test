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
    ui:
        - specs/ui/portfolio/detail.md
---

# POST /api/portfolio/{portfolioId}/optimize

## 개요

AI 비중 추천 (프리미엄 기능). 토큰 5개 소모 또는 멤버십 한도 차감.

## 스펙

### Request

- **URL**: `/api/portfolio/{portfolioId}/optimize`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
```

### Path Parameters

| 파라미터    | 타입 | 필수 | 설명          |
| ----------- | ---- | ---- | ------------- |
| portfolioId | int  | Y    | 포트폴리오 ID |

### Body

```json
{
    "mode": "BALANCED"
}
```

> mode: `MAX_PROFIT`, `BALANCED`, `MIN_RISK`

## Response

### 성공 (200)

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

### 에러

| 코드 | 상황            | 메시지                                         |
| ---- | --------------- | ---------------------------------------------- |
| 402  | 잔액/한도 부족  | "토큰이 부족하거나 멤버십 한도를 초과했습니다" |
| 404  | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다"                |

## 구현 로직

```
1. 권한/토큰 확인 및 차감 (5개)
2. 포트폴리오 종목 목록 조회
3. AI 엔진 호출 (MPT 기반 최적화)
4. 결과 반환
```

## 관련 스펙

- DB: `../../db/bm/token-histories.md`
- DB: `../../db/auth/users.md`
- UI: `../../ui/portfolio/detail.md`
