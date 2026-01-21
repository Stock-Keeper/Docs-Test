---
type: api
phase: P1
endpoint: /api/users/consents
method: GET
related:
    db:
        - specs/db/auth/user-consents.md
    ui: []
---

# 사용자 동의 현황 조회

## 개요

사용자 동의 현황 조회 API

## 요청

```
GET /api/users/consents
```

## 응답

```json
{
    "consents": [
        {
            "type": "TERMS",
            "version": "1.0",
            "agreedAt": "2026-01-15T10:00:00Z",
            "isLatest": true
        },
        {
            "type": "PRIVACY",
            "version": "1.0",
            "agreedAt": "2026-01-15T10:00:00Z",
            "isLatest": true
        },
        {
            "type": "MARKETING",
            "version": "1.0",
            "agreedAt": null,
            "isLatest": true
        }
    ]
}
```

## 에러 코드

| 코드 | 설명      |
| ---- | --------- |
| 401  | 인증 필요 |
