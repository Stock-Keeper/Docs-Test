---
type: api
phase: P1
category: portfolio
method: POST
endpoint: /api/portfolios
auth: required
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/portfolio/create.md
---

# POST /api/portfolios

## 개요
포트폴리오 생성 (최대 5개)

## 스펙

### Request
- **URL**: `/api/portfolios`
- **Method**: `POST`
- **Auth**: Bearer Token 필수

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Body
```json
{
  "name": "string (필수, 1~20자)",
  "description": "string (선택, 0~100자)"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | Y | 포트폴리오 이름 (1~20자, 특수문자 제한) |
| description | string | N | 설명/메모 (0~100자) |

## Response

### 성공 (201)
```json
{
  "id": "uuid",
  "name": "배당주 포트폴리오",
  "description": "고배당 종목 모음",
  "isDefault": false,
  "displayOrder": 2,
  "createdAt": "2026-01-15T12:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 이름 누락 | "포트폴리오 이름을 입력해주세요" |
| 400 | 이름 길이 초과 | "포트폴리오 이름은 1~20자여야 합니다" |
| 400 | 특수문자 포함 | "특수문자는 사용할 수 없습니다" |
| 400 | 5개 초과 | "최대 5개까지 만들 수 있습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. Request Body 검증
   - name: 1~20자, 특수문자 (!@#$%^&*) 차단
   - description: 100자 이하
3. 사용자의 포트폴리오 개수 확인
   - 5개 이상이면 400 에러
4. 새 display_order 계산 (기존 max + 1)
5. portfolios 테이블에 INSERT
6. 응답 반환
```

## 관련 스펙
- DB: `../db/portfolios.md`
- UI: `../ui/portfolio/create.md`
