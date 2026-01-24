---
batch: 2026-01-23_2100
domain: log
type: update
---
# 로그(Log) 도메인 스펙 보안

## 1. 개요

인증(Auth) UI/UX 업데이트(`01_login.md`)에 따라 보안 감사 로그에 로그인 실패 기록 기능을 추가합니다.

## 2. 변경 사항 요약

| 구분         | 항목           | 변경 내용                           |
| ------------ | -------------- | ----------------------------------- |
| **DB** | `audit_logs` | action ENUM에 `LOGIN_FAILED` 추가 |

## 3. 상세 스펙 변경

### A. [DB] `specs/db/log/audit-logs.md`

#### 수정: action ENUM

로그인 실패 이벤트를 명시적으로 추적하기 위해 ENUM 값을 추가합니다.

```sql
-- AS-IS
action ENUM('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT')

-- TO-BE
action ENUM('LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT')
```

> **참고**: `LOGIN_FAILED` 시 `new_value` 또는 `metadata` (현재 스키마엔 없지만 `new_value` JSON 활용 가능)에 실패 사유(예: "Invalid Password", "OAuth Error")를 기록하는 것을 권장합니다.

## 4. AI 분석 및 확인 사항

### 🔍 논리적 검증

- **Auth 도메인 연동**: `LoginService`에서 로그인 실패 시 `audit_logs`에 INSERT 하는 로직이 추가되어야 합니다.
- **기존 스키마 호환**: ENUM 변경은 `ALTER TABLE`이 필요하지만, 아직 P1 단계이므로 설계 변경으로 처리합니다.

### ❓ 확인 필요 사항

#### 1. 로그인 실패 사유 기록 방식

`LOGIN_FAILED` 발생 시 실패 원인(비밀번호 틀림, 계정 잠김 등)을 어디에 저장할까요?

- [X] **옵션 A (new_value 활용)**: `new_value = {"reason": "INVALID_PASSWORD"}` 형태로 저장
- [ ] **옵션 B (컬럼 추가)**: `metadata` 또는 `reason` 컬럼을 `audit_logs` 테이블에 정식 추가
- [ ] 기타: ________________
