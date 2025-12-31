# TDD 가이드

## 워크플로우

```
🔴 Red    → 실패하는 테스트 먼저
🟢 Green  → 테스트 통과하는 최소 코드
🔵 Refactor → 코드 개선
```

---

## 적용 대상

| 대상 | 필수 여부 |
|------|-----------|
| 리밸런싱 계산 | ⭐ 필수 |
| 비율/금액 계산 | ⭐ 필수 |
| API 로직 | 권장 |
| UI 컴포넌트 | 선택 |

---

## 테스트 위치

```
tests/
├── unit/           # 단위 테스트
└── integration/    # 통합 테스트
```

---

## 예시

```typescript
// 1. Red - 테스트 먼저
it('5% 초과 시 매도 제안', () => {
  const result = calculateRebalancing({
    currentRatio: 30,
    targetRatio: 20,
    threshold: 5
  });
  expect(result.action).toBe('sell');
});

// 2. Green - 최소 구현
function calculateRebalancing({ currentRatio, targetRatio, threshold }) {
  const diff = currentRatio - targetRatio;
  if (Math.abs(diff) > threshold) {
    return { action: diff > 0 ? 'sell' : 'buy' };
  }
  return { action: 'hold' };
}
```

---

## 규칙

- 테스트 없이 비즈니스 로직 커밋 금지
- 외부 API는 Mock 사용
