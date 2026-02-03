# 하단 탭바 네비게이션 설계

> **최종 업데이트**: 2026-02-01  
> **Phase**: P2  
> **상태**: 📋 설계 완료

---

## 1. 개요

P2부터 커뮤니티 기능 추가와 함께 앱 하단에 탭 네비게이션 바를 추가합니다.  
컨트롤 패널과 **병행 사용**하여 테스트 편의성을 유지합니다.

---

## 2. 탭 구성

```
┌─────────────────────────────────────┐
│            (화면 콘텐츠)             │
├─────────────────────────────────────┤
│  [🏠 홈]  [📊 포폴]  [💬 커뮤]  [⚙️ 설정] │
└─────────────────────────────────────┘
```

| 탭 | 아이콘 | 화면 | 설명 |
|---|---|---|---|
| 홈 | 🏠 | portfolio-list | 포트폴리오 목록 (메인) |
| 포폴 | 📊 | portfolio-detail | 선택된 포트폴리오 상세 |
| 커뮤 | 💬 | community-feed | 커뮤니티 피드 (진입점) |
| 설정 | ⚙️ | settings-main | 설정 화면 |

---

## 3. 표시 조건

### 3.1 Phase 기반

| Phase | 탭바 표시 |
|-------|----------|
| P1 | ❌ 숨김 |
| P2 | ✅ 표시 |
| P3 | ✅ 표시 |

### 3.2 화면별 예외 (screens.json)

```json
{
  "id": "community-post-create",
  "hideTabBar": true
}
```

| 화면 | hideTabBar | 이유 |
|------|------------|------|
| post-create | true | 풀스크린 에디터 |
| profile-edit | true | 편집 모드 |
| onboarding | true | 초기 설정 플로우 |

---

## 4. CSS 구현

### 4.1 CSS 변수 방식

```css
/* base.css */
:root {
    --tab-bar-height: 0px;
}

body[data-show-tabbar="true"] {
    --tab-bar-height: 56px;
}

/* 모든 화면 자동 여백 */
.screen-body {
    padding-bottom: calc(var(--tab-bar-height) + var(--spacing-md));
}
```

### 4.2 탭바 스타일

```css
/* tab-bar.css */
.tab-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: var(--bg-surface);
    border-top: 1px solid var(--border-color);
    z-index: 100;
}

body[data-show-tabbar="true"] .tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--text-secondary);
    background: none;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
}

.tab-item.active {
    color: var(--accent);
}

.tab-icon { font-size: 20px; }
.tab-label { font-size: 12px; }
```

---

## 5. JavaScript 구현

### 5.1 파일 구조

```
core/
├── navigation.js     # 기존 (수정)
├── control-panel.js  # 기존 (수정)
└── tab-bar.js        # 신규
```

### 5.2 tab-bar.js

```javascript
import { navigateTo, getCurrentScreen } from './navigation.js';

export function initTabBar() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            navigateTo(screenId, false); // 히스토리 추가 안 함
        });
    });
}

export function updateTabBarState(screenId) {
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screenId);
    });
}

export function setTabBarVisibility(show) {
    document.body.setAttribute('data-show-tabbar', show);
}
```

### 5.3 navigation.js 수정사항

```javascript
// navigateTo() 내부에 추가
import { updateTabBarState, setTabBarVisibility } from './tab-bar.js';

export function navigateTo(screenId, addToHistory = true) {
    // ... 기존 코드 ...
    
    // 탭바 상태 업데이트
    updateTabBarState(screenId);
    
    // 화면별 탭바 표시 여부
    const screenConfig = screens.find(s => s.id === screenId);
    if (screenConfig?.hideTabBar) {
        setTabBarVisibility(false);
    } else if (currentPhase !== 'P1') {
        setTabBarVisibility(true);
    }
}
```

---

## 6. 다른 요소와의 상호작용

### 6.1 z-index 체계

| 요소 | z-index |
|------|---------|
| 바텀시트 | 200 |
| 탭바 | 100 |
| FAB | 90 |

### 6.2 FAB 위치

```css
.fab {
    position: fixed;
    right: 16px;
    bottom: calc(var(--tab-bar-height) + 16px);
    z-index: 90;
}
```

### 6.3 바텀시트

바텀시트는 탭바 위에 표시 (z-index: 200)

---

## 7. HTML 구조

```html
<!-- index.html 하단에 추가 -->
<nav id="tab-bar" class="tab-bar">
    <button class="tab-item active" data-screen="portfolio-list">
        <span class="tab-icon">🏠</span>
        <span class="tab-label">홈</span>
    </button>
    <button class="tab-item" data-screen="portfolio-detail">
        <span class="tab-icon">📊</span>
        <span class="tab-label">포폴</span>
    </button>
    <button class="tab-item" data-screen="community-feed">
        <span class="tab-icon">💬</span>
        <span class="tab-label">커뮤</span>
    </button>
    <button class="tab-item" data-screen="settings-main">
        <span class="tab-icon">⚙️</span>
        <span class="tab-label">설정</span>
    </button>
</nav>
```

---

## 8. 라우팅 고려사항

### 8.1 히스토리 관리

- 탭 전환: `navigateTo(screenId, false)` - 히스토리에 추가 안 함
- 화면 내부 이동: `navigateTo(screenId, true)` - 히스토리에 추가

### 8.2 Phase 전환 시

```javascript
// control-panel.js
window.setPhase = function(phase) {
    // ... 기존 코드 ...
    
    // 탭바 표시 설정
    setTabBarVisibility(phase !== 'P1');
    
    // P1으로 전환 시 커뮤니티 화면이면 홈으로 이동
    const current = getCurrentScreen();
    if (phase === 'P1' && current.startsWith('community-')) {
        navigateTo('portfolio-list');
    }
};
```

---

## 9. 체크리스트

- [ ] `css/tab-bar.css` 생성
- [ ] `core/tab-bar.js` 생성
- [ ] `index.html`에 탭바 HTML 추가
- [ ] `base.css`에 CSS 변수 추가
- [ ] `navigation.js` 수정 (탭바 연동)
- [ ] `control-panel.js` 수정 (Phase 연동)
- [ ] `screens.json`에 hideTabBar 속성 추가
- [ ] P1↔P2 전환 테스트
- [ ] 모든 탭 클릭 테스트
