---
type: api
phase: P2
category: community
method: GET
endpoint: /api/community/feed
auth: optional
related:
    db:
        - specs/db/community/articles.md
        - specs/db/portfolio/portfolios.md
    ui:
        - specs/ui/community/feed.md
---

# GET /api/community/feed

## 개요

커뮤니티 피드 조회 (게시글 + 포트폴리오 통합)

## 스펙

### Request

- **URL**: `/api/community/feed`
- **Method**: `GET`
- **Auth**: Bearer Token (선택 - 없어도 조회 가능)

### Headers

```
Authorization: Bearer {access_token} (선택)
```

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명                                                        | 기본값 |
| -------- | ---- | ---- | ----------------------------------------------------------- | ------ |
| sort     | enum | N    | LATEST, POPULAR (P3), FOLLOWING (P3)                        | LATEST |
| filter   | enum | N    | ALL, POST, PORTFOLIO (P3)                                   | ALL    |
| category | enum | N    | 카테고리 필터 (포트폴리오/토론/질문/국내주식/해외주식/자유) | -      |
| page     | int  | N    | 페이지 번호                                                 | 1      |
| limit    | int  | N    | 페이지당 건수                                               | 20     |

## Response

### 성공 (200)

```json
{
    "data": [
        {
            "id": "uuid",
            "type": "POST",
            "title": "삼성전자 분석글",
            "content": "내용 미리보기...",
            "category": "국내주식",
            "author": {
                "id": "uuid",
                "nickname": "투자왕",
                "profileCharacter": 1
            },
            "likeCount": 42,
            "commentCount": 5,
            "imageCount": 2,
            "isLiked": false,
            "createdAt": "2026-01-13T10:00:00Z"
        },
        {
            "id": "uuid",
            "type": "PORTFOLIO",
            "name": "배당주 포트폴리오",
            "description": "고배당 종목 모음",
            "author": {
                "id": "uuid",
                "nickname": "배당러버",
                "profileCharacter": 3
            },
            "stockCount": 8,
            "likeCount": 156,
            "copyCount": 23,
            "isLiked": false,
            "createdAt": "2026-01-12T15:00:00Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 50,
        "totalItems": 1000,
        "limit": 20
    }
}
```

### 에러

| 코드 | 상황            | 메시지                         |
| ---- | --------------- | ------------------------------ |
| 400  | 잘못된 파라미터 | "유효하지 않은 파라미터입니다" |

## 구현 로직

```
1. (선택) JWT 토큰이 있으면 user_id 추출 (좋아요 여부 확인용)
2. Query Parameter 파싱
3. posts와 portfolios(is_public=true) 테이블 UNION 조회
   - P2: sort=LATEST만 지원 (created_at DESC)
   - P3: POPULAR, FOLLOWING 추가
4. category 필터 적용 (게시글만 해당)
5. 각 항목에 대해:
   - 좋아요 수, 댓글 수 조회
   - 로그인 시 사용자의 좋아요 여부 확인
6. 페이지네이션 적용
7. 응답 반환
```

## 관련 스펙

- DB: `../db/posts.md`
- DB: `../db/portfolios.md`
- UI: `../ui/community/feed.md`
