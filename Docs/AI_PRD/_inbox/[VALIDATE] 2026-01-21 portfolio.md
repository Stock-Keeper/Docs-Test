# PRD 검증 결과 - portfolio 도메인

> 검증 일시: 2026-01-21 00:30
> 발견된 문제: **8건** (사용자 결정 필요: 0건, AI 자동 수정 가능: 8건)

---

## 📋 요약

| 항목 | 수량 |
|------|------|
| DB 스펙 파일 | 5개 (P1: 4개, P3: 1개) |
| API 스펙 파일 | 10개 |
| UI 스펙 파일 | 2개 |
| Task 파일 | 1개 |
| **총 스펙 파일** | **17개** |
| **문제 발견** | **8건** |

---

## ❌ Dead Link (4건)

| 파일 | 참조 경로 | 문제 | 권장 조치 |
|------|----------|------|----------|
| [detail.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/detail.md) | `../db/portfolio-items.md` | 파일 미존재 | 삭제 (portfolio-stock-entries 사용) |
| [create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/create.md) | `../../ui/portfolio/create.md` | 파일 미존재 | UI 스펙 생성 또는 참조 삭제 |
| [snapshots-list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-list.md) | `portfolio-snapshots.md` | 경로 오류 | `../../db/portfolio/portfolio-snapshots.md`로 수정 |
| [snapshots-detail.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-detail.md) | `portfolio-snapshots.md` | 경로 오류 | `../../db/portfolio/portfolio-snapshots.md`로 수정 |
| [snapshots-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-create.md) | `portfolio-snapshots.md` | 경로 오류 | `../../db/portfolio/portfolio-snapshots.md`로 수정 |
| [snapshots-compare.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-compare.md) | `portfolio-snapshots.md` | 경로 오류 | `../../db/portfolio/portfolio-snapshots.md`로 수정 |

> **원인 분석**: 
> - 스냅샷 API들이 상대 경로 없이 `portfolio-snapshots.md`만 참조하여 경로 오류 발생
> - `portfolio-items.md`는 존재하지 않으며 실제로는 `portfolio-stock-entries.md`와 `portfolio-cash-entries.md`로 분리됨

---

## 🔗 Missing Backlink (2건)

| 파일 | 필드 | 문제 | 권장 조치 |
|------|------|------|----------|
| [portfolio-stock-entries.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolio-stock-entries.md) | `related.api` | 역참조 누락 | API 없음 (정상 - 내부 테이블) |
| [portfolio-cash-entries.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolio-cash-entries.md) | `related.api` | 역참조 누락 | API 없음 (정상 - 내부 테이블) |

> **참고**: stock-entries와 cash-entries는 portfolios의 하위 테이블로 별도 API 없이 portfolios API에서 함께 처리됨 (의도적)

---

## ⚡ Phase 불일치 (0건)

✅ Phase 일관성 유지됨 (주요 스펙 P1, `portfolio-copies.md`만 P3)

---

## ✅ 정상 항목

### 프론트매터 필수 필드
✅ 모든 스펙 파일에 필수 필드 존재 (일부 API에 `category` 누락 권고)

### Task 검증
✅ `task-portfolio.md`의 대부분 스펙 참조 유효

---

## ✅ AI가 자동 처리할 항목 (참고용)

다음 항목들은 AI가 자동으로 수정할 수 있습니다:

### 1. 스냅샷 API Dead Link 수정 (4건)

**파일**: `specs/api/portfolio/snapshots-*.md` (4개 파일)

```diff
related:
  db:
-   - portfolio-snapshots.md
+   - ../../db/portfolio/portfolio-snapshots.md
```

### 2. detail.md Dead Link 수정

**파일**: `specs/api/portfolio/detail.md`

```diff
## 관련 스펙
- DB: `../db/portfolios.md`
- - DB: `../db/portfolio-items.md`
+ - DB: `../db/portfolio-stock-entries.md`
+ - DB: `../db/portfolio-cash-entries.md`
- UI: `../ui/portfolio/detail.md`
```

> **⚠️ 프론트매터 수정 필요**: 본문뿐만 아니라 프론트매터의 related 필드도 함께 수정

### 3. create.md UI 참조 수정

**파일**: `specs/api/portfolio/create.md`

**옵션 A**: UI 참조 삭제
```diff
related:
  db:
    - ../../db/portfolios.md
- ui:
-   - ../../ui/portfolio/create.md
```

**옵션 B**: 새 UI 스펙 생성 (권장)
- `specs/ui/portfolio/create.md` 파일 생성 필요

---

## 📂 스펙 파일 목록

### DB (5개)

| 파일 | 테이블명 | Phase | 비고 |
|------|----------|-------|------|
| [portfolios.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolios.md) | portfolios | P1 | 메인 테이블 |
| [portfolio-stock-entries.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolio-stock-entries.md) | portfolio_stock_entries | P1 | 종목 엔트리 |
| [portfolio-cash-entries.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolio-cash-entries.md) | portfolio_cash_entries | P1 | 현금 엔트리 |
| [portfolio-snapshots.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolio-snapshots.md) | portfolio_snapshots | P1 | 스냅샷 |
| [portfolio-copies.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/portfolio/portfolio-copies.md) | portfolio_copies | P3 | 복사 기록 |

### API (10개)

| 파일 | 엔드포인트 | 메서드 | Phase |
|------|-----------|--------|-------|
| [list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/list.md) | /api/portfolios | GET | P1 |
| [detail.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/detail.md) | /api/portfolios/{id} | GET | P1 |
| [create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/create.md) | /api/portfolios | POST | P1 |
| [update.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/update.md) | /api/portfolios/{id} | PUT | P1 |
| [delete.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/delete.md) | /api/portfolios/{id} | DELETE | P1 |
| [reorder.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/reorder.md) | /api/portfolios/reorder | PATCH | P1 |
| [snapshots-list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-list.md) | /api/portfolios/{id}/snapshots | GET | P1 |
| [snapshots-detail.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-detail.md) | /api/portfolios/{id}/snapshots/{id} | GET | P1 |
| [snapshots-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-create.md) | /api/portfolios/{id}/snapshots | POST | P1 |
| [snapshots-compare.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/portfolio/snapshots-compare.md) | /api/portfolios/{id}/snapshots/compare | GET | P1 |

### UI (2개)

| 파일 | 화면명 | Phase |
|------|--------|-------|
| [list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/portfolio/list.md) | 포트폴리오 목록 화면 | P1 |
| [detail.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/ui/portfolio/detail.md) | 포트폴리오 상세 화면 | P1 |

---

## 다음 단계

자동 수정을 원하시면 다음과 같이 요청하세요:

```
자동 수정 진행해줘
```
