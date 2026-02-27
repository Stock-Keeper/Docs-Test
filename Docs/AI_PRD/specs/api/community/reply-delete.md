---
type: api
phase: P3
category: community
method: DELETE
endpoint: /api/community/replies/{replyId}
auth: verified
related:
  db:
    - specs/db/community/comments.md
---

# DELETE /api/community/replies/{replyId}

## 개요
작성한 대댓글 삭제 (P3)

## 스펙

### Request

- **URL**: `/api/community/replies/{replyId}`
- **Method**: `DELETE`
- **Auth**: Bearer Token 필수

### Response

### 성공 (200)

```json
{
  "success": true,
  "message": "대댓글이 삭제되었습니다."
}
```

### 에러
- 403: 본인 작성글 아님
- 404: 대댓글 없음

## 구현 로직
1. JWT에서 user_id 추출.
2. replies 테이블에서 replyId 찾아서 본인인지 확인.
3. 삭제 처리 (물리 혹은 논리 삭제 is_deleted = true 적용).
4. 응답 반환.
