# 데이터베이스 스키마

## 요약 ⚡

- MySQL 8.0 기반 관계형 데이터베이스
- 핵심 테이블: users, portfolios, portfolio_entries, portfolio_cash_entries, notification_settings, accounts, account_entries, account_cash_entries, settings, notifications
- INTEGER 기본 키 사용 (AUTO_INCREMENT)
- Google 소셜 로그인 지원
- 계좌 연동 및 포트폴리오 관리 기능
- 현금 자산 관리 기능 (portfolio_cash_entries, account_cash_entries)
- 논리적 삭제(Soft Delete) 지원

---

### 테이블 목록

1. **users** - 사용자 정보
2. **portfolios** - 포트폴리오
3. **portfolio_entries** - 포트폴리오 내 항목들
4. **portfolio_cash_entries** - 포트폴리오 내 현금 목표 비중
5. **notification_settings** - 알림 설정
6. **accounts** - 연동 계좌
7. **account_entries** - 계좌 내 항목들
8. **account_cash_entries** - 계좌 내 실제 현금 잔고
9. **settings** - 사용자 설정값
10. **notifications** - 알림 스택

---

## 테이블 상세

### 1. users (사용자)

| 컬럼명            | 타입                  | 제약               | 설명                    |
| ----------------- | --------------------- | ------------------ | ----------------------- |
| id                | INT                   | PK, AUTO_INCREMENT | 기본 키                 |
| email             | VARCHAR(255)          | UNIQUE, NOT NULL   | 사용자 이메일           |
| nickname          | VARCHAR(100)          | NULL               | 사용자 닉네임           |
| provider          | ENUM('GOOGLE')        | NOT NULL           | 소셜 제공자 (현재 구글) |
| role              | ENUM('USER', 'ADMIN') | NOT NULL           | 사용자 역할             |
| profile_image_url | VARCHAR(500)          | NULL               | 프로필 사진 URL         |
| refresh_token     | TEXT                  | NULL               | 토큰 갱신용             |
| created_at        | TIMESTAMP             | NOT NULL           | 가입 날짜               |
| updated_at        | TIMESTAMP             | NOT NULL           | 업데이트 날짜           |
| membership_type   | ENUM('NOT')           | DEFAULT 'NOT'      | 멤버십 여부             |
| is_delete         | BOOLEAN               | DEFAULT false      | 논리적 삭제 여부        |
| delete_at         | TIMESTAMP             | NULL               | 논리적 삭제 일시        |

**인덱스**

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**DDL**

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100),
  provider ENUM('GOOGLE') NOT NULL,
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  profile_image_url VARCHAR(500),
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  membership_type ENUM('NOT') DEFAULT 'NOT',
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 2. portfolios (포트폴리오)

| 컬럼명       | 타입         | 제약               | 설명                   |
| ------------ | ------------ | ------------------ | ---------------------- |
| id           | INT          | PK, AUTO_INCREMENT | 기본 키                |
| user_id      | INT          | FK, NOT NULL       | users.id 참조          |
| name         | VARCHAR(100) | NOT NULL           | 포트폴리오명           |
| description  | TEXT         | NULL               | 포트폴리오 설명        |
| account_id   | INT          | FK, NULL           | accounts.id 참조 (1:1) |
| banner_color | VARCHAR(20)  | DEFAULT '#4CAF93'  | 포트폴리오 배너 색상   |
| created_at   | TIMESTAMP    | NOT NULL           | 생성 날짜              |
| updated_at   | TIMESTAMP    | NOT NULL           | 업데이트 날짜          |
| is_delete    | BOOLEAN      | DEFAULT false      | 논리적 삭제 여부       |
| delete_at    | TIMESTAMP    | NULL               | 논리적 삭제 일시       |

**제약 조건**

- 한 계좌당 하나의 메인 포트폴리오 설정 가능 (account_id는 UNIQUE)

**인덱스**

```sql
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE UNIQUE INDEX idx_portfolios_account_id ON portfolios(account_id);
```

**DDL**

