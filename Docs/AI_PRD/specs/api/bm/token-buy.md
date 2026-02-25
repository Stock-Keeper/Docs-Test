---
type: api
phase: P3
category: bm
method: POST
endpoint: /api/bm/tokens/buy
auth: verified
related:
    db:
        - specs/db/bm/token-packages.md
        - specs/db/bm/payment-histories.md
        - specs/db/bm/token-histories.md
        - specs/db/auth/users.md
    ui:
        - specs/ui/bm/shop.md
---

# POST /api/bm/tokens/buy

## 개요

토큰 패키지 구매 (PG 결제 승인 후 호출)

## 스펙

### Request

- **URL**: `/api/bm/tokens/buy`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
```

### Body

```json
{
    "packageId": 123,
    "imp_uid": "imp_1234567890",
    "merchant_uid": "ord_12345"
}
```

## Response

### 성공 (200)

```json
{
    "referenceId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 4900,
    "addedTokens": 30,
    "currentBalance": 150,
    "status": "PAID"
}
```

### 에러

| 코드 | 상황           | 메시지                          |
| ---- | -------------- | ------------------------------- |
| 404  | 패키지 없음    | "존재하지 않는 상품입니다"      |
| 400  | 결제 검증 실패 | "결제 금액이 일치하지 않습니다" |

## 구현 로직

```
1. token_packages에서 packageId 조회 (가격 확인)
2. PG사 결제 검증 (imp_uid 이용) -> 실제 금액과 패키지 가격 일치 확인
3. payment_histories에 기록 (PAID)
4. token_histories에 기록 (PURCHASE, +30)
5. users.token_balance 증가
6. 응답 반환
```

## 관련 스펙

- DB: `../../db/bm/token-packages.md`
- DB: `../../db/bm/payment-histories.md`
- DB: `../../db/bm/token-histories.md`
- DB: `../../db/auth/users.md`
- UI: `../../ui/bm/shop.md`
