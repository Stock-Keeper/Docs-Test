# PRD 검증 결과 (admin 도메인)

> 검증 일시: 2026-01-20 23:50
> 검증 범위: admin 도메인
> 발견된 문제: **9건** (사용자 결정 필요: 2건, AI 자동 수정 가능: 7건)

---

## 📊 검증 요약

| 항목                   | 수량           |
| ---------------------- | -------------- |
| DB 스펙 파일           | 2개            |
| API 스펙 파일          | 9개            |
| UI 스펙 파일           | 2개            |
| Task 파일              | 3개            |
| **총 스펙 파일** | **13개** |

---

## ❌ Dead Link (5건)

참조된 파일이 존재하지 않습니다.

| 파일                                                                                                      | 참조 경로                       | 상태         |
| --------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------ |
| [monitoring-errors.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/monitoring-errors.md) | `../../db/error-logs.md`      | ❌ 파일 없음 |
| [monitoring-errors.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/monitoring-errors.md) | `monitoring-errors-detail.md` | ❌ 파일 없음 |
| [stats-overview.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/stats-overview.md)       | `stats-users.md`              | ❌ 파일 없음 |
| [stats-overview.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/stats-overview.md)       | `stats-portfolios.md`         | ❌ 파일 없음 |
| [users-list.md (UI)](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/admin/users-list.md)           | `admin-user-detail-modal.md`  | ❌ 파일 없음 |

---

## 🔴 사용자 결정 필요 (2건)

### 1. 누락된 DB 스펙: `error-logs.md`

`monitoring-errors.md` API가 `error-logs` 테이블을 참조하지만, 해당 DB 스펙이 존재하지 않습니다.

**결정 필요:**

- [X] `specs/db/admin/error-logs.md` 생성 필요
- [ ] 참조 제거 (error_logs 테이블은 사용하지 않음)
- [ ] 기타: ________________

### 2. 미구현 API 스펙 결정

다음 API들이 `stats-overview.md`에서 참조되지만 존재하지 않습니다:

- `stats-users.md` - 사용자 통계 API
- `stats-portfolios.md` - 포트폴리오 통계 API

**결정 필요:**

- [X] 두 API 스펙 생성 필요 (P1)
- [ ] stats-overview에서 단독 제공, 참조 제거
- [ ] P2로 연기
- [ ] 기타: ________________

---

## 🟡 양방향 참조 누락 (2건)

A → B 참조가 있지만 B → A 역참조가 없습니다.

| 파일 A                                                                                                | 참조 →                         | 파일 B                                                                                                      | 역참조 상태             |
| ----------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------- |
| [dashboard.md (UI)](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/admin/dashboard.md)         | `users-list.md`               | [users-list.md (UI)](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/admin/users-list.md)             | ⚠️ 역참조 없음        |
| [announcements.md (DB)](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/admin/announcements.md) | `admin/announcements-list.md` | [announcements-list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/announcements-list.md) | ⚠️ 역참조 경로 불일치 |

---

## ⚠️ 프론트매터 경로 불일치 (3건)

DB 스펙과 API 스펙 간의 related 경로가 일관되지 않습니다.

| 파일                                                                                            | 현재 경로                  | 권장 경로                        |
| ----------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------- |
| [users-role.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/users-role.md)     | `../../db/admin-logs.md` | `../../db/admin/admin-logs.md` |
| [users-status.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/users-status.md) | `../../db/admin-logs.md` | `../../db/admin/admin-logs.md` |
| [users-status.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/users-status.md) | `../../db/users.md`      | `../../db/auth/users.md`       |

---

## 🔵 Task Specs 참조 불일치 (1건)

Task 파일의 specs 경로가 실제 파일 위치와 다릅니다.

| Task 파일                                                                                                        | 참조 경로                      | 실제 경로 |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------- |
| [task-admin-announcements.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/tasks/P1/task-admin-announcements.md) | `db: admin/announcements.md` | ✅ 존재   |

> 참고: task 파일의 specs 경로는 `specs/` 기준 상대 경로입니다.

---

## 📂 고아 스펙 (Task 미참조) (2건)

다음 스펙은 어떤 task 파일에서도 참조되지 않습니다.

| 스펙 파일                                                                                                 | 권장 조치                           |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [monitoring-errors.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/admin/monitoring-errors.md) | task 할당 필요 또는 제거            |
| [admin-logs.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/admin/admin-logs.md)                | 내부 로그 테이블 (task 불필요 가능) |

> `admin-logs.md`는 로그 테이블로 별도 task 없이 사용될 수 있습니다.

---

## ✅ AI가 자동 처리할 항목 (참고용)

다음 항목은 사용자 승인 시 자동으로 수정할 수 있습니다:

| 항목                 | 수량 | 수정 내용                |
| -------------------- | ---- | ------------------------ |
| 프론트매터 경로 수정 | 3건  | 올바른 상대 경로로 변경  |
| 양방향 참조 추가     | 2건  | 역참조 related 필드 추가 |
| Dead Link 제거       | 2건  | 존재하지 않는 참조 제거  |

---

## 📋 검증 통과 항목

| 항목                 | 상태                          |
| -------------------- | ----------------------------- |
| Phase 일관성         | ✅ 모든 admin 스펙이 P1       |
| Task Phase 일치      | ✅ 모든 task가 P1 폴더에 위치 |
| 파일명 네이밍        | ✅ kebab-case 준수            |
| 테이블명 네이밍      | ✅ snake_case 준수            |
| 프론트매터 필수 필드 | ✅ type, phase 존재           |

---

## 다음 단계

1. **사용자 결정 필요 항목**에서 옵션을 선택해주세요.
2. 선택 후 "자동 수정 진행해줘" 라고 요청하시면 AI가 수정을 진행합니다.
3. 새로운 스펙 파일 생성이 필요한 경우 `/prd-prepare` 워크플로우를 사용하세요.
