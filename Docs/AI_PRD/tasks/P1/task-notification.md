# Task: 알림 기능 구현 (FCM + 알림 센터)

## 목표
리밸런싱 알림, 푸시(FCM), 알림 센터, 알림 설정 기능 구현

## 스펙 참조

### API
- `../../specs/api/notification/list.md`
- `../../specs/api/notification/read.md`
- `../../specs/api/notification/settings.md`
- `../../specs/api/notification/fcm-token.md`

### DB
- `../../specs/db/notifications.md`
- `../../specs/db/notification-settings.md`

### UI
- `../../specs/ui/notification/center.md`
- `../../specs/ui/notification/settings.md`

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `NotificationController` 생성
  - [ ] `GET /api/notifications` - 알림 목록
  - [ ] `PATCH /api/notifications/{id}/read` - 읽음 처리
  - [ ] `PATCH /api/notifications/read-all` - 전체 읽음
  - [ ] `DELETE /api/notifications/{id}` - 알림 삭제
- [ ] `NotificationSettingsController` 생성
  - [ ] `GET /api/notifications/settings` - 설정 조회
  - [ ] `PUT /api/notifications/settings` - 설정 수정
- [ ] `FcmController` 생성
  - [ ] `POST /api/notifications/fcm-token` - 토큰 등록
  - [ ] `DELETE /api/notifications/fcm-token` - 토큰 삭제
- [ ] `NotificationService` 생성
  - [ ] FCM 푸시 발송 로직
  - [ ] 알림 저장 로직
- [ ] `RebalancingNotificationScheduler` 생성
  - [ ] 배치 잡 (매시 정각)
  - [ ] 알림 대상자 조회
  - [ ] 리밸런싱 필요 여부 확인
  - [ ] FCM + DB 알림 발송
- [ ] 엔티티 생성
  - [ ] `Notification`
  - [ ] `NotificationSetting`
  - [ ] `PortfolioNotificationSetting`
  - [ ] `FcmToken`
- [ ] Repository 생성
- [ ] FCM 암호화/복호화 유틸

### Frontend (React Native)

- [ ] 알림 센터 화면
  - [ ] 알림 목록 (무한 스크롤)
  - [ ] 읽음/미읽음 표시
  - [ ] 스와이프 삭제
  - [ ] 전체 읽음 버튼
- [ ] 알림 설정 화면
  - [ ] 전체 토글
  - [ ] 주기 선택 (라디오)
  - [ ] 시간 선택 (피커)
  - [ ] 포트폴리오별 토글/임계값
- [ ] 홈 화면 벨 아이콘
  - [ ] 미읽음 배지 표시
- [ ] FCM 연동
  - [ ] `expo-notifications` 또는 `react-native-firebase`
  - [ ] 토큰 등록/갱신
  - [ ] 푸시 수신 시 네비게이션
- [ ] 알림 권한 요청 UI

### Database

- [ ] `notifications` 테이블 생성
- [ ] `notification_settings` 테이블 생성
- [ ] `portfolio_notification_settings` 테이블 생성
- [ ] `fcm_tokens` 테이블 생성

## 완료 조건

- [ ] FCM 푸시 알림 수신
- [ ] 알림 센터에 알림 목록 표시
- [ ] 알림 클릭 시 해당 포트폴리오 이동
- [ ] 알림 설정 저장/조회
- [ ] 포트폴리오별 알림 ON/OFF
- [ ] 배치 잡으로 자동 알림 발송

## 테스트 케이스

| 케이스 | 예상 결과 |
|--------|----------|
| FCM 토큰 등록 | DB에 암호화 저장 |
| 알림 목록 조회 | 최근 30일 알림, 최신순 |
| 알림 읽음 처리 | is_read=true, 배지 감소 |
| 전체 읽음 | 모든 알림 is_read=true |
| 알림 설정 수정 | DB 저장, 즉시 반영 |
| 배치 실행 (임계값 초과) | FCM 발송 + DB 저장 |
| 배치 실행 (임계값 이하) | 알림 발송 안 함 |
| 알림 권한 거부 | 권한 요청 안내 표시 |

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| Backend - API | 3일 |
| Backend - 배치 | 2일 |
| Backend - FCM | 2일 |
| Frontend - 알림 센터 | 2일 |
| Frontend - 설정 | 1일 |
| Frontend - FCM 연동 | 2일 |
| 테스트 | 2일 |
| **총합** | **14일** |
