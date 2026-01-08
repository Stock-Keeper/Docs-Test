# Stock-Keeper UI Prototype V3

주식 리밸런싱 앱의 UI/UX 프로토타입입니다.

## 🚀 실행 방법

이 프로젝트는 **정적 HTML**로 구성되어 있어 별도의 빌드/설치 없이 바로 실행할 수 있습니다.

### 방법 1: Live Server (VS Code 확장) - 권장

1. VS Code에서 **Live Server** 확장 프로그램 설치
2. `index.html` 파일을 열고 우클릭
3. **"Open with Live Server"** 선택
4. 브라우저에서 `http://127.0.0.1:5500` 자동 열림

### 방법 2: 직접 열기

1. 파일 탐색기에서 `index.html` 파일 더블클릭
2. 브라우저에서 바로 열림

> ⚠️ **주의**: 직접 열기 시 `fetch()`를 사용하는 화면 로딩이 CORS 정책으로 실패할 수 있습니다. Live Server 사용을 권장합니다.

---

## 📁 폴더 구조

```
prototype_v3/
├── index.html              # 메인 진입점 (프레임 + 컨트롤 패널)
│
├── js/                     # JavaScript 모듈 (SRP 적용)
│   ├── app.js              # 메인 초기화 (~15줄)
│   ├── navigation.js       # 화면 전환, 모달 관리
│   ├── theme.js            # 다크/라이트 모드
│   ├── state.js            # Empty/Loading/Error 상태 토글
│   └── utils.js            # 유틸리티 (showToast 등)
│
├── css/                    # 스타일시트 (변수 중심 설계)
│   ├── variables.css       # ⭐ CSS 변수 (색상, 테마, radius)
│   ├── base.css            # 기본 레이아웃, 폰 프레임, 헤더
│   ├── components.css      # 공통 컴포넌트 (버튼, 모달, 칩 등)
│   ├── utilities.css       # 컨트롤 패널, 툴팁, 스크롤바 숨김
│   ├── light-mode.css      # 라이트 모드 예외 처리 (~35줄)
│   └── screens/            # 화면별 스타일
│       ├── login.css
│       ├── profile.css
│       ├── home.css
│       ├── detail.css
│       ├── search.css
│       ├── rebalance.css
│       └── settings.css
│
├── screens/                # 동적 로딩되는 화면 HTML
│   ├── login.html
│   ├── profile.html
│   ├── home.html
│   ├── detail.html
│   ├── search.html
│   ├── rebalance.html
│   └── settings.html
│
└── components/
    └── modals.html         # 공통 모달 컴포넌트
```

---

## 🎨 주요 기능

| 기능 | 설명 |
|------|------|
| **다크/라이트 모드** | 우측 컨트롤 패널에서 토글 스위치로 전환 |
| **화면 네비게이션** | 숫자 버튼(1~7)으로 각 화면 이동 |
| **상태 시뮬레이션** | 이모지 버튼으로 Empty/Loading/Error 상태 테스트 |
| **반응형 스크롤** | 각 화면 내부에서 콘텐츠 스크롤 |

---

## 🏗 아키텍처 (v3.1 리팩토링)

### CSS 변수 시스템

모든 색상과 크기가 `variables.css`에 정의되어 **한 곳에서 관리**됩니다:

```css
/* 테마 색상 */
--bg-body, --bg-screen, --bg-card, --bg-surface, --bg-modal
--text-primary, --text-secondary, --text-tertiary, --text-inverse
--border-color, --border-hover, --border-focus

/* Border Radius */
--radius-sm (8px), --radius-md (12px), --radius-lg (16px)
--radius-xl (24px), --radius-pill (9999px)
```

**다크/라이트 모드**: `[data-mode="light"]` 셀렉터로 변수 값만 오버라이드

### JS 모듈 분리

| 파일 | 책임 |
|------|------|
| `app.js` | 앱 초기화만 담당 |
| `navigation.js` | 화면 로딩, 네비게이션, 모달 |
| `theme.js` | 다크/라이트 모드 전환 |
| `state.js` | Empty/Loading/Error 상태 토글 |
| `utils.js` | showToast, 공용 유틸리티 |

---

## 🛠 기술 스택

- **HTML5** + **CSS3** (Vanilla, CSS Variables)
- **JavaScript** (ES6+, 비-모듈 방식)
- **Noto Sans KR** 폰트 (Google Fonts)

---

## 📝 개발 가이드

### 새 컴포넌트 추가

1. `components.css`에 스타일 추가 (CSS 변수 사용)
2. 필요 시 `modals.html`에 HTML 추가

### 색상 변경

`variables.css`의 해당 변수만 수정:

- 다크 모드: `:root` 블록
- 라이트 모드: `[data-mode="light"]` 블록

### 새 화면 추가

1. `screens/새화면.html` 생성
2. `css/screens/새화면.css` 생성
3. `navigation.js`의 `SCREENS` 배열에 추가
4. `index.html`에 네비게이션 버튼 추가

---

## 📚 화면 기획서 참고

프로토타입 작업 시 **화면 기획서**를 참고하세요:

📁 **경로**: [`Docs/project_analysis/pages/`](../../Docs/project_analysis/pages/)

### 기획서에서 확인할 내용

| 항목 | 설명 |
|------|------|
| **화면 개요** | 목적, 진입 경로, 이동 가능 화면 |
| **와이어프레임** | ASCII 레이아웃 스케치 |
| **화면 상태** | Loading, Error, Empty 등 |
| **체크리스트** | `[직접]`/`[패널]` 태그로 구현 방법 구분 |

### 체크리스트 태그 범례

- `[직접]` - 화면 HTML에서 직접 조작/확인 가능
- `[패널]` - 컨트롤 패널 버튼으로 상태 토글

### 작업 후 업데이트

기능 구현 완료 시 해당 기획서의 체크리스트를 `[x]`로 업데이트하세요.

---

## 🎛 상태 버튼 추가 방법

컨트롤 패널에 새로운 UI 상태 토글 버튼을 추가하려면:

### 1. HTML 버튼 추가 (`index.html` → `.state-column`)

```html
<button class="state-btn" 
        data-for-screens="screen-home screen-detail" 
        onclick="toggleMyState(this)" 
        data-title="상태 이름">🔘</button>
```

| 속성 | 설명 |
|------|------|
| `data-for-screens` | 버튼이 표시될 화면 ID (공백으로 구분) |
| `onclick` | 상태를 토글하는 함수 호출 |
| `data-title` | 마우스 오버 시 툴팁 |

### 2. JS 토글 함수 추가 (`js/state.js`)

```javascript
let myState = false;

function toggleMyState(btnElement) {
    myState = !myState;
    if (btnElement) btnElement.classList.toggle('active', myState);
    
    // UI 변경 로직
    document.getElementById('my-element').style.display = myState ? 'block' : 'none';
    
    showToast(`My State: ${myState ? 'ON' : 'OFF'}`);
}
```

> [!TIP]
> 상태 버튼은 `data-for-screens`에 명시된 화면에서만 표시됩니다. 다른 화면에서는 자동으로 fade out됩니다.

---

## 🔗 관련 문서

- [리팩토링 계획서](../../Docs/project_analysis/prototype_refactoring_plan.md)
- [화면 기획서 인덱스](../../Docs/project_analysis/pages/README.md)
