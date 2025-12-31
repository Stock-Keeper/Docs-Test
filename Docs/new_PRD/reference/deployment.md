# 배포 및 CI/CD

## 요약 ⚡

- **CI/CD**: GitHub Actions
- **백엔드**: AWS EC2 + 자동 배포
- **프론트엔드**: Expo EAS Build + TestFlight/Google Play
- **배포 주기**: Phase 1 주간, Phase 2+ 2주
- **환경**: Dev (develop) → Staging (release) → Production (main)

---

## Phase 1 (현재)

### 배포 환경

```
┌─────────────┐
│   develop    │ → Dev 환경 (dev-api.stock-keeper.com)
└──────┬──────┘
       │
       v
┌─────────────┐
│   release    │ → Staging 환경 (staging-api.stock-keeper.com)
└──────┬──────┘
       │
       v
┌─────────────┐
│     main     │ → Production 환경 (api.stock-keeper.com)
└─────────────┘
```

### 환경별 설정

| 환경 | 브랜치 | 서버 | DB | 배포 트리거 |
|------|--------|------|----|-----------|
| **Dev** | `develop` | AWS EC2 t3.micro | AWS RDS dev | 커밋 푸시 |
| **Staging** | `release` | AWS EC2 t3.small | AWS RDS staging | PR 머지 → release |
| **Production** | `main` | AWS EC2 t3.small | AWS RDS prod | 태그 발행 (v1.0.0) |

---

## 백엔드 배포

### CI/CD 파이프라인

#### GitHub Actions Workflow

**파일**: `.github/workflows/backend-deploy.yml`

```yaml
name: Backend Deploy

on:
  push:
    branches: [main, develop]
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'adopt'
      
      - name: Build with Gradle
        run: ./gradlew build -x test
      
      - name: Run tests
        run: ./gradlew test
      
      - name: Build JAR
        run: ./gradlew bootJar
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: app-jar
          path: build/libs/*.jar
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: app-jar
      
      - name: Deploy to EC2
        env:
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ${{ secrets.EC2_USER }}
          EC2_KEY: ${{ secrets.EC2_PRIVATE_KEY }}
        run: |
          echo "$EC2_KEY" > private_key.pem
          chmod 600 private_key.pem
          
          scp -i private_key.pem -o StrictHostKeyChecking=no \
            *.jar $EC2_USER@$EC2_HOST:/app/
          
          ssh -i private_key.pem -o StrictHostKeyChecking=no \
            $EC2_USER@$EC2_HOST \
            'sudo systemctl restart stock-keeper-api'
      
      - name: Health check
        run: |
          sleep 10
          curl -f https://api.stock-keeper.com/health || exit 1
```

### EC2 서버 설정

#### systemd 서비스 파일

**파일**: `/etc/systemd/system/stock-keeper-api.service`

```ini
[Unit]
Description=Stock-Keeper API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/app
ExecStart=/usr/bin/java -jar /app/stock-keeper-api.jar
Restart=on-failure
RestartSec=10

Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="JAVA_OPTS=-Xms512m -Xmx1024m"

[Install]
WantedBy=multi-user.target
```

#### 서비스 관리 명령어

```bash
# 서비스 시작
sudo systemctl start stock-keeper-api

# 서비스 중지
sudo systemctl stop stock-keeper-api

# 서비스 재시작
sudo systemctl restart stock-keeper-api

# 서비스 상태 확인
sudo systemctl status stock-keeper-api

# 로그 확인
sudo journalctl -u stock-keeper-api -f
```

### 배포 절차

#### 자동 배포 (GitHub Actions)

1. **코드 푸시**
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   git push origin develop  # Dev 환경
   ```

2. **빌드 & 테스트**
   - GitHub Actions가 자동으로 빌드
   - 단위/통합 테스트 실행

3. **배포**
   - JAR 파일 EC2에 업로드
   - 서비스 재시작

4. **헬스 체크**
   - `/health` 엔드포인트 호출
   - 실패 시 롤백

#### 수동 배포 (비상 시)

```bash
# 1. 빌드
./gradlew bootJar