```sql
CREATE TABLE portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  account_id INT UNIQUE,
  banner_color VARCHAR(20) DEFAULT '#4CAF93',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3. portfolio_entries (포트폴리오 내 항목들)

| 컬럼명        | 타입          | 제약               | 설명               |
| ------------- | ------------- | ------------------ | ------------------ |
| id            | INT           | PK, AUTO_INCREMENT | 기본 키            |
| portfolio_id  | INT           | FK, NOT NULL       | portfolios.id 참조 |
| group         | VARCHAR(50)   | NULL               | 분류               |
| ticker        | VARCHAR(20)   | NOT NULL           | 주식 ticker        |
| target_weight | DECIMAL(5,2)  | NULL               | 희망 비중(%)       |
| created_at    | TIMESTAMP     | NOT NULL           | 생성 날짜          |
| updated_at    | TIMESTAMP     | NOT NULL           | 업데이트 날짜      |
| is_delete     | BOOLEAN       | DEFAULT false      | 논리적 삭제 여부   |
| delete_at     | TIMESTAMP     | NULL               | 논리적 삭제 일시   |

**제약 조건**

- 동일 포트폴리오 내 동일 ticker 중복 불가

**인덱스**

```sql
CREATE INDEX idx_portfolio_entries_portfolio_id ON portfolio_entries(portfolio_id);
CREATE UNIQUE INDEX idx_portfolio_entries_unique ON portfolio_entries(portfolio_id, ticker);
```

**DDL**

```sql
CREATE TABLE portfolio_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT NOT NULL,
  `group` VARCHAR(50),
  ticker VARCHAR(20) NOT NULL,
  target_weight DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_portfolio_ticker (portfolio_id, ticker)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 4. portfolio_cash_entries (포트폴리오 내 현금 목표 비중)

| 컬럼명        | 타입                      | 제약               | 설명               |
| ------------- | ------------------------- | ------------------ | ------------------ |
| id            | INT                       | PK, AUTO_INCREMENT | 기본 키            |
| portfolio_id  | INT                       | FK, NOT NULL       | portfolios.id 참조 |
| currency      | ENUM('KRW', 'USD', 'JPY') | NOT NULL, DEFAULT 'KRW' | 통화          |
| target_weight | DECIMAL(5,2)              | NULL               | 희망 비중(%)       |
| created_at    | TIMESTAMP                 | NOT NULL           | 생성 날짜          |
| updated_at    | TIMESTAMP                 | NOT NULL           | 업데이트 날짜      |
| is_delete     | BOOLEAN                   | DEFAULT false      | 논리적 삭제 여부   |
| delete_at     | TIMESTAMP                 | NULL               | 논리적 삭제 일시   |

**제약 조건**

- 동일 포트폴리오 내 동일 통화 중복 불가

**인덱스**

```sql
CREATE INDEX idx_portfolio_cash_entries_portfolio_id ON portfolio_cash_entries(portfolio_id);
CREATE UNIQUE INDEX idx_portfolio_cash_entries_unique ON portfolio_cash_entries(portfolio_id, currency);
```

**DDL**

```sql
CREATE TABLE portfolio_cash_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT NOT NULL,
  currency ENUM('KRW', 'USD', 'JPY') NOT NULL DEFAULT 'KRW',
  target_weight DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_portfolio_currency (portfolio_id, currency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 5. notification_settings (알림 설정)

| 컬럼명               | 타입           | 제약                 | 설명                     |
| -------------------- | -------------- | -------------------- | ------------------------ |
| id                   | INT            | PK, AUTO_INCREMENT   | 기본 키                  |
| portfolio_id         | INT            | FK, UNIQUE, NOT NULL | portfolios.id 참조 (1:1) |
| is_enabled           | BOOLEAN        | DEFAULT false        | 알림 활성화 여부         |
| alert_cycle          | ENUM('WEEKLY') | NOT NULL             | 알림 주기                |
| alert_time           | TIME           | NOT NULL             | 알림 발송 시간           |
| threshold_percentage | DECIMAL(5,2)   | DEFAULT 20.0         | 임계값 (±20%)           |
| updated_at           | TIMESTAMP      | NOT NULL             | 업데이트 날짜            |

**제약 조건**

- 포트폴리오와 1:1 관계 (portfolio_id UNIQUE)

**인덱스**

```sql
CREATE UNIQUE INDEX idx_notification_settings_portfolio_id ON notification_settings(portfolio_id);
CREATE INDEX idx_notification_settings_enabled ON notification_settings(is_enabled, alert_time);
```

**DDL**

```sql
CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  alert_cycle ENUM('WEEKLY') NOT NULL,
  alert_time TIME NOT NULL,
  threshold_percentage DECIMAL(5,2) DEFAULT 20.0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 6. accounts (연동 계좌)

