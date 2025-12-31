# 인증 (Authentication)

## 요약 ⚡

- Google OAuth 2.0 소셜 로그인으로 회원가입/로그인 통합
- JWT 토큰 기반 인증 (Access 1시간, Refresh 14일)
- 자동 토큰 갱신으로 사용자 경험 최적화
- [P1] 기본 인증 플로우 / [P2] 다중 기기 관리 / [P3] 생체 인증
- 보안: HTTPS 필수, Secure Storage 사용, Rate Limiting 적용

---

## Phase 1 (현재)

### 기능 목록

- [x] Google OAuth 2.0 소셜 로그인
- [x] JWT 토큰 발급 (Access + Refresh)
- [x] 자동 토큰 갱신
- [x] 로그아웃 (토큰 무효화)
- [x] 최초 로그인 시 프로필 입력
- [ ] 토큰 만료 시 자동 재로그인 유도

### 상세 규칙

#### 1. Google OAuth 2.0 로그인

| 항목 | 규칙 |
|------|------|
| **요청 권한** | email, profile, openid (필수) |
| **수집 정보** | 이메일(필수), 이름, Google User ID, 프로필 사진 URL |
| **신규 사용자** | users 테이블에 자동 생성 → 프로필 입력 화면 이동 |
| **기존 사용자** | 바로 메인 화면 이동 |
| **에러 처리** | OAuth 실패 시 에러 메시지 표시 + 재시도 버튼 |

#### 2. JWT 토큰 정책

| 토큰 종류 | 유효기간 | 저장 위치 | 페이로드 |
|----------|----------|----------|----------|
| **Access Token** | 1시간 | React Native Secure Storage | user_id, email, name, role, iat, exp |
| **Refresh Token** | 14일 | Secure Storage + DB 해시값 | user_id, iat, exp |

**암호화 알고리즘**: HS256 (HMAC-SHA256)  
**Secret Key**: 환경변수로 관리 (`.env` 파일, 코드 하드코딩 금지)

#### 3. 자동 토큰 갱신

```
플로우:
1. API 요청 시 401 Unauthorized 발생
2. Refresh Token으로 새 Access Token 자동 요청
3. 새 토큰으로 원래 요청 재시도
4. 갱신 실패 시 → 로그아웃 → 로그인 화면 이동
```

| 항목 | 규칙 |
|------|------|
| **갱신 시점** | API 응답 401 에러 발생 시 |
| **갱신 실패** | 로그아웃 처리 + 토스트 메시지 "다시 로그인해주세요" |
| **동시 요청 처리** | 첫 401 발생 시만 갱신 요청, 나머지는 대기 후 재시도 |

#### 4. 로그아웃

| 항목 | 처리 |
|------|------|
| **클라이언트** | Secure Storage의 토큰 삭제 |
| **서버** | Refresh Token DB에서 삭제 (무효화) |
| **이동** | 로그인 화면으로 이동 |

#### 5. 프로필 입력 (최초 로그인)

| 항목 | 규칙 |
|------|------|
| **닉네임** | 필수, 1~20자 |
| **프로필 사진** | 선택, Google 프로필 사진 기본값 |
| **입력 완료** | users 테이블 업데이트 → 기본 포트폴리오 자동 생성 → 메인 화면 |
| **검증** | 닉네임 중복 검사 없음 (Phase 1) |

---

## Phase 2+ (확장 고려사항)

### [P2] 다중 기기 관리

- Refresh Token을 device_tokens 테이블로 분리
- 사용자당 최대 5개 기기 동시 로그인
- 기기 목록 확인 및 원격 로그아웃 기능

**P1 설계 시 고려사항**:
- [P2-고려] users 테이블에 `last_login_device` 컬럼 예약
- Refresh Token을 user_id와 함께 저장 (device_id 추가 준비)

### [P2] 보안 강화

- 로그인 실패 5회 시 5분간 계정 잠금
- 비정상적인 로그인 시도 알림 (다른 국가, 새 기기)
- Certificate Pinning (API 서버 인증서 고정)

**P1 설계 시 고려사항**:
- [P2-고려] login_attempts 테이블 구조 미리 설계
- CloudWatch 로그 수집 설정 (로그인 이벤트)

### [P3] 생체 인증

- 지문/Face ID 로그인 (Access Token 재발급 없이 앱 접근)
- 로컬에 암호화된 토큰 저장 후 생체 인증으로 복호화

**현재 영향 없음** - Phase 1/2 구현과 독립적

### [P3] 소셜 로그인 확장

- Apple Login (iOS 필수 정책 대응)
- Kakao/Naver Login (한국 사용자 편의성)

**P1 설계 시 고려사항**:
- [P3-고려] users 테이블에 `provider` 컬럼 추가 (google, apple, kakao 등)
- OAuth 로직을 전략 패턴으로 구현 (확장성 확보)

---

## API 엔드포인트

### 1. Google OAuth 콜백

```
POST /api/auth/google/callback
```

**Request Body**:
```json
{
  "authorization_code": "string",
  "redirect_uri": "string"
}
```

**Response**:
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "is_new_user": true
  }
}
```

### 2. 토큰 갱신

```
POST /api/auth/refresh
```

**Request Body**:
```json
{
  "refresh_token": "string"
}
```

**Response**:
```json
{
  "access_token": "string"
}
```

### 3. 로그아웃

```
POST /api/auth/logout
```

**Request Headers**:
```
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "message": "로그아웃 되었습니다"
}
```

---

## 보안 요구사항

### Phase 1 필수

| 항목 | 규칙 |
|------|------|
| **HTTPS** | 프로덕션 환경 필수, 개발은 localhost 허용 |
| **Secure Storage** | JWT 토큰 암호화 저장 (React Native Secure Storage) |
| **Secret Key** | 환경변수 관리, Git에 커밋 금지 |
| **Rate Limiting** | 인증 API: 10회/분 per IP |
| **로그** | 로그인/로그아웃/토큰 갱신 이벤트 CloudWatch 기록 |
| **토큰 무효화** | 로그아웃 시 Refresh Token DB에서 삭제 |

### 에러 처리

| 시나리오 | 처리 |
|----------|------|
| Google OAuth 실패 | 에러 메시지 표시 + 재시도 버튼 |
| Access Token 만료 | Refresh Token으로 자동 갱신 |
| Refresh Token 만료 | 로그아웃 + "다시 로그인해주세요" 메시지 |
| API Rate Limit 초과 | 429 에러 + "잠시 후 다시 시도해주세요" |
| 네트워크 에러 | 재시도 버튼 + 오프라인 안내 |

---

## 관련 문서

- **DB**: `reference/db-schema.md#users`, `reference/db-schema.md#refresh_tokens`
- **API**: `reference/api-spec.md#auth-endpoints`
- **보안**: `reference/security.md#authentication`
- **인프라**: `reference/infra.md#oauth-setup`

---

## 개발 가이드

### 프론트엔드 (React Native)

1. **Google OAuth 라이브러리**: `expo-auth-session` 또는 `react-native-google-signin`
2. **토큰 저장**: `expo-secure-store` 또는 `react-native-keychain`
3. **HTTP 클라이언트**: `axios` (인터셉터로 401 자동 처리)

### 백엔드 (Spring Boot)

1. **JWT 라이브러리**: `jjwt` (io.jsonwebtoken)
2. **OAuth 클라이언트**: Spring Security OAuth2 Client
3. **Rate Limiting**: Spring Cloud Gateway 또는 Bucket4j

---

> 📅 **작성일**: 2025-12-31  
> 📝 **Phase**: Phase 1 (MVP)  
> 🔐 **중요도**: 필수 (Blocker)
