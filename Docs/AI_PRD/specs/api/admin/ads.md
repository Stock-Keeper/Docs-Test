---
type: api
phase: P1
category: admin
method: GET, POST, PUT
endpoint: /api/v1/admin/ads
auth: admin
related:
    db:
        - specs/db/ads/ad-units.md
---

# CRUD /api/v1/admin/ads

## 개요

관리자 전용 광고 단위 관리 API (목록 조회, 생성, 수정)

## 스펙

### 1. 광고 단위 목록 조회

#### Request

- **URL**: `/api/v1/admin/ads`
- **Method**: `GET`
- **Auth**: Admin (Super Admin Only)

#### Response (200)

```json
{
    "ads": [
        {
            "id": 1,
            "placement_type": "SPLASH",
            "platform": "ANDROID",
            "provider": "ADMOB",
            "unit_id": "ca-app-pub-xxxxx/yyyyy",
            "is_active": true,
            "config": { "frequency_cap": 2 },
            "description": "Android 스플래시 광고",
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z"
        }
    ]
}
```

---

### 2. 광고 단위 생성

#### Request

- **URL**: `/api/v1/admin/ads`
- **Method**: `POST`
- **Auth**: Admin (Super Admin Only)

#### Body

```json
{
    "placement_type": "FEED_NATIVE",
    "platform": "ANDROID",
    "provider": "ADMOB",
    "unit_id": "ca-app-pub-xxxxx/aaaaa",
    "is_active": true,
    "config": { "feed_interval": 5 },
    "description": "Android 네이티브 인피드 광고"
}
```

#### Response (201)

```json
{
    "id": 2,
    "message": "광고 단위가 생성되었습니다."
}
```

---

### 3. 광고 단위 수정

#### Request

- **URL**: `/api/v1/admin/ads/{id}`
- **Method**: `PUT`
- **Auth**: Admin (Super Admin Only)

#### Body

```json
{
    "is_active": false,
    "config": { "frequency_cap": 3 },
    "description": "수정된 설명"
}
```

#### Response (200)

```json
{
    "message": "광고 단위가 수정되었습니다."
}
```

### 에러

| 코드 | 상황                    | 메시지                              |
| ---- | ----------------------- | ----------------------------------- |
| 400  | placement+platform 중복 | "해당 위치/플랫폼 조합이 이미 존재" |
| 403  | Admin 권한 없음         | "관리자 권한이 필요합니다"          |
| 404  | 존재하지 않는 id        | "광고 단위를 찾을 수 없습니다"      |

## 구현 로직

```
[생성]
1. Admin 권한 확인 (Super Admin Only)
2. placement_type + platform 유니크 제약 확인
3. ad_units 테이블 INSERT
4. audit_logs에 변경 기록

[수정]
1. Admin 권한 확인
2. id로 기존 레코드 조회
3. 변경 필드만 UPDATE
4. audit_logs에 변경 기록
```

## 관련 스펙

- DB: `../../db/ads/ad-units.md`
