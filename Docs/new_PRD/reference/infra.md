# 인프라 및 성능

## 요약 ⚡

- AWS 기반 인프라 (EC2, RDS, S3, CloudWatch)
- Phase 1: t3.small EC2 1대 + t3.micro RDS ($30~50/월)
- Phase 2: 로드 밸런서 + Auto Scaling (2~5대) + Redis ($150~250/월)
- 목표 응답시간: API < 1초, 실시간 시세 < 2초
- 모니터링: CloudWatch + Firebase Crashlytics
- [P2-고려] Redis 캠싱, CDN, Multi-AZ, Read Replica

---

## Phase 1 (현재)

### 트래픽 예측

| 지표 | 값 |
|------|------|
| 예상 사용자 | 100~500명 (3개월) |
| 동시 접속자 (CCU) | 10~50명 |
| Peak Time | 평일 09:00~09:30, 15:00~15:30 |
| 일일 API 호출 | 1,000~10,000회 |
| 사용자당 호출 | 10~20회/일 |

### 인프라 구성

#### 애플리케이션 서버

| 항목 | 사양 |
|------|------|
| 클라우드 | AWS EC2 |
| 인스턴스 | t3.small (2 vCPU, 2GB RAM) |
| 운영체제 | Amazon Linux 2 |
| 스토리지 | 30GB gp3 SSD |
| 네트워크 | Public Subnet, Elastic IP |
| 보안 | Security Group (포트 80, 443, 22) |
| 예상 비용 | $15~20/월 |

