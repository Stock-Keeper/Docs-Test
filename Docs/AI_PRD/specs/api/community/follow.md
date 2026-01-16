---
type: api
phase: P3
category: community
method: POST
endpoint: /api/community/follows
auth: verified
related:
  db:
    - ../../db/follows.md
  api:
    - profile.md
---

# POST /api/community/follows

## 개요
팔로우 등록/취소 (P3)

## 스펙

### Request
- **URL**: `/api/community/follows`
- **Method**: `POST`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Body
```json
{
  "targetUserId": "uuid"
}
```

## Response

### 성공 (200)
```json
{
  "targetUserId": "uuid",
  "isFollowing": true,
  "followerCount": 124
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 자기 자신 팔로우 | "자신을 팔로우할 수 없습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 본인인증 미완료 | "본인인증이 필요합니다" |
| 404 | 대상 사용자 없음 | "사용자를 찾을 수 없습니다" |

## 구현 로직 (토글 방식)

```
1. JWT 토큰에서 user_id 추출
2. users 테이블에서 is_verified 확인 (false면 403)
3. targetUserId가 본인이면 400 에러
4. users 테이블에서 targetUserId 존재 확인 (없으면 404)
5. follows 테이블에서 기존 팔로우 확인
   - SELECT * FROM follows 
     WHERE follower_id = ? AND following_id = ?
6. 기존 팔로우가 있으면:
   - DELETE (언팔로우)
   - isFollowing = false
7. 기존 팔로우가 없으면:
   - INSERT (팔로우)
   - isFollowing = true
   - 대상에게 팔로우 알림 발송
8. 새 follower_count 조회
9. 응답 반환
```

## 관련 스펙
- DB: `../db/follows.md`
- API: `profile.md`
