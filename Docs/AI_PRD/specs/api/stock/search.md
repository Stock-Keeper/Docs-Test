# GET /api/stocks/search

## 개요
종목 검색 (한국투자증권 API 연동)

## 스펙

### Request
- **URL**: `/api/stocks/search`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| keyword | string | Y | 검색어 (종목명 또는 종목코드) | - |
| limit | int | N | 최대 결과 수 | 20 |

## Response

### 성공 (200)
```json
{
  "stocks": [
    {
      "stockCode": "005930",
      "stockName": "삼성전자",
      "market": "KOSPI",
      "currentPrice": 75000,
      "changeAmount": 1700,
      "changeRate": 2.32
    },
    {
      "stockCode": "005935",
      "stockName": "삼성전자우",
      "market": "KOSPI",
      "currentPrice": 62000,
      "changeAmount": -500,
      "changeRate": -0.80
    }
  ]
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 검색어 누락 | "검색어를 입력해주세요" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 503 | 외부 API 실패 | "검색 결과를 불러올 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. keyword 검증 (1자 이상)
3. 캐시에서 검색 결과 확인 (TTL 5분)
4. 캐시 미스 시 한국투자증권 API 호출
   - 종목명 검색 API
   - 현재가 조회 API (결과 종목들)
5. 결과 캐싱
6. 응답 반환
```

## 관련 스펙
- UI: `../ui/stock/search.md`
