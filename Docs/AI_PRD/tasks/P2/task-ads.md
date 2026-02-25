---
type: task
phase: P2
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

# Task: 전면 광고 추가 도입

## 목표

앱 콜드 스타트 시 노출되는 스플래시 전면 광고(Interstitial) 연동 및 해당 광고 단위 활성화

## 구현 체크리스트

### Frontend (React Native)

- [ ] 스플래시 전면 광고 (Interstitial)
    - [ ] 앱 시작 시 1회 표시
    - [ ] 3초 타이머 자동 닫힘
    - [ ] 닫기(X) 버튼

### Database

- [ ] 초기 데이터 시딩 (P2: SPLASH 추가)

## 완료 조건

- [ ] 스플래시 광고 앱 시작 시 정상 표시 및 동작

## 예상 소요 시간

| 파트                | 예상 시간 |
| ------------------- | --------- |
| Frontend - 스플래시 | 1일       |
| **총합**            | **1일**   |
