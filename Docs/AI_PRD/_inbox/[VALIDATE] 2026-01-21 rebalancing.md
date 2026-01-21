# PRD 검증 결과 - rebalancing 도메인

> 검증 일시: 2026-01-21 00:33
> 발견된 문제: **1건** (사용자 결정 필요: 0건, AI 자동 수정 가능: 1건)

---

## 📋 요약

| 항목 | 수량 |
|------|------|
| DB 스펙 파일 | 0개 (별도 DB 없음, portfolio 도메인 참조) |
| API 스펙 파일 | 1개 |
| UI 스펙 파일 | 1개 |
| Task 파일 | 1개 (`task-stock-rebalancing.md`에 포함) |
| **총 스펙 파일** | **2개** |
| **문제 발견** | **1건** |

---

## ❌ Dead Link (1건)

| 파일 | 참조 경로 | 문제 | 권장 조치 |
|------|----------|------|----------|
| [calculate.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/rebalancing/calculate.md) | `../../db/portfolios.md` | 경로 오류 | `../../db/portfolio/portfolios.md`로 수정 |

> **원인 분석**: API 스펙에서 DB 참조 시 `portfolio/` 하위 디렉토리 경로가 누락됨

---

## ✅ 정상 항목

### 프론트매터 필수 필드
✅ 모든 스펙 파일에 필수 필드 존재

| 파일 | type | phase | endpoint/screen | method | related |
|------|------|-------|-----------------|--------|---------|
| calculate.md | api | P1 | /api/portfolios/{id}/rebalancing | GET | ✅ |
| check.md | ui | P1 | 리밸런싱 확인 화면 | - | ✅ |

### 양방향 참조
✅ API ↔ UI 양방향 참조 정상

| 방향 | 참조 |
|------|------|
| API → UI | `../../ui/rebalancing/check.md` ✅ |
| UI → API | `../../api/rebalancing/calculate.md` ✅ |

### Phase 일관성
✅ 모든 스펙이 **P1**으로 일관됨

### Task 검증
✅ `task-stock-rebalancing.md`에서 rebalancing 스펙 참조 유효 (domain: stock과 통합)

> **참고**: rebalancing 기능은 stock 도메인의 Task에 포함되어 있음

---

## ✅ AI가 자동 처리할 항목 (참고용)

### 1. Dead Link 수정

**파일**: `specs/api/rebalancing/calculate.md`

```diff
related:
  db:
-   - ../../db/portfolios.md
+   - ../../db/portfolio/portfolios.md
```

**본문 수정**:
```diff
## 관련 스펙
-- DB: `../db/portfolios.md`
+- DB: `../../db/portfolio/portfolios.md`
```

---

## 📂 스펙 파일 목록

### API (1개)

| 파일 | 엔드포인트 | 메서드 | Phase | 설명 |
|------|-----------|--------|-------|------|
| [calculate.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/rebalancing/calculate.md) | /api/portfolios/{id}/rebalancing | GET | P1 | 리밸런싱 제안 계산 |

### UI (1개)

| 파일 | 화면명 | Phase | 설명 |
|------|--------|-------|------|
| [check.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/rebalancing/check.md) | 리밸런싱 확인 화면 | P1 | 매수/매도 제안 표시 |

---

## 📝 도메인 구조 참고

rebalancing 도메인은 별도의 DB 테이블이 없으며, **portfolio 도메인의 테이블을 참조**합니다:
- `portfolios` - 포트폴리오 기본 정보
- `portfolio_stock_entries` - 종목별 목표 비율

리밸런싱 계산은 다음 데이터를 활용합니다:
1. 포트폴리오 내 종목 목록 및 목표 비율
2. 외부 API를 통한 실시간 현재가
3. 임계값 설정 (3%, 5%, 10%)

---

## 다음 단계

자동 수정을 원하시면 다음과 같이 요청하세요:

```
자동 수정 진행해줘
```
