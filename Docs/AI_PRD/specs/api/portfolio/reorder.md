---
type: api
phase: P1
category: portfolio
method: PATCH
endpoint: /api/portfolios/reorder
auth: required
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/portfolio/list.md
---

# PATCH /api/portfolios/reorder

## 개요
포트폴리오 정렬 순서 변경

## 스펙

### Request
- **URL**: `/api/portfolios/reorder`
- **Method**: `PATCH`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Body
```json
{
  "orders": [
    {"id": "uuid1", "displayOrder": 1},
    {"id": "uuid2", "displayOrder": 2},
    {"id": "uuid3", "displayOrder": 3}
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| orders | array | Y | 포트폴리오 ID와 순서 배열 |
| orders[].id | uuid | Y | 포트폴리오 ID |
| orders[].displayOrder | int | Y | 표시 순서 (1부터 시작) |

## Response

### 성공 (200)
```json
{
  "updated": true
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 잘못된 형식 | "올바르지 않은 요청입니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "접근 권한이 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. Request Body 검증
3. 각 ID에 대해 소유권 확인
   - 다른 사용자 포트폴리오 포함 시 403
4. 트랜잭션으로 모든 display_order 업데이트
5. 실패 시 롤백
6. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
- UI: `../ui/portfolio/list.md`
