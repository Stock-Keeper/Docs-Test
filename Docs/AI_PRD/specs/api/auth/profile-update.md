---
type: api
phase: P1
category: auth
method: PUT
endpoint: /api/users/profile
auth: required
related:
    db:
        - specs/db/auth/users.md
    ui:
        - specs/ui/auth/profile-input.md
---

# PUT /api/users/profile

## 개요

프로필 입력/수정 (최초 로그인 후 필수)

## 스펙

### Request

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Auth**: Bearer Token 필수

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Body

```json
{
    "nickname": "string (필수, 1-20자)",
    "profile_picture": "string (선택, URL)",
    "investmentType": "string (필수, STABLE|NEUTRAL|AGGRESSIVE)"
}
```

| 필드            | 타입   | 필수 | 설명                                          |
| --------------- | ------ | ---- | --------------------------------------------- |
| nickname        | string | Y    | 1~20자, 특수문자 제한                         |
| profile_picture | string | N    | 프로필 이미지 URL (없으면 Google 기본값 유지) |
| investmentType  | string | Y    | 투자 성향 (STABLE, NEUTRAL, AGGRESSIVE)       |

## Response

### 성공 (200)

```json
{
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "홍길동",
    "profile_picture": "https://...",
    "is_profile_complete": true
}
```

### 에러

| 코드 | 상황               | 메시지                                |
| ---- | ------------------ | ------------------------------------- |
| 400  | nickname 누락      | "닉네임을 입력해주세요"               |
| 400  | nickname 길이 초과 | "닉네임은 1~20자 이내로 입력해주세요" |
| 401  | 인증 실패          | "로그인이 필요합니다"                 |

## 구현 로직

```
1. Authorization 헤더에서 Access Token 추출 및 검증
2. JWT payload에서 user_id 추출
3. Request Body 검증 (nickname 필수, 길이, investmentType 유효성)
4. users 테이블 업데이트
   - nickname, profile_picture 업데이트
   - is_profile_complete = true
5. settings 테이블 업데이트
   - investment_type = investmentType
6. 신규 사용자인 경우 (첫 프로필 입력):
   - 기본 포트폴리오 자동 생성
   - portfolios 테이블에 INSERT
7. 응답 반환
```

## 프로필 완료 후 처리

```
신규 사용자 첫 프로필 입력 시:
1. is_profile_complete = true로 업데이트
2. 기본 포트폴리오 생성:
   - name: "내 포트폴리오"
   - is_default: true
   - display_order: 1
3. 홈 화면으로 이동
```

## 관련 스펙

- DB: `../db/users.md`
- UI: `../ui/auth/profile-input.md`
