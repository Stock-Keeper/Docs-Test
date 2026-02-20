---
type: api
phase: P2
category: community
method: DELETE
endpoint: /api/community/comments/{commentId}
auth: verified
related:
    db:
        - specs/db/community/comments.md
    api:
        - specs/api/community/comment-create.md
        - specs/api/community/comment-update.md
---

# DELETE /api/community/comments/{commentId}

## 개요

댓글 삭제 (Soft Delete)

## 스펙

### Request

- **URL**: `/api/community/comments/{commentId}`
- **Method**: `DELETE`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Headers

```
Authorization: Bearer {access_token}
```

### Path Parameters

| 파라미터  | 타입 | 필수 | 설명    |
| --------- | ---- | ---- | ------- |
| commentId | int  | Y    | 댓글 ID |

## Response

### 성공 (200)

```json
{
    "id": 1,
    "deleted": true
}
```

### 에러

| 코드 | 상황            | 메시지                             |
| ---- | --------------- | ---------------------------------- |
| 401  | 인증 실패       | "로그인이 필요합니다"              |
| 403  | 본인 아님       | "본인의 댓글만 삭제할 수 있습니다" |
| 403  | 본인인증 미완료 | "본인인증이 필요합니다"            |
| 404  | 댓글 없음       | "댓글을 찾을 수 없습니다"          |

## 구현 로직

```
1. JWT에서 user_id 추출
2. is_verified 확인 (false → 403)
3. commentId로 댓글 조회 (is_delete=FALSE)
4. 작성자 확인 (user_id != comment.user_id → 403)
5. Soft Delete: is_delete=TRUE, delete_at=NOW()
6. 게시글의 comment_count 감소 (-1)
7. 응답 반환
```

> **비즈니스 규칙**: 대댓글이 있는 댓글 삭제 시 Soft Delete 처리하고 UI에서 "삭제된 댓글입니다" 표시. 대댓글은 유지.

## 관련 스펙

- DB: `../../db/community/comments.md`
- API: `comment-create.md`
- API: `comment-update.md`
