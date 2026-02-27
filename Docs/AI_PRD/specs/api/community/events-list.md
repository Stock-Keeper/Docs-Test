---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/events
auth: optional
related:
  db:
    - specs/db/community/events.md
  ui:
    - specs/ui/community/events-list.md
---

# GET /api/community/events

## 개요

커뮤니티 이벤트/대회 목록 조회

## 스펙

### Request

- **URL**: `/api/community/events`
- **Method**: `GET`
- **Auth**: 불필요 (선택)

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| status | enum | N | 이벤트 상태 필터 (UPCOMING, ONGOING, ENDED) | - |
| page | int | N | 페이지 번호 | 1 |
| limit | int | N | 페이지당 건수 | 20 |

## Response

### 성공 (200)

```json
{
  "data": [
    {
      "id": 1,
      "title": "제1회 스마일 수익률 대회",
      "eventType": "PORTFOLIO_CONTEST",
      "status": "ONGOING",
      "bannerImageUrl": "https://...",
      "startAt": "2026-03-01T00:00:00Z",
      "endAt": "2026-03-31T23:59:59Z",
      "joinCount": 1500,
      "maxParticipants": 5000
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 25,
    "limit": 20
  }
}
```

## 에러

| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 잘못된 파라미터 | "유효하지 않은 요청 파라미터입니다" |

## 구현 로직

```
1. query param 파싱 및 이벤트 상태 필터 조건 생성.
2. events 테이블에서 start_at 기준 내림차순 등으로 목록 조회.
3. 각 이벤트별로 event_participants 를 count하여 현재 joinCount를 연산.
4. 페이지네이션 객체와 함께 응답 목록 반환.
```
