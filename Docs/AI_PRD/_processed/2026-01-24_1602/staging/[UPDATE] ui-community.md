---
type: ui
domain: community
source: _inbox/community/02_screens.md
---
# [UPDATE] Community UI Screens

> `community` 도메인의 UI/UX 대규모 업데이트 및 신규 화면 정의입니다.

## 1. 기존 화면 업데이트

| 화면             | 변경 사항                                                                   |
| ---------------- | --------------------------------------------------------------------------- |
| **Feed**   | `specs/ui/community/feed.md` 업데이트. 헤더/탭/카드 UI 구체화, FAB 추가.  |
| **Search** | `specs/ui/community/search.md` 업데이트. 최근 검색/핫토픽/결과 UI 구체화. |

## 2. 신규 화면 정의 ([NEW] 파일 생성 예정)

Inbox의 `02_screens.md` 내용을 바탕으로 다음 스펙 파일들을 신규 생성합니다.

- **Onboarding** (`onboarding.md`): 약관 동의, 닉네임 설정
- **Post Detail** (`post-detail.md`): 게시글 상세, 댓글/대댓글 UI
- **Profiles** (`profiles.md`): 내 프로필, 타인 프로필, 프로필 편집
- **Post Create/Edit** (`post-create.md`): 게시글 작성/수정, 종목 태그, 임시저장
- **Reference Lists** (`lists.md`): 북마크 목록, 차단 계정 관리
- **Settings** (`settings.md`): 알림 설정, 공개 범위 등

---

## 🔍 확인 필요 사항

### 1. 화면 스펙 파일 분리 전략

화면이 많아 파일이 파편화될 수 있습니다. 어떻게 구성하시겠습니까?

- [X] **옵션 A: 기능 단위 분리 (권장)**
  - `feed.md`, `post-detail.md`, `profile.md` 등으로 잘게 쪼개서 관리
- [ ] **옵션 B: 도메인 통합 파일**
  - `community-screens.md` 하나에 모든 화면 명세 통합
- [ ] 기타: ________________

### 2. 검색 화면의 '핫토픽' 기능

기획서에 'TBD(선정 기준 미정)'로 표시되어 있습니다. P1 포함 여부를 결정해주세요.

- [X] **옵션 A: P1 제외 (권장)**
  - UI에서 숨김 처리하고 기준 확정 후 구현
- [ ] **옵션 B: 더미 데이터로 구현**
  - UI 확인용으로 고정된 데이터 노출
- [ ] 기타: ________________
