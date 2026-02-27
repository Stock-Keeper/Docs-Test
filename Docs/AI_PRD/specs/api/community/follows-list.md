---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/users/{userId}/followers
auth: optional
related:
  db:
    - specs/db/community/follows.md
    - specs/db/auth/users.md
  ui:
    - specs/ui/community/follows-list.md
---

# GET /api/community/users/{userId}/[followers|following]

## 개요
특정 사용자의 팔로워(나를 팔로우함) 혹은 팔로잉(내가 팔로우함) 목록 페이징 조회

## 스펙

### Request

- **URL 1**: `/api/community/users/{userId}/followers`
  - 해당 사용자를 팔로우하는 사람 목록 조회
- **URL 2**: `/api/community/users/{userId}/following`
  - 해당 사용자가 팔로우하는 사람 목록 조회
- **Method**: `GET`
- **Auth**: 선택

### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 |
|----------|------|------|--------|
| page | int | N | 1 |
| limit | int | N | 20 |

## Response

### 성공 (200)

```json
{
  "data": [
    {
      "id": "uuid",
      "nickname": "배당러버",
      "profileCharacter": 3,
      "isFollowing": true  // 요청자가 이 유저를 팔로우하고 있는지 여부
    }
  ],
  "pagination": { ... }
}
```

## 구현 로직
1. userId 검증(존재하는지).
2. follows 테이블을 조인하여 목록 쿼리. (followers는 target_id 기준, following은 follower_id 기준)
3. JWT 토큰이 있다면, 반환되는 유저 리스트 각 항목에 대해 내가 팔로우 중인지(`isFollowing`) 판별결과 추가 포함.
