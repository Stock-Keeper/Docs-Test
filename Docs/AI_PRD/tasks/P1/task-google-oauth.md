# Task 001: Google OAuth 로그인 구현

## 목표
Google OAuth 2.0 기반 소셜 로그인 구현 (신규/기존 사용자 처리)

## 스펙 참조
- API: `../../specs/api/auth-google.md`
- DB: `../../specs/db/users.md`
- UI: `../../specs/ui/login-screen.md`

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `AuthController` 생성
  - [ ] `POST /api/auth/google/callback` 엔드포인트
- [ ] `AuthService` 생성
  - [ ] Google OAuth access_token 요청 로직
  - [ ] Google 사용자 정보 조회 로직
  - [ ] 신규/기존 사용자 분기 처리
- [ ] `JwtTokenProvider` 생성
  - [ ] Access Token 생성 (HS256, 1시간)
  - [ ] Refresh Token 생성 (14일)
  - [ ] 토큰 검증 로직
- [ ] `User` 엔티티 생성
- [ ] `UserRepository` 생성
- [ ] `RefreshToken` 엔티티 및 Repository 생성

### Frontend (React Native)

- [ ] 로그인 화면 UI 구현
  - [ ] 앱 로고 표시
  - [ ] Google 로그인 버튼
  - [ ] 약관 동의 문구
- [ ] Google Sign-In 연동
  - [ ] `expo-auth-session` 또는 `react-native-google-signin`
- [ ] OAuth 플로우 처리
  - [ ] authorization_code 획득
  - [ ] 백엔드 API 호출
- [ ] 토큰 저장
  - [ ] `expo-secure-store` 사용
- [ ] 화면 이동 로직
  - [ ] 신규 → 프로필 입력 화면
  - [ ] 기존 → 홈 화면

### Database

- [ ] `users` 테이블 생성
- [ ] `refresh_tokens` 테이블 생성

## 완료 조건

- [ ] Google 로그인 버튼 클릭 → JWT 토큰 발급
- [ ] 신규 사용자 → users 테이블 레코드 생성 → 프로필 입력 화면
- [ ] 기존 사용자 → last_login_at 업데이트 → 홈 화면
- [ ] 토큰이 Secure Storage에 저장됨

## 테스트 케이스

| 케이스 | 예상 결과 |
|--------|----------|
| 신규 사용자 로그인 | users에 새 레코드, is_new_user=true |
| 기존 사용자 로그인 | last_login_at 업데이트, is_new_user=false |
| 잘못된 인증 코드 | 401 에러 |
| 네트워크 오류 | 에러 토스트 표시 |

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| Backend | 3일 |
| Frontend | 2일 |
| 테스트 | 1일 |
| **총합** | **6일** |
