---
type: api
phase: P1
category: admin
method: PATCH
endpoint: /api/admin/users/{id}/status
auth: admin
related:
  db:
    - ../../db/admin-logs.md
    - ../../db/users.md
---

# PATCH /api/admin/users/{id}/status

## 개요
관리자 - 사용자 상태 변경 (활성화/비활성화)

## 스펙

### Request
- **URL**: `/api/admin/users/{id}/status`
- **Method**: `PATCH`
- **Auth**: Bearer Token (ADMIN role 필수)

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | uuid | Y | 대상 사용자 ID |

### Body
```json
{
  "isActive": false,
  "reason": "이용약관 위반"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| isActive | boolean | Y | true=활성화, false=비활성화 |
| reason | string | 비활성화 시 필수 | 변경 사유 |

## Response

### 성공 (200)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "isActive": false,
  "updatedAt": "2026-01-13T15:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 비활성화 시 reason 누락 | "비활성화 사유를 입력해주세요" |
| 400 | 자기 자신 변경 시도 | "본인의 상태는 변경할 수 없습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "관리자 권한이 필요합니다" |
| 404 | 사용자 없음 | "사용자를 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 현재 관리자 ID 추출
2. 대상 사용자 ID가 현재 관리자와 같으면 400 에러
3. isActive가 false인데 reason이 없으면 400 에러
4. users 테이블에서 id로 사용자 조회
5. 사용자 없으면 404
6. is_active 업데이트
7. admin_logs 테이블에 기록:
   - action: 'STATUS_CHANGE'
   - target_type: 'USER'
   - target_id: {사용자 ID}
   - before_value: {"isActive": 이전값}
   - after_value: {"isActive": 새값}
   - reason: {사유}
8. 비활성화 시: 해당 사용자의 refresh_tokens 모두 삭제 (강제 로그아웃)
9. 응답 반환
```

## 비활성화 효과
- 앱 로그인 차단
- JWT 발급 거부
- 기존 Refresh Token 무효화

## 관련 스펙
- DB: `../db/admin-logs.md`
- DB: `../db/users.md`
