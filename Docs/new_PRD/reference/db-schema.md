# 데이터베이스 스키마

## 요약 ⚡

- MySQL 8.0 기반 관계형 데이터베이스
- 핵심 테이블: users, portfolios, stocks, notifications
- UUID 기본 키 사용으로 보안 강화
- 소수점 거래 대비 DECIMAL 타입 사용
- [P2-고려] Soft Delete, 버전 관리, 인덱스 최적화

---

## Phase 1 (현재)

### 테이블 목록

1. **users** - 사용자 정보
2. **portfolios** - 포트폴리오
3. **stocks** - 종목 정보
4. **notifications** - 알림 설정

---

## 테이블 상세

### 1. users (사용자)

| 컬럼명 | 타입 | 제약 | 설명 |
|---------|------|------|------|
| id | VARCHAR(36) | PK | UUID 기본 키 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 사용자 이메일 (Google) |
| name | VARCHAR(100) | NOT NULL | 사용자 이름 |
| google_id | VARCHAR(255) | UNIQUE, NOT NULL | Google User ID |
| profile_image_url | VARCHAR(500) | NULL | 프로필 사진 URL |
| created_at | TIMESTAMP | NOT NULL | 가입일시 |
| updated_at | TIMESTAMP | NOT NULL | 마지막 수정일시 |

