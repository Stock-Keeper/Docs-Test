# PRD 검증 결과 - stock 도메인

> 검증 일시: 2026-01-21 00:35
> 발견된 문제: **3건** (사용자 결정 필요: 1건, AI 자동 수정 가능: 2건)

---

## 📋 요약

| 항목 | 수량 |
|------|------|
| DB 스펙 파일 | 0개 (portfolio 도메인 참조) |
| API 스펙 파일 | 4개 |
| UI 스펙 파일 | 1개 |
| Task 파일 | 1개 (`task-stock-rebalancing.md`) |
| **총 스펙 파일** | **5개** |
| **문제 발견** | **3건** |

---

## ❌ Dead Link (3건)

| 파일 | 참조 경로 | 문제 | 권장 조치 |
|------|----------|------|----------|
| [add.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/add.md) | `../../db/portfolios.md` | 경로 오류 | `../../db/portfolio/portfolios.md`로 수정 |
| [update-delete.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/update-delete.md) | `../../db/portfolios.md` | 경로 오류 | `../../db/portfolio/portfolios.md`로 수정 |
| [search.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/search.md) | `../../ui/stock/search.md` | 파일 미존재 | UI 스펙 생성 필요 (사용자 결정) |

---

## 🔴 사용자 결정 필요 (1건)

### 1. UI 스펙 누락: 종목 검색 화면

`api/stock/search.md`에서 참조하는 `ui/stock/search.md` 파일이 존재하지 않습니다.

**현재 상황**:
- 종목 추가 화면(`ui/stock/add.md`)에 검색 기능이 통합되어 있음
- 별도의 검색 전용 UI 스펙이 필요한지 결정 필요

**옵션**:
- [ ] **옵션 A**: `ui/stock/search.md` 새로 생성 (별도 검색 화면)
- [ ] **옵션 B**: `search.md`의 UI 참조를 `add.md`로 변경 (통합 화면)
- [ ] **옵션 C**: `search.md`의 UI 참조 삭제 (내부 API)

---

## ✅ 정상 항목

### 프론트매터 필수 필드
✅ 모든 스펙 파일에 필수 필드 존재

| 파일 | type | phase | endpoint/screen | method | related |
|------|------|-------|-----------------|--------|---------|
| add.md | api | P1 | /api/portfolios/{id}/items | POST | ✅ |
| search.md | api | P1 | /api/stocks/search | GET | ⚠️ UI 미존재 |
| price.md | api | P1 | /api/stocks/price | GET | ✅ |
| update-delete.md | api | P1 | /api/portfolios/{id}/items/{id} | PUT/DELETE | ✅ |
| ui/add.md | ui | P1 | 종목 추가 화면 | - | ✅ |

### Phase 일관성
✅ 모든 스펙이 **P1**으로 일관됨

### Task 검증
✅ `task-stock-rebalancing.md`에서 stock 스펙 참조 유효

---

## ✅ AI가 자동 처리할 항목 (참고용)

### 1. DB 경로 수정 (2건)

**파일**: `specs/api/stock/add.md`

```diff
related:
  db:
-   - ../../db/portfolios.md
+   - ../../db/portfolio/portfolios.md
```

**파일**: `specs/api/stock/update-delete.md`

```diff
related:
  db:
-   - ../../db/portfolios.md
+   - ../../db/portfolio/portfolios.md
```

---

## 📂 스펙 파일 목록

### API (4개)

| 파일 | 엔드포인트 | 메서드 | Phase | 설명 |
|------|-----------|--------|-------|------|
| [add.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/add.md) | /api/portfolios/{id}/items | POST | P1 | 포트폴리오에 종목 추가 |
| [search.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/search.md) | /api/stocks/search | GET | P1 | 종목 검색 (한투 API) |
| [price.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/price.md) | /api/stocks/price | GET | P1 | 실시간 시세 조회 |
| [update-delete.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/stock/update-delete.md) | /api/portfolios/{id}/items/{id} | PUT/DELETE | P1 | 종목 수정/삭제 |

### UI (1개)

| 파일 | 화면명 | Phase | 설명 |
|------|--------|-------|------|
| [add.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/stock/add.md) | 종목 추가 화면 | P1 | 검색 + 추가 통합 화면 |

---

## 📝 도메인 구조 참고

stock 도메인은 별도의 DB 테이블 없이 **portfolio 도메인의 테이블을 참조**합니다:
- `portfolio_stock_entries` - 포트폴리오 내 종목 엔트리

종목 정보는 외부 API(한국투자증권)에서 실시간 조회합니다.

---

## 다음 단계

1. **사용자 결정 필요**: 위의 옵션 중 하나를 선택해주세요
2. **자동 수정**: DB 경로 수정은 "자동 수정 진행해줘"로 요청

```
자동 수정 진행해줘
```
