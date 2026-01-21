# Log 도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-log.md`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| api-call-logs.md | UPDATE | specs/db/log/api-call-logs.md | Dead Link 제거 |
| audit-logs.md | UPDATE | specs/db/log/audit-logs.md | 경로 수정 |
| error-logs.md | - | specs/db/log/error-logs.md | ✅ 검증 통과 |
| user-activities.md | UPDATE | specs/db/log/user-activities.md | 경로 수정 |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 4개
- **특이 사항**: 내부 로깅용 테이블로 API/Task 없음 정상

---

## 자동 처리 항목 [AI 수정 가능]

### 1. api-call-logs.md Dead Link 처리

**현재:**

```yaml
related:
  api:
    - ../api/admin/monitoring-api.md
```

**수정 후:**

```yaml
related:
  api: []
```

> [!NOTE]
> `monitoring-api.md`는 존재하지 않습니다.
> admin 도메인에서 모니터링 API를 생성하면 다시 연결할 수 있습니다.

### 2. audit-logs.md 경로 수정

**현재:**

```yaml
related:
  db:
    - auth/users.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/auth/users.md
```

### 3. user-activities.md 경로 수정

**현재:**

```yaml
related:
  db:
    - auth/users.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/auth/users.md
```

### 4. 관련 스펙 섹션 수정

**audit-logs.md (L56-57):**

```markdown
## 관련 스펙
- DB: `users.md`
```

→

```markdown
## 관련 스펙
- DB: `specs/db/auth/users.md`
```

**user-activities.md (L58-59):**

```markdown
## 관련 스펙
- DB: `users.md`
```

→

```markdown
## 관련 스펙
- DB: `specs/db/auth/users.md`
```

---

## 검증 통과 항목

- ✅ error-logs.md: 경로 올바름
- ✅ Phase 일관성: 모든 log 스펙 P1
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수
- ✅ 로그 테이블: Task 불필요 (내부용)

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (2건)
   - Dead Link 제거 (1건)

2. 선택 사항:
   - admin 도메인에서 `monitoring-api.md` 생성 시 다시 연결
