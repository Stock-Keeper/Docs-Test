---
type: ui
phase: P1
component: 요약 카드
related:
  ui:
    - specs/ui/portfolio/list.md
    - specs/ui/portfolio/detail.md
---

# 요약 카드 (Summary Card)

## 개요

주요 지표를 그리드 형태로 표시하는 요약 컴포넌트.
포트폴리오 목록과 상세 화면에서 자산 현황 표시에 사용.

## 레이아웃

```text
┌─────────────────────────────────┐
│  총 평가금액     수익금/수익률    │
│  ₩32,450,000   +₩2,200,000     │
│                (+7.27%)        │
│                                 │
│  현금 비중 (5%)                  │
│  ₩1,622,500                     │
└─────────────────────────────────┘
```

## 변형 (Variants)

### 1. 상세 요약 (Full)

- 용도: portfolio/detail
- 사용 클래스: `.summary-grid`
- 표시: 총 평가금액, 현금 비중(비율/금액), 수익금, 수익률

### 2. 목록 요약 (Compact)

- 용도: portfolio/list
- 사용 클래스: `.summary-card`
- 표시: 총 평가금액, 업데이트 시간(수정일), 증감액 및 수익률, 보유 현금

## 컴포넌트 요소

| 요소 | 설명 | 표시 위치 |
|---|---|---|
| 총 평가금액 | 종목 + 현금 합계 | Detail / List |
| 수익금 / 증감액 | 평가금액 - 매입금 | Detail / List |
| 수익률 | (수익금 / 매입금) × 100 | Detail / List |
| 현금 (보유 현금/현금 비중) | 현금 액수 및 비중 | Detail / List |
| 수정일 | 마지막 업데이트 시간 | List |

## 스타일 속성

| 요소 | 값 |
|---|---|
| border-radius | 16px |
| padding | 20px |
| background | `var(--card-bg)` |
| grid | 2열 (모바일), 4열 (태블릿) |

## 색상 규칙

| 조건 | 색상 |
|---|---|
| 수익 (양수) | 빨간색 (`var(--success)`) |
| 손실 (음수) | 파란색 (`var(--error)`) |

## 사용 화면

- `portfolio/list`: 포트폴리오 카드 내 간략 정보
- `portfolio/detail`: 상단 자산 요약 영역
