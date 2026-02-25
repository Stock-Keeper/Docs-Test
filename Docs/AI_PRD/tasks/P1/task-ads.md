---
type: task
phase: P1
domain: ads
status: not-started

specs:
    api:
        - ads/config.md
        - admin/ads.md
    db:
        - ads/ad-units.md
    ui:
        - ads/ad-components.md

tech:
    backend: spring-boot
    frontend: react-native
---

# Task: 인앱 광고 시스템 기초 구현 (P1)

## 목표

인앱 광고 표시 시스템 기초 (P1: 하단 배너) 구현 및 관리자 기능 추가

> [!NOTE]
> P1에서는 하단 배너 광고만 구현합니다.

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `AdConfigController` 생성
    - [ ] `GET /api/v1/ads/config?platform=ANDROID|IOS` - 활성 광고 설정 조회
- [ ] `AdminAdsController` 생성
    - [ ] `GET /api/v1/admin/ads` - 광고 단위 목록
    - [ ] `POST /api/v1/admin/ads` - 광고 단위 생성
    - [ ] `PUT /api/v1/admin/ads/{id}` - 광고 단위 수정
- [ ] `AdConfigService` 생성
    - [ ] 플랫폼별 활성 광고 조회 로직
    - [ ] config_json 파싱 및 응답 변환
- [ ] 엔티티 생성
    - [ ] `AdUnit` (placement_type, platform, provider, unit_id, config_json)
- [ ] Repository 생성
    - [ ] `findByPlatformAndIsActiveTrue(platform)`

### Frontend (React Native)

- [ ] 하단 배너 광고 (Banner)
    - [ ] 메인 화면 하단 고정
    - [ ] 자동 갱신 (refresh_interval 기반)
    - [ ] 관심 종목, 자산 현황 탭 하단에도 적용
- [ ] AdMob SDK 연동
    - [ ] `react-native-google-mobile-ads`
    - [ ] 앱 시작 시 광고 설정 fetch
    - [ ] Unit ID 동적 적용

### Database

- [ ] `ad_units` 테이블 생성
- [ ] 초기 데이터 시딩 (P1: BANNER_MAIN만)

## 완료 조건

- [ ] 메인 하단 배너 표시 및 자동 갱신
- [ ] 관리자 광고 단위 CRUD 작동
- [ ] 광고 비활성화 시 클라이언트에서 미표시

## 예상 소요 시간

| 파트                    | 예상 시간 |
| ----------------------- | --------- |
| Backend - 광고 설정 API | 1일       |
| Backend - Admin CRUD    | 1일       |
| Frontend - 배너 광고    | 1일       |
| AdMob 연동/테스트       | 1.5일     |
| **총합**                | **4.5일** |
