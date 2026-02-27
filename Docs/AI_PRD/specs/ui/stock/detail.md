---
type: ui
phase: P1
screen: 종목 상세 화면
related:
  api:
    - ../../api/stock/price.md
    - ../../api/portfolio/update-delete-item.md
  ui:
    - specs/ui/_shared/modal.md
reference: ../../../reference/pages/08_stock_detail.md
---

# 종목 상세 화면 (Stock Detail)

## 개요

개별 종목의 상세 정보와 보유/비율 현황을 확인하고 수정/삭제할 수 있는 상세 페이지

## 레이아웃

```text
┌─────────────────────────────────┐
│  ←  삼성전자               005930 │
├─────────────────────────────────┤
│                                 │
│  ₩74,500           +1,200 (+1.6%)│
│  15:42 기준                     │
│                                 │
│  ┌─────────────────────────────┐│
│  │      📈 주가 차트            ││
│  │      추후 지원 예정 [P2]     ││
│  └─────────────────────────────┘│
│                                 │
│  내 보유 현황                   │
│  ┌─────────────────────────────┐│
│  │ 보유 수량          150주     ││
│  │ 평균 매입가      ₩71,200    ││
│  │ 평가금액     ₩11,175,000    ││
│  ├─────────────────────────────┤│
│  │ 수익금         +₩495,000    ││
│  │ 수익률            +4.6%     ││
│  └─────────────────────────────┘│
│                                 │
│  비율 현황                      │
│  ┌─────────────────────────────┐│
│  │ 현재 비율  [████░░░]  35%   ││
│  │ 목표 비율  [███░░░░]  30%   ││
│  │ ⚠️ 괴리율 +17% (임계값 초과) ││
│  └─────────────────────────────┘│
│                                 │
│  ... (스크롤) ...               │
│                                 │
│  ┌────────────┐ ┌────────────┐  │
│  │  수량 수정  │ │    삭제    │  │
│  └────────────┘ └────────────┘  │
│  (하단 탭바 위 고정 위치)        │
└─────────────────────────────────┘
```

## 컴포넌트

### 1. 헤더 (`header`)
| 요소 | ID / 설명 | Phase |
|---|---|---|
| 뒤로가기 (`←`) | `#stock-detail-back-btn` | P1 |
| 종목명 | `#stock-detail-name` / 화면 타이틀 | P1 |
| 종목코드 | `#stock-detail-code` / 티커, 코드 | P1 |

### 2. 현재가 섹션 (`price-section`)
| 요소 | ID / 설명 | Phase |
|---|---|---|
| 현재가 | `#detail-current-price` / 실시간 가격 | P1 |
| 등락폭/률 | `#detail-price-change` / 전일 대비 증감 (예: `+1,200 (+1.6%)`) | P1 |
| 기준 시각 | `#detail-price-time` / 마지막 업데이트 시각 | P1 |
| 증감 색상 | 상승: 초록(`.positive`), 하락: 빨강(`.negative`) | P1 |

### 3. 차트 영역 (`chart-section`) [P2]
> [!NOTE]
> 차트 영역은 P2에서 구현. P1에서는 플레이스홀더 표시.

| 요소 | 클래스/ID / 설명 | Phase |
|---|---|---|
| 플레이스홀더 | `.chart-placeholder-section` / "주가 차트 / 추후 지원 예정" 표기 | P1 |
| 캔들 차트 | `.chart-canvas` 내 실제 차트 렌더링 | P2 |

### 4. 내 보유 현황 카드 (`holdings-section` > `.holdings-card`)
| 요소 | ID / 설명 | Phase |
|---|---|---|
| 보유 수량 | `#detail-quantity` | P1 |
| 평균 매입가 | `#detail-avg-price` | P1 |
| 평가금액 | `#detail-total-value` | P1 |
| 수익금 | `#detail-profit` / 영역: `.holdings-row.highlight` | P1 |
| 수익률 | `#detail-profit-rate` / 영역: `.holdings-row.highlight` | P1 |

### 5. 비율 현황 카드 (`ratio-section` > `.ratio-card`)
| 요소 | ID / 설명 | Phase |
|---|---|---|
| 현재 비율 | `#current-ratio-bar` (진행바), `#detail-current-ratio` (텍스트) | P1 |
| 목표 비율 | `#target-ratio-bar` (진행바), `#detail-target-ratio` (텍스트) | P1 |
| 괴리율 경고 | `#ratio-deviation-info`, `#deviation-text` / 초과 시 경고 노출 | P1 |

### 6. 하단 고정 액션 버튼 (`stock-detail-actions`)
| 요소 | ID / 설명 | Phase |
|---|---|---|
| 수량 수정 (`.secondary-btn`) | `#stock-edit-btn` / "종목 수정" 바텀시트 모달 표시 | P1 |
| 삭제 (`.danger-btn`) | `#stock-delete-btn` / "종목 삭제" 바텀시트 모달 표시 | P1 |

### 7. 수량 수정 바텀시트 (`#stock-edit-modal`)
| 요소 | ID / 설명 |
|---|---|
| 닫기 버튼 | `#edit-modal-close-btn` |
| 종목 정보 | `#edit-stock-name`, `#edit-stock-code` |
| 수량 입력 | `#edit-qty-minus-btn`, `#edit-quantity-input`, `#edit-qty-plus-btn` |
| 목표 비율 | `#edit-ratio-warning-icon`, `#edit-ratio-slider`, `#edit-ratio-value` |
| 비중 합계 | `#edit-ratio-sum-info`, `#edit-base-ratio`, `#edit-current-ratio`, `#edit-total-ratio`, `#edit-ratio-warning-message` |
| 액션 버튼 | `#edit-cancel-btn` (취소), `#edit-save-btn` (저장) |

### 8. 삭제 확인 바텀시트 (`#stock-delete-modal`)
| 요소 | ID / 설명 |
|---|---|
| 닫기 버튼 | `#delete-modal-close-btn` |
| 텍스트 | "정말로 이 종목을 삭제하시겠습니까?" 등 안내 문구 |
| 액션 버튼 | `#delete-cancel-btn` (취소), `#delete-confirm-btn` (삭제) |

## 상호작용

| 액션 | 동작 | Phase |
|---|---|---|
| 뒤로가기 탭 | 포트폴리오 상세 화면으로 복귀 | P1 |
| 수량 수정 탭 | 종목 수정 바텀시트 모달 노출 | P1 |
| 삭제 탭 | 삭제 확인 바텀시트 모달 노출 | P1 |

## 상태

| 상태 | UI | Phase |
|---|---|---|
| 로딩 중 | 주가 스켈레톤, 차트 스켈레톤 | P1 |
| 삭제 확인 | 하단 삭제 확인 바텀시트 노출 | P1 |
| 차트 플레이스홀더 표시 | P1 단계 안내 UI 표시 (P2 진행 시 차트 노출) | P1 |

## 데이터 소스

| 항목 | 소스 | Phase |
|------|------|-------|
| 종목 기본 정보 | 포트폴리오 상세에서 전달받은 state | P1 |
| 현재가 | price API (캐시 30초) or 더미 | P1 |
| 차트 데이터 | history API | P2 |

## 관련 스펙

- API: `../../api/stock/price.md`
- API: `../../api/portfolio/update-delete-item.md`
- API (P2): `../../api/stock/history.md`

## 📎 선택 참조

> 상세 UI/UX 시나리오가 필요하면 아래 파일을 참조 요청하세요.

- `../../../reference/pages/08_stock_detail.md` - 종목 상세 화면 시나리오
