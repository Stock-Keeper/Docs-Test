---
type: ui
phase: P1
screen: 종목 추가 모달
related:
  api:
    - ../../api/stock/search.md
    - ../../api/stock/add.md
reference: ../../../reference/pages/stock_search.md
---

# 종목 추가 모달 (Stock Add Modal)

## 개요

종목 검색 후 포트폴리오에 추가하는 바텀시트 모달 (검색 화면 내 `stock-add-modal`)

```text
┌───────────────────────────────────────┐
│  [핸들 -]                             │
│  현대자동차                      [X]   │  ← `bottom-sheet-header`
├───────────────────────────────────────┤
│  ₩186,500                   +1.24%   │  ← `stock-modal-price`
│  005380                               │  ← `stock-code-small`
│                                       │
│  보유 수량                             │  ← `form-group`
│  [ - ]        10         [ + ]        │  ← `number-input`
│  예상 금액: ₩1,865,000                │  ← `estimated`
│                                       │
│  목표 비중 ⚠️                          │  ← `form-group`, `ratio-label-row`
│  ○━━━━━━●━━━━━━━━━━━━━━○            │  ← `ratio-slider`
│  10%                                  │  ← `slider-value`
│                                       │
│  기존 종목: 90%                       │  ← `ratio-sum-info`
│  + 현재: 10%                          │
│  합계: 100%                           │
│  초과분은 포트폴리오 상세 화면에서 조정해주세요│  ← `ratio-warning-message`
│                                       │
│  [     취소     ]     [   추가   ]    │  ← `bottom-sheet-footer`
└───────────────────────────────────────┘
```

## 컴포넌트

### 1. 바텀시트 헤더 (`bottom-sheet-header`)
| 요소 | ID / 설명 |
|---|---|
| 핸들 | `bottom-sheet-handle` |
| 종목명 | `#modal-stock-name` |
| 닫기 버튼 [X] | `#stock-modal-close-btn` |

### 2. 현재가 섹션 (`stock-modal-price`)
| 요소 | ID / 설명 |
|---|---|
| 현재가 | `#modal-stock-price` (`current-price`) |
| 등락률 | `#modal-stock-change` (`price-change positive/negative`) |
| 종목코드 | `#modal-stock-code` (`stock-code-small`) |

### 3. 보유 수량 입력 (`form-group`)
| 요소 | ID / 설명 |
|---|---|
| 수량 스테퍼 | `number-input` 영역 안의 `#qty-minus-btn`, `#qty-plus-btn` |
| 현재 수량 | `#stock-quantity` |
| 예상 금액 | `#estimated-amount` (`estimated` 클래스) |

### 4. 목표 비중 설정 (`form-group`)
| 요소 | ID / 설명 | বি고 |
|---|---|---|
| 경고 아이콘 | `#ratio-warning-icon` | 100% 초과 시 노출 좌측 상단 (`⚠️`) |
| 슬라이더 | `#ratio-slider` (`ratio-slider` 클래스) | 좌우 스와이프 |
| 비중 수치 | `#ratio-display` (`slider-value` 클래스) | |
| 비중 요약 | `#ratio-sum-info` | 기존 종목(`#base-ratio-display`), 현재(`#current-add-ratio`), 합계(`#total-ratio`) 노출 |
| 경고 메시지 | `#ratio-warning-message` | 초과 시 "초과분은 ㅍ... 상세화면에서 조정" 문구 |

### 5. 액션 버튼 (`bottom-sheet-footer`)
| 요소 | ID / 설명 |
|---|---|
| 취소 버튼 | `#stock-modal-cancel-btn` (`secondary` 클래스) |
| 추가 버튼 | `#stock-modal-confirm-btn` (`primary` 클래스) |

## 상호작용

| 액션 | 동작 |
|---|---|
| [X], 취소, 백드롭 탭 | 바텀시트 닫기 |
| 수량 증감/입력 | 예상 금액 실시간 자동 계산 |
| 비율 슬라이더 이동 | 선택 비중(`ratio-display`) 및 합계(`total-ratio`) 실시간 갱신 |
| 추가 그룹 액션 | 합계가 100% 넘을 경우 UI 붉게 강조 (`warning` 클래스 전역 스위치) |
| 추가 (`추가`) 버튼 탭 | 추가 완료 알림 후 바텀시트 닫기. (`detail.html`로 화면 전환 및 데이터 반영-가정) |

## 상태

| 상태 | UI | 비고 |
|---|---|---|
| 기본 | 수량 1, 비중 초기값, 버튼 활성화 | |
| 비율 100% 초과 | 슬라이더 색상 변경(`error`), 경고 아이콘 노출, 하단 요약영역 붉은테두리/배경 강조 | |
| 추가 중 로딩 | (필요시) Primary 버튼 스피너 | |

## 관련 스펙

- API: `../../api/stock/search.md`
- API: `../../api/stock/add.md`

