---
type: ui
phase: P1
screen: 리밸런싱 확인 화면
related:
  api:
    - specs/api/rebalancing/calculate.md
  ui:
    - specs/ui/portfolio/detail.md
reference: ../../../reference/pages/rebalancing.md
---

# 리밸런싱 확인 화면 (Rebalancing Check)

## 개요

리밸런싱 필요 종목 확인 및 매수/매도 제안

```text
┌───────────────────────────────────────┐
│  ← 리밸런싱 분석                      │  ← 헤더 (`header`)
├───────────────────────────────────────┤
│                                       │
│  [현재 비율 도넛]   [목표 비율 도넛]  │  ← 도넛 차트 영역 (`donut-section`)
│  - 삼성전자 ...    - 삼성전자 ...     │  ← 범례 (`donut-legend`)
│                                       │
│  ───────────────────────────────────  │
│                                       │
│  리밸런싱 제안                        │  ← `section-header`
│  [3%]  [5% ✓]  [10%]                  │  ← 임계값 선택 (`threshold-selector`)
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ 총 매수 필요 금액      ₩1,622,500 │  │  ← 요약 (`total-required-summary`)
│  │ 총 매도 예상 금액        ₩596,000 │  │
│  │ ─────────────────────────────── │  │
│  │ 순 필요 자금           ₩1,026,500 │  │  ← `summary-row net`
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ 매도  삼성전자                      │  │  ← 제안 카드 (`suggestion-card sell`)
│  │ ─────────────────────────────── │  │
│  │ 현재 비율               35%     │  │  ← `detail-row`
│  │ 목표 비율               30%     │  │
│  │ 권장 수량               -8주    │  │  ← `detail-row highlight`
│  │ 예상 금액            ₩596,000   │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ 매수  카카오                        │  │  ← 제안 카드 (`suggestion-card buy`)
│  │ ...                             │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [ 📋 결과 복사하기 ]                 │  ← 복사 영역 (`copy-result-section`)
└───────────────────────────────────────┘
```

### 1. 헤더 (`header`)
- 뒤로가기 (`rebalance-back-btn`)
- 타이틀: "리밸런싱 분석"

### 2. 도넛 차트 섹션 (`donut-section`)
| 요소 | 클래스명 | 설명 | Phase |
|---|---|---|---|
| 현재 도넛 | `current-donut` | 현재 포트폴리오 비율을 나타내는 도넛 차트 (conic-gradient 사용) | P1 |
| 목표 도넛 | `target-donut` | 설정된 목표 비율을 나타내는 도넛 차트 | P1 |
| 중앙 텍스트 | `donut-hole` | "현재", "목표" 라벨 표시 영역 | P1 |
| 범례 목록 | `donut-legend` | 각 섹션 하단 종목 색상표 (`legend-color`) 및 비율, 종목명 표시 | P1 |

### 3. 리밸런싱 제안 (`rebalance-suggestions`)
- 영역 헤더: "리밸런싱 제안" (`section-header`)
- **임계값 선택기** (`threshold-selector`):
  - 3%, 5%, 10% 버튼 제공 (`threshold-btn`)
  - 현재 선택값은 `selected` 클래스 추가

#### 3.1. 총 필요 자금 요약 (`total-required-summary`)
| 요소 | 클래스명 | 형태 / 특징 | P |
|---|---|---|---|
| 총 매수 | `summary-value buy` | 초록색 금액 표기 (예: ₩1,622,500) | P1 |
| 총 매도 | `summary-value sell` | 붉은색 금액 표기 (예: ₩596,000) | P1 |
| 순 자금 | `summary-row net` | 총 매수 - 총 매도에 따른 순 차액 (순매수면 `net-buy`, 순매도면 `net-sell` 클래스) | P1 |

#### 3.2. 제안 카드 목록 (`suggestion-list`)
- 항목 단위 래퍼 (`suggestion-card`)
- 매도 카드(`sell`), 매수 카드(`buy`)의 상태에 따라 `suggestion-type` 뱃지 스타일 변화
- **상세 내역 (`suggestion-detail`)**:
  - 현재 비율, 목표 비율 행 (`detail-row`)
  - **권장 수량**: 강조 처리 영역 (`detail-row highlight`) -> "-8주", "+20주" 등 기재
  - 예상 금액 표시

### 4. 결과 복사 영역 (`copy-result-section`)
- 복사 버튼 (`copy-btn` / `secondary-btn` 스타일): "📋 결과 복사하기" 텍스트. 클릭 시 전체 요약 가이드 텍스트를 클립보드로 복사

## 상호작용

| 액션 | 동작 |
|------|------|
| 임계값 변경 | 실시간 재계산 |
| 종목 카드 탭 | 해당 종목 수정 화면 |
| 복사 버튼 (클립보드 아이콘) | 해당 종목 매매 가이드 텍스트 복사 (ex: "삼성전자 8주 매도") |
| Pull to Refresh | 현재가 새로고침 후 재계산 |

| 상태 | 컨테이너 | UI |
|---|---|---|
| 로딩 중 | - | JS 로딩 동작 및 스켈레톤 (구현 필요 시) |
| 균형 유지 | `rebalance-ok-state` | 아이콘 (✅), 타이틀 "포트폴리오가 균형 잡혀있어요!", 서브 텍스트 "임계값 내에 있습니다." |
| 에러 | - | 토스트/스낵바 또는 에러 메시지 뷰 표출 |

## 관련 스펙

- API: `specs/api/rebalancing/calculate.md`
- UI: `specs/ui/portfolio/detail.md`
