# Auth 도메인 스펙 업데이트

## 원본 출처

> 원본 파일: `[VALIDATE] 2026-01-21-auth.md`

## 항목별 작업 요약

| 항목           | 작업    | 기존 스펙                     | 비고             |
| -------------- | ------- | ----------------------------- | ---------------- |
| auth-google.md | DELETE? | specs/api/auth/auth-google.md | 중복 - 결정 필요 |
| 7개 API 스펙   | UPDATE  | Dead Link 수정                | 경로 수정        |
| 4개 파일       | UPDATE  | 경로 표기 불일치              | 표기 통일        |

## AI 분석 결과

- **추론 유형**: api (수정 위주)
- **추론 Phase**: P1
- **비교한 기존 스펙 파일**: 14개 (auth 도메인 전체)
  - DB: 4개 (`users.md`, `token-vault.md`, `settings.md`, `user-consents.md`)
  - API: 8개
  - UI: 2개 (`login-screen.md`, `profile-input.md`)

---

## 자동 처리 항목 [AI 수정 가능] (11건)

### 1. Dead Link 수정 (7건)

`refresh-tokens.md` 참조를 `token-vault.md`로 변경 (원본에서 선택됨)

| 파일               | 현재 참조                      | 수정 후                          |
| ------------------ | ------------------------------ | -------------------------------- |
| auth-google.md     | `../../db/users.md`          | `../../db/auth/users.md`       |
| auth-google.md     | `../../db/refresh-tokens.md` | `../../db/auth/token-vault.md` |
| google-callback.md | `../../db/users.md`          | `../../db/auth/users.md`       |
| google-callback.md | `../../db/refresh-tokens.md` | `../../db/auth/token-vault.md` |
| logout.md          | `../../db/refresh-tokens.md` | `../../db/auth/token-vault.md` |
| profile-update.md  | `../../db/users.md`          | `../../db/auth/users.md`       |
| refresh.md         | `../../db/refresh-tokens.md` | `../../db/auth/token-vault.md` |

### 2. 경로 표기 통일 (4건)

| 파일               | 현재 방식               | 수정 후                            |
| ------------------ | ----------------------- | ---------------------------------- |
| settings.md        | `auth/users.md`       | `specs/db/auth/users.md`         |
| token-vault.md     | `auth/users.md`       | `specs/db/auth/users.md`         |
| token-vault.md     | `account/accounts.md` | `specs/db/account/accounts.md`   |
| consents-get.md    | `user-consents.md`    | `specs/db/auth/user-consents.md` |
| consents-update.md | `user-consents.md`    | `specs/db/auth/user-consents.md` |
| terms.md           | `user-consents.md`    | `specs/db/auth/user-consents.md` |

---

## 확인 필요 사항

> [!IMPORTANT]
> 사용자가 결정해야 할 항목이 2건 있습니다.

### 1. refresh-tokens 처리 방안

여러 API에서 `refresh-tokens.md`를 참조하지만 해당 파일이 존재하지 않습니다.
대신 유사한 기능의 `token-vault.md`가 있습니다.

**원본에서 선택됨:**

- [X] **Option A**: `token-vault.md`로 참조 경로 일괄 변경 (토큰 저장소 통합)
- [ ] **Option B**: 새로 `refresh-tokens.md` 생성 필요 (별도 관리)

### 2. auth-google.md 중복 처리 ⚠️

> [!WARNING]
> `auth-google.md`와 `google-callback.md`가 동일한 API 엔드포인트(`/api/auth/google/callback`)를 정의합니다.

**선택이 필요합니다:**

- [ ] **Option A**: `auth-google.md` 삭제 (google-callback.md 유지)
- [X] **Option B**: `google-callback.md` 삭제 (auth-google.md 유지)
- [ ] **Option C**: 두 파일 병합

---

## 검증 통과 항목

| 항목                 | 상태                                |
| -------------------- | ----------------------------------- |
| Phase 일관성         | ✅ 모든 auth 스펙이 P1              |
| 프론트매터 필수 필드 | ✅ 존재                             |
| Task Phase 일치      | ✅`task-auth.md` → `tasks/P1/` |
| 양방향 참조          | ✅ 올바르게 설정됨                  |

---

## 다음 단계

1. **중복 파일 처리 방안 결정** (auth-google.md vs google-callback.md)
2. `/prd-process` 실행 시:
   - Dead Link 7건 수정
   - 경로 표기 4건 통일
   - 중복 파일 처리 (사용자 선택에 따라)
