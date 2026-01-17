# Notification DB 스펙

## 원본 출처

> 원본 파일: `_inbox/sk_p2.dbml`

## 항목별 작업 요약

| 항목                  | 작업   | 기존 스펙                                        |
| --------------------- | ------ | ------------------------------------------------ |
| notification_settings | UPDATE | specs/db/notification/notification-settings.md   |
| notifications         | UPDATE | specs/db/notification/notifications.md           |
| notification_types    | SKIP   | ⏭️ 기존 스펙과 거의 동일                          |
| device_tokens         | SKIP   | ⏭️ 기존 스펙과 거의 동일                          |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P1 (핵심 기능)
- **연관 기존 스펙**:
  - `specs/db/notification/notification-settings.md`
  - `specs/db/notification/notifications.md`
  - `specs/db/notification/notification-types.md`
  - `specs/db/notification/device-tokens.md`
- **비교한 기존 스펙 파일**:
  - `specs/db/notification/notification-settings.md` ⭐ 정밀 비교 완료
  - `specs/db/notification/notifications.md` ⭐ 정밀 비교 완료

---

## notification_settings [UPDATE]

> **구조 변경**: 사용자별/포트폴리오별 분리 → 포트폴리오 전용

### 기존 스펙 요약 (notification-settings.md)

```sql
-- 사용자 알림 설정
CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  global_enabled BOOLEAN DEFAULT TRUE,
  frequency ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY') DEFAULT 'WEEKLY',
  notification_time TIME DEFAULT '16:00:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 포트폴리오별 알림 설정
CREATE TABLE portfolio_notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  threshold INT DEFAULT 5,
  last_notification_at TIMESTAMP NULL,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);
```

### 변경 사항

| 구분        | 기존                              | 변경                              | 비고             |
| ----------- | --------------------------------- | --------------------------------- | ---------------- |
| 구조        | 사용자별 + 포트폴리오별 분리 (2테이블) | 포트폴리오별 단일 테이블           | **구조 통합**    |
| FK 참조     | user_id + portfolio_id           | portfolio_id만                    | 참조 변경        |
| frequency   | DAILY/WEEKLY/BIWEEKLY/MONTHLY    | WEEKLY/MONTHLY                    | 옵션 축소        |
| threshold   | INT (%) - 기본 5%                | DECIMAL (%) - 기본 20%            | 기본값 변경      |
| global_enabled | BOOLEAN                        | 삭제됨                            | 별도 settings 테이블로 이동 |

### 변경된 스키마

```sql
-- 알림 설정 (포트폴리오별)
CREATE TABLE notification_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT NOT NULL,                      -- 포트폴리오와 1:1 관계
  is_enabled BOOLEAN DEFAULT FALSE,               -- 알림 활성화
  alert_cycle ENUM('WEEKLY', 'MONTHLY'),          -- 알림 주기
  alert_time TIME,                                -- 알림 발송 시간
  threshold_percentage DECIMAL DEFAULT 20.0,      -- 임계값 (±20%)
  updated_at TIMESTAMP,
  
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_notif_settings_portfolio (portfolio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼                 | 타입    | 필수 | 설명                 | Phase | 변경      |
| -------------------- | ------- | ---- | -------------------- | ----- | --------- |
| id                   | INT     | Y    | PK, AUTO_INCREMENT   | P1    | 유지      |
| portfolio_id         | INT     | Y    | 포트폴리오 ID (FK)   | P1    | 명칭 유지 |
| is_enabled           | BOOLEAN | Y    | 알림 활성화          | P1    | 명칭 변경 |
| alert_cycle          | ENUM    | N    | 알림 주기            | P1    | 명칭/옵션 변경 |
| alert_time           | TIME    | N    | 알림 발송 시간       | P1    | 명칭 변경 |
| threshold_percentage | DECIMAL | Y    | 임계값 (%)           | P1    | 명칭/기본값 변경 |
| updated_at           | TIMESTAMP | N   | 수정일              | P1    | 유지      |

### 비즈니스 규칙

- 포트폴리오 생성 시 기본 설정 레코드 자동 생성
- 전역 알림 ON/OFF는 별도 `settings` 테이블의 `is_notification`으로 관리

---

## notifications [UPDATE]

> **FK 추가**: notification_type_id로 notification_types 테이블 참조

### 기존 스펙 요약 (notifications.md)

```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('REBALANCING_NEEDED', 'PRICE_ALERT', 'SYSTEM') NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  portfolio_id VARCHAR(36),
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL
);
```

### 변경 사항

| 구분              | 기존                             | 변경                              | 비고             |
| ----------------- | -------------------------------- | --------------------------------- | ---------------- |
| PK 타입           | VARCHAR(36) (UUID)               | INT AUTO_INCREMENT                | 타입 변경        |
| type              | ENUM                             | notification_type_id FK           | **정규화**       |
| body              | body TEXT                        | message TEXT                      | 명칭 변경        |
| data              | JSON                             | 삭제됨                            | 제거             |
| portfolio_id      | VARCHAR(36)                      | related_entity_id INT             | 명칭/타입 변경   |
| read_at           | TIMESTAMP                        | 삭제됨                            | 제거             |
| expires_at        | TIMESTAMP                        | 삭제됨                            | 제거             |
| is_delete/delete_at | 없음                           | 추가                              | **논리적 삭제**  |

### 변경된 스키마

```sql
-- 알림 스택
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                           -- 수신 대상자
  notification_type_id INT NOT NULL,              -- 알림 종류 (FK)
  title VARCHAR(255) NOT NULL,                    -- 알림 제목
  message TEXT NOT NULL,                          -- 알림 본문
  related_entity_id INT,                          -- 관련 포트폴리오 ID 등 (클릭 시 이동용)
  is_read BOOLEAN DEFAULT FALSE,                  -- 읽음 여부
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,                -- 논리적 삭제 여부
  delete_at TIMESTAMP,                            -- 논리적 삭제 일시
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (notification_type_id) REFERENCES notification_types(id),
  FOREIGN KEY (related_entity_id) REFERENCES portfolios(id) ON DELETE SET NULL,
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 컬럼 상세