| 컬럼명         | 타입         | 제약               | 설명              |
| -------------- | ------------ | ------------------ | ----------------- |
| id             | INT          | PK, AUTO_INCREMENT | 기본 키           |
| user_id        | INT          | FK, NOT NULL       | users.id 참조     |
| brokerage_name | VARCHAR(100) | NOT NULL           | 증권사 명         |
| account_number | VARCHAR(255) | NOT NULL           | 계좌 번호(암호화) |
| access_token   | TEXT         | NULL               | API 접근 토큰     |
| refresh_token  | TEXT         | NULL               | 토큰 갱신용       |
| is_connected   | BOOLEAN      | DEFAULT false      | 현재 연결 여부    |
| created_at     | TIMESTAMP    | NOT NULL           | 생성 날짜         |
| updated_at     | TIMESTAMP    | NOT NULL           | 업데이트 날짜     |
| is_delete      | BOOLEAN      | DEFAULT false      | 논리적 삭제 여부  |
| delete_at      | TIMESTAMP    | NULL               | 논리적 삭제 일시  |

**인덱스**

```sql
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

**DDL**

```sql
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  brokerage_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 7. account_entries (계좌 내 항목들)

| 컬럼명           | 타입                      | 제약               | 설명             |
| ---------------- | ------------------------- | ------------------ | ---------------- |
| id               | INT                       | PK, AUTO_INCREMENT | 기본 키          |
| account_id       | INT                       | FK, NOT NULL       | accounts.id 참조 |
| group            | VARCHAR(50)               | NULL               | 분류             |
| ticker           | VARCHAR(20)               | NOT NULL           | 주식 ticker      |
| current_quantity | DECIMAL(18,8)             | NOT NULL           | 현재 수량        |
| bought_price     | DECIMAL(18,4)             | NULL               | 평단가           |
| currency         | ENUM('KRW', 'USD', 'JPY') | DEFAULT 'KRW'      | 거래 통화        |
| exchange         | VARCHAR(50)               | NULL               | 거래소           |
| created_at       | TIMESTAMP                 | NOT NULL           | 생성 날짜        |
| is_delete        | BOOLEAN                   | DEFAULT false      | 논리적 삭제 여부 |
| delete_at        | TIMESTAMP                 | NULL               | 논리적 삭제 일시 |

**인덱스**

```sql
CREATE INDEX idx_account_entries_account_id ON account_entries(account_id);
```

**DDL**

