---
type: ui
phase: P1
screen: 포트폴리오 상세 화면
related:
  api:
    - specs/api/portfolio/detail.md
  ui:
    - specs/ui/stock/add.md
    - specs/ui/rebalancing/check.md
  shared:
    - specs/ui/_shared/modal.md
    - specs/ui/_shared/stock-card.md
    - specs/ui/_shared/summary-card.md
reference: ../../../reference/pages/portfolio_detail.md
---

# 포트폴리오 상세 화면 (Portfolio Detail)

## 개요

포트폴리오 종목 목록 및 리밸런싱 정보 표시

## 레이아웃

```text
┌───────────────────────────────────────┐
│  ← [포트폴리오 상세]                 [☰]  │  ← 헤더 (`header`)
├───────────────────────────────────────┤
│ [테마 색상 띠 (Banner)]                   │  ← `portfolio-banner`
├───────────────────────────────────────┤
│                                       │
│  총 평가금액       현금 비중 (5%)       │  ← `summary-grid`
│  ₩32,450,000     ₩1,622,500         │
│  수익금            수익률               │
│  +₩2,200,000     +7.27%              │
│  ───────────────────────────────────  │
│                                       │
│  보유 종목        5종목 [비율합계 100%] │  ← `stock-meta` (`ratio-sum`)
│  ┌─────────────────────────────────┐  │
│  │ ⚠️ 리밸런싱 필요                  │  │  ← `rebalance-insight`
│  │   삼성전자 +17% 초과 등             │  │
│  │                     [ 분석 → ]   │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │  ← `stock-card`
│  │ 삼성전자      005930            │  │  ← `stock-card-header`
│  │ ₩11,357,500   +5.2%      [×]     │  │  ← `delete-stock-btn` (편집 모드)
│  │ ─────────────────────────────── │  │
│  │ 현재 35%               목표 30%  │  │  ← `stock-card-ratio`
│  │ [███████░░░]          +17% 초과  │  │  ← `deviation-bar`, `deviation-tag sell`
│  └─────────────────────────────────┘  │
│                                       │
│  [+ 종목 추가] [⚖️ 리밸런싱 분석]         │  ← `detail-actions` (하단 고정)
└───────────────────────────────────────┘
```

## 컴포넌트

### 1. 헤더 및 배너
- **헤더**: 뒤로가기(`#detail-back-btn`), 타이틀(`#detail-title`), 메뉴 버튼(`#detail-menu-btn` ☰)
  - 메뉴 버튼 탭 시 관련 드롭다운 메뉴 노출: **임계값 설정, 알림 설정, 편집** (`#detail-dropdown-menu`)
- **배너**: 포트폴리오 테마 그라디언트 컬러 띠 (`.portfolio-banner` / `#detail-banner`)

### 2. 요약 영역 (`.detail-summary` -> `.summary-grid`)
| 요소 | ID / 클래스명 | 설명 |
|---|---|---|
| 총 평가금액 | `#detail-total-val` | 가장 크고 굵게 강조 (`.large` 클래스) |
| 현금 비중 | `#detail-cash-ratio` (%), `#detail-cash-val` | 현금 퍼센트 및 액수 표기 |
| 수익금 / 수익률 | `#detail-return-val`, `#detail-return-rate` | 플러스/마이너스에 따라 `.positive` / `.negative` 클래스 |

### 3. 보유 종목 섹션 (`.stocks-section`)
- **섹션 헤더**: "보유 종목", 아이템 수(`#detail-stock-count`), 목표 비율 합계 안내 배지(`#detail-ratio-sum`)

#### 3.1. 리밸런싱 알림 카드 (`#detail-rebalance-insight` / `.rebalance-insight`)
- 리밸런싱 임계값 설정 초과 시 표시됨
- 타이틀 및 세부 메시지(`#detail-insight-msg`) 표시. 분석 버튼(`#detail-rebalance-btn`) 제공

