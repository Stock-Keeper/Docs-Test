# Community-Moderation 서브도메인 스펙 검증

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-community.md` (community-moderation 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| reports.md | - | specs/db/community/reports.md | ✅ 경로 올바름 |
| report-reasons.md | - | specs/db/community/report-reasons.md | ✅ 경로 올바름 |
| user-suspensions.md | - | specs/db/community/user-suspensions.md | ✅ 경로 올바름 |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P2 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 3개
- **특이 사항**: 모든 스펙이 이미 올바른 경로 형식(`specs/`) 사용 중

---

## ✅ 검증 통과 항목

### 경로 형식

| 스펙 | related.db 경로 | 상태 |
|------|----------------|------|
| reports.md | `specs/db/community/report-reasons.md` | ✅ 올바름 |
| report-reasons.md | `specs/db/community/reports.md` | ✅ 올바름 |
| user-suspensions.md | `specs/db/auth/users.md` | ✅ 올바름 |

### Phase 일관성

- ✅ 모든 moderation 스펙이 P2

### 네이밍 규칙

- ✅ 테이블: snake_case 준수
- ✅ 파일: kebab-case 준수

---

## 📝 참고 사항

### 내부용 스펙 (Admin 도메인)

원본 검증 파일에서 다음 스펙들은 **내부용 (admin)**으로 분류되어 Task 미참조가 정상입니다:

| 스펙 | 용도 |
|------|------|
| reports.md | 관리자 신고 처리 |
| report-reasons.md | 관리자 신고 사유 관리 |
| user-suspensions.md | 관리자 정지 처리 |

> [!NOTE]
> 이 스펙들은 커뮤니티 사용자용 API가 아닌 **관리자 백오피스용**입니다.
> 별도의 `admin` 도메인에서 API를 관리하거나, 백오피스 시스템에서 직접 DB 접근으로 처리할 수 있습니다.

### API 구조 제안 (선택)

관리자용 API가 필요한 경우:

```
specs/api/admin/
├── report-list.md        - GET /api/admin/reports
├── report-action.md      - PATCH /api/admin/reports/{id}
├── user-suspend.md       - POST /api/admin/users/{id}/suspend
└── user-unsuspend.md     - POST /api/admin/users/{id}/unsuspend
```

---

## 다음 단계

1. ✅ **자동 처리 불필요**: 모든 경로가 이미 올바른 형식
2. 선택 사항:
   - 관리자 API 필요 시 `admin` 도메인 스펙 생성
   - 고아 스펙 상태 유지 (내부용이므로 정상)

---

## 결론

> **이 서브도메인은 수정 사항이 없습니다.**
>
> 모든 스펙이 이미 올바른 경로 형식을 사용하고 있으며,
> 내부 관리자용이므로 별도 API 스펙이 없어도 정상입니다.
