---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/badges
auth: optional
related:
  db:
    - specs/db/community/badges.md
  ui:
    - specs/ui/community/badges.md
---

# GET /api/community/badges

## 개요
전체 배지 마스터 목록 및 특정 유저의 배지 획득 여부를 조회

## 스펙

### Request

- **URL 1 (전체)**: `/api/community/badges`
  - 전체 배지 목록 조회
- **URL 2 (유저)**: `/api/community/users/{userId}/badges`
  - 특정 유저가 획득한 배지 목록만 조회

- **Method**: `GET`
- **Auth**: 선택

## Response

### 성공 (200) - URL 1 전체 조회 시

```json
{
  "data": [
    {
      "badgeId": 1,
      "code": "FIRST_POST",
      "name": "첫 게시물",
      "description": "첫 게시물을 작성했습니다.",
      "iconUrl": "/badges/first_post.png",
      "hasEarned": true,             // 로그인한 상태면 내 획득여부 응답
      "earnedAt": "2026-02-10T..."   // 획득 시각
    },
    ...
  ]
}
```

## 구현 로직
1. badges 테이블 전체 조회.
2. userId 파라미터가 URL 패스에 있을 시 user_badges 테이블 조인 수행하여 획득한 것만 필터링.
3. 전체 배지 조회(`/badges`)이면서 JWT 인증 상태라면, 각 배지별로 user_badges 에 내 데이터가 있는지 매핑해 `hasEarned` 부여.
