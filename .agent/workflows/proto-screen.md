---
description: 프로토타입 새 화면 생성 전체 체크리스트
---

# 새 화면 생성 워크플로우

신규 화면 생성 시 반드시 아래 순서를 따르세요.

---

## 1. 파일 생성

```
screens/{domain}/{screen}.html
css/screens/{domain}/{screen}.css
screen-controllers/{domain}/{screen}.js
```

---

## 2. index.html - CSS 연결

// turbo
`index.html`의 `<head>` 섹션에 CSS link 추가:

```html
<link rel="stylesheet" href="css/screens/{domain}/{screen}.css">
```

---

## 3. screens.json 등록

// turbo
`config/screens.json`에 화면 항목 추가:

```json
{
  "id": "{domain}-{screen}",
  "path": "screens/{domain}/{screen}.html",
  "controller": "screen-controllers/{domain}/{screen}.js",
  "phase": "P1",
  "stateButtons": []
}
```

stateButtons 예시:

- `{ "id": "loading", "icon": "⏳", "title": "로딩" }`
- `{ "id": "empty", "icon": "📭", "title": "빈 상태" }`
- `{ "id": "error", "icon": "❌", "title": "에러" }`

---

## 4. HTML 구조 필수 요소

```html
<div id="screen-{domain}-{screen}" class="screen">
    <div class="screen-body">
        <!-- 헤더 (뒤로가기 필요시) -->
        <div class="screen-header">
            <button class="back-btn" id="{screen}-back-btn">←</button>
            <h1 class="header-title">화면 제목</h1>
            <div class="header-spacer"></div>
        </div>

        <!-- 콘텐츠 영역 -->
        <div class="content-container">
            <!-- 메인 콘텐츠 -->
        </div>

        <!-- 스켈레톤 (로딩 상태) -->
        <div class="skeleton-container" id="{screen}-skeleton">
            <!-- 스켈레톤 아이템 -->
        </div>

        <!-- 빈 상태 -->
        <div class="empty-state hidden" id="{screen}-empty-state">
            <span class="empty-icon">📭</span>
            <p>데이터가 없습니다</p>
        </div>
    </div>
</div>
```

---

## 5. 컨트롤러 필수 함수

```javascript
import { navigateTo, goBack } from '../../core/navigation.js';

// 앱 로드 시 한 번 호출
export function init() {
    console.log('[{Screen}] Init');
}

// 화면 활성화 시마다 호출
export function start() {
    console.log('[{Screen}] Start');
    
    // 뒤로가기 버튼 연결
    const backBtn = document.getElementById('{screen}-back-btn');
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            goBack();
        };
    }
    
    // 초기 데이터 렌더링
    render();
}

// 화면 이탈 시 호출
export function reset() {
    console.log('[{Screen}] Reset');
}

// 컨트롤 패널 상태 변경 시 호출
export function setState(stateId) {
    console.log('[{Screen}] setState:', stateId);
    
    const content = document.querySelector('.content-container');
    const skeleton = document.getElementById('{screen}-skeleton');
    const emptyState = document.getElementById('{screen}-empty-state');
    
    // 모두 숨김
    if (content) content.style.display = 'none';
    if (skeleton) skeleton.classList.remove('visible');
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }
    
    switch (stateId) {
        case 'loading':
            if (skeleton) skeleton.classList.add('visible');
            break;
        case 'empty':
            if (emptyState) {
                emptyState.classList.remove('hidden');
                emptyState.style.display = 'flex';
            }
            break;
        case 'error':
            alert('에러 상태 예시');
            break;
        default:
            if (content) content.style.display = 'block';
            break;
    }
}

function render() {
    // 렌더링 로직
}
```

---

## 6. CSS 필수 규칙

```css
/* 화면 스코프 지정 */
#screen-{domain}-{screen} {
    /* 화면별 스타일 */
}

/* 변수 사용 (하드코딩 금지) */
#screen-{domain}-{screen} .container {
    background: var(--bg-surface);    /* ✅ */
    color: var(--text-primary);       /* ✅ */
    padding: var(--spacing-md);       /* ✅ */
    border-radius: var(--radius-md);  /* ✅ */
}
```

### CSS 변수 참조 (`base.css`)

- 색상: `--bg-surface`, `--text-primary`, `--text-secondary`, `--accent`
- 간격: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`
- 둥글기: `--radius-sm`, `--radius-md`, `--radius-lg`

---

## 7. 디자인 일관성 참조 파일

| 패턴 | 참조 파일 |
|------|-----------|
| 헤더 스타일 | `css/screens/auth/profile-input.css` |
| 설정 아이템 | `css/screens/settings/main.css` |
| 리스트 카드 | `css/screens/notification/center.css` |
| 검색 UI | `css/screens/stock/search.css` |
| 스켈레톤 | `css/components.css` |

---

## 8. 검증 체크리스트

- [ ] index.html에 CSS link 추가됨
- [ ] screens.json에 화면 등록됨
- [ ] 컨트롤러 init/start/reset/setState 함수 존재
- [ ] 뒤로가기 버튼 goBack() 연결됨
- [ ] stateButtons 있으면 setState() 구현됨
- [ ] CSS 변수 사용 (하드코딩 없음)
- [ ] 브라우저에서 화면 전환 테스트 완료
