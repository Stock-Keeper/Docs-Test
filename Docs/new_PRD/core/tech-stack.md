# 기술 스택 및 아키텍처

> 프로젝트에서 사용하는 모든 기술과 외부 서비스, 인프라 구성을 정리한 문서입니다.

---

## 요약 ⚡

React Native(Expo)로 모바일 앱을 개발하고, Spring Boot + MySQL로 백엔드 API를 구축합니다. Google OAuth 2.0으로 로그인하고 JWT 토큰으로 인증을 관리합니다. 한국투자증권 API로 실시간 주식 시세를 조회하며, AWS 인프라와 GitHub Actions로 CI/CD를 구성합니다. Phase 2에서 Redis 캠싱을 추가하여 성능을 개선합니다.

---

## 전체 아키텍처

```
[모바일 앱]
  React Native (Expo)
  │
  │ HTTPS
  ↓
[로드 밸런서]  ←─────── AWS ELB (Elastic Load Balancer)
  │
  ↓
[백엔드 API 서버]
  Spring Boot 3.x
  │
  ├──→ [MySQL]       ←── RDS (AWS)
  ├──→ [Redis]        ←── [P2] 캠싱
  ├──→ [한투 API]     ←── 주식 시세
  └──→ [Google OAuth] ←── 소셜 로그인
```

---

## Frontend

### React Native (Expo)

**선택 이유**:
- iOS와 Android 동시 개발 가능
- Expo로 빠른 프로토타이핑 및 배포 가능
- 풍부한 커뮤니티와 라이브러리

**버전**:
- React Native: `0.74+`
- Expo SDK: `51+`
- Node.js: `18+ (LTS)`

**주요 라이브러리**:

| 라이브러리 | 용도 | 버전 |
|----------|------|------|
| `expo` | Expo 프레임워크 | 51+ |
| `react-navigation` | 화면 네비게이션 | 6.x |
| `axios` | HTTP 클라이언트 | 1.x |
| `react-native-paper` or `NativeBase` | UI 컴포넌트 | TBD |
| `expo-secure-store` | 토큰 저장 | - |
| `react-native-chart-kit` or `Victory Native` | `[P2]` 차트 | TBD |
| `expo-notifications` | `[P1]` Push 알림 | - |

### 상태 관리

**Phase 1**: React Context API
- 간단한 전역 상태 관리
- 로그인 상태, 포트폴리오 목록 등

**Phase 2**: Zustand 또는 Redux Toolkit
- 복잡도 증가 시 도입 검토
- 캐싱, 미들웨어 지원

### 스타일링

- React Native StyleSheet + Flexbox
- `styled-components` 또는 UI 라이브러리 내장 스타일
- 다크 모드 `[P2-고려]` (AsyncStorage에 설정 저장)

---

## Backend

### Spring Boot

**선택 이유**:
- 엔터프라이즈급 안정성
- Spring Security로 인증/인가 간편하게 구현
- JPA로 DB 접근 추상화

**버전**:
- Spring Boot: `3.2+`
- Java: `17 (LTS)`
- Gradle: `8.x`

**주요 라이브러리**:

| 라이브러리 | 용도 |
|----------|------|
| `spring-boot-starter-web` | REST API |
| `spring-boot-starter-data-jpa` | ORM (Hibernate) |
| `spring-boot-starter-security` | 인증/인가 |
| `spring-boot-starter-oauth2-client` | Google OAuth |
| `jjwt` (io.jsonwebtoken) | JWT 처리 |
| `mysql-connector-java` | MySQL 드라이버 |
| `spring-boot-starter-data-redis` | `[P2]` Redis 캠싱 |
| `lombok` | Boilerplate 코드 감소 |
| `spring-boot-starter-validation` | 입력값 검증 |

### 레이어 구조

```
Controller (REST API 엔드포인트)
   ↓
Service (비즈니스 로직)
   ↓
Repository (DB 접근)
   ↓
Entity (JPA 엔티티)
```

**DTO 패턴**: Request/Response DTO로 Entity 분리

---

## Database

### MySQL 8.0

**선택 이유**:
- 가장 널리 사용되는 관계형 DB
- AWS RDS 지원
- JSON 필드 지원 (8.0+)

