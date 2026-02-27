---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/rankings
auth: none
related:
    db:
        - specs/db/community/rankings.md
        - specs/db/community/badges.md
---

# GET /api/community/rankings

## 개요

랭킹 조회 (P3)

## 스펙

### Request

- **URL**: `/api/community/rankings`
- **Method**: `GET`
- **Auth**: 불필요

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명                      | 기본값  |
| -------- | ---- | ---- | ------------------------- | ------- |
| type     | enum | N    | WEEKLY, MONTHLY, ALL_TIME | WEEKLY  |
| category | enum | N    | LIKE, COPY, OVERALL       | OVERALL |
| page     | int  | N    | 페이지 번호               | 1       |
| limit    | int  | N    | 페이지당 건수             | 20      |

## Response

### 성공 (200)

```json
{
    "period": {
        "type": "WEEKLY",
        "startDate": "2026-01-06",
        "endDate": "2026-01-13"
    },
    "rankings": [
        {
            "rank": 1,
            "user": {
                "id": 1,
                "nickname": "투자왕",
                "profileImageUrl": "https://cdn.example.com/profiles/1.jpg",
                "badges": ["LIKE_100", "COPY_50"]
            },
            "stats": {
                "likeCount": 1234,
                "copyCount": 567,
                "followerCount": 890
            },
            "topPortfolio": {
                "id": "uuid",
                "name": "배당주 포트폴리오"
            }
        }
    ],
    "myRank": {
        "rank": 42,
        "likeCount": 56,
        "copyCount": 12
    },
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 100
    }
}
```

## 랭킹 점수 계산 (OVERALL)

```
점수 = (좋아요 수 × 1) + (복사 수 × 3) + (팔로워 수 × 2)
```

| 지표      | 가중치 | 비고                     |
| --------- | ------ | ------------------------ |
| 좋아요 수 | ×1     | 포트폴리오 + 게시글 합산 |
| 복사 수   | ×3     | 실질적 참여 가치 높음    |
| 팔로워 수 | ×2     | 영향력 지표              |

## 구현 로직

```
1. 기간(type)에 따라 집계 기간 결정
2. rankings 테이블에서 해당 기간 데이터 조회
   - 또는 실시간 집계 (캐싱 권장)
3. category에 따라 정렬:
   - LIKE: like_count DESC
   - COPY: copy_count DESC
   - OVERALL: score DESC
4. 로그인 사용자의 경우 myRank 계산
5. 페이지네이션 적용
6. 응답 반환
```

## 랭킹 집계 배치

```sql
-- 주간 랭킹 집계 (매주 월요일 00:00)
INSERT INTO rankings (user_id, period_type, period_start, period_end, like_count, copy_count, follower_count, score)
SELECT
  u.id,
  'WEEKLY',
  DATE_SUB(CURDATE(), INTERVAL 7 DAY),
  CURDATE(),
  COALESCE(SUM(pl.cnt), 0) + COALESCE(SUM(postl.cnt), 0) as like_count,
  COALESCE(SUM(pc.cnt), 0) as copy_count,
  COALESCE(f.follower_count, 0) as follower_count,
  (COALESCE(SUM(pl.cnt), 0) + COALESCE(SUM(postl.cnt), 0)) * 1 +
  COALESCE(SUM(pc.cnt), 0) * 3 +
  COALESCE(f.follower_count, 0) * 2 as score
FROM users u
LEFT JOIN (...) -- 집계 서브쿼리
GROUP BY u.id;
```

## 관련 스펙

- DB: `specs/db/community/rankings.md`
- DB: `specs/db/community/badges.md`
