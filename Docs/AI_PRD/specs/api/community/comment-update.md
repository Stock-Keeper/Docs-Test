---
type: api
phase: P2
category: community
method: PUT
endpoint: /api/community/comments/{commentId}
auth: verified
related:
    db:
        - specs/db/community/comments.md
    api:
        - specs/api/community/comment-create.md
        - specs/api/community/comment-delete.md
---

# PUT /api/community/comments/{commentId}

## 개요

댓글 수정

## 스펙

### Request

- **URL**: `/api/community/comments/{commentId}`
- **Method**: `PUT`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Path Parameters

| 파라미터  | 타입 | 필수 | 설명    |
| --------- | ---- | ---- | ------- |
| commentId | int  | Y    | 댓글 ID |

### Body

```json
{
    "content": "수정된 댓글 내용 (1~500자)"
}
```

## Response

### 성공 (200)

```json
{
    "id": 1,
    "content": "수정된 댓글 내용",
    "updatedAt": "2026-01-13T11:30:00Z"
}
```

### 에러

| 코드 | 상황            | 메시지                             |
| ---- | --------------- | ---------------------------------- |
| 400  | 내용 누락       | "댓글 내용을 입력해주세요"         |
| 400  | 글자수 초과     | "댓글은 500자 이내로 입력해주세요" |
| 401  | 인증 실패       | "로그인이 필요합니다"              |
| 403  | 본인 아님       | "본인의 댓글만 수정할 수 있습니다" |
| 403  | 본인인증 미완료 | "본인인증이 필요합니다"            |
| 404  | 댓글 없음       | "댓글을 찾을 수 없습니다"          |

## 구현 로직

```
1. JWT에서 user_id 추출
2. is_verified 확인 (false → 403)
3. commentId로 댓글 조회 (is_delete=FALSE)
4. 작성자 확인 (user_id != comment.user_id → 403)
5. content 검증
6. UPDATE content, updated_at
7. 응답 반환
```

## 관련 스펙

- DB: `../../db/community/comments.md`
- API: `comment-create.md`
- API: `comment-delete.md`
