# PRD 검증 결과 - Account 도메인

> 검증 일시: 2026-01-20 19:11
> 검증 범위: account 도메인 (specs/db/account/, specs/api/account/, specs/ui/account/)
> 발견된 문제: 4건 (사용자 결정 필요: 2건, AI 자동 수정 가능: 2건)

---

## 요약

| 항목             | 수량     |
| ---------------- | -------- |
| DB 스펙 파일     | 3개      |
| API 스펙 파일    | 0개      |
| UI 스펙 파일     | 0개      |
| Task 파일        | 1개      |
| 프론트매터 오류  | 0건 ✅   |
| Dead Link        | 0건 ✅   |
| Missing Backlink | 1건 ⚠️ |
| API 누락         | 1건 ⚠️ |

---

## 스펙 파일 현황

### DB 스펙 (3개)

| 파일                                                                                                               | 테이블                | Phase | 상태 |
| ------------------------------------------------------------------------------------------------------------------ | --------------------- | ----- | ---- |
| [accounts.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/account/accounts.md)                           | accounts              | P1    | ✅   |
| [account-stock-entries.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/account/account-stock-entries.md) | account_stock_entries | P1    | ✅   |
| [account-cash-entries.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/account/account-cash-entries.md)   | account_cash_entries  | P1    | ✅   |

### API/UI 스펙

- `specs/api/account/` 디렉토리 미존재
- `specs/ui/account/` 디렉토리 미존재

---

## 🔗 참조 무결성 검사

### Cross-Reference 검증

| 스펙 파일                                       | 참조 대상 | 존재 여부 |
| ----------------------------------------------- | --------- | --------- |
| accounts.md → auth/users.md                    | ✅ 존재   |           |
| accounts.md → auth/token-vault.md              | ✅ 존재   |           |
| accounts.md → account/account-stock-entries.md | ✅ 존재   |           |
| accounts.md → account/account-cash-entries.md  | ✅ 존재   |           |
| account-stock-entries.md → account/accounts.md | ✅ 존재   |           |
| account-cash-entries.md → account/accounts.md  | ✅ 존재   |           |

### ⚠️ Missing Backlink (1건)

| 발신 파일                    | 수신 파일                       | 상태           |
| ---------------------------- | ------------------------------- | -------------- |
| accounts.md → auth/users.md | users.md ← account/accounts.md | ❌ 역참조 없음 |

> [!NOTE]
> `accounts.md`가 `auth/users.md`를 참조하지만, `users.md`의 `related.db`에 `account/accounts.md`가 없습니다.
>
> `token-vault.md`는 양방향 참조가 정상입니다.

---

## 🟡 사용자 결정 필요 항목

### 1. API 스펙 생성 필요 여부

> [!IMPORTANT]
> 3개의 DB 스펙 모두 `related.api: []` 상태입니다.
> Task 파일(`task-accounts.md`)에는 API 엔드포인트가 정의되어 있으나 별도 API 스펙이 없습니다.

**Task에 정의된 API 엔드포인트:**

- `GET /api/accounts` - 계좌 목록
- `POST /api/accounts` - 계좌 생성
- `PUT /api/accounts/{id}` - 계좌 수정
- `DELETE /api/accounts/{id}` - 계좌 삭제
- `POST /api/accounts/{id}/stocks` - 종목 추가
- `PUT /api/accounts/{id}/stocks/{stockId}` - 종목 수정
- `DELETE /api/accounts/{id}/stocks/{stockId}` - 종목 삭제
- `PUT /api/accounts/{id}/cash` - 현금 잔고 수정

**선택:**

- [X] API 스펙 파일 생성 (specs/api/account/)
- [ ] Task 내 정의로 충분 (API 스펙 불필요)

---

### 2. UI 스펙 생성 필요 여부

> [!NOTE]
> Task에 정의된 화면:
>
> - 계좌 목록 화면
> - 계좌 생성/수정 모달
> - 종목 수동 입력 화면
> - 현금 잔고 입력

**선택:**

- [X] UI 스펙 파일 생성 (specs/ui/account/)
- [ ] Task 내 정의로 충분 (UI 스펙 불필요)

---

## ✅ AI가 자동 처리할 항목 (참고용)

### 1. Missing Backlink 수정

`specs/db/auth/users.md`의 `related.db`에 `account/accounts.md` 추가

**현재:**

```yaml
related:
  db:
    - specs/db/community/profiles.md
    - specs/db/community/settings.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/community/profiles.md
    - specs/db/community/settings.md
    - account/accounts.md
```

### 2. 경로 형식 통일

`users.md`의 related 경로가 `specs/db/...` 형식을 사용하고 있으나, 다른 스펙들은 `{domain}/...` 형식 사용. 통일 필요.

---

## 📂 Tasks 검증

### Phase ↔ 폴더 일치

- [task-accounts.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/tasks/P1/task-accounts.md): `phase: P1` ↔ `tasks/P1/` ✅

### Specs 참조 유효성

| Task 파일        | 참조 스펙                        | 존재 여부 |
| ---------------- | -------------------------------- | --------- |
| task-accounts.md | account/accounts.md              | ✅        |
| task-accounts.md | account/account-stock-entries.md | ✅        |
| task-accounts.md | account/account-cash-entries.md  | ✅        |

### 고아 스펙

- account 도메인 내 고아 스펙 없음 ✅

---

## ⚡ Phase 일관성

| 스펙        | Phase | 참조                | Phase | 상태 |
| ----------- | ----- | ------------------- | ----- | ---- |
| accounts.md | P1    | auth/users.md       | P1    | ✅   |
| accounts.md | P1    | auth/token-vault.md | P1    | ✅   |

---

## 📋 권장 조치

1. **사용자 결정 후 진행**: API/UI 스펙 생성 여부 결정
2. **자동 수정 요청 시**: "자동 수정 진행해줘" 입력
   - users.md에 account/accounts.md 역참조 추가
   - related 경로 형식 통일