**인덱스**
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_google_id ON users(google_id);
```

**DDL**
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 2. portfolios (포트폴리오)

| 컬럼명 | 타입 | 제약 | 설명 |
|---------|------|------|------|
| id | VARCHAR(36) | PK | UUID 기본 키 |
| user_id | VARCHAR(36) | FK, NOT NULL | users.id 참조 |
| name | VARCHAR(20) | NOT NULL | 포트폴리오 이름 |
| description | VARCHAR(100) | NULL | 목표 설명/메모 |
| is_default | BOOLEAN | DEFAULT false | 기본 포트폴리오 여부 |
| display_order | INT | NOT NULL | 표시 순서 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 마지막 수정일시 |

**제약 조건**
- 사용자당 최대 5개 포트폴리오 (응용 레벨에서 검증)
- 사용자당 최소 1개 포트폴리오 유지

**인덱스**
```sql
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_display_order ON portfolios(user_id, display_order);
```

**DDL**
```sql
CREATE TABLE portfolios (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(20) NOT NULL,
  description VARCHAR(100),
  is_default BOOLEAN DEFAULT false,
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3. stocks (종목)

| 컬럼명 | 타입 | 제약 | 설명 |
|---------|------|------|------|
| id | VARCHAR(36) | PK | UUID 기본 키 |
| portfolio_id | VARCHAR(36) | FK, NOT NULL | portfolios.id 참조 |
| stock_code | VARCHAR(10) | NOT NULL | 종목코드 (6자리) |
| stock_name | VARCHAR(100) | NOT NULL | 종목명 |
| quantity | DECIMAL(18,4) | NOT NULL | 보유 수량 (소수점 4자리) |
| average_price | DECIMAL(15,2) | NULL | 평균 매입 단가 (Phase 2) |
| target_ratio | DECIMAL(5,2) | NULL | 목표 비율 (0~100%) |
| created_at | TIMESTAMP | NOT NULL | 추가일시 |
| updated_at | TIMESTAMP | NOT NULL | 마지막 수정일시 |

**제약 조건**
- 포트폴리오당 최대 50종목
- 동일 포트폴리오 내 동일 종목 중복 불가 (UNIQUE)

**인덱스**
```sql
CREATE INDEX idx_stocks_portfolio_id ON stocks(portfolio_id);
CREATE UNIQUE INDEX idx_stocks_portfolio_stock ON stocks(portfolio_id, stock_code);
```

**DDL**
```sql
CREATE TABLE stocks (
  id VARCHAR(36) PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL,
  stock_code VARCHAR(10) NOT NULL,
  stock_name VARCHAR(100) NOT NULL,
  quantity DECIMAL(18,4) NOT NULL CHECK (quantity > 0),
  average_price DECIMAL(15,2),
  target_ratio DECIMAL(5,2) CHECK (target_ratio >= 0 AND target_ratio <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_portfolio_stock (portfolio_id, stock_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 4. notifications (알림 설정)

| 컬럼명 | 타입 | 제약 | 설명 |
|---------|------|------|------|
| id | VARCHAR(36) | PK | UUID 기본 키 |
| portfolio_id | VARCHAR(36) | FK, NOT NULL | portfolios.id 참조 |
| is_enabled | BOOLEAN | DEFAULT false | 알림 활성화 여부 |
| frequency | ENUM | NOT NULL | 주기 (daily, weekly, biweekly, monthly) |
| notification_time | TIME | NOT NULL | 알림 시간 (HH:MM) |
| threshold | DECIMAL(5,2) | DEFAULT 5.0 | 임계값 (%) |
| last_sent_at | TIMESTAMP | NULL | 마지막 알림 발송 시각 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 마지막 수정일시 |

**인덱스**
```sql
CREATE INDEX idx_notifications_portfolio_id ON notifications(portfolio_id);
CREATE INDEX idx_notifications_enabled ON notifications(is_enabled, notification_time);
```

**DDL**
```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  frequency ENUM('daily', 'weekly', 'biweekly', 'monthly') NOT NULL,
  notification_time TIME NOT NULL,
  threshold DECIMAL(5,2) DEFAULT 5.0 CHECK (threshold >= 0 AND threshold <= 100),
  last_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 관계도 (ERD)

```
users (1) ---< (N) portfolios (1) ---< (N) stocks
                      |
                      (1)
                      |
                     (1)
                      |
                 notifications
```

**설명**
- 1명의 사용자는 여러 포트폴리오를 가질 수 있음
- 1개의 포트폴리오는 여러 종목을 가질 수 있음
- 1개의 포트폴리오는 1개의 알림 설정을 가짐
- 모든 외래 키는 CASCADE DELETE 설정

---

## Phase 2+ (확장 고려사항)

### Phase 2 기능

- [P2] **Soft Delete**
  - `deleted_at TIMESTAMP NULL` 컬럼 추가
  - 실제 삭제 대신 타임스탬프 기록
  - 30일 후 자동 완전 삭제 (배치 작업)
  - 사용자 복구 기능 제공

- [P2] **버전 관리**
  - stocks_history 테이블 추가
  - 종목 변경 이력 추적
  - 수량, 목표 비율 변경 내역 저장

- [P2] **추가 테이블**
  ```sql
  -- 포트폴리오 공유 설정
  CREATE TABLE portfolio_shares (
    id VARCHAR(36) PRIMARY KEY,
    portfolio_id VARCHAR(36) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    share_token VARCHAR(64) UNIQUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
  );
  
  -- 앱 내 알림 내역
  CREATE TABLE notification_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    portfolio_id VARCHAR(36) NOT NULL,
    type ENUM('rebalancing', 'price_alert', 'news') NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
  );
  ```

### Phase 3 기능

- [P3] **다국어 지원**
  - i18n 테이블 추가
  - 사용자별 선호 언어 저장

- [P3] **해외 주식**
  - stock_market 컬럼 추가 (KR, US, JP 등)
  - 환율 정보 테이블

- [P3] **성능 최적화**
  - 파티셔닝 (user_id 기준)
  - Read Replica 구성
  - 인덱스 추가 최적화

---

## 보안

| 항목 | 규칙 |
|------|------|
| 저장 데이터 암호화 | AWS RDS AES-256 |
| 전송 암호화 | TLS/SSL 1.2+ |
| 접근 제어 | 최소 권한 원칙, IP 화이트리스트 |
| 백업 | 매일 자동 백업 (7일 보관) |
| 비밀번호 | 해시 저장 (BCrypt) |

---

## 관련 문서

- **기술 스택**: `core/tech-stack.md#database` - MySQL, JPA 설정
- **보안**: `reference/security.md` - 데이터베이스 보안 체크리스트
- **인프라**: `reference/infra.md#database` - AWS RDS 구성
- **API**: `reference/api-spec.md` - 각 API와 DB 테이블 매핑

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: Backend + DBA
