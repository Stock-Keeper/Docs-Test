# Stock-Keeper UI Prototype V4

주식 리밸런싱 앱의 UI/UX 프로토타입 (ES6 모듈 기반)

## 🚀 실행 방법

```bash
# VS Code Live Server 사용 (권장)
# index.html 우클릭 → Open with Live Server
```

> ⚠️ ES6 모듈 사용으로 `file://` 프로토콜에서는 CORS 에러 발생. 반드시 HTTP 서버 필요.

---

## 📁 폴더 구조

```
prototype_v4/
├── index.html              # 진입점
├── config/
│   └── screens.json        # ⭐ 화면 설정 (진실의 원천)
├── core/                   # ES6 모듈
│   ├── app.js              # 초기화
│   ├── navigation.js       # 화면 전환
│   ├── control-panel.js    # 컨트롤 패널 생성
│   ├── theme.js            # 테마
│   └── utils.js            # 유틸리티
├── screens/{domain}/       # 화면 HTML
├── screen-controllers/{domain}/  # 화면별 JS
├── css/
│   ├── variables.css       # CSS 변수
│   ├── base.css            # 기본 레이아웃
│   ├── components.css      # 공통 컴포넌트
│   ├── control-panel.css   # 컨트롤 패널
│   ├── screens/{domain}/   # 화면별 CSS
│   └── themes/             # 다크/라이트
└── components/             # 공통 컴포넌트
```

---

## 🎛 컨트롤 패널

| 기능 | 설명 |
|------|------|
| **Phase 토글** | P1/P2/P3 버튼으로 해당 Phase 화면만 표시 |
| **네비게이션** | screens.json 기반 자동 생성 |
| **상태 토글** | 화면별 Empty/Loading/Error 상태 테스트 |
| **테마** | 다크/라이트 모드 전환 |

---

## 📝 화면 추가 방법

1. `screens.json`에 화면 등록
2. `screens/{domain}/{name}.html` 생성
3. `screen-controllers/{domain}/{name}.js` 생성 (선택)
4. `css/screens/{domain}/{name}.css` 생성 (선택)

---

## 🔗 관련 문서

- [PRD 스펙](../../Docs/AI_PRD/specs/ui/)
- [설계 결정](../../Docs/인사이트/prototype-v4-decisions.md)
- [FSD 매핑](./docs/FSD_MAPPING.md)

---

## ✅ 구현 현황

### P1 - Auth

- [x] splash
- [x] login
- [x] profile-input

### P1 - Portfolio

- [ ] list (= home)
- [ ] detail

### P1 - Stock

- [ ] search

### P1 - Rebalancing

- [ ] check

### P1 - Settings

- [ ] main
