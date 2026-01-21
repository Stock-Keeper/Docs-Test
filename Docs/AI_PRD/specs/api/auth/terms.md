---
type: api
phase: P1
endpoint: /api/terms
method: GET
related:
    db:
        - specs/db/auth/user-consents.md
    ui: []
---

# 약관 버전 조회

## 개요

약관 버전 및 내용 조회 API

## 요청

```
GET /api/terms?type={type}
```

| 파라미터 | 타입   | 필수 | 설명                                    |
| -------- | ------ | ---- | --------------------------------------- |
| type     | string | N    | TERMS, PRIVACY, MARKETING (없으면 전체) |

## 응답

```json
{
    "terms": [
        {
            "type": "TERMS",
            "version": "1.0",
            "title": "서비스 이용약관",
            "content": "제1조 (목적)...",
            "effectiveDate": "2026-01-01",
            "isRequired": true
        },
        {
            "type": "PRIVACY",
            "version": "1.0",
            "title": "개인정보 처리방침",
            "content": "1. 수집하는 개인정보...",
            "effectiveDate": "2026-01-01",
            "isRequired": true
        },
        {
            "type": "MARKETING",
            "version": "1.0",
            "title": "마케팅 수신 동의",
            "content": "마케팅 정보 수신에 동의합니다...",
            "effectiveDate": "2026-01-01",
            "isRequired": false
        }
    ]
}
```

## 에러 코드

| 코드 | 설명           |
| ---- | -------------- |
| 400  | 잘못된 type 값 |