| 컬럼                 | 타입      | 필수 | 설명                    | Phase | 변경         |
| -------------------- | --------- | ---- | ----------------------- | ----- | ------------ |
| id                   | INT       | Y    | PK, AUTO_INCREMENT      | P1    | 타입 변경    |
| user_id              | INT       | Y    | 수신자 ID (FK)          | P1    | 타입 변경    |
| notification_type_id | INT       | Y    | 알림 종류 (FK)          | P1    | **신규**     |
| title                | VARCHAR   | Y    | 알림 제목               | P1    | 유지         |
| message              | TEXT      | Y    | 알림 본문               | P1    | 명칭 변경    |
| related_entity_id    | INT       | N    | 관련 엔티티 ID          | P1    | 명칭/타입 변경 |
| is_read              | BOOLEAN   | Y    | 읽음 여부               | P1    | 유지         |
| created_at           | TIMESTAMP | Y    | 생성일                  | P1    | 유지         |
| is_delete            | BOOLEAN   | Y    | 논리적 삭제             | P1    | **신규**     |
| delete_at            | TIMESTAMP | N    | 삭제 일시               | P1    | **신규**     |

### 비즈니스 규칙

- 알림 만료 정책: expires_at 대신 is_delete + 배치로 관리
- 알림 종류는 notification_types 테이블에서 관리 (정규화)

---

## 확인 필요 사항

> [!IMPORTANT]
> AI가 원본 파일에서 발견한 질문, 주석, 모호한 부분을 아래에 정리했습니다.

### 발견된 이슈 (원본에서 추출)

1. **notification_settings 구조 통합**
   - 기존: 사용자별 + 포트폴리오별 2개 테이블
   - inbox: 포트폴리오별 1개 테이블만
   - 전역 알림 설정은 `settings.is_notification`으로 이동
   - 기존 `portfolio_notification_settings` 테이블 삭제 필요

2. **notifications.data JSON 삭제**
   - 기존: 추가 데이터를 JSON으로 저장
   - inbox: 해당 컬럼 없음
   - 추가 데이터 필요 시 결정 필요

3. **expires_at 삭제**
   - 기존: 만료일을 명시적으로 저장
   - inbox: is_delete + 배치 처리로 대체
   - 만료 정책 재정의 필요

### 사용자 결정 필요

**1. notification_settings 통합 방식**

- [ ] 옵션 A (추천) - inbox 방식 채택 (포트폴리오별 단일 테이블)
- [ ] 옵션 B - 기존 방식 유지 (사용자별 + 포트폴리오별 분리)

**2. notifications.data 컬럼**

- [ ] 옵션 A (추천) - 삭제 (inbox 방식)
- [ ] 옵션 B - 유지 (기존 방식)

**3. 알림 만료 정책**

- [ ] 옵션 A (추천) - 30일 후 배치 삭제 (is_delete 기반)
- [ ] 옵션 B - expires_at 컬럼 유지

---

## 관련 스펙 (수정 필요)

### API
- `specs/api/notification/settings.md` → 테이블 구조 변경 반영
- `specs/api/notification/list.md` → 컬럼 변경 반영
- `specs/api/notification/read.md` → 컬럼 변경 반영
