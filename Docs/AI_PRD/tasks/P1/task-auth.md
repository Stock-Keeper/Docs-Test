# Task: 인증 기능 구현 (Google OAuth + JWT)

## 목표

Google OAuth 2.0 로그인 + JWT 토큰 기반 인증 시스템 구현

## 스펙 참조

### API

- `../../specs/api/auth/google-callback.md`
- `../../specs/api/auth/refresh.md`
- `../../specs/api/auth/logout.md`
- `../../specs/api/auth/profile-update.md`

### DB

- `../../specs/db/users.md`
- `../../specs/db/refresh-tokens.md`

### UI

- `../../specs/ui/auth/login-screen.md`
- `../../specs/ui/auth/profile-input.md`

## 📎 선택 참조 (사용자 요청 시)

> 상세 UI/UX 시나리오가 필요하면 아래 파일을 참조 요청하세요.

- `../../reference/pages/01_login.md` - 로그인 플로우, 엣지케이스, 반응형 처리

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `AuthController` 생성
  - [ ] `POST /api/auth/google/callback` - Google OAuth 콜백
  - [ ] `POST /api/auth/refresh` - 토큰 갱신
  - [ ] `POST /api/auth/logout` - 로그아웃
- [ ] `UserController` 생성
  - [ ] `PUT /api/users/profile` - 프로필 입력/수정
- [ ] `AuthService` 생성
  - [ ] Google OAuth access_token 요청
  - [ ] Google 사용자 정보 조회
  - [ ] 신규/기존 사용자 처리
- [ ] `JwtTokenProvider` 생성
  - [ ] Access Token 생성 (HS256, 1시간)
  - [ ] Refresh Token 생성 (14일)
  - [ ] 토큰 검증
  - [ ] 페이로드 추출
- [ ] `User` 엔티티 생성
- [ ] `UserRepository` 생성
- [ ] `RefreshToken` 엔티티 생성
- [ ] `RefreshTokenRepository` 생성
- [ ] JWT 인증 필터 (`JwtAuthenticationFilter`)
- [ ] Rate Limiting 설정 (10회/분 per IP)

### Frontend (React Native)

- [ ] 로그인 화면 구현
  - [ ] 앱 로고 + 타이틀
  - [ ] Google 로그인 버튼
  - [ ] 약관 동의 문구 + 링크
- [ ] 프로필 입력 화면 구현
  - [ ] 프로필 이미지 표시
  - [ ] 닉네임 입력 (글자수 카운트)
  - [ ] 시작하기 버튼
- [ ] Google Sign-In 연동
  - [ ] `expo-auth-session` 또는 `react-native-google-signin`
- [ ] 토큰 저장
  - [ ] `expo-secure-store` 사용
- [ ] Axios 인터셉터 설정
  - [ ] 401 시 자동 토큰 갱신
  - [ ] 갱신 실패 시 로그아웃
- [ ] 네비게이션 처리
  - [ ] 신규 사용자 → 프로필 입력
  - [ ] 기존 사용자 → 홈

### Database

- [ ] `users` 테이블 생성
- [ ] `refresh_tokens` 테이블 생성

## 완료 조건

- [ ] Google 로그인 버튼 클릭 → JWT 토큰 발급
- [ ] 신규 사용자 → 프로필 입력 화면 → 홈
- [ ] 기존 사용자 → 바로 홈
- [ ] Access Token 만료 시 자동 갱신
- [ ] 로그아웃 시 토큰 무효화
- [ ] Secure Storage에 토큰 저장

## 테스트 케이스

| 케이스             | 예상 결과                                      |
| ------------------ | ---------------------------------------------- |
| 신규 사용자 로그인 | users 생성, is_new_user=true, 프로필 화면      |
| 기존 사용자 로그인 | last_login_at 업데이트, is_new_user=false, 홈  |
| 프로필 입력 완료   | is_profile_complete=true, 기본 포트폴리오 생성 |
| Access Token 만료  | Refresh로 자동 갱신                            |
| Refresh Token 만료 | 로그아웃 + 로그인 화면                         |
| 로그아웃           | refresh_tokens 삭제, 로그인 화면               |

## 예상 소요 시간

| 파트                 | 예상 시간     |
| -------------------- | ------------- |
| Backend - Auth       | 3일           |
| Backend - JWT        | 1일           |
| Frontend - 로그인    | 2일           |
| Frontend - 프로필    | 1일           |
| Frontend - 토큰 관리 | 1일           |
| 테스트               | 1일           |
| **총합**       | **9일** |
