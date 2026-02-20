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

# [NEW] api-community-comment-delete

## 1. 원본 출처

- `_inbox/[VALIDATE] all-2026-02-20.md` (커뮤니티 CRUD 누락 보완)

## 2. 작업 요약

- **[NEW]** `comment-delete`: 댓글 삭제 API (Soft Delete)

## 3. AI 분석 결과

- `comments.md` DB 스펙에 `is_delete`, `delete_at` 존재 → Soft Delete
- 본인 댓글만 삭제 가능
- 대댓글이 있는 댓글은 "삭제된 댓글입니다" 표시 처리

## 4. 변경 명세

### API: DELETE /api/community/comments/{commentId}

**Request**

- Path: `commentId` (int, 필수)
- Auth: Bearer Token 필수 (본인인증 필수)

**Response (200)**

```json
{
    "id": 1,
    "deleted": true
}
```

**에러**
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 본인 아님 | "본인의 댓글만 삭제할 수 있습니다" |
| 403 | 본인인증 미완료 | "본인인증이 필요합니다" |
| 404 | 댓글 없음 | "댓글을 찾을 수 없습니다" |

**구현 로직**

```
1. JWT에서 user_id 추출
2. is_verified 확인 (false → 403)
3. commentId로 댓글 조회 (is_delete=FALSE)
4. 작성자 확인 (user_id != comment.user_id → 403)
5. Soft Delete: is_delete=TRUE, delete_at=NOW()
6. 게시글의 comment_count 감소 (-1)
7. 응답 반환
```

## 🔍 확인 필요 사항

### 대댓글이 있는 댓글 삭제 시

- [x] **Soft Delete + UI 표시**: 삭제 후 "삭제된 댓글입니다" 표시, 대댓글은 유지 (현재 권장)
- [ ] **Cascade Delete**: 대댓글도 함께 삭제
