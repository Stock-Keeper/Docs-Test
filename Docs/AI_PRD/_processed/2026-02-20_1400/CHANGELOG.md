# CHANGELOG — 2026-02-20_1400

> 📅 처리일: 2026-02-20
> 📦 배치: 2026-02-20_1400
> 🔍 원본: `[VALIDATE] all-2026-02-20-2.md` (전수 검사 결과 기반 수정)

---

## 신규 생성 (NEW) — 0건

없음

---

## 업데이트 (UPDATE) — 12건

### 본문 상대경로 수정 (`../api/` → `../../api/`)

#### DB 스펙 (5개 파일)

| 파일                                             | 변경 내용                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| `specs/db/notification/notifications.md`         | FM+Body: `../api/notification/list.md`, `read.md` → `specs/api/` / `../../api/` |
| `specs/db/notification/notification-settings.md` | FM+Body: `../api/notification/settings.md` → `specs/api/` / `../../api/`        |
| `specs/db/log/error-logs.md`                     | FM+Body: `../api/admin/monitoring-errors.md` → `specs/api/` / `../../api/`      |
| `specs/db/community/post-likes.md`               | Body: `../api/community/like.md` → `../../api/`                                 |

#### UI 스펙 (7개 파일)

| 파일                                | 변경 내용                                                                |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `specs/ui/admin/dashboard.md`       | Body: `../api/admin/stats-overview.md` → `../../api/`                    |
| `specs/ui/admin/users-list.md`      | Body: `../api/admin/users-list.md` → `../../api/`                        |
| `specs/ui/auth/login-screen.md`     | Body: `../api/auth/google-callback.md` → `../../api/auth/auth-google.md` |
| `specs/ui/auth/profile-input.md`    | Body: `../api/auth/profile-update.md` → `../../api/`                     |
| `specs/ui/community/search.md`      | Body: `../api/community/search.md` → `../../api/`                        |
| `specs/ui/notification/center.md`   | Body: `../api/notification/list.md`, `read.md` → `../../api/`            |
| `specs/ui/notification/settings.md` | Body: `../api/notification/settings.md` → `../../api/`                   |

---

## 삭제 (DELETE) — 0건

없음

---

## 요약

- 본문(관련 스펙) 및 프론트매터 내 상대경로 Dead Link 일괄 수정
- `../api/` (잘못된 계층) → `../../api/` (올바른 계층) 통일
- `login-screen.md`의 `google-callback.md` → `auth-google.md` 리네임 반영
- 프론트매터 참조 형식 `specs/api/...` 통일
