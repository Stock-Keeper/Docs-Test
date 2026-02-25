---
type: api
phase: P3
category: bm
method: POST
endpoint: /api/bm/membership/subscribe
auth: verified
related:
    db:
        - specs/db/bm/membership-products.md
        - specs/db/bm/payment-histories.md
        - specs/db/auth/users.md
    ui:
        - specs/ui/bm/shop.md
---

# POST /api/bm/membership/subscribe

## 개요

멤버십 구독 (또는 업그레이드)

## 스펙

### Request

- **URL**: `/api/bm/membership/subscribe`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
```

### Body

```json
{
    "productId": 2,
    "imp_uid": "imp_9876543210",
    "merchant_uid": "sub_12345"
}
```

## Response

### 성공 (200)

```json
{
    "tier": "PRO",
    "expiresAt": "2026-03-21T10:00:00Z",
    "status": "PAID"
}
```

### 에러

| 코드 | 상황           | 메시지                          |
| ---- | -------------- | ------------------------------- |
| 400  | 결제 검증 실패 | "결제 금액이 일치하지 않습니다" |
| 404  | 상품 없음      | "존재하지 않는 상품입니다"      |

## 구현 로직

```
1. membership_products 조회
2. PG사 결제 검증
3. payment_histories 기록
4. users.membership_tier 업데이트
5. users.membership_expires_at 업데이트 (현재 + 30일)
6. 월간 토큰 지급: token_histories (MEMBERSHIP_GRANT) & users.token_balance 증가
```

## 관련 스펙

- DB: `../../db/bm/membership-products.md`
- DB: `../../db/bm/payment-histories.md`
- DB: `../../db/auth/users.md`
- UI: `../../ui/bm/shop.md`
