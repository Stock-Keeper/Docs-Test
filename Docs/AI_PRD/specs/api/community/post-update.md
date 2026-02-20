---
type: api
phase: P2
category: community
method: PUT
endpoint: /api/community/posts/{postId}
auth: verified
related:
    db:
        - specs/db/community/posts.md
    api:
        - specs/api/community/post-create.md
        - specs/api/community/post-detail.md
---

# PUT /api/community/posts/{postId}

## 개요

게시글 수정

## 스펙

### Request

- **URL**: `/api/community/posts/{postId}`
- **Method**: `PUT`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Headers

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명      |
| -------- | ---- | ---- | --------- |
| postId   | int  | Y    | 게시글 ID |

### Body (FormData)

| 필드           | 타입   | 필수 | 설명                  |
| -------------- | ------ | ---- | --------------------- |
| title          | string | N    | 제목 (1~100자)        |
| content        | string | N    | 내용 (1~3000자)       |
| category       | enum   | N    | 카테고리              |
| images         | file[] | N    | 새 이미지 (최대 5장)  |
| deleteImageIds | int[]  | N    | 삭제할 이미지 ID 목록 |

## Response

### 성공 (200)

```json
{
    "id": 1,
    "title": "수정된 제목",
    "content": "수정된 내용...",
    "category": "국내주식",
    "images": ["https://s3.../img1.jpg"],
    "updatedAt": "2026-01-13T12:00:00Z"
}
```

### 에러

| 코드 | 상황            | 메시지                               |
| ---- | --------------- | ------------------------------------ |
| 400  | 글자수 초과     | "내용은 3000자 이내로 입력해주세요"  |
| 401  | 인증 실패       | "로그인이 필요합니다"                |
| 403  | 본인 아님       | "본인의 게시글만 수정할 수 있습니다" |
| 403  | 본인인증 미완료 | "본인인증이 필요합니다"              |
| 404  | 게시글 없음     | "게시글을 찾을 수 없습니다"          |

## 구현 로직

```
1. JWT에서 user_id 추출
2. is_verified 확인 (false → 403)
3. postId로 게시글 조회 (is_delete=FALSE)
4. 작성자 확인 (user_id != post.user_id → 403)
5. 변경 필드만 UPDATE
6. deleteImageIds가 있으면 S3 삭제 + DB 삭제
7. 새 이미지가 있으면 S3 업로드 + DB 저장
8. updated_at 갱신
9. 응답 반환
```

## 관련 스펙

- DB: `../../db/community/posts.md`
- API: `post-create.md`
- API: `post-detail.md`
