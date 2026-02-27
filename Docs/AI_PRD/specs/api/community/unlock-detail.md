---
type: api
phase: P3
category: community
method: POST
endpoint: /api/community/posts/{postId}/unlock-detail
auth: verified
related:
    db:
        - specs/db/community/post-detail-unlocks.md
        - specs/db/bm/token-histories.md
        - specs/db/auth/users.md
    api:
        - specs/api/community/post-detail.md
    ui:
        - specs/ui/community/post-detail.md
---

# POST /api/community/posts/{postId}/unlock-detail

## 개요

게시글에 첨부된 포트폴리오의 프리미엄 상세 지표(Lv.2/Lv.3) 열람 잠금 해제. 토큰 2개 소모 또는 멤버십 한도 차감.

## 스펙

### Request

- **URL**: `/api/community/posts/{postId}/unlock-detail`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명           |
| -------- | ---- | ---- | -------------- |
| postId   | int  | Y    | 대상 게시글 ID |

## Response

### 성공 (200)

```json
{
    "isDetailUnlocked": true,
    "premiumStats": {
        "aiScore": "A",
        "sharpeRatio": 1.5,
        "mdd": "-10.2%",
        "sectorDistribution": [
            { "sector": "IT", "weight": 40 },
            { "sector": "Finance", "weight": 20 }
        ]
    },
    "costType": "TOKEN",
    "remaining": 148
}
```

### 에러

| 코드 | 상황           | 메시지                                         |
| ---- | -------------- | ---------------------------------------------- |
| 402  | 토큰/한도 부족 | "토큰이 부족하거나 멤버십 한도를 초과했습니다" |
| 404  | 게시글 없음    | "게시글을 찾을 수 없습니다"                    |
| 409  | 이미 해제됨    | "이미 열람 해제된 게시글입니다"                |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. 게시글 조회 (존재 여부, 포트폴리오 첨부 여부 확인)
3. post_detail_unlocks에서 (user_id, article_id) 조회
   - 이미 해제됨 → 409 또는 바로 premiumStats 반환
4. 멤버십 확인
   - Premium → 토큰/한도 차감 없이 통과 (cost_type = 'MEMBERSHIP')
   - Basic/Pro → 월간 잔여 열람 한도 확인 → 있으면 차감 후 통과 (cost_type = 'MEMBERSHIP')
   - Free/한도초과 → users.token_balance 확인 (2개 이상?)
     - 부족하면 402
     - 충분하면 트랜잭션 시작:
       1. users.token_balance -= 2
       2. token_histories INSERT (USE, DETAIL, reference_id=postId)
       3. post_detail_unlocks INSERT (user_id, article_id, cost_type='TOKEN')
5. premiumStats 데이터 조회 및 반환
```

## 관련 스펙

- DB: `../../db/community/post-detail-unlocks.md`
- DB: `../../db/bm/token-histories.md`
- DB: `../../db/auth/users.md`
- API: `post-detail.md`
- UI: `../../ui/community/post-detail.md`
