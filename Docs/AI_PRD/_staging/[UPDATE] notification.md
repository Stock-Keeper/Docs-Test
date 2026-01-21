# Notification 도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 notification.md`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| fcm-token.md | UPDATE | specs/api/notification/fcm-token.md | Dead Link 수정 |
| device-tokens.md | UPDATE | specs/db/notification/device-tokens.md | Backlink 추가 + 경로 수정 |
| notifications.md | - | specs/db/notification/notifications.md | ✅ 검증 통과 |
| notification-settings.md | - | specs/db/notification/notification-settings.md | ✅ 검증 통과 |
| notification-types.md | - | specs/db/notification/notification-types.md | ✅ 검증 통과 |
| list.md | - | specs/api/notification/list.md | ✅ 검증 통과 |
| read.md | - | specs/api/notification/read.md | ✅ 검증 통과 |
| settings.md | - | specs/api/notification/settings.md | ✅ 검증 통과 |

## AI 분석 결과

- **추론 유형**: db/api/ui
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 10개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. fcm-token.md Dead Link 수정

**현재:**

```yaml
related:
  db:
    - ../../db/fcm-tokens.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/notification/device-tokens.md
```

> [!NOTE]
> `fcm-tokens.md` 파일은 존재하지 않습니다.
> 실제 파일명은 `device-tokens.md`입니다.

### 2. device-tokens.md Backlink 추가 + 경로 수정

**현재:**

```yaml
related:
  db:
    - auth/users.md
  api: []
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/auth/users.md
  api:
    - specs/api/notification/fcm-token.md
```

### 3. 관련 스펙 섹션 수정

**fcm-token.md (L84-85):**

```markdown
## 관련 스펙
- DB: `../db/fcm-tokens.md`
```

→

```markdown
## 관련 스펙
- DB: `specs/db/notification/device-tokens.md`
```

**device-tokens.md (L46-47):**

```markdown
## 관련 스펙
- DB: `users.md`
```

→

```markdown
## 관련 스펙
- DB: `specs/db/auth/users.md`
- API: `specs/api/notification/fcm-token.md`
```

---

## 검증 통과 항목

- ✅ notifications.md: 올바른 경로
- ✅ notification-settings.md: 올바른 경로
- ✅ notification-types.md: 올바른 경로
- ✅ list.md, read.md, settings.md (API): 검증 통과
- ✅ center.md, settings.md (UI): 검증 통과
- ✅ Phase 일관성: 모든 notification 스펙 P1
- ✅ Task 검증: `task-notification.md` 참조 유효

---

## 다음 단계

1. `/prd-process` 실행 시:
   - Dead Link 수정 (fcm-tokens.md → device-tokens.md)
   - Backlink 추가 (device-tokens.md ← fcm-token.md)
   - 경로 표기 통일 (auth/users.md → specs/db/auth/users.md)
