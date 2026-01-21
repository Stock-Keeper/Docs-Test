# PRD 검증 결과 - notification 도메인

> 검증 일시: 2026-01-21 00:24
> 발견된 문제: **2건** (사용자 결정 필요: 0건, AI 자동 수정 가능: 2건)

---

## 📋 요약

| 항목 | 수량 |
|------|------|
| DB 스펙 파일 | 4개 |
| API 스펙 파일 | 4개 |
| UI 스펙 파일 | 2개 |
| Task 파일 | 1개 |
| **총 스펙 파일** | **10개** |
| **문제 발견** | **2건** |

---

## ❌ Dead Link (1건)

| 파일 | 참조 경로 | 문제 | 권장 조치 |
|------|----------|------|----------|
| [fcm-token.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/notification/fcm-token.md) | `../../db/fcm-tokens.md` | 파일 미존재 | `notification/device-tokens.md`로 수정 |

> **원인 분석**: API 스펙에서 `fcm-tokens.md`를 참조하지만, 실제 DB 스펙 파일명은 `device-tokens.md`입니다.

---

## 🔗 Missing Backlink (1건)

| 파일 | 필드 | 문제 | 권장 조치 |
|------|------|------|----------|
| [device-tokens.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/notification/device-tokens.md) | `related.api` | 역참조 누락 | `notification/fcm-token.md` 추가 |

> **원인 분석**: `device-tokens.md`의 `related.api`가 비어있어 `fcm-token.md`와의 양방향 참조가 누락되었습니다.

---

## ✅ 정상 항목

### 프론트매터 필수 필드
✅ 모든 스펙 파일에 필수 필드 존재

| 타입 | 필수 필드 | 상태 |
|------|----------|------|
| DB | type, phase, table, related | ✅ |
| API | type, phase, endpoint, method, related | ✅ |
| UI | type, phase, screen, related | ✅ |

### Phase 일관성
✅ 모든 스펙이 **P1**으로 일관됨

### 중복 검출
✅ 도메인 내 중복 없음

### Task 검증
✅ `task-notification.md`의 모든 스펙 참조 유효

---

## ✅ AI가 자동 처리할 항목 (참고용)

다음 항목들은 AI가 자동으로 수정할 수 있습니다:

### 1. Dead Link 수정

**파일**: `specs/api/notification/fcm-token.md`

```diff
related:
  db:
-   - ../../db/fcm-tokens.md
+   - ../../db/notification/device-tokens.md
```

### 2. Missing Backlink 수정

**파일**: `specs/db/notification/device-tokens.md`

```diff
related:
  db:
    - auth/users.md
- api: []
+ api:
+   - notification/fcm-token.md
```

---

## 📂 스펙 파일 목록

### DB (4개)

| 파일 | 테이블명 | Phase |
|------|----------|-------|
| [device-tokens.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/notification/device-tokens.md) | device_tokens | P1 |
| [notification-settings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/notification/notification-settings.md) | notification_settings | P1 |
| [notification-types.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/notification/notification-types.md) | notification_types | P1 |
| [notifications.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/notification/notifications.md) | notifications | P1 |

### API (4개)

| 파일 | 엔드포인트 | 메서드 | Phase |
|------|-----------|--------|-------|
| [fcm-token.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/notification/fcm-token.md) | /api/notifications/fcm-token | POST | P1 |
| [list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/notification/list.md) | /api/notifications | GET | P1 |
| [read.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/notification/read.md) | /api/notifications/{id}/read | PATCH | P1 |
| [settings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/notification/settings.md) | /api/notifications/settings | GET/PUT | P1 |

### UI (2개)

| 파일 | 화면명 | Phase |
|------|--------|-------|
| [center.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/notification/center.md) | 알림 센터 화면 | P1 |
| [settings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/notification/settings.md) | 알림 설정 화면 | P1 |

---

## 다음 단계

자동 수정을 원하시면 다음과 같이 요청하세요:

```
자동 수정 진행해줘
```