**호스팅**: AWS RDS
- Multi-AZ `[P2]` (고가용성)
- 자동 백업 (7일 보관)

**주요 설정**:
- Character Set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`
- Storage Engine: `InnoDB`

### 주요 테이블

> 상세 스키마는 `reference/db-schema.md` 참조

- `users` - 사용자 정보
- `portfolios` - 포트폴리오
- `stocks` - 종목 보유 내역
- `notifications` - 알림 설정
- `refresh_tokens` - Refresh Token 관리

### Redis (Phase 2)

**용도**:
- 주식 시세 캠싱 (30초~1분 TTL)
- API 요청 횟수 제한 (Rate Limiting)

**호스팅**: AWS ElastiCache for Redis

---

## 외부 API

### 한국투자증권 API

**공식 문서**: [https://apiportal.koreainvestment.com/apiservice](https://apiportal.koreainvestment.com/apiservice)

**사용 API**:

| API | 용도 | Phase |
|-----|------|-------|
| 국내주식시세 API | 실시간 시세 조회 | P1 |
| 종목검색 API | 종목명/코드 검색 | P1 |

**인증 방식**:
- OAuth 2.0 기반 접근토큰
- App Key 및 App Secret 필요 (환경변수 관리)
- Access Token 유효기간: 24시간

**호출 제한**:
- 분당: 20~30회 (API 문서 확인 필요)
- 일당: TBD
- **대응**: Redis 캠싱(P2), 배치 요청, Rate Limiting

**제약사항**:
- 장 운영 시간: 평일 09:00-15:30
- 데이터 지연: 실시간 또는 분 단위 가능

### Google OAuth 2.0

**공식 문서**: [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)

**요청 권한 (Scope)**:
- `openid` - OpenID Connect (필수)
- `email` - 이메일 주소
- `profile` - 이름, 프로필 사진

**클라이언트 설정**:
- 발급 위치: Google Cloud Console
- Redirect URI:
  - 개발: `exp://localhost:19000`
  - 프로덕션: `yourapp://auth/callback` 또는 Custom Scheme

**수집 정보**:
- 이메일 (필수)
- 이름
- 프로필 사진 URL
- Google User ID

---

## 인증 및 보안

### JWT 토큰 정책

**Access Token**:
- 유효기간: `1시간 (3600초)`
- 저장 위치: React Native Secure Storage
- 페이로드:
  ```json
  {
    "user_id": "UUID",
    "email": "user@example.com",
    "name": "사용자명",
    "role": "user",
    "iat": 1234567890,
    "exp": 1234571490
  }
  ```

**Refresh Token**:
- 유효기간: `14일 (1209600초)`
- 저장 위치:
  - 클라이언트: Secure Storage (암호화)
  - 서버: DB에 해시값 저장
- 갱신 로직:
  1. API 요청 시 401 에러 발생
  2. Refresh Token으로 자동 갱신
  3. 실패 시 로그아웃

**암호화 알고리즘**:
- HS256 (HMAC-SHA256)
- Secret Key: 환경변수로 관리 (256-bit 이상)

### 보안 요구사항

> 상세 내용은 `reference/security.md` 참조

- `[P1]` HTTPS 강제 (프로덕션)
- `[P1]` Input Validation (모든 입력값 검증)
- `[P1]` SQL Injection 방지 (JPA Prepared Statement)
- `[P1]` XSS 방어 (React Native 기본 + Sanitization)
- `[P1]` Rate Limiting (분당 60회)
- `[P2]` Certificate Pinning
- `[P2]` Code Obfuscation

---

## 인프라

### AWS 서비스

| 서비스 | 용도 | Phase |
|---------|------|-------|
| EC2 | 백엔드 API 서버 | P1 |
| RDS (MySQL) | 데이터베이스 | P1 |
| S3 | 프로필 이미지 저장 | P1 |
| ELB | 로드 밸런서 | P2 |
| ElastiCache (Redis) | 캠싱 | P2 |
| CloudWatch | 모니터링 & 로그 | P1 |

### EC2 인스턴스

**Phase 1**:
- 인스턴스 타입: `t3.small` (2 vCPU, 2GB RAM)
- OS: Ubuntu 22.04 LTS
- 단일 인스턴스

