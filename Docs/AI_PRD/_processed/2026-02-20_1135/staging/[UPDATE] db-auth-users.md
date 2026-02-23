---
type: db
phase: P1
table: users
related:
    api:
        - specs/api/auth/auth-google.md
        - specs/api/auth/profile-update.md
    db:
        - specs/db/community/profiles.md
        - specs/db/community/settings.md
        - specs/db/account/accounts.md
        - specs/db/admin/audit-logs.md
        - specs/db/auth/device-tokens.md
---

# [UPDATE] auth-dead-links

## 5. 변경 명세

- **related**: Dead Link 수정 (`google-callback.md` -> `auth-google.md`)
