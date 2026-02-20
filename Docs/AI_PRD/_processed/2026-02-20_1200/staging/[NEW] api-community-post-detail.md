---
type: api
phase: P2
category: community
method: GET
endpoint: /api/community/posts/{postId}
auth: optional
related:
    db:
        - specs/db/community/posts.md
        - specs/db/community/comments.md
    api:
        - specs/api/community/post-create.md
        - specs/api/community/post-update.md
        - specs/api/community/feed-list.md
    ui:
        - specs/ui/community/post-detail.md
---

# [NEW] api-community-post-detail

## 1. 원본 출처

- `_inbox/[VALIDATE] all-2026-02-20.md` (커뮤니티 CRUD 누락 보완)

## 2. 작업 요약

- **[NEW]** `post-detail`: 게시글 상세 조회 API

## 3. AI 분석 결과

- `post-create.md` 존재 but `post-detail` 미존재 → CRUD 불완전
- `ui/community/post-detail.md`가 이미 이 API를 참조하고 있으나 스펙 미존재
- 게시글 상세는 작성자 정보, 이미지, 좋아요/댓글 수, 댓글 목록 포함

## 4. 기존 스펙 비교

- `feed-list.md`의 응답 구조를 기반으로 상세 필드 확장
- 댓글 목록은 별도 페이지네이션 (초기 로드 20건)

## 5. 변경 명세

### API: GET /api/community/posts/{postId}

**Request**

- Path: `postId` (int, 필수)
- Auth: Bearer Token (선택 - 좋아요 여부 확인용)

**Response (200)**

```json
{
    "id": 1,
    "title": "삼성전자 실적 분석",
    "content": "전체 내용...",
    "category": "국내주식",
    "author": {
        "id": 1,
        "nickname": "투자왕",
        "profileImageUrl": "https://...",
        "isFollowing": false
    },
    "images": ["https://s3.../img1.jpg"],
    "likeCount": 42,
    "commentCount": 5,
    "viewCount": 128,
    "isLiked": false,
    "isBookmarked": false,
    "isMine": false,
    "comments": [
        {
            "id": 1,
            "content": "좋은 분석입니다",
            "author": { "id": 2, "nickname": "댓글러" },
            "likeCount": 3,
            "isLiked": false,
            "replyCount": 1,
            "createdAt": "2026-01-13T11:00:00Z"
        }
    ],
    "createdAt": "2026-01-13T10:00:00Z",
    "updatedAt": null
}
```

**에러**
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 404 | 게시글 없음 | "게시글을 찾을 수 없습니다" |

**구현 로직**

```
1. (선택) JWT에서 user_id 추출
2. posts 테이블에서 postId로 조회 (is_delete=FALSE)
3. 작성자 정보 JOIN (community_profiles)
4. 이미지 목록 조회 (community_article_images)
5. 좋아요 수, 댓글 수 집계
6. 로그인 시: 좋아요/북마크/팔로우/본인 여부 확인
7. 조회수 증가 (view_count += 1)
8. 최상위 댓글 20건 조회 (최신순)
9. 응답 반환
```
