# Prototype Code Fixes (UI)

본 문서는 PRD 스펙과 프로토타입 구현체를 동기화하는 과정에서 발견된 UI 구현 문제점들을 나중에 코드로 반영하기 위해 기록하는 작업 리스트입니다.

## 1. 공통 모달 오버레이 투명도 수정

- **대상 파일:** `TEST\prototype_v4\css\variables.css`, `modal.css`, `modals.css`
- **문제점:** 모달 오버레이가 반투명(`rgba`, `backdrop-filter: blur`)하게 적용되어 있어, 여러 컴포넌트나 모달이 겹칠 때 UI 렌더링에 문제가 발생함.
- **수정 계획:**
  - `variables.css`의 `--bg-overlay` 색상을 불투명하게(예: 시스템 배경색이나 완전 검정 등 단색 헥스코드) 변경.
  - `modal.css` 및 `modals.css`에서 오버레이 `.modal-overlay`, `.bottom-sheet-overlay`의 `backdrop-filter: blur(2px)` 속성 제거.

## 2. 미구현 프로토타입 화면 제작

- **대상 파일:** `account/*`, `admin/*`, `community/lists.html`, `community/onboarding.html`
- **문제점:** 기획 스펙(`Docs/AI_PRD/specs/ui/`)에는 정의되어 있으나 아직 HTML 프로토타입으로 구현되지 않은 상태.
- **수정 계획:** 추후 디자인/마크업 작업 시 해당 명세서를 기준으로 신규 파일 작성 필요.

## 3. 하단 FAB(Floating Action Button) 및 액션 버튼 겹침 현상

- **대상 화면:** `community/feed.html`, `portfolio/detail.html`, `stock/detail.html` 등 FAB가 있는 화면
- **문제점:** 화면 하단에 플로팅되는 추가(+) 버튼이나 고정 액션바가, 앱 하단 네비게이션(추후 추가 시) 혹은 하단 광고 배너 영역과 겹쳐서 클릭을 방해할 우려가 있음.
- **수정 계획:** 광고 배너나 네비게이션 바의 높이를 변수(예: `--bottom-nav-height`, `--ad-banner-height`)로 지정하고, FAB 컨테이너의 `bottom` 속성에 이 변수들을 산입(`calc`)하여 안전 영역(Safe Area)을 확보.

## 4. 인라인 모달/바텀시트의 공통 컴포넌트 분리

- **대상 파일:** `portfolio/list.html`, `portfolio/detail.html` 등
- **문제점:** `create-portfolio-modal`, `threshold-modal` 등의 바텀시트 마크업이 각 HTML 뷰 안에 하드코딩되어 있음.
- **수정 계획:** 향후 JS 연동 및 리팩토링 단계에서 `modal.html`이나 모포넌트 템플릿 로더를 사용해 동적으로 DOM에 삽입되도록 구조 분리 및 재사용성 향상.
