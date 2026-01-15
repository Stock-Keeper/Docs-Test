# 📐 Project Analysis (프로젝트 분석)

> **Stock-Keeper 프로젝트의 UI/UX 분석 및 디자인 가이드**  
> **목적:** 프로토타입 분석 → 실제 구현 가이드  
> **최종 수정일:** 2026-01-15

---

## 🎯 이 폴더의 목적

HTML 프로토타입(`prototype_v2_opus`)을 기반으로 한 **UI/UX 분석 문서** 모음입니다.

```
프로토타입 분석 → 디자인 권장사항 → 와이어프레임 가이드 → 실제 구현
```

---

## 📂 폴더 구조

```
📁 project_analysis/
├── 📄 README.md                   ← 현재 문서
├── 📄 prototype_page_analysis.md  ← ⭐ 페이지별 분석
├── 📄 ux_design_recommendations.md← ⭐ UX/UI 권장사항
├── 📄 screen_flow.md              ← 화면 흐름 다이어그램
├── 📄 wireframe_guide.md          ← Figma 와이어프레임 가이드
│
└── 📁 pages/                      ← 화면별 상세 스펙
    ├── 📄 README.md               ← 페이지 스펙 개요
    ├── 📄 00_onboarding.md
    ├── 📄 01_login.md
    ├── 📄 02_profile.md
    ├── 📄 03_home.md
    ├── 📄 04_portfolio_detail.md
    ├── 📄 05_stock_search.md
    ├── 📄 06_rebalancing.md
    ├── 📄 07_settings.md
    ├── 📄 08_stock_detail.md
    ├── 📄 09_tutorial.md
    ├── 📄 10_profile_edit.md
    └── 📄 11_splash.md
```

---

## 📋 문서 역할

| 문서 | 역할 | 대상 |
|------|------|------|
| [prototype_page_analysis.md](./prototype_page_analysis.md) | 페이지별 UI/UX 분석, 논의사항 정리 | 기획자, 디자이너 |
| [ux_design_recommendations.md](./ux_design_recommendations.md) | UX 디자인 권장사항, 컴포넌트 패턴 | 디자이너, 프론트 |
| [screen_flow.md](./screen_flow.md) | 화면 전환 흐름 다이어그램 | 전체 팀 |
| [wireframe_guide.md](./wireframe_guide.md) | Figma 초보용 와이어프레임 가이드 | 디자이너 |
| [pages/](./pages/) | 화면별 상세 스펙 (12개) | 개발자 |

---

## 🎨 핵심 디자인 원칙

### 정보 계층
```
Level 1: 즉시 인지 (1초 이내) → 큰 숫자, 색상, 아이콘
Level 2: 스캔 가능 (3초 이내) → 카드, 리스트, 요약
Level 3: 탐색 시 확인        → 상세 정보, 설정값
```

### 한국 증시 색상 규칙
| 상태 | 색상 | 용도 |
|------|------|------|
| 상승/수익 | 🔴 빨강 | 수익률, 매수 필요 |
| 하락/손실 | 🔵 파랑 | 손실률, 매도 필요 |
| 경고/주의 | 🟡 노랑 | 리밸런싱 필요 |

### 터치 타겟
- **최소 영역:** 44×44px (iOS), 48×48dp (Android)
- **버튼 높이:** 48px
- **리스트 아이템:** 56~88px

---

## 📱 주요 화면 (7개)

| # | 화면 | 핵심 요소 | 사용자 니즈 |
|---|------|----------|------------|
| 1 | 로그인 | Google 로그인, 앱 소개 | 빠른 시작 |
| 2 | 프로필 | 닉네임, 투자 성향 | 최소 입력 |
| 3 | 홈 | 총 자산, 포트폴리오 목록 | 전체 현황 파악 |
| 4 | 상세 | 종목별 비율, 수익률 | 비율 조정 파악 |
| 5 | 검색 | 종목 검색, 수량 입력 | 빠른 검색/추가 |
| 6 | 리밸런싱 | 현재/목표 비교, 매수/매도 제안 | ⭐ 핵심 기능 |
| 7 | 설정 | 알림, 프로필, 로그아웃 | 개인화 |

---

## ⭐ 핵심 디자인 결정

| 항목 | 권장 방식 | 이유 |
|------|----------|------|
| 비율 표현 | **초과/미달 바** (중심선 기준) | 리밸런싱 필요성 즉시 파악 |
| 리밸런싱 표시 | **눈에 띄는 배지** | 앱의 핵심 가치 강조 |
| 차트 형태 | 요약 도넛 + 상세 액션 카드 | 직관적 + 액션 가능 |
| 종목 레이아웃 | 5개 이하 테이블, 6개 이상 카드 | 정보 밀도 조절 |

---

## 🔗 관련 문서

- HTML 프로토타입: `prototype_v2_opus/index.html`
- 현재 PRD: `Docs/AI_PRD/`
- 에이전트 가이드: `Docs/agent_docs/`

---

*📌 이 폴더는 프로토타입을 실제 앱으로 전환하기 위한 분석과 가이드를 제공합니다.*
