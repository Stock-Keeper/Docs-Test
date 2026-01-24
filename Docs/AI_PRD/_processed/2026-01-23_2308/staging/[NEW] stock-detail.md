---
batch: 2026-01-23_2100
domain: stock
type: new
---
# 종목 상세 (Detail) 신규 구축

## 1. 개요

Inbox의 `08_stock_detail.md` 요구사항을 반영하여 개별 종목의 상세 정보, 차트, 내 보유/비율 현황을 한눈에 볼 수 있는 상세 페이지와 차트 API를 신규 설계합니다.

## 2. 변경 사항 요약

| 구분          | 항목      | 변경 내용                                              |
| ------------- | --------- | ------------------------------------------------------ |
| **UI**  | 상세 화면 | `specs/ui/stock/detail.md` 신규 생성                 |
| **API** | 차트      | `specs/api/stock/history.md` 신규 생성 (기간별 시세) |

## 3. 상세 스펙 변경

### A. [NEW] [UI] `specs/ui/stock/detail.md`

#### 개요

종목의 상세 정보(현재가, 차트)와 내 포트폴리오 내에서의 위상(보유량, 비율)을 통합 조회 및 관리하는 화면입니다.

#### 주요 기능

1. **차트 뷰어**: 1일/1주/3달 기간별 주가 추이 확인
2. **보유 현황**: 평균단가, 수익률, 평가금액 표시
3. **CRM**: 종목 수량 수정 및 삭제 아이콘 제공

### B. [NEW] [API] `specs/api/stock/history.md`

#### 개요

종목 상세 화면의 차트를 그리기 위한 과거 시세 데이터 조회 API입니다.

```markdown
# GET /api/stocks/{stockCode}/history

## Request
- Query: `period` (1d, 1w, 1m, 3m)

## Response
```json
{
  "stockCode": "005930",
  "period": "1w",
  "candles": [
    {
      "date": "2026-01-10",
      "close": 74000,
      "volume": 12000000
    },
    ...
  ]
}
```

## 4. AI 분석 및 확인 사항

### 🔍 논리적 검증

- **데이터 소스**: 차트 데이터는 외부 API(한투 등)에서 가져와야 하며, 트래픽 비용 절감을 위해 **서버 측 캐싱(Redis 10분~1시간)**이 필수입니다.
- **수익률 계산**: `(현재가 - 평균단가) / 평균단가 * 100`. 클라이언트/서버 어디서 계산할지 정해야 하나, 보통 서버에서 `portfolio_item` 조회 시 계산해서 줍니다. (`detail` API가 없으므로 `GET /portfolios/{id}`의 `stocks` 배열 내 정보를 재사용하거나, 별도 `GET /portfolios/{id}/items/{itemId}`가 필요할 수 있음)

### ❓ 확인 필요 사항

#### 1. 차트 데이터 제공 범위

초기 버전(P1~P2)에서 차트 캔들(Candle) 데이터(시가/고가/저가/종가)를 모두 제공할까요, 아니면 단순 라인 차트용 종가(Close)만 제공할까요?

- [ ] **옵션 A (Line Chart)**: 종가(Close)만 제공 (데이터 가볍고 구현 빠름)
- [X] **옵션 B (Candle Chart)**: OHLC 모두 제공 (전문적인 느낌, 데이터 양 많음)
- [ ] 기타: ________________

#### 2. 종목 단건 조회 API

현재 `GET /api/portfolios/{id}`는 전체 목록을 줍니다. 상세 화면 진입 시 전체 목록에서 필터링해서 쓸까요, 아니면 단건 조회 API를 만들까요?

- Inbox의 `08_stock_detail.md`에는 API 명세가 없음.

- [X] **옵션 A (Frontend State)**: 포트폴리오 상세에서 가져온 데이터를 그대로 넘겨서 사용 (API 호출 절약)
- [ ] **옵션 B (New API)**: `GET /api/portfolios/{id}/items/{itemId}` 신설 (새로고침 시 유리)
