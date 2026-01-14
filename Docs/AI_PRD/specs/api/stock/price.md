# GET /api/stocks/price

## 개요
실시간 시세 조회 (캐싱 적용)

## 스펙

### Request
- **URL**: `/api/stocks/price`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| codes | string | Y | 종목코드 (콤마 구분) | - |

**예시**: `/api/stocks/price?codes=005930,035720,035420`

## Response

### 성공 (200)
```json
{
  "prices": [
    {
      "stockCode": "005930",
      "stockName": "삼성전자",
      "currentPrice": 75000,
      "changeAmount": 1700,
      "changeRate": 2.32,
      "volume": 15000000,
      "timestamp": "2026-01-15T14:30:00Z",
      "isCached": false
    },
    {
      "stockCode": "035720",
      "stockName": "카카오",
      "currentPrice": 50000,
      "changeAmount": -500,
      "changeRate": -0.99,
      "volume": 8000000,
      "timestamp": "2026-01-15T14:30:00Z",
      "isCached": true
    }
  ],
  "marketStatus": "OPEN"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 종목코드 누락 | "종목 코드를 입력해주세요" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 503 | 외부 API 실패 | "시세 정보를 불러올 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. codes 파싱 (콤마 구분)
3. 각 종목에 대해 캐시 확인 (TTL 30초)
4. 캐시 미스 종목들만 한투 API 호출
5. 결과 캐싱 (메모리/Redis)
6. 응답 반환 (isCached로 캐시 여부 표시)
```

## 캐싱 전략

| 항목 | 값 |
|------|-----|
| 캐시 키 | `stock:price:{stockCode}` |
| TTL | 30초 |
| 장외 시간 | TTL 확장 (5분) |
| 캐시 미스 시 | 외부 API 호출 |

## 관련 스펙
- UI: `../ui/portfolio/detail.md`
