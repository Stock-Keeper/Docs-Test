---
type: api
phase: P1
endpoint: /api/users/consents
method: PUT
related:
    db:
        - specs/db/auth/user-consents.md
    ui: []
---

# 사용자 동의 업데이트

## 개요

사용자 동의 업데이트 API

## 요청

```
PUT /api/users/consents
```

### Request Body

```json
{
    "consents": [
        {
            "type": "MARKETING",
            "agreed": true
        }
    ]
}
```

| 필드              | 타입    | 필수 | 설명                         |
| ----------------- | ------- | ---- | ---------------------------- |
| consents          | array   | Y    | 동의 항목 목록               |
| consents[].type   | string  | Y    | TERMS, PRIVACY, MARKETING 등 |
| consents[].agreed | boolean | Y    | 동의 여부                    |

## 응답

```json
{
    "success": true,
    "updatedConsents": ["MARKETING"]
}
```

## 비즈니스 로직

- TERMS, PRIVACY는 철회 불가 (서비스 이용에 필수)
- MARKETING은 토글 가능

## 에러 코드

| 코드 | 설명                |
| ---- | ------------------- |
| 400  | 필수 동의 철회 불가 |
| 401  | 인증 필요           |