#### 3.2. 종목 리스트 (`#detail-stock-list` / `.stocks-cards` / `.stock-card`)
| 구성영역 | 클래스명 | 설명 |
|---|---|---|
| Header | `.stock-info` | 종목명표기 (`.stock-name`, `.stock-code`) |
| | `.stock-value-info` | 평가액(`.value-main`), 증감(`.value-change`) |
| | `.delete-stock-btn` | 편집 모드 시 활성화되는 붉은색 [×] 버튼 |
| Ratio | `.ratio-labels` | 좌/우로 현재 % (`.ratio-current-label`) / 목표 % (`.ratio-target-label`) 표기 |
| | `.deviation-bar` | 비율 게이지 모형, `.deviation-fill` 너비 조절 방식. 부족시 `.under`, 초과시 `.over` 스타일 |
| | `.deviation-tag` | 퍼센트 결과 배지. `.ok`(적정), `.buy`(미달), `.sell`(초과) 표시 |

### 4. 설정 바텀시트 (`.bottom-sheet-overlay`)
- **임계값 설정 모달** (`#threshold-modal`): "리밸런싱 알림을 보냅니다" 안내와 함께 ±3%, ±5%, ±10% 라디오 버튼 렌더링
- **알림 설정 모달** (`#notification-modal`): "리밸런싱 알림"(`#notification-rebalance`), "가격 변동 알림"(`#notification-price`) 각각을 토글(`.toggle`) 할 수 있는 스위치 제공

### 5. 단독 버튼 영역 (`.detail-actions` / 빈 화면)
- 빈 화면 추가 버튼: `#detail-add-stock-empty-btn` (목록이 비어있을 때 `#detail-empty-state` 노출)
- 하단 플로팅 바 (버튼 영역 이외 클릭 스루 지원)
- **종목 추가**: `#detail-add-stock-btn` (+ 아이콘)
- **리밸런싱 분석**: `#detail-rebalance-action-btn` (저울 아이콘)

## 상호작용

| 액션 | 동작 |
|---|---|
| 상단 메뉴 `[☰]` 탭 | 하단 드롭다운 메뉴 표시 (임계값 설정, 알림 설정, 편집) |
| 메뉴 > 임계값 설정 탭 | 임계값 설정 바텀시트 (`threshold-modal`) 표시 |
| 메뉴 > 알림 설정 탭 | 알림 설정 바텀시트 (`notification-modal`) 표시 |
| 메뉴 > 편집 탭 | 삭제 모드 (`edit-mode`) 활성화, 완료 시 원래 화면으로 복귀 |
| (편집 모드 시) 삭제 `[×]` 탭 | 해당 종목을 포트폴리오에서 즉시/확인 후 제거 애니메이션 |
| [+ 종목 추가] 탭 | 자산 검색 화면 이동 (`specs/ui/stock/add.md`) |
| [⚖️ 리밸런싱 분석] 탭 | 대상 종목 전체 리밸런싱 화면 (`specs/ui/rebalancing/check.md`) |
| Pull to Refresh | 종목/결과 현재가 새로고침 |

## 상태

| 상태 | UI |
|---|---|
| 로딩 중 | 스켈레톤 UI 표출 |
| 빈 목록 | 📈 아이콘, "아직 종목이 없어요" 빈 영역 노출 (`detail-empty-state`) + 종목 추가 유도 영역 |
| 에러 | 에러 핸들링 영역 및 알림 |
| 편집 모드 (`edit-mode`) | 리밸런싱 인사이트 카드 및 하단 액션바 일시 숨김 처리. 종목 카드 클릭 비활성화, 우측 삭제 버튼 활성화 & 트랜지션 애니메이션 |

## 관련 스펙

- API: `specs/api/portfolio/detail.md`
- UI: `specs/ui/stock/add.md`
- UI: `specs/ui/rebalancing/check.md`