# 2. 서버에 업로드
scp -i key.pem build/libs/*.jar ec2-user@HOST:/app/

# 3. SSH 접속
ssh -i key.pem ec2-user@HOST

# 4. 서비스 재시작
sudo systemctl restart stock-keeper-api

# 5. 로그 확인
sudo journalctl -u stock-keeper-api -f
```

### 롤백 전략

#### 빠른 롤백

```bash
# 이전 버전으로 복구
scp -i key.pem backup/stock-keeper-api-v1.0.0.jar ec2-user@HOST:/app/stock-keeper-api.jar
sudo systemctl restart stock-keeper-api
```

#### Git 롤백

```bash
# 이전 커밋으로 복구
git revert <commit-hash>
git push origin main

# GitHub Actions가 자동으로 이전 버전 배포
```

---

## 프론트엔드 배포

### Expo EAS Build

#### 초기 설정

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 프로젝트 초기화
eas init

# EAS 빌드 환경 설정
eas build:configure
```

#### eas.json 설정

**파일**: `eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "API_URL": "https://dev-api.stock-keeper.com"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "API_URL": "https://staging-api.stock-keeper.com"
      }
    },
    "production": {
      "env": {
        "API_URL": "https://api.stock-keeper.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD1234"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 배포 절차

#### iOS (TestFlight)

1. **빌드**
   ```bash
   # Preview 빌드 (내부 테스트)
   eas build --platform ios --profile preview
   
   # Production 빌드
   eas build --platform ios --profile production
   ```

2. **TestFlight 업로드**
   ```bash
   eas submit --platform ios --latest
   ```

3. **베타 테스터 초대**
   - App Store Connect에서 테스터 추가
   - TestFlight 링크 공유

4. **검토 후 출시**
   - App Store 심사 제출
   - 승인 후 출시

#### Android (Google Play)

1. **빌드**
   ```bash
   # Preview 빌드 (내부 테스트)
   eas build --platform android --profile preview
   
   # Production 빌드
   eas build --platform android --profile production
   ```

2. **Google Play Console 업로드**
   ```bash
   eas submit --platform android --latest
   ```

3. **내부 테스트**
   - Google Play Console에서 테스터 추가
   - 내부 테스트 트랙으로 배포

4. **정식 출시**
   - 프로덕션 트랙으로 승격
   - 출시

### GitHub Actions (Mobile)

**파일**: `.github/workflows/mobile-build.yml`

```yaml
name: Mobile Build

on:
  push:
    branches: [main, develop]
    tags:
      - 'mobile-v*'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build iOS (Preview)
        if: github.ref == 'refs/heads/develop'
        run: eas build --platform ios --profile preview --non-interactive
      
      - name: Build Android (Preview)
        if: github.ref == 'refs/heads/develop'
        run: eas build --platform android --profile preview --non-interactive
      
      - name: Build iOS (Production)
        if: startsWith(github.ref, 'refs/tags/mobile-v')
        run: eas build --platform ios --profile production --non-interactive
      
      - name: Build Android (Production)
        if: startsWith(github.ref, 'refs/tags/mobile-v')
        run: eas build --platform android --profile production --non-interactive
```

---

## 버전 관리

### 시맨틱 버전닝 (Semantic Versioning)

**형식**: `vMAJOR.MINOR.PATCH`

- **MAJOR**: 호환성이 깨지는 변경 (v2.0.0)
- **MINOR**: 호환성을 유지하는 기능 추가 (v1.1.0)
- **PATCH**: 버그 수정 (v1.0.1)

**예시**
- `v1.0.0`: Phase 1 MVP 출시
- `v1.1.0`: Phase 2 포트폴리오 공유 기능 추가
- `v1.1.1`: 버그 수정
- `v2.0.0`: AI 추천 기능 추가 (Phase 3)

### Git 태그

```bash
# 태그 생성
git tag -a v1.0.0 -m "Release v1.0.0: Phase 1 MVP"

# 태그 푸시
git push origin v1.0.0

# 태그 목록 확인
git tag -l
```

### 백엔드 vs 프론트엔드 버전

- **백엔드**: `v1.0.0` (동일)
- **프론트엔드**: `mobile-v1.0.0` (접두사 추가)

---

## 모니터링 및 알림

### 배포 후 확인 사항

| 항목 | 확인 방법 | 목표 |
|------|----------|------|
| 서버 구동 | `systemctl status` | 정상 구동 |
| API 응답 | `/health` 엔드포인트 | 200 OK |
| 로그 오류 | CloudWatch Logs | ERROR 0건 |
| CPU/메모리 | CloudWatch Metrics | < 70% |
| 데이터베이스 | RDS Metrics | 정상 연결 |

### Slack 알림 연동

**GitHub Actions Slack Notification**

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deploy to Production ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**알림 내용**
- ✅ 배포 성공
- ❌ 배포 실패
- ⚠️ 헬스 체크 실패

---

## 배포 일정

### Phase 1 (MVP)

| 주차 | 배포 항목 | 환경 |
|------|-----------|------|
| 1-2주 | 개발 환경 구축 | Dev |
| 3-11주 | 주간 배포 | Dev |
| 12주 | Staging 배포 | Staging |
| 12주 | Production 배포 | Production |

**배포 주기**: 주 1회 (금요일)

### Phase 2+

**배포 주기**: 2주 1회

**모바일 앱 업데이트**
- iOS: 2-4주마다 (App Store 심사 기간 고려)
- Android: 2주마다

---

## 보안

### 비밀 관리

**GitHub Secrets**

| Secret | 설명 |
|--------|------|
| `EC2_HOST` | EC2 서버 주소 |
| `EC2_USER` | EC2 사용자명 |
| `EC2_PRIVATE_KEY` | SSH Private Key |
| `DB_PASSWORD` | RDS 비밀번호 |
| `JWT_SECRET` | JWT Secret Key |
| `EXPO_TOKEN` | Expo Access Token |
| `SLACK_WEBHOOK` | Slack Webhook URL |

### 환경별 보안

| 환경 | 보안 수준 |
|------|----------|
| Dev | Basic (개발용) |
| Staging | Medium (테스트용) |
| Production | High (SSL, WAF, 암호화) |

---

## Phase 2+ (확장 고려사항)

### 무중단 배포 (Blue-Green)

- [P2] Blue-Green Deployment
  - 2개 EC2 인스턴스 준비
  - 로드 밸런서로 트래픽 전환
  - 문제 발생 시 즐시 롤백

### 컨테이너 배포 (Docker + Kubernetes)

- [P3] Docker 컨테이너화
- [P3] AWS ECS 또는 EKS
- [P3] 오토스케일링

### 모니터링 고도화

- [P2] Datadog/New Relic APM
- [P2] 성능 메트릭 대시보드
- [P2] 자동화된 알림 및 에스케이레이션

---

## 트러블슈팅

### 일반적인 문제

| 문제 | 원인 | 해결 방법 |
|------|------|----------|
| 배포 실패 | 빌드 오류 | 로그 확인, 종속성 업데이트 |
| 서버 구동 실패 | 포트 충돌, 환경변수 | systemctl status, 로그 확인 |
| DB 연결 실패 | 보안 그룹, 비밀번호 | RDS 설정 확인 |
| Health check 실패 | 서버 시작 지연 | 대기 시간 증가 |

---

## 팀 논의 필요 사항

- [ ] 배포 주기 확정 (주간 vs 2주)
- [ ] 모바일 앱 업데이트 주기
- [ ] Blue-Green 배포 도입 시점 (Phase 2 vs Phase 3)
- [ ] Slack 알림 채널 설정
- [ ] 긴급 핫픽스 프로세스

---

## 체크리스트

### Phase 1 출시 전 필수

- [ ] GitHub Actions CI/CD 구축
- [ ] EC2 서버 설정 및 systemd 서비스 등록
- [ ] EAS Build 환경 설정
- [ ] TestFlight/Google Play Console 설정
- [ ] Slack 알림 연동
- [ ] 버전 태깅 규칙 확정
- [ ] 롤백 절차 문서화

### Phase 2 목표

- [ ] Blue-Green Deployment 구축
- [ ] 모니터링 대시보드 구축
- [ ] 자동화된 롤백 시스템

---

## 관련 문서

- **기술 스택**: `core/tech-stack.md`
- **인프라**: `reference/infra.md`
- **테스트**: `reference/testing.md`
- **보안**: `reference/security.md`

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: DevOps + Backend + Frontend
