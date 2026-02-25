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
    ui:
        - specs/ui/bm/shop.md
---

# GET /api/bm/products

## 개요

판매 중인 토큰 패키지와 멤버십 상품 목록 조회

## 스펙

### Request

- **URL**: `/api/bm/products`
- **Method**: `GET`
- **Auth**: Bearer Token (선택)

## Response

### 성공 (200)

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

## 구현 로직

```
1. token_packages에서 is_active=TRUE 조회
2. membership_products에서 is_active=TRUE 조회
3. 토큰/멤버십 각각 리스트로 응답
```

## 관련 스펙

- DB: `../../db/bm/token-packages.md`
- DB: `../../db/bm/membership-products.md`
- UI: `../../ui/bm/shop.md`
