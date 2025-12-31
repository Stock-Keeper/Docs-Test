# DB 스키마 설계 기초: 용어와 원리

> 프론트엔드 개발자가 백엔드 팀과 소통하기 위해 알아야 할 DB 핵심 개념을 정리합니다.

---

## 1. 기본 용어 사전

### 1.1 테이블 구조 용어

| 용어 | 영어 | 비유 | 설명 |
|------|------|------|------|
| **테이블** | Table | 엑셀 시트 | 데이터를 담는 표 |
| **행 (Row)** | Record | 엑셀 한 줄 | 데이터 하나 (김철수 정보) |
| **열 (Column)** | Field | 엑셀 헤더 | 데이터 항목 (이름, 나이) |
| **스키마** | Schema | 설계도 | 테이블 구조 전체 정의 |

### 1.2 키(Key) 용어

#### Primary Key (PK) - 기본키

```
🔑 각 행을 유일하게 구분하는 값
```

```sql
Table users {
  id integer [primary key]  -- ← 이게 PK
  email varchar
  nickname varchar
}
```

| id (PK) | email | nickname |
|---------|-------|----------|
| 1 | <kim@mail.com> | 김철수 |
| 2 | <lee@mail.com> | 이영희 |
| 3 | <park@mail.com> | 박민수 |

> **왜 필요?** "김철수"가 두 명일 수 있지만, id=1은 유일함

---

#### Foreign Key (FK) - 외래키

```
🔗 다른 테이블의 PK를 참조하는 값
```

```sql
Table portfolios {
  id integer [primary key]
  user_id integer [ref: > users.id]  -- ← 이게 FK
  name varchar
}
```

| id (PK) | user_id (FK) | name |
|---------|--------------|------|
| 1 | 1 | 은퇴 준비 |
| 2 | 1 | 단기 투자 |
| 3 | 2 | 적금 대체 |

> `user_id = 1` → users 테이블의 id=1(김철수)을 가리킴

**그림으로 보면:**

```
users                      portfolios
┌────┬───────────┐         ┌────┬─────────┬──────────┐
│ id │ nickname  │         │ id │ user_id │ name     │
├────┼───────────┤         ├────┼─────────┼──────────┤
│ 1  │ 김철수    │◄────────│ 1  │ 1       │ 은퇴준비 │
│    │           │◄────────│ 2  │ 1       │ 단기투자 │
│ 2  │ 이영희    │◄────────│ 3  │ 2       │ 적금대체 │
└────┴───────────┘         └────┴─────────┴──────────┘
```

---

### 1.3 데이터 타입 용어

| 타입 | 용도 | 예시 |
|------|------|------|
| `integer` | 정수 | id, 나이, 수량 |
| `float` / `decimal` | 소수점 | 가격, 비율 |
| `varchar` | 짧은 문자열 | 이름, 이메일 (길이 제한) |
| `text` | 긴 문자열 | 설명, 토큰 (길이 제한 없음) |
| `boolean` | 참/거짓 | 활성화 여부 |
| `timestamp` | 날짜+시간 | 생성일, 수정일 |
| `enum` | 정해진 값 중 하나 | 상태, 등급 |

---

### 1.4 enum이란?

```sql
provider enum('GOOGLE', 'KAKAO', 'APPLE')
```

> **정해진 값 중에서만** 선택 가능

| 사용 예 | 가능한 값 |
|---------|----------|
| 로그인 제공자 | GOOGLE, KAKAO, APPLE |
| 알림 주기 | DAILY, WEEKLY, MONTHLY |
| 멤버십 등급 | FREE, PRO, EXPERT |

**왜 enum을 쓰나?**

- ✅ 잘못된 값 입력 방지 (`GOOGLEE` 같은 오타 불가)
- ✅ 값이 뭐가 있는지 명확함
- ⚠️ 단점: 나중에 값 추가하려면 DB 수정 필요

---

## 2. 테이블 관계 (Relationship)

### 2.1 1:1 관계 (One-to-One)

```
한 사용자 ↔ 하나의 설정
```

```sql
Table users { id integer [primary key] }
Table settings { 
  user_id integer [ref: - users.id]  -- `-`가 1:1
}
```

> 사용자당 설정은 딱 하나

---

### 2.2 1:N 관계 (One-to-Many)

```
한 사용자 → 여러 포트폴리오
```

```sql
Table users { id integer [primary key] }
Table portfolios { 
  user_id integer [ref: > users.id]  -- `>`가 1:N
}
```

> 한 명이 여러 개 가질 수 있음

---

### 2.3 N:M 관계 (Many-to-Many)

```
여러 포트폴리오 ↔ 여러 종목 (공유)
```

직접 연결 불가 → **중간 테이블** 필요

```sql
Table portfolios { id integer [primary key] }
Table stocks { id integer [primary key] }  -- 종목 마스터

Table portfolio_stocks {  -- 중간 테이블
  portfolio_id integer [ref: > portfolios.id]
  stock_id integer [ref: > stocks.id]
  quantity float  -- 이 포트폴리오에서 몇 주?
}
```

**이게 바로 "값 공유" 문제의 해결책!**

---

## 3. 여러분 프로젝트의 설계 고민점

### 3.1 현재 스키마의 문제

현재 `portfolio_entries`:

```sql
Table portfolio_entries {
  stock_name varchar    -- 종목명만 저장
  bought_price float
  current_quantity float
}
```

**문제:**

