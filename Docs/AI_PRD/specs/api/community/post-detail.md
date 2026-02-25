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
        - specs/db/bm/token-histories.md
    api:
        - specs/api/community/post-create.md
        - specs/api/community/post-update.md
        - specs/api/community/feed-list.md
    ui:
        - specs/ui/community/post-detail.md
---

# GET /api/community/posts/{postId}

## 개요

게시글 상세 조회

## 스펙

### Request

- **URL**: `/api/community/posts/{postId}`
- **Method**: `GET`
- **Auth**: Bearer Token (선택 - 좋아요/북마크 여부 확인용)

### Headers

```
Authorization: Bearer {access_token} (선택)
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명      |
| -------- | ---- | ---- | --------- |
| postId   | int  | Y    | 게시글 ID |

## Response

### 성공 (200)

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
    "updatedAt": null,
    "portfolio": {
        "id": 12,
        "returns": "+15.2%",
        "itemCount": 5,
        "isDetailUnlocked": false,
        "premiumStats": null
    }
}
```

### 에러

| 코드 | 상황        | 메시지                      |
| ---- | ----------- | --------------------------- |
| 404  | 게시글 없음 | "게시글을 찾을 수 없습니다" |

## 구현 로직

```
1. (선택) JWT에서 user_id 추출
2. posts 테이블에서 postId로 조회 (is_delete=FALSE)
3. 작성자 정보 JOIN (community_profiles)
4. 이미지 목록 조회 (community_article_images)
5. 좋아요 수, 댓글 수 집계
6. 로그인 시: 좋아요/북마크/팔로우/본인 여부 확인
7. 조회수 증가 (view_count += 1)
8. 최상위 댓글 20건 조회 (최신순)
9. 포트폴리오 첨부 시: 프리미엄 상태 판별
   - Premium/Pro 멤버십 → isDetailUnlocked=true
   - 기 결제 이력 (token_histories) → isDetailUnlocked=true
   - 미충족 → isDetailUnlocked=false, premiumStats=null
   - 한도 차감은 별도 엔드포인트(POST /api/community/posts/{id}/unlock-detail)로 처리
10. 응답 반환
```

## 관련 스펙

- DB: `../../db/community/posts.md`
- DB: `../../db/community/comments.md`
- DB: `../../db/bm/token-histories.md`
- API: `post-create.md`
- API: `post-update.md`
- API: `feed-list.md`
- UI: `../../ui/community/post-detail.md`
