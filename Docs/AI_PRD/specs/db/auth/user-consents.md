---
type: db
phase: P1
table: user_consents
related:
  db:
    - specs/db/auth/users.md
  api:
    - specs/api/auth/consents-get.md
    - specs/api/auth/consents-update.md
    - specs/api/auth/terms.md
---

# user_consents 테이블

## 개요

사용자 동의 정보 저장 (이용약관, 개인정보, 마케팅)

## 스키마

```sql
CREATE TABLE user_consents (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  consent_type ENUM('TERMS', 'PRIVACY', 'MARKETING') NOT NULL,
  is_agreed BOOLEAN DEFAULT FALSE,
  agreed_at TIMESTAMP,
  version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_consents_user_id (user_id),
  INDEX idx_user_consents_user_type (user_id, consent_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼         | 타입        | 필수 | 기본값            | 설명                    |
| ------------ | ----------- | ---- | ----------------- | ----------------------- |
| id           | INTEGER     | Y    | AUTO_INCREMENT    | PK                      |
| user_id      | INTEGER     | Y    | -                 | FK → users.id           |
| consent_type | ENUM        | Y    | -                 | TERMS/PRIVACY/MARKETING |
| is_agreed    | BOOLEAN     | Y    | FALSE             | 동의 여부               |
| agreed_at    | TIMESTAMP   | N    | NULL              | 동의 일시               |
| version      | VARCHAR(20) | N    | NULL              | 약관 버전               |
| created_at   | TIMESTAMP   | Y    | CURRENT_TIMESTAMP | 생성일                  |
| updated_at   | TIMESTAMP   | Y    | CURRENT_TIMESTAMP | 수정일                  |

## 인덱스

| 인덱스명                      | 컬럼                   | 타입  | 용도                  |
| ----------------------------- | ---------------------- | ----- | --------------------- |
| idx_user_consents_user_id     | user_id                | INDEX | 사용자별 조회         |
| idx_user_consents_user_type   | user_id, consent_type  | INDEX | 사용자+유형 복합 조회 |

## 주요 변경 이력

| 버전 | 변경 내용 |
|------|----------|
| P2   | idx_user_consents_user_type 복합 인덱스 추가 |
