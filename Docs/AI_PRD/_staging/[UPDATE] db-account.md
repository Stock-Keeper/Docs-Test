# Account DB 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-20 account.md`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 |
|------|------|----------|
| accounts.md | UPDATE | specs/db/account/accounts.md |
| account-stock-entries.md | - | specs/db/account/account-stock-entries.md |
| account-cash-entries.md | - | specs/db/account/account-cash-entries.md |
| API 스펙 | NEW | - (결정 필요) |
| UI 스펙 | NEW | - (결정 필요) |

## AI 분석 결과

- **추론 유형**: db / api / ui
- **추론 Phase**: P1
- **연관 기존 스펙**:
  - specs/db/account/accounts.md
  - specs/db/account/account-stock-entries.md
  - specs/db/account/account-cash-entries.md
  - specs/db/auth/users.md (외부 참조)
  - specs/db/auth/token-vault.md (외부 참조)
- **비교한 기존 스펙 파일**: 3개 (account 도메인 전체)

---

## 자동 처리 항목 [AI 수정 가능]

### 1. Missing Backlink 수정

**대상**: `specs/db/auth/users.md`

`accounts.md`가 `auth/users.md`를 참조하지만, `users.md`의 `related.db`에 `account/accounts.md`가 없습니다.

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

**대상**: `specs/db/auth/users.md`

`users.md`의 related 경로가 `specs/db/...` 형식을 사용하고 있으나, 다른 스펙들은 `{domain}/...` 형식 사용.

**권장**: `{domain}/...` 형식으로 통일

---

## 확인 필요 사항

> [!IMPORTANT]
> 사용자가 결정해야 할 항목이 2건 있습니다.

### 사용자 결정 필요

#### 1. API 스펙 생성 여부

3개의 DB 스펙 모두 `related.api: []` 상태입니다.
Task 파일(`task-accounts.md`)에는 API 엔드포인트가 정의되어 있으나 별도 API 스펙이 없습니다.

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

- [X] API 스펙 파일 생성 (specs/api/account/) ← 원본에서 체크됨
- [ ] Task 내 정의로 충분 (API 스펙 불필요)

#### 2. UI 스펙 생성 여부

**Task에 정의된 화면:**

- 계좌 목록 화면
- 계좌 생성/수정 모달
- 종목 수동 입력 화면
- 현금 잔고 입력

**선택:**

- [X] UI 스펙 파일 생성 (specs/ui/account/) ← 원본에서 체크됨
- [ ] Task 내 정의로 충분 (UI 스펙 불필요)

---

## 다음 단계

1. **사용자 결정이 이미 완료됨** (원본에서 체크 표시됨)
   - API 스펙: 생성 필요 ✅
   - UI 스펙: 생성 필요 ✅

2. **자동 수정 진행 시**: `/prd-process` 실행
   - users.md에 account/accounts.md 역참조 추가
   - related 경로 형식 통일
   - API 스펙 초안 생성 (specs/api/account/)
   - UI 스펙 초안 생성 (specs/ui/account/)
