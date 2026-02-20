---
type: api
phase: P1
uri: /api/v1/ads/*
method: TEXT
related:
    db:
        - specs/db/ads/ad_units.md
---

# [NEW] api-ads

## 1. 개요

광고 ID 및 정책을 조회하고 관리하는 API 세트입니다.

## 2. 변경 명세

### 2.1. [Public] 광고 설정 조회

- **URI**: `GET /api/v1/ads/config`
- **목적**: 앱 실행 시 활성화된 광고 단위 정보를 플랫폼별로 조회
- **Request**: `?platform=ANDROID|IOS`
- **Response**:
    ```json
    {
        "configs": [
            {
                "placement": "SPLASH",
                "unit_id": "ca-app-pub-...",
                "config": { "frequency_cap": 2 }
            }
        ]
    }
    ```

### 2.2. [Admin] 광고 단위 목록 조회

- **URI**: `GET /api/v1/admin/ads`
- **목적**: 어드민 대시보드에서 광고 단위 목록 관리

### 2.3. [Admin] 광고 단위 생성/수정

- **URI**: `POST /api/v1/admin/ads`, `PUT /api/v1/admin/ads/{id}`
- **Body**:
    ```json
    {
        "placement": "FEED_NATIVE",
        "platform": "ANDROID",
        "unit_id": "...",
        "is_active": true,
        "config": { "interval": 5 }
    }
    ```

## 🔍 확인 필요 사항

### 1. Admin API 권한

- [x] **Super Admin Only**: 광고 수익과 직결되므로 최고 관리자만 접근
- [ ] **Manager Allowed**: 운영팀도 접근 가능

### 2. Config 포맷

- [x] **JSON Flexible**: `config_json` 필드를 그대로 내려주어 클라이언트가 파싱 (유연함)
- [ ] **Defined Schema**: 서버가 해석하여 정해진 필드만 내려줌 (안전함)