- "삼성전자"를 3개 포트폴리오에 넣으면 3번 저장
- 삼성전자 종목코드, 시장구분 등 반복 저장
- 종목명 오타 가능 ("삼성전자" vs "삼성 전자")

---

### 3.2 해결: 종목 마스터 테이블 분리

```sql
Table stocks {  -- 종목 마스터 (공유 데이터)
  id integer [primary key]
  code varchar [unique]      -- "005930", "AAPL"
  name varchar               -- "삼성전자", "Apple Inc."
  market enum                -- KOSPI, NASDAQ
  currency enum              -- KRW, USD
}

Table portfolio_entries {  -- 보유 정보
  portfolio_id integer [ref: > portfolios.id]
  stock_id integer [ref: > stocks.id]  -- ← 종목 마스터 참조
  quantity float
  avg_price float
  target_weight float
}
```

**장점:**

- 종목 정보는 한 번만 저장 (중복 제거)
- 여러 포트폴리오에서 같은 종목 ID 참조
- 종목 정보 수정 시 한 곳만 수정

---

### 3.3 계좌와 포트폴리오 관계

현재: 연결 없음 (독립적)

```
users → accounts
users → portfolios
```

**선택지:**

| 방식 | 설명 | 적합한 경우 |
|------|------|------------|
| A. 연결 없음 | 포트폴리오는 "가상", 계좌와 무관 | 시뮬레이션/연습용 |
| B. 포트폴리오→계좌 | 포트폴리오가 특정 계좌에 소속 | 실제 계좌 연동 |
| C. N:M 연결 | 포트폴리오가 여러 계좌 종목 포함 | 복합 관리 |

> 팀과 논의해서 결정 필요!

---

## 4. 정규화 (Normalization)

### 4.1 정규화란?

> **중복을 줄이고 데이터를 쪼개는 것**

**나쁜 예 (비정규화):**

| id | 종목 | 시장 | 가격 | 포트폴리오 |
|----|------|------|------|-----------|
| 1 | 삼성전자 | KOSPI | 70000 | 은퇴준비 |
| 2 | 삼성전자 | KOSPI | 70000 | 단기투자 |

→ "삼성전자, KOSPI" 중복!

**좋은 예 (정규화):**

stocks 테이블:

| id | 종목 | 시장 |
|----|------|------|
| 1 | 삼성전자 | KOSPI |

portfolio_entries 테이블:

| stock_id | 포트폴리오 | 수량 |
|----------|-----------|------|
| 1 | 은퇴준비 | 10 |
| 1 | 단기투자 | 5 |

---

### 4.2 왜 정규화?

| 장점 | 설명 |
|------|------|
| **중복 제거** | 저장 공간 절약 |
| **수정 용이** | 한 곳만 고치면 됨 |
| **일관성** | 데이터 불일치 방지 |

| 단점 | 설명 |
|------|------|
| **JOIN 필요** | 조회할 때 테이블 합쳐야 함 |
| **복잡도** | 테이블 늘어남 |

---

## 5. 제약조건 (Constraints)

### 5.1 주요 제약조건

| 제약 | 의미 | 예시 |
|------|------|------|
| `PRIMARY KEY` | 유일 + NOT NULL | id |
| `UNIQUE` | 중복 불가 | email |
| `NOT NULL` | 빈 값 불가 | nickname |
| `DEFAULT` | 기본값 지정 | is_main = false |
| `FOREIGN KEY` | 참조 무결성 | user_id → users.id |

### 5.2 참조 무결성이란?

```sql
user_id integer [ref: > users.id]
```

> FK가 가리키는 값이 **반드시 존재해야 함**

- users에 id=1이 없으면 → portfolios에 user_id=1 저장 불가
- users에서 id=1 삭제하면 → portfolios의 user_id=1도 처리 필요

**삭제 시 동작 옵션:**

- `CASCADE`: 같이 삭제
- `SET NULL`: NULL로 변경
- `RESTRICT`: 삭제 막음

---

## 6. 개선된 스키마 제안

```sql
-- 종목 마스터 (공유)
Table stocks {
  id integer [primary key]
  code varchar [unique, not null]  -- 005930
  name varchar [not null]          -- 삼성전자
  market enum('KOSPI','KOSDAQ','NASDAQ','NYSE')
  currency enum('KRW','USD')
}

-- 포트폴리오 내 종목 (참조)
Table portfolio_entries {
  id integer [primary key]
  portfolio_id integer [ref: > portfolios.id]
  stock_id integer [ref: > stocks.id]  -- 종목 마스터 참조!
  quantity decimal(15,4)      -- 소수점 4자리
  avg_price decimal(15,2)     -- 소수점 2자리
  target_weight decimal(5,2)  -- 0.00 ~ 100.00
  created_at timestamp
}
```

**변경 포인트:**

1. `stock_name` → `stock_id`로 변경 (종목 마스터 참조)
2. `float` → `decimal`로 변경 (금융은 정밀도 중요)
3. `stocks` 테이블 분리 (중복 제거)

---

## 요약 체크리스트

```
✅ PK = 각 행을 유일하게 식별
✅ FK = 다른 테이블 참조
✅ enum = 정해진 값 중 선택
✅ 1:N = 한 쪽이 여러 개
✅ 정규화 = 중복 제거, 테이블 분리
✅ decimal = 금융 데이터에 적합 (float보다 정밀)
```

---

> 궁금한 점 있으면 질문해주세요! 😊
