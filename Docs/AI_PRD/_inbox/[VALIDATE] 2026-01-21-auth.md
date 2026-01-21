# PRD 검증 결과 - Auth 도메인

> 검증 일시: 2026-01-21 00:01
> 검증 범위: auth 도메인
> 발견된 문제: **12건** (사용자 결정 필요: 1건, AI 자동 수정 가능: 11건)

---

## 요약

| 항목 | 수량 |
|------|------|
| 검증 DB 스펙 | 4개 |
| 검증 API 스펙 | 8개 |
| 검증 UI 스펙 | 2개 |
| 검증 Task 파일 | 1개 |
| **총 스펙 파일** | **14개** |
| **발견된 문제** | **12건** |

---

## ❌ Dead Link (7건)

존재하지 않는 파일을 참조하고 있습니다.

| 소스 파일 | 참조 경로 | 상태 |
|----------|----------|------|
| [auth-google.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/auth-google.md#L10-L11) | `../../db/users.md` | ❌ 잘못된 상대경로 |
| [auth-google.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/auth-google.md#L11) | `../../db/refresh-tokens.md` | ❌ 파일 없음 |
| [google-callback.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/google-callback.md#L10-L11) | `../../db/users.md` | ❌ 잘못된 상대경로 |
| [google-callback.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/google-callback.md#L11) | `../../db/refresh-tokens.md` | ❌ 파일 없음 |
| [logout.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/logout.md#L10) | `../../db/refresh-tokens.md` | ❌ 파일 없음 |
| [profile-update.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/profile-update.md#L10) | `../../db/users.md` | ❌ 잘못된 상대경로 |
| [refresh.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/refresh.md#L13) | `../../db/refresh-tokens.md` | ❌ 파일 없음 |

> [!IMPORTANT]
> **`refresh-tokens.md` 파일이 존재하지 않습니다!**
> - `token-vault.md`와 역할이 중복되는 것으로 보입니다.
> - 아래 "중복 해결" 섹션에서 결정해주세요.

---

## 🔴 중복 의심 (1건)

### 1. `refresh-tokens` ↔ `token-vault`

| 항목 | refresh-tokens | token-vault |
|------|----------------|-------------|
| 상태 | ❌ 파일 없음 | ✅ 존재 |
| 용도 | Refresh Token 저장 | 암호화 토큰 저장소 |
| 참조 API | auth-google, google-callback, logout, refresh | (없음) |

**권장 조치**:
- [ ] `token-vault.md`가 refresh token 기능을 포함하도록 API 참조 경로 수정
- [ ] 별도 `refresh-tokens.md` 생성 필요

---

## ⚠️ 경로 표기 불일치 (4건)

상대경로와 절대경로(specs/ 기준)가 혼용되어 있습니다.

| 파일 | 현재 방식 | 권장 방식 |
|------|----------|----------|
| [settings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/auth/settings.md#L6-L7) | `auth/users.md` | `specs/db/auth/users.md` |
| [token-vault.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/auth/token-vault.md#L6-L8) | `auth/users.md`, `account/accounts.md` | 절대경로로 변경 필요 |
| [consents-get.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/consents-get.md#L7-L8) | `user-consents.md` | `specs/db/auth/user-consents.md` |
| [consents-update.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/consents-update.md#L7-L8) | `user-consents.md` | `specs/db/auth/user-consents.md` |
| [terms.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/terms.md#L7-L8) | `user-consents.md` | `specs/db/auth/user-consents.md` |

---

## 🔗 양방향 참조 누락 (0건)

✅ 양방향 참조가 올바르게 설정되어 있습니다.

---

## ⚡ Phase 불일치 (0건)

✅ 모든 auth 도메인 스펙이 P1으로 일관성 있게 설정되어 있습니다.

---

## 📝 프론트매터 검증 (0건)

✅ 모든 필수 필드가 존재합니다.

| 파일 유형 | 필수 필드 | 상태 |
|----------|----------|------|
| DB 스펙 | type, phase, table, related | ✅ |
| API 스펙 | type, phase, endpoint, method, related | ✅ |
| UI 스펙 | type, phase, screen, related | ✅ |

---

## 📂 Tasks 검증

### Phase ↔ 폴더 일치 (0건)
✅ `task-auth.md`가 `tasks/P1/`에 올바르게 위치

### Specs 참조 유효성 (0건)
✅ Task 파일의 모든 specs 참조가 유효함

| 참조 유형 | 참조 수 | 유효 |
|----------|--------|------|
| specs.api | 7개 | ✅ |
| specs.db | 4개 | ✅ |
| specs.ui | 2개 | ✅ |

### 고아 스펙 (1건)

| 스펙 파일 | 상태 | 권장 |
|-----------|------|------|
| [auth-google.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/auth/auth-google.md) | Task에 미참조 | ⚠️ 중복 파일로 보임 (google-callback.md와 동일 엔드포인트) |

> [!WARNING]
> `auth-google.md`와 `google-callback.md`가 동일한 엔드포인트(`/api/auth/google/callback`)를 정의하고 있습니다.
> 하나를 삭제하거나 통합이 필요합니다.

---

## ✅ AI가 자동 처리할 항목 (참고용)

아래 항목들은 "자동 수정 진행해줘" 요청 시 AI가 처리합니다:

| 항목 | 수량 | 내용 |
|------|------|------|
| Dead Link 경로 수정 | 7건 | 상대경로 → 절대경로(specs/ 기준) 변경 |
| 경로 표기 통일 | 4건 | 혼용된 경로 표기 통일 |

---

## 🔴 사용자 결정 필요 항목

### 1. refresh-tokens 처리 방안

여러 API에서 `refresh-tokens.md`를 참조하지만 해당 파일이 존재하지 않습니다.
대신 유사한 기능의 `token-vault.md`가 있습니다.

**선택해주세요:**
- [ ] **Option A**: `token-vault.md`로 참조 경로 일괄 변경 (토큰 저장소 통합)
- [ ] **Option B**: 새로 `refresh-tokens.md` 생성 필요 (별도 관리)

### 2. auth-google.md 중복 처리

`auth-google.md`와 `google-callback.md`가 동일한 API 엔드포인트를 정의합니다.

**선택해주세요:**
- [ ] **Option A**: `auth-google.md` 삭제 (google-callback.md 유지)
- [ ] **Option B**: `google-callback.md` 삭제 (auth-google.md 유지)
- [ ] **Option C**: 두 파일 병합

---

## 다음 단계

1. 위 "사용자 결정 필요 항목" 체크박스에서 옵션 선택
2. 선택 후 **"자동 수정 진행해줘"** 요청
3. AI가 Dead Link 수정 + 경로 통일 + 사용자 선택 항목 반영
