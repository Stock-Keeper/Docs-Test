# Rebalancing 도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 rebalancing.md`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| calculate.md | UPDATE | specs/api/rebalancing/calculate.md | Dead Link + 경로 수정 |
| check.md | UPDATE | specs/ui/rebalancing/check.md | 경로 수정 |

## AI 분석 결과

- **추론 유형**: api/ui
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 2개
- **특이 사항**: 별도 DB 없음, portfolio 도메인 테이블 참조

---

## 자동 처리 항목 [AI 수정 가능]

### 1. calculate.md Dead Link + 경로 수정

**현재:**

```yaml
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/rebalancing/check.md
  api:
    - ../notification/list.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
  ui:
    - specs/ui/rebalancing/check.md
  api:
    - specs/api/notification/list.md
```

> [!NOTE]
>
> - `../../db/portfolios.md` → `specs/db/portfolio/portfolios.md` (Dead Link 수정)
> - `portfolio/` 디렉토리 경로가 누락되어 있었음

**관련 스펙 섹션 (L114-117):**

```diff
## 관련 스펙
- - DB: `../db/portfolios.md`
+ - DB: `specs/db/portfolio/portfolios.md`
- - UI: `../ui/rebalancing/check.md`
+ - UI: `specs/ui/rebalancing/check.md`
- - API: `../notification/list.md`
+ - API: `specs/api/notification/list.md`
```

### 2. check.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/rebalancing/calculate.md
  ui:
    - ../portfolio/detail.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/rebalancing/calculate.md
  ui:
    - specs/ui/portfolio/detail.md
```

**관련 스펙 섹션 (L111-113):**

```diff
## 관련 스펙
- - API: `../api/rebalancing/calculate.md`
+ - API: `specs/api/rebalancing/calculate.md`
- - UI: `../portfolio/detail.md`
+ - UI: `specs/ui/portfolio/detail.md`
```

---

## 도메인 구조 참고

rebalancing 도메인은 **별도 DB 테이블이 없으며** portfolio 도메인을 참조합니다:

- `portfolios` - 포트폴리오 기본 정보
- `portfolio_stock_entries` - 종목별 목표 비율

---

## 검증 통과 항목

- ✅ Phase P1 일관성
- ✅ API ↔ UI 양방향 참조 정상
- ✅ Task에서 참조 유효 (`task-stock-rebalancing.md`)
- ✅ 파일 네이밍: kebab-case 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - Dead Link 수정 (1건): `portfolios.md` 경로
   - 경로 표기 통일 (2건)
