---
type: api
phase: P2
category: portfolio
method: PATCH
endpoint: /api/portfolios/{portfolioId}/visibility
auth: required
related:
  db:
    - specs/db/portfolio/portfolios.md
  ui:
    - specs/ui/community/portfolio-detail.md
---

# PATCH /api/portfolios/{portfolioId}/visibility

## 개요

내 포트폴리오의 커뮤니티 공개/비공개 상태를 설정

## 스펙

### Request

- **URL**: `/api/portfolios/{portfolioId}/visibility`
- **Method**: `PATCH`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| portfolioId | uuid | Y | 포트폴리오 ID |

### Body

```json
{
  "isPublic": true
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| isPublic | boolean | Y | 공개(true)/비공개(false) 여부 |

## Response

### 성공 (200)

```json
{
  "id": "uuid",
  "name": "배당주 포트폴리오",
  "isPublic": true,
  "updatedAt": "2026-02-15T14:00:00Z"
}
```

### 에러

| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | isPublic 필드 누락 | "isPublic 값은 필수입니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "본인의 포트폴리오만 설정할 수 있습니다" |
| 404 | 포트폴리오 없음 | "포트폴리오를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. portfolios 테이블에서 portfolioId 조회
   - 없으면 404
   - user_id 불일치 시 403
3. Request Body 검증 (isPublic 필드 존재 여부)
4. portfolios 테이블의 is_public 컬럼을 UPDATE
5. 만약 isPublic이 false로 변경되었고 커뮤니티 피드에 공유된 적이 있다면 처리? (P2: 일단 그대로 둠. 접근 시 비공개 처리됨)
6. 응답 반환
```

## 관련 스펙

- DB: `../../db/portfolio/portfolios.md`
- UI: `../../ui/community/portfolio-detail.md`
