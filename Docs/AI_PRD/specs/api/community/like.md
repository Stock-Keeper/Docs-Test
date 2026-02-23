---
type: api
phase: P2
category: community
method: POST
endpoint: /api/community/likes
auth: verified
related:
    db:
        - specs/db/community/post-likes.md
---

# POST /api/community/likes

## 개요

좋아요 등록/취소 (포트폴리오, 게시글)

## 스펙

### Request

- **URL**: `/api/community/likes`
- **Method**: `POST`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Body

```json
{
    "targetType": "POST | PORTFOLIO",
    "targetId": "uuid"
}
```

| 필드       | 타입 | 필수 | 설명                |
| ---------- | ---- | ---- | ------------------- |
| targetType | enum | Y    | POST 또는 PORTFOLIO |
| targetId   | uuid | Y    | 대상 ID             |

## Response

### 성공 (200)

```json
{
    "targetType": "POST",
    "targetId": "uuid",
    "isLiked": true,
    "likeCount": 43
}
```

## 구현 로직 (토글 방식)

```
1. JWT 토큰에서 user_id 추출
2. users 테이블에서 is_verified 확인 (false면 403)
3. likes 테이블에서 기존 좋아요 확인
   - SELECT * FROM {target_type}_likes
     WHERE user_id = ? AND {target_type}_id = ?
4. 기존 좋아요가 있으면:
   - DELETE (좋아요 취소)
   - 대상의 like_count -= 1
   - isLiked = false
5. 기존 좋아요가 없으면:
   - INSERT (좋아요 등록)
   - 대상의 like_count += 1
   - isLiked = true
6. 새 like_count 조회
7. 응답 반환
```

### 에러

| 코드 | 상황            | 메시지                     |
| ---- | --------------- | -------------------------- |
| 400  | targetType 누락 | "대상 유형을 지정해주세요" |
| 401  | 인증 실패       | "로그인이 필요합니다"      |
| 403  | 본인인증 미완료 | "본인인증이 필요합니다"    |
| 404  | 대상 없음       | "대상을 찾을 수 없습니다"  |

## 관련 스펙

- DB: `../db/post-likes.md`
- DB: `../db/portfolio-likes.md`
