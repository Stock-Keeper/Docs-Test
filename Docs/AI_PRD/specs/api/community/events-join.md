---
type: api
phase: P3
category: community
method: POST
endpoint: /api/community/events/{eventId}/join
auth: required
related:
  db:
    - specs/db/community/events.md
    - specs/db/community/event-participants.md
  ui:
    - specs/ui/community/events-detail.md
---

# POST /api/community/events/{eventId}/join

## 개요

특정 이벤트(대회)에 유저가 참여(신청)합니다.

## 스펙

### Request

- **URL**: `/api/community/events/{eventId}/join`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| eventId | int | Y | 참여할 이벤트 ID |

### Body
(수익률 대회처럼 포트폴리오를 필수로 제출해야 하는 이벤트 타입일 경우)

```json
{
  "portfolioId": "uuid" 
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| portfolioId | string | N | 이벤트 종류에 따라 제출할 포트폴리오 식별자 | 

## Response

### 성공 (201)

```json
{
  "success": true,
  "joinedAt": "2026-03-05T12:00:00Z",
  "message": "제1회 스마일 대회에 성공적으로 참가하셨습니다."
}
```

### 에러

| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 404 | 이벤트 없음 | "이벤트를 찾을 수 없습니다" |
| 400 | 상태 오류 | "현재 모집 중이거나 진행 중인 이벤트가 아닙니다" |
| 403 | 이미 참여함 | "이미 참여 완료된 이벤트입니다" |
| 400 | 정원 초과 | "해당 이벤트의 선착순 참여가 마감되었습니다" |
| 400 | 누락 (조건) | "수익률 대회 참여를 위해 포트폴리오 ID가 필요합니다" |

## 구현 로직

```
1. events 테이블에서 eventId 조회 -> 없으면 404. status 가 UPCOMING/ONGOING 이 아니면 400.
2. maxParticipants 가 존재하는 이벤트면 count 조회 후 정원 초과 방지 락/체크 -> 초과시 400.
3. event_participants 에서 본인참여이력 체크 (UK 기반) -> 있으면 403.
4. event_type이 PORTFOLIO_CONTEST인데 body에 portfolioId가 없으면 400 처리. (포트폴리오 소유권도 검증)
5. event_participants 에 INSERT 쿼리 실행.
6. 응답.
```