```sql
CREATE TABLE account_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  `group` VARCHAR(50),
  ticker VARCHAR(20) NOT NULL,
  current_quantity DECIMAL(18,8) NOT NULL,
  bought_price DECIMAL(18,4),
  currency ENUM('KRW', 'USD', 'JPY') DEFAULT 'KRW',
  exchange VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 8. account_cash_entries (계좌 내 실제 현금 잔고)

| 컬럼명     | 타입                      | 제약                    | 설명             |
| ---------- | ------------------------- | ----------------------- | ---------------- |
| id         | INT                       | PK, AUTO_INCREMENT      | 기본 키          |
| account_id | INT                       | FK, NOT NULL            | accounts.id 참조 |
| currency   | ENUM('KRW', 'USD', 'JPY') | NOT NULL, DEFAULT 'KRW' | 통화             |
| amount     | DECIMAL(18,4)             | DEFAULT 0               | 실제 보유 금액   |
| created_at | TIMESTAMP                 | NOT NULL                | 생성 날짜        |
| updated_at | TIMESTAMP                 | NOT NULL                | 업데이트 날짜    |
| is_delete  | BOOLEAN                   | DEFAULT false           | 논리적 삭제 여부 |
| delete_at  | TIMESTAMP                 | NULL                    | 논리적 삭제 일시 |

**제약 조건**

- 동일 계좌 내 동일 통화 중복 불가

**인덱스**

```sql
CREATE INDEX idx_account_cash_entries_account_id ON account_cash_entries(account_id);
CREATE UNIQUE INDEX idx_account_cash_entries_unique ON account_cash_entries(account_id, currency);
```

**DDL**

```sql
CREATE TABLE account_cash_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  currency ENUM('KRW', 'USD', 'JPY') NOT NULL DEFAULT 'KRW',
  amount DECIMAL(18,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_account_currency (account_id, currency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 9. settings (사용자 설정값)

| 컬럼명                | 타입    | 제약                 | 설명                        |
| --------------------- | ------- | -------------------- | --------------------------- |
| id                    | INT     | PK, AUTO_INCREMENT   | 기본 키                     |
| user_id               | INT     | FK, UNIQUE, NOT NULL | users.id 참조 (1:1)         |
| is_notification       | BOOLEAN | DEFAULT true         | 알림 설정 허용              |
| is_privacy            | BOOLEAN | DEFAULT true         | 개인정보 허용               |
| is_tutorial_completed | BOOLEAN | DEFAULT false        | 튜토리얼 가이드 완료 여부   |

**제약 조건**

- 사용자와 1:1 관계 (user_id UNIQUE)

**인덱스**

```sql
CREATE UNIQUE INDEX idx_settings_user_id ON settings(user_id);
```

**DDL**

```sql
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  is_notification BOOLEAN DEFAULT true,
  is_privacy BOOLEAN DEFAULT true,
  is_tutorial_completed BOOLEAN DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 10. notifications (알림 스택)

| 컬럼명            | 타입                                                    | 제약                      | 설명                                   |
| ----------------- | ------------------------------------------------------- | ------------------------- | -------------------------------------- |
| id                | INT                                                     | PK, AUTO_INCREMENT        | 기본 키                                |
| user_id           | INT                                                     | FK, NOT NULL              | users.id 참조 (수신 대상자)            |
| type              | ENUM('REBALANCING_CYCLE', 'THRESHOLD_BREACH', 'SYSTEM') | NOT NULL                  | 알림 종류 (1.주기 2.임계치 3.시스템)   |
| title             | VARCHAR(255)                                            | NOT NULL                  | 알림 제목                              |
| message           | TEXT                                                    | NOT NULL                  | 알림 본문                              |
| related_entity_id | INT                                                     | NULL                      | 관련 포트폴리오 ID 등 (클릭 시 이동용) |
| is_read           | BOOLEAN                                                 | DEFAULT false             | 읽음 여부                              |
| created_at        | TIMESTAMP                                               | DEFAULT CURRENT_TIMESTAMP | 생성 날짜                              |
| is_delete         | BOOLEAN                                                 | DEFAULT false             | 논리적 삭제 여부                       |
| delete_at         | TIMESTAMP                                               | NULL                      | 논리적 삭제 일시                       |

**인덱스**

```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

**DDL**

```sql
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('REBALANCING_CYCLE', 'THRESHOLD_BREACH', 'SYSTEM') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_entity_id INT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT false,
  delete_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 관계도 (ERD)

```
users (1) ---< (N) portfolios (1) ---< (N) portfolio_entries
  |                   |
  |                   +---< (N) portfolio_cash_entries
  |                   |
  |                  (1)
  |                   |
  |           notification_settings
  |
  (1)
  |
 (N)
  |
accounts (1) ---< (N) account_entries
  |
  +---< (N) account_cash_entries
  |
  (1)
  |
 (1)
  |
portfolios

users (1) --- (1) settings

users (1) ---< (N) notifications
```

**설명**

- 1명의 사용자는 여러 포트폴리오를 가질 수 있음
- 1개의 포트폴리오는 여러 항목(portfolio_entries)을 가질 수 있음
- 1개의 포트폴리오는 여러 현금 목표 비중(portfolio_cash_entries)을 가질 수 있음
- 1개의 포트폴리오는 1개의 알림 설정을 가짐 (1:1)
- 1명의 사용자는 여러 계좌를 연동할 수 있음
- 1개의 계좌는 여러 항목(account_entries)을 가질 수 있음
- 1개의 계좌는 여러 현금 잔고(account_cash_entries)를 가질 수 있음
- 1개의 포트폴리오는 1개의 계좌를 메인으로 설정 가능 (1:1, optional)
- 1명의 사용자는 1개의 설정을 가짐 (1:1)
- 1명의 사용자는 여러 알림을 받을 수 있음
- 모든 외래 키는 CASCADE DELETE 설정

---

## 보안

| 항목               | 규칙                                  |
| ------------------ | ------------------------------------- |
| 저장 데이터 암호화 | AWS RDS AES-256                       |
| 전송 암호화        | TLS/SSL 1.2+                          |
| 접근 제어          | 최소 권한 원칙, IP 화이트리스트       |
| 백업               | 매일 자동 백업 (7일 보관)             |
| 계좌 번호 암호화   | AES-256 암호화 저장                   |
| 토큰 관리          | refresh_token, access_token 안전 저장 |

---

## 관련 문서

- **기술 스택**: `core/tech-stack.md#database` - MySQL, JPA 설정
- **보안**: `reference/security.md` - 데이터베이스 보안 체크리스트
- **인프라**: `reference/infra.md#database` - AWS RDS 구성
- **API**: `reference/api-spec.md` - 각 API와 DB 테이블 매핑

---

> **작성일**: 2026-01-06
> **담당**: Backend + DBA
> **마지막 업데이트**: 현금 자산 관리 테이블(portfolio_cash_entries, account_cash_entries) 추가
