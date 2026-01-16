---
type: api
phase: P1
endpoint: /api/portfolios/{portfolioId}/snapshots/{snapshotId}
method: GET
related:
  db:
    - portfolio-snapshots.md
  ui: []
---

# 포트폴리오 스냅샷 상세 조회

## 개요
포트폴리오 스냅샷 상세 조회 API

## 요청

```
GET /api/portfolios/{portfolioId}/snapshots/{snapshotId}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | number | Y | 포트폴리오 ID |
| snapshotId | number | Y | 스냅샷 ID |

## 응답

```json
{
  "id": 1,
  "portfolioId": 123,
  "name": "2026년 1월 리밸런싱 전",
  "totalValue": 50000000,
  "stockValue": 45000000,
  "cashValue": 5000000,
  "items": [
    {
      "stockCode": "005930",
      "stockName": "삼성전자",
      "quantity": 100,
      "price": 70000,
      "value": 7000000,
      "targetRatio": 15.0,
      "currentRatio": 14.0
    }
  ],
  "createdAt": "2026-01-15T10:00:00Z"
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 본인 포트폴리오만 조회 가능 |
| 404 | 스냅샷을 찾을 수 없음 |