**설치 소프트웨어**
- Java 17 (OpenJDK)
- Spring Boot 3.x
- Nginx (Reverse Proxy)
- Certbot (Let's Encrypt SSL)

#### 데이터베이스

| 항목 | 사양 |
|------|------|
| 클라우드 | AWS RDS MySQL 8.0 |
| 인스턴스 | t3.micro (1 vCPU, 1GB RAM) |
| 스토리지 | 20GB gp3 SSD |
| 백업 | 자동 백업 7일 보관 |
| 네트워크 | Private Subnet |
| 보안 | Security Group (포트 3306, EC2만 허용) |
| 예상 비용 | $15~20/월 |

**설정**
- Charset: utf8mb4
- Collation: utf8mb4_unicode_ci
- Encryption at Rest: 활성화 (AES-256)
- SSL/TLS: 강제

#### 스토리지

| 항목 | 사양 |
|------|------|
| 클라우드 | AWS S3 |
| 용도 | 프로필 사진, 백업 |
| 버킷 | `app-prod-uploads` |
| 접근 제어 | IAM Role (애플리케이션 서버만) |
| 예상 비용 | $1~5/월 |

#### 총 비용

| 항목 | 비용 |
|------|------|
| EC2 | $15~20 |
| RDS | $15~20 |
| S3 | $1~5 |
| 트래픽 | $5~10 |
| **합계** | **$30~50/월** |

### 응답시간 목표

| API | 목표 (P95) |
|-----|------|
| 로그인 | < 2초 |
| 토큰 갱신 | < 500ms |
| 포트폴리오 목록 | < 300ms |
| 포트폴리오 상세 | < 500ms |
| 종목 검색 | < 1초 |
| 실시간 시세 (단일) | < 1초 |
| 실시간 시세 (5~10개) | < 2초 |
| 리밸런싱 분석 | < 1초 |

**목표 근거**
- < 100ms: Instant (즉각)
- < 1초: Fast (빠름)
- < 3초: Acceptable (허용 범위)

### 데이터베이스 최적화

#### 인덱스 전략

```sql
-- users
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_google_id ON users(google_id);

-- portfolios
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_display_order ON portfolios(user_id, display_order);

-- stocks
CREATE INDEX idx_stocks_portfolio_id ON stocks(portfolio_id);
CREATE UNIQUE INDEX idx_stocks_portfolio_stock ON stocks(portfolio_id, stock_code);

-- notifications
CREATE INDEX idx_notifications_portfolio_id ON notifications(portfolio_id);
CREATE INDEX idx_notifications_enabled ON notifications(is_enabled, notification_time);
```

#### 커넥션 풀 설정

```yaml
spring:
  datasource:
    hikari:
      minimum-idle: 10
      maximum-pool-size: 50
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

### 모바일 성능 최적화

#### 초기 로딩

| 항목 | 목표 |
|------|------|
| 첫 화면 로딩 | < 3초 (4G) |
| 번들 크기 | < 5MB |
| 메모리 사용량 | < 100MB |

**최적화 방법**
- Code Splitting (Lazy Loading)
- 불필요한 라이브러리 제거
- 이미지 WebP 포맷, 500KB 이하

#### 렌더링 성능

| 항목 | 목표 |
|------|------|
| FPS | 60 FPS 유지 |
| 스크롤 | 랙 없음 |
| ANR (비율) | < 0.5% |

**최적화 방법**
- FlatList windowSize, maxToRenderPerBatch
- useMemo, useCallback
- React Query 중복 요청 방지

### 모니터링

#### 서버 모니터링

| 지표 | 목표 |
|------|------|
| CPU 사용률 | < 70% (Avg) |
| 메모리 사용률 | < 80% (Avg) |
| 디스크 I/O | < 70% (Avg) |
| API 응답시간 | P95 < 1초 |

#### 데이터베이스 모니터링

| 지표 | 목표 |
|------|------|
| 커넥션 수 | < 40 (Max 50) |
| 슬로우 쿼리 | > 1초 로깅 |
| 데드락 | 모니터링 및 알림 |

#### 모바일 모니터링

| 지표 | 목표 |
|------|------|
| 크래시율 | < 1% |
| ANR율 | < 0.5% |
| 앱 시작시간 | P95 < 3초 |

**도구**
- 서버: AWS CloudWatch
- 모바일: Firebase Crashlytics

---

## Phase 2+ (확장 고려사항)

### Phase 2 구성

#### 트래픽 예측

| 지표 | 값 |
|------|------|
| 예상 사용자 | 1,000~5,000명 (6개월) |
| 동시 접속자 (CCU) | 50~200명 |
| 일일 API 호출 | 10,000~100,000회 |

#### 인프라 구성

**애플리케이션 서버**

| 항목 | 사양 |
|------|------|
| 인스턴스 | t3.medium 2대 (4 vCPU, 4GB RAM) |
| Auto Scaling | 최소 2대, 최대 5대 |
| Load Balancer | Application Load Balancer |
| 예상 비용 | $80~150/월 |

**데이터베이스**

| 항목 | 사양 |
|------|------|
| 인스턴스 | t3.small (2 vCPU, 2GB RAM) |
| 스토리지 | 100GB gp3 SSD |
| Read Replica | 1대 (선택) |
| 예상 비용 | $50~80/월 |

**캠시 서버**

| 항목 | 사양 |
|------|------|
| 클라우드 | AWS ElastiCache Redis |
| 인스턴스 | t3.micro (0.5GB RAM) |
| 용도 | 실시간 시세, 세션 |
| 예상 비용 | $15~20/월 |

**총 비용**: $150~250/월

#### 캠싱 전략

**Redis 캠싱**

| 데이터 | Key | TTL |
|--------|-----|-----|
| 실시간 시세 | `stock:price:{code}` | 30초 |
| 사용자 세션 | `user:session:{id}` | 1시간 |
| 종목 검색 | `stock:search:{keyword}` | 1시간 |

**예상 효과**
- 한투 API 호출 50~70% 감소
- API 응답시간 30~50% 감소

#### Auto Scaling 설정

| 트리거 | 임계값 | 동작 |
|--------|----------|------|
| CPU 사용률 | > 70% (5분) | Scale Out (+1대) |
| CPU 사용률 | < 30% (10분) | Scale In (-1대) |
| 최소/최대 | 2대 / 5대 | - |

### Phase 3 구성

#### 트래픽 예측

| 지표 | 값 |
|------|------|
| 예상 사용자 | 10,000~50,000명 (1년) |
| 동시 접속자 (CCU) | 200~1,000명 |
| 일일 API 호출 | 100,000~500,000회 |

#### 인프라 구성

- [P3] **Multi-AZ 배포**
  - 고가용성 보장
  - 자동 장애 조치

- [P3] **CDN (CloudFront)**
  - 정적 리소스 캠싱
  - 전세계 엣지 노드

- [P3] **마이크로서비스**
  - 서비스 분리 (인증, 포트폴리오, 시세, 알림)
  - 독립적 확장 및 장애 격리

**총 비용**: $500~1,000/월

---

## 보안 설정

### 네트워크 구성

```
VPC
├── Public Subnet
│   ├── EC2 (Application Server)
│   └── Load Balancer (Phase 2)
└── Private Subnet
    ├── RDS (Database)
    └── ElastiCache (Phase 2)
```

### Security Group 규칙

**EC2 (Application Server)**

| 포트 | 프로토콜 | 소스 | 설명 |
|------|----------|------|------|
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |
| 22 | TCP | 관리자 IP | SSH |

**RDS (Database)**

| 포트 | 프로토콜 | 소스 | 설명 |
|------|----------|------|------|
| 3306 | TCP | EC2 SG | MySQL |

**ElastiCache (Redis, Phase 2)**

| 포트 | 프로토콜 | 소스 | 설명 |
|------|----------|------|------|
| 6379 | TCP | EC2 SG | Redis |

### IAM 역할

**EC2 Instance Role**
- S3 읽기/쓰기 (프로필 사진)
- CloudWatch Logs 쓰기
- RDS 연결

---

## CI/CD

### GitHub Actions Workflow

**빌드 및 배포**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
      - name: Build with Gradle
        run: ./gradlew build
      - name: Run tests
        run: ./gradlew test
      - name: Deploy to EC2
        run: |
          scp -i ${{ secrets.EC2_KEY }} target/*.jar ec2-user@${{ secrets.EC2_HOST }}:/app
          ssh -i ${{ secrets.EC2_KEY }} ec2-user@${{ secrets.EC2_HOST }} 'sudo systemctl restart app'
```

**모바일 앱 빌드**

- Expo EAS Build
- TestFlight (iOS) / Internal Testing (Android)
- 주간 빌드 배포

---

## 성능 테스트

### 부하 테스트

**도구**: Apache JMeter 또는 k6

**시나리오**
1. 로그인 (10 users/sec)
2. 포트폴리오 목록 조회 (50 users/sec)
3. 실시간 시세 조회 (30 users/sec)
4. 리밸런싱 분석 (20 users/sec)

**목표**
- 동시 사용자 100명 (예상 CCU의 2배)
- 에러율 < 1%
- P95 응답시간 < 1초

### 성능 테스트 일정

| Phase | 시점 |
|-------|------|
| Phase 1 | 출시 전 1회 |
| Phase 2 | 주요 기능 추가 시 |
| 정기 | 분기별 1회 |

---

## 비용 요약

| Phase | 서버 | 데이터베이스 | 캠시 | 기타 | 합계 |
|-------|------|------------|------|------|------|
| Phase 1 | $15~20 | $15~20 | - | $5~10 | **$30~50** |
| Phase 2 | $80~150 | $50~80 | $15~20 | $10~20 | **$150~250** |
| Phase 3 | $300~500 | $100~200 | $30~50 | $50~100 | **$500~1,000** |

---

## 팀 논의 필요 사항

- [ ] Phase 1 서버 스펙 최종 결정 (t3.small vs t3.micro)
- [ ] Redis 캠싱 도입 시점 (Phase 1 vs Phase 2)
- [ ] 모니터링 도구 예산 (CloudWatch vs New Relic vs DataDog)
- [ ] Auto Scaling 임계값 설정 (CPU 70% vs 80%)
- [ ] 부하 테스트 수행 주체 (팀 내부 vs 외주)
- [ ] 예상 트래픽 초과 시 비상 계획

---

## 체크리스트

### Phase 1 출시 전 필수

- [ ] AWS 계정 생성 및 VPC 구성
- [ ] EC2 인스턴스 생성 및 설정
- [ ] RDS 인스턴스 생성 및 설정
- [ ] S3 버킷 생성
- [ ] Security Group 규칙 설정
- [ ] SSL 인증서 발급 (Let's Encrypt)
- [ ] 도메인 연결 및 DNS 설정
- [ ] GitHub Actions CI/CD 구성
- [ ] CloudWatch 모니터링 설정
- [ ] 부하 테스트 수행

### Phase 2 목표

- [ ] Load Balancer 구성
- [ ] Auto Scaling Group 설정
- [ ] ElastiCache Redis 구성
- [ ] Read Replica 추가 (선택)
- [ ] APM 도구 도입 (선택)

---

## 관련 문서

- **기술 스택**: `core/tech-stack.md` - 기술 선택 근거
- **보안**: `reference/security.md` - 보안 설정
- **DB 스키마**: `reference/db-schema.md` - 데이터베이스 구조
- **API**: `reference/api-spec.md` - API 명세
- **배포**: `process/deployment.md` - 배포 프로세스

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: DevOps + Backend
