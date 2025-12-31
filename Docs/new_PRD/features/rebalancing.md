# 리밸런싱 알고리즘

## 요약 ⚡

- 사용자가 설정한 목표 비율과 현재 보유 비율을 비교하여 매수/매도 제안
- 임계값 기반 알림: 목표 비율 대비 ±5% 초과 시 자동 감지
- 실시간 시세 기반 정확한 평가금액 및 비율 계산
- 최소 리밸런싱 금액 설정으로 소액 거래 제외 가능
- [P2-고려] 소수점 거래 지원을 위해 계산 로직에 DECIMAL 타입 사용

---

## Phase 1 (현재)

### 기능 목록

- [P1] 목표 비율 설정 (종목별 0~100%)
- [P1] 현재 비율 자동 계산 (실시간 시세 기반)
- [P1] 리밸런싱 제안 계산 (매수/매도 수량 및 금액)
- [P1] 임계값 기반 알림 (기본 ±5%)
- [P1] 리밸런싱 필요 종목 시각화 (비율 차이 표시)

### 목표 비율 설정

| 항목 | 규칙 |
|------|------|
| 입력 방식 | 종목별 퍼센트(%) 입력 또는 슬라이더 |
| 범위 | 0~100% (소수점 첫째 자리) |
| 합계 검증 | 전체 종목 목표 비율 합계 = 100% |
| 미설정 시 | 균등 분배 (예: 5종목 = 각 20%) |
| 자동 조정 | 마지막 종목은 자동으로 100% 맞춤 |
| 저장 | 수정 즉시 DB 동기화 |

**합계 검증 로직**

```javascript
// 목표 비율 합계 계산
const totalTargetRatio = stocks.reduce((sum, stock) => {
  return sum + (stock.targetRatio || 0);
}, 0);

// 검증
if (Math.abs(totalTargetRatio - 100) > 0.1) {
  throw new Error('목표 비율 합계는 100%여야 합니다.');
}
```

### 현재 비율 계산

| 항목 | 규칙 |
|------|------|
| 계산 시점 | 실시간 시세 업데이트 시마다 자동 재계산 |
| 평가금액 | 보유 수량 × 현재가 |
| 전체 평가 | 모든 종목의 평가금액 합계 |
| 현재 비율 | (종목 평가금액 / 전체 평가) × 100 |
| 소수점 처리 | 소수점 둘째 자리까지 표시 (12.34%) |

**계산 예시**

```javascript
// 예시 데이터
const portfolio = [
  { name: '삼성전자', quantity: 10, currentPrice: 70000 },
  { name: '카카오', quantity: 5, currentPrice: 50000 }
];

// 1. 종목별 평가금액
const values = portfolio.map(stock => ({
  ...stock,
  value: stock.quantity * stock.currentPrice
}));
// 삼성전자: 700,000원
// 카카오: 250,000원

// 2. 전체 평가금액
const totalValue = values.reduce((sum, s) => sum + s.value, 0);
// 950,000원

// 3. 현재 비율
const currentRatios = values.map(stock => ({
  ...stock,
  currentRatio: (stock.value / totalValue * 100).toFixed(2)
}));
// 삼성전자: 73.68%
// 카카오: 26.32%
```

### 리밸런싱 제안 계산

| 항목 | 규칙 |
|------|------|
| 제안 조건 | 목표 비율 대비 임계값 초과 시 |
| 기본 임계값 | ±5% (목표 30% → 25~35% 범위) |
| 사용자 설정 | ±3%, ±5%, ±10% 중 선택 |
| 우선순위 | 비율 차이가 큰 순서대로 정렬 |
| 표시 정보 | 종목명, 현재/목표 비율, 매수/매도 수량, 예상 금액 |

**리밸런싱 알고리즘**

```javascript
function calculateRebalancing(portfolio, threshold = 5) {
  const totalValue = portfolio.reduce((sum, s) => 
    sum + (s.quantity * s.currentPrice), 0
  );
  
  const suggestions = portfolio.map(stock => {
    // 1. 현재 비율
    const currentValue = stock.quantity * stock.currentPrice;
    const currentRatio = (currentValue / totalValue) * 100;
    
    // 2. 목표 비율과 차이
    const diff = currentRatio - stock.targetRatio;
    
    // 3. 임계값 초과 여부
    if (Math.abs(diff) <= threshold) {
      return null; // 리밸런싱 불필요
    }
    
    // 4. 목표 금액 계산
    const targetValue = (totalValue * stock.targetRatio) / 100;
    const diffValue = targetValue - currentValue;
    
    // 5. 매수/매도 수량
    const quantity = Math.round(diffValue / stock.currentPrice);
    
    return {
      stockName: stock.name,
      stockCode: stock.code,
      currentRatio: currentRatio.toFixed(2),
      targetRatio: stock.targetRatio.toFixed(2),
      diff: diff.toFixed(2),
      action: diffValue > 0 ? 'BUY' : 'SELL',
      quantity: Math.abs(quantity),
      estimatedAmount: Math.abs(quantity * stock.currentPrice)
    };
  }).filter(s => s !== null);
  
  // 비율 차이 큰 순서로 정렬
  return suggestions.sort((a, b) => 
    Math.abs(b.diff) - Math.abs(a.diff)
  );
}
```

