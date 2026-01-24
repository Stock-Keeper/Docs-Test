---
batch: 2026-01-23_2100
domain: auth
type: update
---
# 인증/프로필(Auth) 도메인 고도화

## 1. 개요

Inbox의 `01_login.md`, `02_profile.md` 등의 요구사항을 반영하여 투자 성향(Investment Type) 정보를 추가하고, 설정 및 스플래시 화면을 신규 정의합니다.

## 2. 변경 사항 요약

| 구분          | 항목         | 변경 내용                                                  |
| ------------- | ------------ | ---------------------------------------------------------- |
| **DB**  | `settings` | `investment_type` 컬럼 추가 (투자 성향 저장)             |
| **UI**  | 프로필       | 투자 성향 선택(안정/중립/공격) 추가, 프로필 편집 화면 신설 |
| **UI**  | 설정         | 설정 메인 화면(`specs/ui/auth/settings.md`) 신설         |
| **UI**  | 스플래시     | 스플래시 화면(`specs/ui/auth/splash.md`) 신설            |
| **API** | `profile`  | `investmentType` 필드 추가                               |

## 3. 상세 스펙 변경

### A. [DB] `specs/db/auth/settings.md` (Update)

#### 수정: 컬럼 추가

사용자의 투자 성향을 저장하기 위한 컬럼을 추가합니다. (users 테이블보다는 설정/성향 테이블이 적절)

> **AI 제안**: `settings` 테이블보다는 `users`나 별도 `user_profiles`가 맞을 수 있으나, P1 단계 단순화를 위해 `settings` 또는 `users` 확장을 고려합니다. 여기서는 `users` 테이블에 넣는 것이 더 조회 빈도상 유리할 수 있으나, '설정'의 일종으로 보아 `settings`에 추가하겠습니다.

```sql
ALTER TABLE settings ADD COLUMN investment_type ENUM('STABLE', 'NEUTRAL', 'AGGRESSIVE') DEFAULT 'NEUTRAL';
```

### B. [UI] `specs/ui/auth/profile-input.md` (Update)

#### 수정: 레이아웃

닉네임 입력 하단에 투자 성향 선택 버튼을 추가합니다.

```markdown
### 3-1. 투자 성향 (신규)
- **옵션**: 안정형 / 중립형 / 공격형
- **형태**: 토글 버튼 그룹 (하나만 선택 가능)
- **기본값**: 중립형
```

### C. [NEW] `specs/ui/auth/profile-edit.md`

`specs/ui/auth/profile-input.md`와 유사하지만, 진입점이 '설정'이며 '저장' 버튼 동작이 다릅니다.

### D. [NEW] `specs/ui/auth/settings.md`

설정 메인 화면의 UI 명세를 정의합니다. (프로필, 알림, 앱 정보, 계정 관리 등 포함)

### E. [NEW] `specs/ui/auth/splash.md`

앱 실행 시 최초 진입 화면 명세입니다.

### F. [API] `specs/api/auth/profile-update.md` (Update)

#### 수정: Request Body

```json
{
  "nickname": "투자왕",
  "investmentType": "AGGRESSIVE" // [NEW]
}
```

## 4. AI 분석 및 확인 사항

### 🔍 논리적 검증

- **투자 성향 저장 위치**: `settings` vs `users`. 투자 성향은 포트폴리오 추천 로직에 쓰일 수 있어 `users`가 나을 수도 있지만, 초기 Onboarding Flow상 사용자 '설정'값으로 분류했습니다.
- **Splash**: 단순 UI이지만 재방문 유저 분기(Login vs Home) 로직이 포함됩니다. 클라이언트에서 토큰 유무로 판단합니다.

### ❓ 확인 필요 사항

#### 1. 투자 성향 필수 여부

프로필 입력 시 투자 성향을 반드시 선택해야 하나요, 아니면 건너뛰기 가능합니까? (Inbox: "선택"이라고 표기됨)

- [X] **옵션 A**: 필수 선택 (기본값이 선택되어 있음)
- [ ] **옵션 B**: 선택 사항 (null 허용)
- [ ] 기타: ________________

#### 2. 설정 화면 위치

설정 화면 UI 스펙을 `specs/ui/auth/settings.md`에 위치시키는 것에 동의하십니까? (알림 등 타 도메인 포함하지만 진입점이 Auth와 밀접)

- [ ] **옵션 A**: `ui/auth/`
- [X] **옵션 B**: `ui/settings/` (별도 폴더 신설)
- [ ] 기타: ________________
