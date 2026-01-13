# GET /api/portfolios

## 개요
포트폴리오 목록 조회

## 스펙

### Request
- **URL**: `/api/portfolios`
- **Method**: `GET`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

## Response

### 성공 (200)
```json
{
  "portfolios": [
    {
      "id": "uuid",
      "name": "내 포트폴리오",
      "description": "메인 포트폴리오",
      "isDefault": true,
      "displayOrder": 1,
      "stockCount": 5,
      "cashKrw": 1000000,
      "cashUsd": 500.0,
      "totalValue": 10000000,
      "updatedAt": "2026-01-15T12:00:00Z"
    }
  ]
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolios 테이블에서 해당 사용자 포트폴리오 조회
   - ORDER BY display_order ASC, updated_at DESC
3. 각 포트폴리오에 대해:
   - 종목 수 카운트 (portfolio_items)
   - 총 평가금액 계산 (종목 평가금액 + 현금)
4. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
- API: `detail.md`
- UI: `../ui/portfolio/list.md`
