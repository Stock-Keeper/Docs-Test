---
type: api
phase: P1
endpoint: /api/portfolios/{portfolioId}/snapshots
method: POST
related:
  db:
    - portfolio-snapshots.md
  ui: []
---

# 포트폴리오 스냅샷 생성

## 개요
포트폴리오 스냅샷 수동 생성 API

## 요청

```
POST /api/portfolios/{portfolioId}/snapshots
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | number | Y | 포트폴리오 ID |

### Request Body

```json
{
  "name": "2026년 1월 리밸런싱 전"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | N | 스냅샷 이름 (기본: 날짜+시간) |

## 응답

```json
{
  "id": 2,
  "name": "2026년 1월 리밸런싱 전",
  "totalValue": 50000000,
  "stockCount": 10,
  "createdAt": "2026-01-16T14:00:00Z"
}
```

## 비즈니스 로직
- 현재 포트폴리오 상태를 스냅샷으로 저장
- 종목별 수량, 가격, 비율 정보 포함

## 에러 코드

| 코드 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 본인 포트폴리오만 가능 |
| 404 | 포트폴리오를 찾을 수 없음 |
