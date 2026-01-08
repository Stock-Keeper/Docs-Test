# Stock-Keeper UI Prototype V3

주식 리밸런싱 앱의 UI/UX 프로토타입입니다.

## 🚀 실행 방법

이 프로젝트는 **정적 HTML**로 구성되어 있어 별도의 빌드/설치 없이 바로 실행할 수 있습니다.

### 방법 1: Live Server (VS Code 확장)

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
├── index.html          # 메인 진입점 (프레임 + 컨트롤 패널)
├── js/
│   └── app.js          # 네비게이션, 테마, 상태 토글 로직
├── css/
│   ├── variables.css   # CSS 변수 (색상, 그라디언트)
│   ├── base.css        # 기본 레이아웃, 폰 프레임, 헤더
│   ├── components.css  # 공통 컴포넌트 (버튼, 모달, 칩 등)
│   ├── utilities.css   # 컨트롤 패널, 툴팁, 스크롤바 숨김
│   ├── light-mode.css  # 라이트 모드 오버라이드
│   └── screens/        # 화면별 스타일
│       ├── login.css
│       ├── profile.css
│       ├── home.css
│       ├── detail.css
│       ├── search.css
│       ├── rebalance.css
│       └── settings.css
├── screens/            # 동적 로딩되는 화면 HTML
│   ├── login.html
│   ├── profile.html
│   ├── home.html
│   ├── detail.html
│   ├── search.html
│   ├── rebalance.html
│   └── settings.html
└── components/
    └── modals.html     # 공통 모달 컴포넌트

```

---

## 🎨 주요 기능

| 기능 | 설명 |
|------|------|
| **다크/라이트 모드** | 우측 컨트롤 패널에서 🌙/☀️ 버튼으로 전환 |
| **화면 네비게이션** | 숫자 버튼(1~7)으로 각 화면 이동 |
| **상태 시뮬레이션** | 이모지 버튼으로 Empty/Loading/Error 상태 테스트 |
| **반응형 스크롤** | 각 화면 내부에서 콘텐츠 스크롤 |

---

## 🛠 기술 스택

- **HTML5** + **CSS3** (Vanilla)
- **JavaScript** (ES6+, 모듈 없음)
- **Noto Sans KR** 폰트 (Google Fonts)

---

## 📝 개발 노트

- 모든 CSS는 `css/` 폴더 내 모듈화되어 `index.html`에서 순서대로 로드됩니다.
- 화면 HTML은 `js/app.js`의 `loadAllScreens()`에서 `fetch()`로 동적 로딩됩니다.

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
| **체크리스트** | MVP vs Phase 2 구분 (구현 완료 시 체크) |

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

### 2. JS 토글 함수 추가 (`app.js`)

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
