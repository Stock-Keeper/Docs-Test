---
type: api
phase: P1
endpoint: /api/portfolios/{portfolioId}/snapshots/compare
method: GET
related:
  db:
    - portfolio-snapshots.md
  ui: []
---

# 포트폴리오 스냅샷 비교

## 개요
두 스냅샷 간 비교 또는 스냅샷과 현재 상태 비교 API

## 요청

```
GET /api/portfolios/{portfolioId}/snapshots/compare?from={snapshotId1}&to={snapshotId2}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | number | Y | 포트폴리오 ID |
| from | number | Y | 비교 기준 스냅샷 ID |
| to | string | Y | 비교 대상 스냅샷 ID 또는 "current" |

## 응답

```json
{
  "from": {
    "id": 1,
    "name": "1월 초",
    "totalValue": 50000000,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  "to": {
    "id": 2,
    "name": "현재",
    "totalValue": 55000000,
    "createdAt": "2026-01-16T14:00:00Z"
  },
  "diff": {
    "totalValueChange": 5000000,
    "totalValueChangePercent": 10.0,
    "items": [
      {
        "stockCode": "005930",
        "stockName": "삼성전자",
        "fromQuantity": 100,
        "toQuantity": 120,
        "quantityChange": 20,
        "fromRatio": 14.0,
        "toRatio": 15.3,
        "ratioChange": 1.3
      }
    ]
  }
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 본인 포트폴리오만 가능 |
| 404 | 스냅샷을 찾을 수 없음 |
