---
type: db
phase: P3
table: users
related:
    api:
        - specs/api/auth/profile-update.md
        - specs/api/bm/token-buy.md
        - specs/api/bm/membership-subscribe.md
---

# [UPDATE] db-auth-users

## 1. 원본 출처

- `_inbox/bm-token-membership.md`

## 2. 작업 요약

- **[UPDATE]** `users`: 토큰 잔액(`token_balance`), 멤버십 등급(`membership_tier`), 만료일(`membership_expires_at`) 추가

## 3. 변경 명세

### users 테이블

**변경 전**

```sql
membership_type ENUM('FREE', 'PRO', 'EXPERT') DEFAULT 'FREE'
-- token_balance 없음 (P2 삭제됨)
```

**변경 후**

```sql
-- membership_type 삭제 (membership_tier로 대체 또는 ENUM 변경)
membership_tier ENUM('FREE', 'BASIC', 'PRO', 'PREMIUM') DEFAULT 'FREE',
token_balance INT DEFAULT 0,            -- 보유 토큰 (비즈니스 로직 중요)
membership_expires_at TIMESTAMP,        -- 멤버십 만료일 (NULL=Free)
```

**마이그레이션 전략**

- 기존 `membership_type`이 있다면 매핑 필요 (PRO->PRO, EXPERT->PREMIUM 등). 현재는 초기 단계이므로 직접 변경 가능.
- `token_balance` 초기값 0.
