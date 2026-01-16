---
type: api
phase: P1
endpoint: /api/portfolios/{portfolioId}/snapshots
method: GET
related:
  db:
    - portfolio-snapshots.md
  ui: []
---

# 포트폴리오 스냅샷 목록 조회

## 개요
포트폴리오 스냅샷 목록 조회 API

## 요청

```
GET /api/portfolios/{portfolioId}/snapshots?page={page}&size={size}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | number | Y | 포트폴리오 ID |
| page | number | N | 페이지 번호 (기본: 0) |
| size | number | N | 페이지 크기 (기본: 20) |

## 응답

```json
{
  "content": [
    {
      "id": 1,
      "name": "2026년 1월 리밸런싱 전",
      "totalValue": 50000000,
      "stockValue": 45000000,
      "cashValue": 5000000,
      "stockCount": 10,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 5
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 본인 포트폴리오만 조회 가능 |
| 404 | 포트폴리오를 찾을 수 없음 |
