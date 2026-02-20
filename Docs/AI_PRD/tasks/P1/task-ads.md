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

# Task: 인앱 광고 시스템 구현

## 목표

인앱 광고 표시 (스플래시, 배너, 네이티브, 알림형) 및 관리자 광고 단위 CRUD

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

- [ ] 스플래시 전면 광고 (Interstitial)
    - [ ] 앱 시작 시 1회 표시
    - [ ] 3초 타이머 자동 닫힘
    - [ ] 닫기(X) 버튼
- [ ] 하단 배너 광고 (Banner)
    - [ ] 메인 화면 하단 고정
    - [ ] 자동 갱신 (refresh_interval 기반)
- [ ] 네이티브 인피드 광고 (Native)
    - [ ] 피드 목록 내 삽입 (feed_interval 기반)
    - [ ] 커스텀 레이아웃 (앱 UI 일관성)
    - [ ] "광고" 라벨 표시
- [ ] 알림 고정 배너 (Sticky)
    - [ ] 알림 센터 최상단 고정
    - [ ] 닫기 가능 (세션당 1회만 다시 표시)
- [ ] AdMob SDK 연동
    - [ ] `react-native-google-mobile-ads`
    - [ ] 앱 시작 시 광고 설정 fetch
    - [ ] Unit ID 동적 적용

### Database

- [ ] `ad_units` 테이블 생성
- [ ] 초기 데이터 시딩 (AOS/iOS × 4 placement)

## 완료 조건

- [ ] 스플래시 광고 앱 시작 시 표시
- [ ] 메인 하단 배너 표시 및 자동 갱신
- [ ] 피드 내 네이티브 광고 정상 삽입
- [ ] 알림 센터 상단 스티키 배너 표시
- [ ] 관리자 광고 단위 CRUD 작동
- [ ] 광고 비활성화 시 클라이언트에서 미표시

## 예상 소요 시간

| 파트                     | 예상 시간 |
| ------------------------ | --------- |
| Backend - 광고 설정 API  | 1일       |
| Backend - Admin CRUD     | 1일       |
| Frontend - 스플래시      | 1일       |
| Frontend - 배너/네이티브 | 2일       |
| Frontend - 알림 배너     | 0.5일     |
| AdMob 연동/테스트        | 1.5일     |
| **총합**                 | **7일**   |
