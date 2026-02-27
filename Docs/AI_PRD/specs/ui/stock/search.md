---
type: ui
phase: P1
screen: 종목 검색 화면
related:
  api:
    - specs/api/stock/search.md
  ui:
    - specs/ui/stock/add.md
  shared:
    - specs/ui/_shared/stock-card.md
---

# 종목 검색 화면 (Stock Search)

## 개요

종목 검색 및 선택

## 레이아웃

```text
┌───────────────────────────────────────┐
│  ← 종목 추가                           │  ← 헤더 (`header`)
├───────────────────────────────────────┤
│  현재 목표 비중 합계               95%  │  ← `ratio-summary-bar`
│  ───────────────────────────────────  │
│  [🔍 종목명 또는 종목코드 검색     (✕)] │  ← `search-container`
│                                       │
│  ┌─────────────────────────────────┐  │  ← `search-results`
│  │ 삼성전자      005930            │  │  ← `result-item`
│  │ ₩11,357,500   +5.2%             │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ 삼성전자우    005935  [보유]     │  │  ← `owned-badge`
│  │ (선택 불가 - Dimmed 처리)         │  │  ← `owned` 클래스
│  │ ₩62,000       -0.80%            │  │
│  └─────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
```

## 컴포넌트

### 1. 헤더 (`header`)
- 구성: 뒤로가기 버튼 (`#search-back-btn`), 타이틀("종목 추가")

### 2. 현재 비중 합계 바 (`ratio-summary-bar`)
- 라벨 (`ratio-label`): "현재 목표 비중 합계"
- 값 (`ratio-value` / `#current-ratio-sum`): 포트폴리오 비중 총합 (예: `95%`)
- 초과 시 경고 색상 적용 (`warning`/`error` 클래스)

### 3. 검색 입력창 (`search-container` > `search-input-wrapper`)
- 구성: 검색 아이콘(`search-icon`), 텍스트 입력 (`#search-input`), 지우기 버튼 (`#clear-search-btn`)
- 실시간 검색 (debounce 300ms 등) 및 초기화(`✕`) 기능

### 4. 검색 결과 목록 (`search-results` / `#search-results`)
| 요소 | 클래스명 | 설명 | 비고 |
|---|---|---|---|
| 카드 | `result-item` | 개별 종목 컨테이너 행 | 보유 시 `owned` 적용 |
| 종목정보 | `result-info` | `result-name` (종목명), `result-code` (티커/코드) | |
| 가격정보 | `result-price` | `price` (현재가), `change` (등락률) | 양수/음수 색상 |
| 보유 배지 | `owned-badge` | 이미 보유 중인 종목인 경우 표출 | |
| 활성 상태 | `owned` (클래스) | 보유 종목은 화면 선택 비활성화 (Dimmed 효과) | |

## 상호작용

| 액션 | 동작 |
|---|---|
| 뒤로가기 탭 | 이전 화면(포트폴리오 상세)으로 복귀 |
| 검색어 입력 | `debounce` 처리된 실시간 검색 결과 갱신 |
| `#clear-search-btn` 탭 | 검색어 및 결과 초기화 |
| 종목 (미보유) 탭 | 화면 하단에서 "**종목 추가 바텀시트**"(`stock-add-modal`) 호출 (`add.md` 명세 참조) |
| 종목 (보유) 탭 | `owned` 클래스로 인해 이벤트 비활성화 |

## 상태

| 상태 / ID | UI |
|---|---|
| 초기 진입 (`search-initial-state`) | 📝 아이콘 + "종목을 검색해주세요" 안내 메시지 |
| 검색 결과 없음 (`search-empty-state`) | 🔍 아이콘 + "검색 결과가 없어요" 메시지 |
| 로딩 중 | 스켈레톤 UI 노출 |
| 에러 | API 오류 시 에러 안내/토스트 표출 |

## 관련 스펙

- API: `specs/api/stock/search.md`
- UI: `specs/ui/stock/add.md`
