---
type: api
phase: P1
category: rebalancing
method: POST
endpoint: /api/portfolios/{portfolioId}/rebalancing/snapshot
auth: required
related:
    db:
        - specs/db/portfolio/portfolios.md
        - specs/db/portfolio/portfolio-snapshots.md
    ui:
        - specs/ui/rebalancing/check.md
    api:
        - specs/api/rebalancing/calculate.md
---

# POST /api/portfolios/{portfolioId}/rebalancing/snapshot

## 개요

리밸런싱 제안 확인 후 현재 상태를 스냅샷으로 저장. 리밸런싱 실행 기록으로 남김.

## 스펙

### Request

- **URL**: `/api/portfolios/{portfolioId}/rebalancing/snapshot`
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
    "note": "2026년 1분기 리밸런싱",
    "threshold": 5
}
```

| 필드      | 타입   | 필수 | 설명                   |
| --------- | ------ | ---- | ---------------------- |
| note      | string | N    | 리밸런싱 메모          |
| threshold | int    | N    | 사용한 임계값 (기본 5) |

## Response

### 성공 (201)

```json
{
    "snapshotId": 123,
    "snapshotType": "REBALANCE",
    "totalValue": 10000000,
    "profitLoss": 500000,
    "profitLossRate": 5.0,
    "note": "2026년 1분기 리밸런싱",
    "createdAt": "2026-02-27T15:00:00Z"
}
```

### 에러

| 코드 | 상황            | 메시지                          |
| ---- | --------------- | ------------------------------- |
| 401  | 인증 실패       | "로그인이 필요합니다"           |
| 403  | 권한 없음       | "접근 권한이 없습니다"          |
| 404  | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolioId 유효성 및 소유권 검증
3. 현재 portfolio_stock_entries, portfolio_cash_entries 수집
4. 현재가 기준 total_value, profit_loss, profit_loss_rate 계산
5. portfolio_snapshots INSERT
   - snapshot_type = 'REBALANCE'
   - stock_entries, cash_entries JSON 직렬화
   - exchange_rates 현재 환율 포함
   - note = body.note
6. 스냅샷 결과 반환
```

## 관련 스펙

- DB: `../../db/portfolio/portfolio-snapshots.md`
- DB: `../../db/portfolio/portfolios.md`
- API: `calculate.md`
- UI: `../../ui/rebalancing/check.md`
