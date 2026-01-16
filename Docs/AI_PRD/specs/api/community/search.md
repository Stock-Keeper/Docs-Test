---
type: api
phase: P2
category: community
method: GET
endpoint: /api/community/search
auth: none
related:
  ui:
    - ../../ui/community/search.md
---

# GET /api/community/search

## 개요
커뮤니티 통합 검색 (종목, 게시글, 사용자)

## 스펙

### Request
- **URL**: `/api/community/search`
- **Method**: `GET`
- **Auth**: 불필요

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| q | string | Y | 검색어 (2자 이상) | - |
| type | enum | N | STOCK, POST, USER (개별 조회 시) | ALL |
| page | int | N | 페이지 번호 (type 지정 시) | 1 |
| limit | int | N | 페이지당 건수 | 5 (통합) / 20 (개별) |

## Response

### 통합 검색 (type 미지정)
```json
{
  "stocks": {
    "items": [
      {
        "code": "005930",
        "name": "삼성전자",
        "currentPrice": 70000,
        "changeRate": 2.5,
        "portfolioCount": 156
      }
    ],
    "totalCount": 15,
    "hasMore": true
  },
  "posts": {
    "items": [
      {
        "id": "uuid",
        "title": "삼성전자 실적 분석",
        "category": "국내주식",
        "likeCount": 42,
        "createdAt": "2026-01-13T10:00:00Z"
      }
    ],
    "totalCount": 28,
    "hasMore": true
  },
  "users": {
    "items": [
      {
        "id": "uuid",
        "nickname": "삼성맨",
        "profileCharacter": 1,
        "followerCount": 123
      }
    ],
    "totalCount": 5,
    "hasMore": false
  }
}
```

### 개별 검색 (type=STOCK)
```json
{
  "data": [
    {
      "code": "005930",
      "name": "삼성전자",
      "currentPrice": 70000,
      "changeRate": 2.5,
      "portfolioCount": 156
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 45,
    "limit": 20
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 검색어 2자 미만 | "검색어는 2자 이상 입력해주세요" |

## 구현 로직

```
1. Query Parameter 검증 (q 필수, 2자 이상)
2. type에 따라 분기:
   - ALL (미지정): 각 카테고리별 5개씩 조회
   - STOCK: stocks 테이블 검색 + 페이지네이션
   - POST: posts 테이블 검색 + 페이지네이션
   - USER: users 테이블 검색 + 페이지네이션
3. 검색 쿼리:
   - STOCK: name LIKE '%{q}%' OR code LIKE '%{q}%'
   - POST: title LIKE '%{q}%'
   - USER: nickname LIKE '%{q}%'
4. 각 결과에 부가 정보 추가:
   - STOCK: portfolioCount (해당 종목 포함 포트폴리오 수)
   - USER: followerCount
5. 응답 반환
```

## 종목 클릭 시 포트폴리오 조회

```
GET /api/community/stocks/{stockCode}/portfolios

Response:
{
  "stockCode": "005930",
  "stockName": "삼성전자",
  "portfolios": [
    {
      "id": "uuid",
      "name": "배당주 포트폴리오",
      "author": { "nickname": "투자왕" },
      "likeCount": 156,
      "copyCount": 23
    }
  ]
}
```

## 관련 스펙
- UI: `../ui/community/search.md`
