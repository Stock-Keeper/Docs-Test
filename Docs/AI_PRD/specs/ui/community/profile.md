---
type: ui
phase: P2
screen: 프로필 화면
related:
  api: []
  db:
    - specs/db/community/profiles.md
  ui:
    - specs/ui/community/feed.md
---

# 프로필 화면 (Profile Screen)

## 개요

내 프로필 / 타인 프로필 / 프로필 편집

---

## 1. 내 프로필

```text
┌─────────────────────────────────────┐
│  ←                    ⚙️ (설정)    │  ← 헤더 (`profile-header`)
├─────────────────────────────────────┤
│                                     │
│  투자왕김철수              [프사]   │  ← 프로필 메인 (`profile-main`)
│  @investking                        │
│  장기투자를 지향합니다.             │  ← 자기소개 (`profile-bio`)
│                                     │
│  게시글 12  │ 팔로워 156  │ 팔로잉 23│  ← 통계 (`profile-stats`)
│                                     │
│  [프로필 편집]                      │  ← 액션 버튼 (`profile-edit-btn`)
│                                     │
├─────────────────────────────────────┤
│  [최근활동]  [투자]  [매매내역]     │  ← 탭 (`profile-tabs`)
├─────────────────────────────────────┤
│  📝 새 글을 작성했습니다             │  ← 활동 리스트 (`activity-list`)
│     삼성전자, 지금 사도 될까요?      │
└─────────────────────────────────────┘
```

### 컴포넌트

| 요소 | ID / 설명 | Phase |
|---|---|---|
| 헤더 버튼 | 뒤로가기 (`#community-profile-back-btn`), 설정 (`#profile-settings-btn`) | P1 |
| 프로필 메인 | 닉네임 (`#profile-name`), 핸들 (`#profile-handle`), 소개 (`#profile-bio`), 아바타 (`#profile-avatar`) | P1 |
| 통계 (`.profile-stats`) | 게시글 (`#stat-posts`), 팔로워 (`#stat-followers`), 팔로잉 (`#stat-following`) | P1 |
| 사용자 액션 | 프로필 편집 (`#profile-edit-btn`) 화면 이동 | P1 |
| 탭 (`.profile-tabs`) | 최근활동, 투자, 매매내역 탭 버튼 | P1 |
| 탭 콘텐츠 | `#activity-list` 및 비공개 안내 (`.portfolio-visibility-notice`, `.trade-visibility-notice`) 표출 | P1 |

---

## 2. 타인 프로필

```text
┌─────────────────────────────────────┐
│  ←                          [🚫]   │  ← 헤더 (차단 버튼)
├─────────────────────────────────────┤
│                                     │
│  배당러버                   [프사]  │  
│  @dividend_lover                    │
│                                     │
│  게시글 48  │ 팔로워 1.2K │ 팔로잉 89│
│                                     │
│  [팔로우]                           │  ← 액션 버튼 (`profile-follow-btn`)
│                                     │
├─────────────────────────────────────┤
│  [최근활동]  [투자]  [매매내역]     │
├─────────────────────────────────────┤
│  🔒 투자 정보는 비공개입니다        │  ← 공개 제한 안내
│                                     │
└─────────────────────────────────────┘
```

### 차이점

| 항목 | 내 프로필 | 타인 프로필 |
|---|:---:|:---:|
| 헤더 우측 | ⚙️ 설정 (`#profile-settings-btn`) | 🚫 차단 (`#profile-block-btn`) |
| 버튼 | 프로필 편집 (`#profile-edit-btn`) | 팔로우 (`#profile-follow-btn`, `.following` 상태 됨) |
| 탭 내용 | 전체 내역 노출 | 비공개 설정 시 🔒 안내 (`. [type]-visibility-notice`) 표시 |

---

## 3. 프로필 편집

```text
┌─────────────────────────────────────┐
│  ←                 프로필 편집      │  ← 헤더 (`screen-header`)
├─────────────────────────────────────┤
│                                     │
│            ┌───────┐                │
│            │ [프사] │                │  ← 이미지 (`profile-image-section`)
│            └───────┘                │
│             사진 변경하기           │  ← 버튼 (`community-profile-photo-btn`)
│                                     │
├─────────────────────────────────────┤
│  닉네임                             │
│  ┌─────────────────────────────────┐│
│  │ 투자왕김철수                     ││  ← 입력 (`community-nickname-input`)
│  └─────────────────────────────────┘│
│  ⚠️ 닉네임은 90일마다 변경 가능합니다│  ← 경고 (`nickname-warning`)   0/20
│  마지막 변경 2025-12-01            │  ← 기록 (`nickname-last-changed`)
│                                     │
├─────────────────────────────────────┤
│  자기소개                           │
│  ┌─────────────────────────────────┐│
│  │ 장기투자를 지향합니다.           ││  ← 작성 (`community-bio-input`)
│  └─────────────────────────────────┘│
│                                0/200│  ← 글자수 (`bio-char-count`)
│                                     │
├─────────────────────────────────────┤
│  [저장하기]                         │  ← 하단 고정 버튼 (`community-profile-edit-save-btn`)
└─────────────────────────────────────┘
```

### 입력 제한

| 필드/요소 | ID/클래스 / 설명 장/제한조건 | Phase |
|---|---|---|
| 프사 변경 | `#community-profile-photo-btn` / 사진 변경하기 (앨범 진입) | P1 |
| 닉네임 | `#community-nickname-input` / 한글/영어/숫자, 최대 20자 (`maxlength="20"`) | P1 |
| 자기소개 | `#community-bio-input` / 최대 200자 (`maxlength="200"`) | P1 |
| 닉네임 쿨타임 | `.nickname-warning` / 90일에 1회 변경 정책 안내문 노출 및 마지막 날짜 명시 | P1 |
| 저장 버튼 | `#community-profile-edit-save-btn` / 값이 변경/검증된 경우에만 활성화 (기본 `disabled`) | P1 |

### 나가기 확인 모달 (`#community-profile-edit-exit-modal`)

변경사항 있을 때 뒤로가기(`#community-profile-edit-cancel-btn`) 클릭 시:
- "⚠️ 변경사항이 저장되지 않아요. 정말 나가시겠어요?" 메시지 모달 노출
- `[닫기]` (`#profile-edit-exit-cancel`), `[나가기]` (`#profile-edit-exit-confirm`)
