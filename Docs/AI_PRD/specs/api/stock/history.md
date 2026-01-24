---
type: api
phase: P2
category: stock
method: GET
endpoint: /api/stocks/{stockCode}/history
auth: required
related:
  ui:
    - ../../ui/stock/detail.md
---

# GET /api/stocks/{stockCode}/history

## 개요

종목 상세 화면의 차트를 그리기 위한 과거 시세 데이터 조회

## 스펙

### Request
- **URL**: `/api/stocks/{stockCode}/history`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| stockCode | string | Y | 종목코드 (6자리) |

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| period | string | N | 조회 기간 (1d, 1w, 1m, 3m) | 1w |

**예시**: `/api/stocks/005930/history?period=1w`

## Response

### 성공 (200)
```json
{
  "stockCode": "005930",
  "stockName": "삼성전자",
  "period": "1w",
  "candles": [
    {
      "date": "2026-01-10",
      "open": 73500,
      "high": 74800,
      "low": 73000,
      "close": 74000,
      "volume": 12000000
    },
    {
      "date": "2026-01-13",
      "open": 74000,
      "high": 75500,
      "low": 73800,
      "close": 75000,
      "volume": 15000000
    }
  ],
  "cacheInfo": {
    "cached": true,
    "ttlSeconds": 600
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 잘못된 period 값 | "지원하지 않는 기간입니다 (1d, 1w, 1m, 3m)" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 404 | 종목 없음 | "존재하지 않는 종목입니다" |
| 503 | 외부 API 실패 | "시세 정보를 불러올 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. stockCode, period 파라미터 검증
3. 캐시 확인 (Redis key: stock:history:{stockCode}:{period})
4. 캐시 히트 → 캐시 데이터 반환
5. 캐시 미스 → 외부 API (한투 등) 호출
   - period별 적절한 일수 요청 (1d=1, 1w=7, 1m=30, 3m=90)
6. OHLC 데이터 파싱 및 정규화
7. Redis 캐싱 (TTL: 장중 10분, 장외 1시간)
8. 응답 반환
```

## 캐싱 전략

| 항목 | 값 |
|------|-----|
| 캐시 키 | `stock:history:{stockCode}:{period}` |
| TTL (장중) | 10분 (600초) |
| TTL (장외) | 1시간 (3600초) |
| 캐시 미스 시 | 외부 API 호출 |

## Period별 데이터

| Period | 데이터 범위 | 캔들 수 |
|--------|------------|---------|
| 1d | 오늘 1일 | 1개 (일봉 기준) |
| 1w | 최근 7영업일 | ~7개 |
| 1m | 최근 30영업일 | ~22개 |
| 3m | 최근 90영업일 | ~65개 |

## 관련 스펙

- UI: `../../ui/stock/detail.md`
