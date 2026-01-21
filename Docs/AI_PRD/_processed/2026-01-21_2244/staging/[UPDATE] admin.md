# Admin 도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-20 admin.md`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| error-logs.md | NEW | - | DB 스펙 생성 필요 |
| stats-users.md | NEW | - | API 스펙 생성 필요 |
| stats-portfolios.md | NEW | - | API 스펙 생성 필요 |
| monitoring-errors.md | UPDATE | specs/api/admin/monitoring-errors.md | Dead Link 수정 |
| stats-overview.md | UPDATE | specs/api/admin/stats-overview.md | Dead Link 수정 |
| users-role.md | UPDATE | specs/api/admin/users-role.md | 경로 수정 |
| users-status.md | UPDATE | specs/api/admin/users-status.md | 경로 수정 |
| users-list.md (UI) | UPDATE | specs/ui/admin/users-list.md | 역참조 추가 |
| announcements-list.md | UPDATE | specs/api/admin/announcements-list.md | 역참조 추가 |

## AI 분석 결과

- **추론 유형**: db / api
- **추론 Phase**: P1
- **비교한 기존 스펙 파일**: 13개 (admin 도메인 전체)
  - DB: 2개 (`admin-logs.md`, `announcements.md`)
  - API: 9개
  - UI: 2개 (`dashboard.md`, `users-list.md`)

---

## error-logs.md [NEW]

### 정형화된 초안

```yaml
---
type: db
phase: P1
table: error_logs
related:
  api:
    - admin/monitoring-errors.md
---
```

```markdown
# error_logs 테이블

## 개요
시스템 에러 로그 저장 및 모니터링

## 스키마
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | INTEGER | Y | PK, AUTO_INCREMENT |
| error_type | VARCHAR(50) | Y | 에러 유형 |
| message | TEXT | Y | 에러 메시지 |
| stack_trace | TEXT | N | 스택 트레이스 |
| user_id | INTEGER | N | 발생 사용자 (FK) |
| endpoint | VARCHAR(255) | N | 발생 API 엔드포인트 |
| created_at | TIMESTAMP | Y | 발생 시간 |

## 관련 스펙
- API: `monitoring-errors.md`
```

---

## stats-users.md [NEW]

### 정형화된 초안

```yaml
---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/stats/users
auth: admin
related:
  db:
    - auth/users.md
  api:
    - admin/stats-overview.md
---
```

```markdown
# GET /api/admin/stats/users

## 개요
사용자 통계 상세 조회

## 스펙

### Request
- **URL**: `/api/admin/stats/users`
- **Method**: GET
- **Auth**: Admin Bearer Token 필수
- **Query Params**:
  - `period`: day | week | month (기본: week)

## Response

### 성공 (200)
```json
{
  "total_users": 1234,
  "active_users": 890,
  "new_users_period": 45,
  "chart_data": [...]
}
```

## 관련 스펙

- DB: `auth/users.md`
- API: `stats-overview.md`

```

---

## stats-portfolios.md [NEW]

### 정형화된 초안

```yaml
---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/stats/portfolios
auth: admin
related:
  db:
    - portfolio/portfolios.md
  api:
    - admin/stats-overview.md
---
```

```markdown
# GET /api/admin/stats/portfolios

## 개요
포트폴리오 통계 상세 조회

## 스펙

### Request
- **URL**: `/api/admin/stats/portfolios`
- **Method**: GET
- **Auth**: Admin Bearer Token 필수
- **Query Params**:
  - `period`: day | week | month (기본: week)

## Response

### 성공 (200)
```json
{
  "total_portfolios": 5678,
  "active_portfolios": 4500,
  "new_portfolios_period": 120,
  "chart_data": [...]
}
```

## 관련 스펙

- DB: `portfolio/portfolios.md`
- API: `stats-overview.md`

```

---

## 자동 처리 항목 [AI 수정 가능]

### 1. Dead Link 수정 (5건)

| 파일 | 현재 참조 | 조치 |
|------|----------|------|
| monitoring-errors.md | `../../db/error-logs.md` | → `../../db/admin/error-logs.md` (NEW 파일 생성 후) |
| monitoring-errors.md | `monitoring-errors-detail.md` | ⚠️ 참조 제거 또는 파일 생성 필요 |
| stats-overview.md | `stats-users.md` | → NEW 파일로 해결 |
| stats-overview.md | `stats-portfolios.md` | → NEW 파일로 해결 |
| users-list.md (UI) | `admin-user-detail-modal.md` | ⚠️ 참조 제거 또는 파일 생성 필요 |

### 2. 프론트매터 경로 수정 (3건)

| 파일 | 현재 경로 | 수정 후 |
|------|----------|--------|
| users-role.md | `../../db/admin-logs.md` | `../../db/admin/admin-logs.md` |
| users-status.md | `../../db/admin-logs.md` | `../../db/admin/admin-logs.md` |
| users-status.md | `../../db/users.md` | `../../db/auth/users.md` |

### 3. 양방향 참조 추가 (2건)

| 대상 파일 | 추가할 역참조 |
|----------|-------------|
| users-list.md (UI) | `related.ui: [admin/dashboard.md]` 추가 |
| announcements-list.md (API) | `related.db` 경로 형식 통일 |

---

## 확인 필요 사항

> [!IMPORTANT]
> 사용자가 결정해야 할 항목이 완료되었습니다 (원본에서 체크됨).

### 완료된 결정 사항

1. **error-logs.md 생성**: ✅ 선택됨
2. **stats-users.md, stats-portfolios.md 생성**: ✅ 선택됨 (P1)

### 추가 확인 필요

> [!WARNING]
> 다음 Dead Link는 추가 결정이 필요합니다:

- `monitoring-errors-detail.md` - 생성 또는 참조 제거?
- `admin-user-detail-modal.md` - 생성 또는 참조 제거?

---

## 다음 단계

1. **위 추가 확인 필요 항목** 결정
2. `/prd-process` 실행 시:
   - 3개 NEW 스펙 생성 (error-logs.md, stats-users.md, stats-portfolios.md)
   - 7건 자동 수정 적용
