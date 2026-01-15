---
type: api
phase: P1
category: portfolio
method: DELETE
endpoint: /api/portfolios/{portfolioId}
auth: required
related:
  db:
    - ../../db/portfolios.md
---

# DELETE /api/portfolios/{portfolioId}

## 개요
포트폴리오 삭제 (마지막 1개면 빈 포트폴리오 자동 생성)

## 스펙

### Request
- **URL**: `/api/portfolios/{portfolioId}`
- **Method**: `DELETE`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
```

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | uuid | Y | 포트폴리오 ID |

## Response

### 성공 (200)
```json
{
  "message": "삭제되었습니다",
  "newDefaultPortfolio": null
}
```

### 마지막 포트폴리오 삭제 시 (200)
```json
{
  "message": "삭제되었습니다",
  "newDefaultPortfolio": {
    "id": "uuid",
    "name": "기본 포트폴리오",
    "isDefault": true
  }
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "접근 권한이 없습니다" |
| 404 | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolios 테이블에서 portfolioId 조회
   - 없으면 404
   - user_id 불일치면 403
3. 사용자의 포트폴리오 개수 확인
4. 삭제 실행 (CASCADE로 portfolio_items도 함께 삭제)
5. 마지막 포트폴리오였다면:
   - 새 '기본 포트폴리오' 자동 생성
   - newDefaultPortfolio에 담아 응답
6. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
