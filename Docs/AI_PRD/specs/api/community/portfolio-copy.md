---
type: api
phase: P3
category: community
method: POST
endpoint: /api/community/portfolios/{portfolioId}/copy
auth: verified
related:
  db:
    - ../../db/portfolios.md
    - ../../db/portfolio-copies.md
---

# POST /api/community/portfolios/{portfolioId}/copy

## 개요
포트폴리오 복사

## 스펙

### Request
- **URL**: `/api/community/portfolios/{portfolioId}/copy`
- **Method**: `POST`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | uuid | Y | 복사할 포트폴리오 ID |

### Body
```json
{
  "name": "string (선택, 없으면 원본 이름 + ' (복사)')"
}
```

## Response

### 성공 (201)
```json
{
  "id": "uuid",
  "name": "배당주 포트폴리오 (복사)",
  "originalPortfolioId": "uuid",
  "originalAuthor": {
    "id": "uuid",
    "nickname": "투자왕"
  },
  "items": [
    {
      "stockCode": "005930",
      "stockName": "삼성전자",
      "targetRatio": 30.0
    }
  ],
  "createdAt": "2026-01-13T10:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 포트폴리오 5개 초과 | "포트폴리오는 최대 5개까지 생성할 수 있습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 본인인증 미완료 | "본인인증이 필요합니다" |
| 403 | 비공개 포트폴리오 | "비공개 포트폴리오는 복사할 수 없습니다" |
| 404 | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. users 테이블에서 is_verified 확인 (false면 403)
3. 사용자의 포트폴리오 개수 확인 (5개 초과면 400)
4. portfolios 테이블에서 portfolioId 조회
   - 없으면 404
   - is_public = false면 403
5. 새 포트폴리오 생성:
   - name: 입력값 또는 원본이름 + " (복사)"
   - user_id: 현재 사용자
   - copied_from_id: 원본 portfolioId
6. 원본의 portfolio_items 복사
7. 원본의 copy_count += 1
8. portfolio_copies 테이블에 기록
9. 원본 작성자에게 알림 발송
10. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
- DB: `../db/portfolio-copies.md`