**계산 예시**

```javascript
// 포트폴리오 데이터
const portfolio = [
  { name: '삼성전자', code: '005930', quantity: 10, 
    currentPrice: 70000, targetRatio: 50 },
  { name: '카카오', code: '035720', quantity: 5, 
    currentPrice: 50000, targetRatio: 30 },
  { name: 'NAVER', code: '035420', quantity: 2, 
    currentPrice: 200000, targetRatio: 20 }
];

// 리밸런싱 제안 계산 (임계값 5%)
const suggestions = calculateRebalancing(portfolio, 5);

// 결과
[
  {
    stockName: '삼성전자',
    currentRatio: '46.67',  // 700,000 / 1,500,000
    targetRatio: '50.00',
    diff: '-3.33',          // 임계값 내 - 제외
    action: null
  },
  {
    stockName: '카카오',
    currentRatio: '16.67',  // 250,000 / 1,500,000
    targetRatio: '30.00',
    diff: '-13.33',         // 임계값 초과!
    action: 'BUY',
    quantity: 4,            // (450,000 - 250,000) / 50,000
    estimatedAmount: 200000
  },
  {
    stockName: 'NAVER',
    currentRatio: '26.67',  // 400,000 / 1,500,000
    targetRatio: '20.00',
    diff: '+6.67',          // 임계값 초과!
    action: 'SELL',
    quantity: 1,            // (300,000 - 400,000) / 200,000
    estimatedAmount: 200000
  }
]
```

### 임계값 설정

| 항목 | 규칙 |
|------|------|
| 기본값 | ±5% |
| 선택 옵션 | ±3%, ±5%, ±10% |
| 적용 범위 | 포트폴리오별 개별 설정 |
| 알림 트리거 | 임계값 초과 시 자동 감지 |
| 기본 동작 | 임계값 내 종목은 제안에서 제외 |

### 최소 리밸런싱 금액

| 항목 | 규칙 |
|------|------|
| Phase 1 | 설정 기능 없음 (모든 제안 표시) |
| Phase 2 | 기본 10,000원 (사용자 조정 가능) |
| 동작 | 예상 금액 < 최소 금액 시 제안에서 제외 |
| 목적 | 소액 거래 수수료 부담 방지 |

---

## Phase 2+ (확장 고려사항)

### Phase 2 기능

- [P2] **소수점 거래 지원**
  - 소수점 4자리 보유 수량 (0.0001주 단위)
  - 리밸런싱 제안도 소수점 수량 포함
  - DECIMAL(18,4) 타입으로 정확한 계산

- [P2] **최소 리밸런싱 금액 설정**
  - 기본 10,000원, 사용자 조정 가능
  - 설정 미만 금액은 제안에서 자동 제외
  - "소액 거래 제외" 필터 ON/OFF 기능

- [P2] **조정 금액 입력**
  - 현재 평가 외에 추가 투자 금액 입력
  - 예: 현재 100만원 + 추가 50만원 = 150만원 기준 리밸런싱
  - 목표 비율을 맞추기 위한 종목별 투자 금액 제안

### Phase 3 기능

- [P3] **자동 리밸런싱**
  - 증권사 API 연동으로 자동 매매 실행
  - 사용자 승인 후 자동 주문
  - 리밸런싱 이력 기록 및 성과 분석

- [P3] **고급 리밸런싵 전략**
  - 절세 고려 (손실 종목 먼저 매도)
  - 수수료 최소화 (거래 횟수 최소화)
  - 단계별 리밸런싱 (1주에 걸쳐 점진적 조정)

- [P3] **백테스팅**
  - 과거 데이터로 리밸런싱 효과 시뮬레이션
  - 전략별 성과 비교
  - 최적 임계값 추천

---

## 성능 목표

| 지표 | 목표 |
|------|------|
| 비율 계산 | < 100ms |
| 리밸런싱 제안 계산 | < 200ms |
| 실시간 업데이트 | 30초 내 반영 |
| 동시 업데이트 처리 | 포트폴리오 10개 + 종목 50개까지 |

---

## 에러 처리

| 에러 케이스 | 처리 방법 |
|------------|----------|
| 목표 비율 합계 ≠ 100% | "목표 비율 합계는 100%여야 합니다" 에러 |
| 목표 비율 미설정 | 균등 분배 자동 적용 |
| 시세 조회 실패 | 마지막 캐시 데이터 사용 + "업데이트 실패" 표시 |
| 평가금액 0원 | 리밸런싱 불가능 안내 |
| 계산 오버플로우 | "계산에 오류가 발생했습니다" + Sentry 로그 |

---

## 관련 문서

- **포트폴리오**: `features/portfolio.md` - 리밸런싱이 적용되는 포트폴리오 구조
- **종목 관리**: `features/stock.md` - 종목 시세 조회 및 목표 비율 설정
- **알림**: `features/notification.md` - 리밸런싱 필요 시 알림 발송
- **DB 스키마**: `reference/db-schema.md#stocks` - target_ratio 컬럼
- **API 명세**: `reference/api-spec.md#rebalancing-api` - 리밸런싱 엔드포인트

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: Backend + Algorithm
