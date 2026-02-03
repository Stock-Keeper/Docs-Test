# 프로토타입 스타일 가이드

> **최종 업데이트**: 2026-02-01  
> **적용 대상**: prototype_v4

---

## 1. CSS 변수 체계

### 1.1 레이아웃

```css
:root {
    --header-height: 56px;
    --tab-bar-height: 56px;
    --safe-area-top: env(safe-area-inset-top, 0px);
    --safe-area-bottom: env(safe-area-inset-bottom, 0px);
}
```

### 1.2 간격 (8px 그리드)

```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
}
```

### 1.3 타이포그래피

```css
:root {
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 20px;
    --font-size-xl: 24px;
}
```

### 1.4 색상 (시맨틱)

```css
:root {
    /* 상태 색상 */
    --color-success: #4ade80;
    --color-warning: #fbbf24;
    --color-error: #f87171;
    --color-info: #60a5fa;
    
    /* 한국 주식 컨벤션 */
    --color-up: #ef4444;    /* 상승 = 빨강 */
    --color-down: #3b82f6;  /* 하락 = 파랑 */
}
```

### 1.5 애니메이션

```css
:root {
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 350ms ease;
}
```

---

## 2. 공통 컴포넌트

### 2.1 스켈레톤 로딩

```css
.skeleton {
    background: linear-gradient(
        90deg, 
        var(--bg-surface) 25%, 
        var(--bg-surface-hover) 50%, 
        var(--bg-surface) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-line { height: 16px; }
.skeleton-line.short { width: 40%; }
.skeleton-line.medium { width: 70%; }
.skeleton-line.long { width: 100%; }
.skeleton-circle { width: 40px; height: 40px; border-radius: 50%; }
```

### 2.2 터치 피드백

```css
.touchable {
    cursor: pointer;
    transition: opacity var(--transition-fast);
    -webkit-tap-highlight-color: transparent;
}

.touchable:active {
    opacity: 0.7;
    transform: scale(0.98);
}
```

### 2.3 모달/바텀시트

```css
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
}

.bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    z-index: 200;
}
```

---

## 3. 레이아웃 규칙

### 3.1 화면 구조

```html
<div id="screen-{domain}-{screen}" class="screen">
    <div class="screen-body">
        <div class="screen-header">...</div>
        <div class="content-container">...</div>
    </div>
</div>
```

### 3.2 자동 여백

```css
.screen-body {
    padding-top: calc(var(--header-height) + var(--safe-area-top));
    padding-bottom: calc(var(--tab-bar-height) + var(--safe-area-bottom));
}
```

### 3.3 탭바 표시 조건

```css
body[data-show-tabbar="true"] {
    --tab-bar-height: 56px;
}

body[data-show-tabbar="false"],
body:not([data-show-tabbar]) {
    --tab-bar-height: 0px;
}
```

---

## 4. z-index 체계

| 요소 | z-index | 비고 |
|------|---------|------|
| 콘텐츠 | auto | 기본 |
| FAB | 90 | 콘텐츠 위 |
| 탭바 | 100 | 항상 보임 |
| 헤더 | 100 | 항상 보임 |
| 모달/바텀시트 | 200 | 최상위 |
| 토스트 | 300 | 가장 위 |

---

## 5. 파일 구조

```
css/
├── base.css          # 리셋, CSS 변수, 기본 스타일
├── utilities.css     # 유틸리티 클래스
├── components.css    # 버튼, 카드, 스켈레톤 등
├── modals.css        # 모달, 바텀시트
├── tab-bar.css       # 하단 탭바
└── screens/          # 화면별 스타일
```

---

## 6. 코딩 규칙

### ✅ DO

```css
/* 변수 사용 */
padding: var(--spacing-md);
background: var(--bg-surface);
transition: opacity var(--transition-fast);

/* 화면 스코프 */
#screen-community-feed .feed-card { ... }
```

### ❌ DON'T

```css
/* 하드코딩 금지 */
padding: 16px;
background: #1a1a1a;
transition: opacity 0.15s ease;

/* 전역 오염 금지 */
.card { ... } /* 너무 일반적 */
```

---

## 7. 참조 파일

| 패턴 | 참조 |
|------|------|
| 헤더 | `css/screens/auth/profile-input.css` |
| 설정 아이템 | `css/screens/settings/main.css` |
| 리스트 카드 | `css/screens/notification/center.css` |
| 검색 UI | `css/screens/stock/search.css` |
