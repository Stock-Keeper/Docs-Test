---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/events/{eventId}/leaderboard
auth: optional
related:
  db:
    - specs/db/community/events.md
    - specs/db/community/event-participants.md
  ui:
    - specs/ui/community/events-detail.md
---

# GET /api/community/events/{eventId}/leaderboard

## 개요

진행 중이거나 종료된 대회의 실시간 랭킹 순위(리더보드) 조회.

## 스펙

### Request

- **URL**: `/api/community/events/{eventId}/leaderboard`
- **Method**: `GET`
- **Auth**: 불필요 (선택 - 내 랭킹을 하이라이팅하기 위함)

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| page | int | N | 랭킹 페이지 | 1 |
| limit | int | N | 조회 건수 | 50 |

## Response

### 성공 (200)

```json
{
  "myRank": {
    "rank": 420,
    "user": { "id": 1, "nickname": "투자왕" },
    "score": 15.2,
    "portfolioId": "uuid"
  },
  "leaderboard": [
    {
      "rank": 1,
      "user": { "id": 5, "nickname": "워렌버핏동생" },
      "score": 45.3,
      "portfolioId": "uuid"
    },
    {
      "rank": 2,
      "user": { "id": 12, "nickname": "단타의신" },
      "score": 38.1,
      "portfolioId": "uuid"
    }
  ],
  "pagination": { ... }
}
```

## 구현 로직

```
1. events 에서 eventId 조회 (404 처리)
2. event_participants 테이블에서 해당 eventId 의 데이터를 가져오되 `score` 내림차순(DESC) 정렬.
3. page, limit 적용하여 리더보드 List 추출.
4. (선택) JWT 토큰으로 userId가 넘어온 경우, 해당 유저의 event_participants 로우를 별도 단건 조회하여 `myRank` 객체로 반환. (랭킹은 전체 COUNT(*) WHERE score > 내점수 + 1 방식 등으로 도출)
5. 응답 JSON 구성하여 반환.
```
