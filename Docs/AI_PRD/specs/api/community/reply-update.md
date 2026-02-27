---
type: api
phase: P3
category: community
method: PUT
endpoint: /api/community/replies/{replyId}
auth: verified
related:
  db:
    - specs/db/community/comments.md
---

# PUT /api/community/replies/{replyId}

## 개요
작성한 대댓글 수정 (P3)

## 스펙

### Request

- **URL**: `/api/community/replies/{replyId}`
- **Method**: `PUT`
- **Auth**: Bearer Token 필수

### Body

```json
{
  "content": "수정된 대댓글 내용 (1~500자)"
}
```

## Response

### 성공 (200)

```json
{
  "id": "uuid",
  "commentId": "uuid",
  "content": "수정된 대댓글 내용 (1~500자)",
  "updatedAt": "2026-03-01T10:00:00Z"
}
```

### 에러
- 400: 내용 누락 또는 길이 초과
- 403: 본인 작성글 아님
- 404: 대댓글 없음

## 구현 로직
1. JWT에서 user_id 추출.
2. replies 테이블에서 replyId 조회 (존재 여부 404, 작성자 일치 여부 403)
3. content 검증 후 UPDATE 쿼리 실행.
