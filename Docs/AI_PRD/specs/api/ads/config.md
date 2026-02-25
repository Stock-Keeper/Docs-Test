---
type: api
phase: P1
category: ads
method: GET
endpoint: /api/v1/ads/config
auth: none
related:
    db:
        - specs/db/ads/ad-units.md
    ui:
        - specs/ui/ads/ad-components.md
---

# GET /api/v1/ads/config

## 개요

앱 실행 시 플랫폼별 활성화된 광고 단위 목록 및 정책을 조회

## 스펙

### Request

- **URL**: `/api/v1/ads/config`
- **Method**: `GET`
- **Auth**: 불필요

### Query Parameters

| 파라미터 | 타입   | 필수 | 설명                 | 기본값 |
| -------- | ------ | ---- | -------------------- | ------ |
| platform | STRING | Y    | `ANDROID` 또는 `IOS` | -      |

## Response

### 성공 (200)

```json
{
    "configs": [
        {
            "placement": "SPLASH",
            "unit_id": "ca-app-pub-xxxxx/yyyyy",
            "config": {
                "frequency_cap": 2
            }
        },
        {
            "placement": "BANNER_MAIN",
            "unit_id": "ca-app-pub-xxxxx/zzzzz",
            "config": {
                "refresh_interval_sec": 30
            }
        },
        {
            "placement": "FEED_NATIVE",
            "unit_id": "ca-app-pub-xxxxx/aaaaa",
            "config": {
                "feed_interval": 5
            }
        },
        {
            "placement": "NOTI_STICKY",
            "unit_id": "ca-app-pub-xxxxx/bbbbb",
            "config": {}
        }
    ]
}
```

> **Phase별 반환 placement**
>
> - P1: `BANNER_MAIN`
> - P2 추가: `SPLASH`
> - P3 추가: `FEED_NATIVE`, `NOTI_STICKY`, `REWARDED_VIDEO`, `VIDEO_BANNER`

### 에러

| 코드 | 상황                   | 메시지                    |
| ---- | ---------------------- | ------------------------- |
| 400  | platform 파라미터 누락 | "platform은 필수입니다"   |
| 400  | 유효하지 않은 platform | "ANDROID 또는 IOS만 가능" |

## 구현 로직

```
1. platform 파라미터 검증 (ANDROID | IOS)
2. ad_units 테이블에서 platform + is_active=TRUE 조건 조회
3. placement_type, unit_id, config_json을 응답 배열로 매핑
4. config_json이 NULL이면 빈 객체({}) 반환
```

## 관련 스펙

- DB: `../../db/ads/ad-units.md`
- UI: `../../ui/ads/ad-components.md`
