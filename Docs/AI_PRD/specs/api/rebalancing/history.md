---
type: api
phase: P1
category: rebalancing
method: GET
endpoint: /api/portfolios/{portfolioId}/rebalancing/history
auth: required
related:
    db:
        - specs/db/portfolio/portfolio-snapshots.md
        - specs/db/portfolio/portfolios.md
    ui:
        - specs/ui/rebalancing/check.md
---

# GET /api/portfolios/{portfolioId}/rebalancing/history

## 개요

포트폴리오의 리밸런싱 스냅샷 이력 조회. `snapshot_type = 'REBALANCE'` 필터.

## 스펙

### Request

- **URL**: `/api/portfolios/{portfolioId}/rebalancing/history`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Path Parameters

| 파라미터    | 타입 | 필수 | 설명          |
| ----------- | ---- | ---- | ------------- |
| portfolioId | int  | Y    | 포트폴리오 ID |

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명          | 기본값 |
| -------- | ---- | ---- | ------------- | ------ |
| page     | int  | N    | 페이지 번호   | 1      |
| limit    | int  | N    | 페이지당 건수 | 20     |

## Response

### 성공 (200)

```json
{
    "history": [
        {
            "id": 123,
            "snapshotType": "REBALANCE",
            "totalValue": 10000000,
            "totalInvested": 9500000,
            "profitLoss": 500000,
            "profitLossRate": 5.26,
            "cashRatio": 10.0,
            "note": "2026년 1분기 리밸런싱",
            "createdAt": "2026-02-27T15:00:00Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 3,
        "totalItems": 12
    }
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
2. portfolioId 소유권 검증
3. portfolio_snapshots 조회
   WHERE portfolio_id = ? AND snapshot_type = 'REBALANCE'
   ORDER BY created_at DESC
   LIMIT {limit} OFFSET {(page-1)*limit}
4. 페이지네이션 메타 계산
5. 응답 반환
```

## 관련 스펙

- DB: `../../db/portfolio/portfolio-snapshots.md`
- API: `calculate.md`, `snapshot.md`
