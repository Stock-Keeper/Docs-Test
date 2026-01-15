---
type: api
phase: P1
category: admin
method: PATCH
endpoint: /api/admin/users/{id}/role
auth: admin
related:
  db:
    - ../../db/admin-logs.md
  api:
    - users-detail.md
---

# PATCH /api/admin/users/{id}/role

## 개요
관리자 - 사용자 역할 변경 (USER ↔ ADMIN)

## 스펙

### Request
- **URL**: `/api/admin/users/{id}/role`
- **Method**: `PATCH`
- **Auth**: Bearer Token (ADMIN role 필수)

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | uuid | Y | 대상 사용자 ID |

### Body
```json
{
  "role": "ADMIN"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| role | enum | Y | USER 또는 ADMIN |

## Response

### 성공 (200)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "ADMIN",
  "updatedAt": "2026-01-13T15:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 자기 자신 변경 시도 | "본인의 역할은 변경할 수 없습니다" |
| 400 | 잘못된 role 값 | "유효하지 않은 역할입니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "관리자 권한이 필요합니다" |
| 404 | 사용자 없음 | "사용자를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 현재 관리자 ID 추출
2. 대상 사용자 ID가 현재 관리자와 같으면 400 에러
3. users 테이블에서 id로 사용자 조회
4. 사용자 없으면 404
5. role 업데이트
6. admin_logs 테이블에 기록:
   - action: 'ROLE_CHANGE'
   - target_type: 'USER'
   - target_id: {사용자 ID}
   - before_value: {"role": "이전값"}
   - after_value: {"role": "새값"}
7. 응답 반환
```

## 관련 스펙
- DB: `../db/admin-logs.md`
- API: `users-detail.md`