**Phase 2**:
- Auto Scaling 그룹
- 최소 2개, 최대 4개 인스턴스

### RDS 설정

**Phase 1**:
- 인스턴스 클래스: `db.t3.micro`
- 스토리지: 20GB (General Purpose SSD)
- Single-AZ

**Phase 2**:
- Multi-AZ (고가용성)
- Read Replica (읽기 성능 향상)

### 백업 정책

- 자동 백업: 매일 새벽 3시 (KST)
- 보관 기간: 7일
- Point-in-Time Recovery: 최근 7일 내 복구 가능

---

## CI/CD

### GitHub Actions

**Frontend (모바일 앱)**:

```yaml
Workflow:
1. Push to main branch
2. 코드 린팅 (ESLint)
3. 단위 테스트 (Jest)
4. [P1] Expo EAS Build
5. [P2] TestFlight / Google Play Beta 배포
```

**Backend (API 서버)**:

```yaml
Workflow:
1. Push to main branch
2. 코드 린팅 (Checkstyle)
3. 단위 테스트 (JUnit)
4. Docker 이미지 빌드
5. AWS EC2에 배포 (SSH)
6. Health Check
```

### Expo EAS

**빌드**:
- EAS Build로 네이티브 앱 빌드
- iOS: `.ipa` 파일
- Android: `.apk` 또는 `.aab` 파일

**배포**:
- `[P1]` 테스트: Expo Go
- `[P2]` 베타: TestFlight (iOS), Google Play Beta (Android)
- `[P3]` 프로덕션: App Store, Google Play Store

---

## 개발 환경

### 필수 도구

| 도구 | 버전 | 용도 |
|------|--------|------|
| Node.js | 18+ (LTS) | Frontend 빌드 |
| npm / yarn | 최신 | 패키지 관리 |
| Java | 17 (LTS) | Backend 개발 |
| Gradle | 8.x | Backend 빌드 |
| MySQL | 8.0 | 로컬 DB |
| Docker | 최신 | 컨테이너화 |
| Git | 최신 | 버전 관리 |

### IDE 및 에디터

- **Frontend**: VS Code + ESLint + Prettier
- **Backend**: IntelliJ IDEA 또는 Eclipse
- **DB**: DBeaver 또는 MySQL Workbench

### 환경변수

**Frontend (`.env`)**:
```bash
API_BASE_URL=https://api.example.com
GOOGLE_CLIENT_ID=your-client-id
```

**Backend (`application.yml`)**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sms_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  
jwt:
  secret: ${JWT_SECRET}
  access-token-validity: 3600
  refresh-token-validity: 1209600

kis: # 한국투자증권
  app-key: ${KIS_APP_KEY}
  app-secret: ${KIS_APP_SECRET}
```

---

## 마이그레이션 및 룰백

### 마이그레이션 전략

**Phase 1 → Phase 2**:
- `portfolios` 테이블에 `is_public`, `share_token` 컬럼 추가
- `stocks` 테이블의 `quantity` 타입 `DECIMAL(15,4)`로 변경

**마이그레이션 도구**:
- Flyway 또는 Liquibase
- 버전 관리된 SQL 스크립트

### 룰백 계획

각 Phase의 마이그레이션은 룰백 스크립트를 함께 작성하여 문제 발생 시 이전 버전으로 복구 가능해야 합니다.

---

## 팀 논의 필요 사항

- [ ] UI 라이브러리 최종 결정 (React Native Paper vs NativeBase)
- [ ] 차트 라이브러리 최종 결정 (Phase 2)
- [ ] AWS 인스턴스 타입 최종 확정 (비용 vs 성능)
- [ ] Expo EAS vs React Native CLI 선택
- [ ] Flyway vs Liquibase 마이그레이션 도구

---

## 관련 문서

- **프로젝트 개요**: `core/overview.md`
- **DB 스키마**: `reference/db-schema.md`
- **API 명세**: `reference/api-spec.md`
- **보안 체크리스트**: `reference/security.md`
- **인프라 구성**: `reference/infra.md`
- **배포 가이드**: `reference/deployment.md`

---

> 📅 **마지막 업데이트**: 2025-12-31  
> 📝 **문서 버전**: 1.0.0  
> 🛠️ **기술 스택 최종 확정**: 2026-01 예정
