---
type: api
phase: P3
category: bm
method: GET
endpoint: /api/bm/products
auth: optional
related:
    db:
        - specs/db/bm/token-packages.md
        - specs/db/bm/membership-products.md
---

# GET /api/bm/products

## 개요

판매 중인 토큰 패키지와 멤버십 상품 목록 조회

## 스펙

### Response

#### 성공 (200 OK)

```json
{
    "tokens": [
        { "id": 1, "name": "소량", "tokenCount": 10, "price": 1900, "isBest": false },
        { "id": 3, "name": "인기", "tokenCount": 60, "price": 8900, "isBest": true }
    ],
    "memberships": [
        { "id": 1, "tier": "BASIC", "name": "Basic", "price": 4900, "benefits": ["월 10토큰", "백테스팅 3회"] },
        {
            "id": 2,
            "tier": "PRO",
            "name": "Pro",
            "price": 9900,
            "benefits": ["월 30토큰", "광고 제거", "백테스팅 15회"]
        }
    ]
}
```
