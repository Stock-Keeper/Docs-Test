---
type: task
phase: P3
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

# Task: 커뮤니티 네이티브 및 알림 광고 도입

## 목표

커뮤니티 피드 리스트 사이의 네이티브 인피드 광고 및 알림 센터 고정 배너 연동

## 구현 체크리스트

### Frontend (React Native)

- [ ] 네이티브 인피드 광고 (Native)
    - [ ] 피드 목록 내 삽입 (feed_interval 기반)
    - [ ] 커스텀 레이아웃 (앱 UI 일관성)
    - [ ] "광고" 라벨 표시
- [ ] 알림 고정 배너 (Sticky)
    - [ ] 알림 센터 최상단 고정
    - [ ] 닫기 가능 (세션당 1회만 다시 표시)

### Database

- [ ] 초기 데이터 시딩 (P3: FEED_NATIVE, NOTI_STICKY 추가)

## 완료 조건

- [ ] 피드 내 네이티브 광고 정상 삽입
- [ ] 알림 센터 상단 스티키 배너 표시

## 예상 소요 시간

| 파트                     | 예상 시간 |
| ------------------------ | --------- |
| Frontend - 배너/네이티브 | 1.5일     |
| Frontend - 알림 배너     | 0.5일     |
| **총합**                 | **2일**   |
