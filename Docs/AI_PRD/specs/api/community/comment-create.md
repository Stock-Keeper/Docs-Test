---
type: api
phase: P2
category: community
method: POST
endpoint: /api/community/posts/{postId}/comments
auth: verified
related:
    db:
        - specs/db/community/comments.md
    api:
        - specs/api/community/comment-update.md
        - specs/api/community/comment-delete.md
---

# POST /api/community/posts/{postId}/comments

## 개요

댓글 작성

## 스펙

### Request

- **URL**: `/api/community/posts/{postId}/comments`
- **Method**: `POST`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명      |
| -------- | ---- | ---- | --------- |
| postId   | uuid | Y    | 게시글 ID |

### Body

```json
{
    "content": "string (1~500자)"
}
```

## Response

### 성공 (201)

```json
{
    "id": "uuid",
    "postId": "uuid",
    "content": "댓글 내용",
    "author": {
        "id": "uuid",
        "nickname": "댓글러",
        "profileCharacter": 2
    },
    "createdAt": "2026-01-13T10:30:00Z"
}
```

### 에러

| 코드 | 상황            | 메시지                             |
| ---- | --------------- | ---------------------------------- |
| 400  | 내용 누락       | "댓글 내용을 입력해주세요"         |
| 400  | 글자수 초과     | "댓글은 500자 이내로 입력해주세요" |
| 401  | 인증 실패       | "로그인이 필요합니다"              |
| 403  | 본인인증 미완료 | "본인인증이 필요합니다"            |
| 404  | 게시글 없음     | "게시글을 찾을 수 없습니다"        |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. users 테이블에서 is_verified 확인 (false면 403)
3. posts 테이블에서 postId 존재 확인 (없으면 404)
4. Request Body 검증 (content 필수, 길이)
5. comments 테이블에 INSERT
6. posts 테이블의 comment_count 증가 (+1)
7. 게시글 작성자에게 알림 발송 (본인 제외)
8. 응답 반환
```

## 관련 스펙

- DB: `../db/comments.md`
- API: `comment-update.md`
- API: `comment-delete.md`
