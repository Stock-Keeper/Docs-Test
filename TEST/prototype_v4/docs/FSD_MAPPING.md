# FSD (Feature-Sliced Design) 매핑

> 프로토타입 → 실제 개발 구조 매핑 가이드

---

## 폴더 매핑

| 프로토타입 (v4) | FSD 구조 | 설명 |
|----------------|----------|------|
| `screens/` | `pages/` | 페이지 컴포넌트 |
| `screen-controllers/` | `pages/*/model/` | 페이지 로직 |
| `components/` | `widgets/`, `entities/` | UI 컴포넌트 |
| `core/` | `shared/lib/` | 공통 유틸리티 |
| `css/variables.css` | `shared/design-tokens/` | 디자인 토큰 |
| `css/components.css` | `shared/ui/` | 공통 UI 스타일 |

---

## 화면 매핑

| 프로토타입 | FSD 페이지 |
|-----------|-----------|
| `screens/auth/login.html` | `pages/login/` |
| `screens/portfolio/list.html` | `pages/portfolio-list/` |
| `screens/portfolio/detail.html` | `pages/portfolio-detail/` |
| `screens/stock/search.html` | `pages/stock-search/` |
| `screens/rebalancing/check.html` | `pages/rebalancing/` |
| `screens/settings/main.html` | `pages/settings/` |

---

## 디자인 토큰 변환

### 프로토타입 (CSS)

```css
:root {
    --color-primary: #4CAF50;
    --radius-md: 12px;
}
```

### 실제 개발 (TypeScript)

```typescript
// shared/design-tokens/colors.ts
export const colors = {
    primary: '#4CAF50',
} as const;

// shared/design-tokens/radius.ts
export const radius = {
    md: 12,
} as const;
```

---

## 컴포넌트 매핑

| 프로토타입 클래스 | FSD 컴포넌트 |
|-----------------|-------------|
| `.btn-primary` | `shared/ui/Button` |
| `.card` | `shared/ui/Card` |
| `.stock-card` | `entities/stock/ui/StockCard` |
| `.modal` | `widgets/Modal` |
| `.bottom-sheet` | `widgets/BottomSheet` |

---

## 사용 방법

1. 프로토타입에서 UI/UX 확정
2. 이 문서 참고하여 FSD 구조에 매핑
3. CSS 변수 → TypeScript 토큰 변환
4. HTML 구조 → React/RN 컴포넌트 변환
