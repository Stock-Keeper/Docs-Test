---
type: ui
phase: P1
screen: 설정 메인 화면
related:
  api:
    - ../../api/notification/settings.md
  ui:
    - ../auth/profile-edit.md
    - ../notification/settings.md
---

# 설정 메인 화면 (Settings)

## 개요

사용자 설정을 관리하는 메인 허브 화면

## 레이아웃

```text
┌───────────────────────────────────────┐
│  ← 설정                               │  ← 헤더 (`header`)
├───────────────────────────────────────┤
│                                       │
│  프로필                               │  ← 그룹 타이틀 (`settings-group-title`)
│  ┌─────────────────────────────────┐  │
│  │ 📷 투자왕김철수               › │  │  ← 프로필 영역 (`profile-edit-link`)
│  │    investor@email.com           │  │
│  ├─────────────────────────────────┤  │
│  │ 투자 성향              중립형   │  │  ← 투자 성향 (`settings-value` / `display-investment-style`)
│  └─────────────────────────────────┘  │
│                                       │
│  알림 설정                             │
│  ┌─────────────────────────────────┐  │
│  │ 알림 설정                     › │  │  ← `notification-settings-link`
│  ├─────────────────────────────────┤  │
│  │ 알림 센터                     › │  │  ← `notification-center-link`
│  └─────────────────────────────────┘  │
│                                       │
│  커뮤니티                              │
│  [ 커뮤니티 설정                 › ]  │  ← `community-settings-link`
│                                       │
│  멤버십                               │
│  [ 멤버십 구독 관리         [Free플랜] ›] │  ← `membership-plans-link` (오른쪽 뱃지)
│                                       │
│  앱 정보                               │
│  ┌─────────────────────────────────┐  │
│  │ 버전                       4.0.0│  │
│  ├─────────────────────────────────┤  │
│  │ 이용약관                      › │  │
│  ├─────────────────────────────────┤  │
│  │ 개인정보처리방침              › │  │
│  ├─────────────────────────────────┤  │
│  │ 오픈소스 라이선스             › │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [ 로그아웃 ]                         │  ← 로그아웃 버튼 (`logout-btn`)
│                                       │
│  [ 계정 삭제 ]                        │  ← 계정 삭제 버튼 (`delete-account-btn / danger-zone`)
└───────────────────────────────────────┘
```

## 컴포넌트

### 1. 헤더 (`header`)
- 뒤로가기 (`settings-back-btn`)
- 타이틀: "설정" (`header-title`)

### 2. 프로필 그룹 (`settings-group`)
| 요소 | 클래스명/ID | 설명 | Phase |
|---|---|---|---|
| 프로필 편집 이동 | `profile-edit-link` | 아바타(`settings-avatar`), 닉네임(`display-nickname`), 이메일(`settings-email`) | P1 |
| 투자 성향 | `settings-item` | 현재 투자 성향 텍스트 표시 (`display-investment-style`) | P1 |

### 3. 알림 설정 그룹 (`settings-group`)
| 요소 | ID | 설명 | Phase |
|---|---|---|---|
| 알림 설정 | `notification-settings-link` | 알림 세부 설정 화면 진입 | P1 |
| 알림 센터 | `notification-center-link` | 이전 알림 기록 확인 센터 | P1 |

### 4. 커뮤니티 그룹 (`settings-group`)
- 커뮤니티 설정 링크 (`community-settings-link`): 커뮤니티 활동 관련 설정 이동

### 5. 멤버십 그룹 (`settings-group`)
- 멤버십 구독 및 토큰 관리 (`membership-plans-link`):
  - 우측에 현재 등급 배지 렌더링 (예: `Free 플랜`, `Pro 플랜`)

### 6. 앱 정보 그룹 (`settings-group`)
- **버전**: 현재 버전 텍스트 렌더링 (예: 4.0.0)
- **이용약관 / 개인정보처리방침 / 오픈소스 라이선스**: 각 법적 고지 웹뷰 호출

### 7. 계정 관리 액션
- **로그아웃** (`logout-btn`): 로그아웃 확인 모달 (`logout-confirm-modal`) 바텀시트 호출
- **계정 삭제** (`delete-account-btn`, `danger-zone` 하위 영역):
  - 계정 삭제 경고 모달 (`delete-confirm-modal`, `danger`) 바텀시트 호출
  - "⚠️ 정말 계정을 삭제하시겠습니까?" / "모든 포트폴리오 데이터가 영구적으로 삭제됩니다." 경고 표시

## 상호작용

| 액션 | 동작 |
|---|---|
| 프로필 영역 탭 | 프로필 편집 화면 이동 |
| 각종 설정 메뉴 탭 | 각 세부 설정/안내 화면(WebView 등) 이동 |
| 로그아웃 탭 | 하단 바텀시트(`logout-confirm-modal`) 오픈 |
| 계정 삭제 탭 | 하단 경고 바텀시트(`delete-confirm-modal`) 오픈 |
| (모달) 확인 탭 | 실제 로그아웃/탈퇴 처리 후 로그인 화면으로 이동 |

## 상태

| 상태 | UI |
|---|---|
| 로그아웃 확인 | `logout-confirm-modal` / 바텀시트 렌더링 |
| 계정 삭제 확인 | `delete-confirm-modal` / 붉은 경고 톤 디자인 적용 |
| 액션 처리 중 | 버튼 로딩 애니메이션 혹은 진행률 표시 |

## 관련 스펙

- API: `../../api/notification/settings.md`
- UI: `../auth/profile-edit.md`
- UI: `../notification/settings.md`
