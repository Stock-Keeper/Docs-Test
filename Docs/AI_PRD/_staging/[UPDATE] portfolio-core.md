# Portfolio-Core 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 portfolio.md` (portfolio-core 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| portfolios.md | UPDATE | specs/db/portfolio/portfolios.md | 경로 수정 |
| portfolio-stock-entries.md | UPDATE | specs/db/portfolio/portfolio-stock-entries.md | 경로 수정 |
| portfolio-cash-entries.md | UPDATE | specs/db/portfolio/portfolio-cash-entries.md | 경로 수정 |
| detail.md | UPDATE | specs/api/portfolio/detail.md | Dead Link 수정 |
| create.md | UPDATE | specs/api/portfolio/create.md | Dead Link 제거 |
| list.md | - | specs/api/portfolio/list.md | 검증 필요 |
| update.md | - | specs/api/portfolio/update.md | 검증 필요 |
| delete.md | - | specs/api/portfolio/delete.md | 검증 필요 |
| reorder.md | - | specs/api/portfolio/reorder.md | 검증 필요 |

## AI 분석 결과

- **추론 유형**: db/api
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 9개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. portfolios.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../api/portfolio/list.md
    - ../api/portfolio/detail.md
    - ../api/portfolio/create.md
  db:
    - ./portfolio-stock-entries.md
    - ./portfolio-cash-entries.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/portfolio/list.md
    - specs/api/portfolio/detail.md
    - specs/api/portfolio/create.md
  db:
    - specs/db/portfolio/portfolio-stock-entries.md
    - specs/db/portfolio/portfolio-cash-entries.md
```

### 2. portfolio-stock-entries.md 경로 수정

**현재:**

```yaml
related:
  db:
    - portfolio/portfolios.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
```

### 3. portfolio-cash-entries.md 경로 수정

**현재:**

```yaml
related:
  db:
    - portfolio/portfolios.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
```

### 4. detail.md Dead Link 수정

**현재:**

```yaml
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/portfolio/detail.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
    - specs/db/portfolio/portfolio-stock-entries.md
    - specs/db/portfolio/portfolio-cash-entries.md
  ui:
    - specs/ui/portfolio/detail.md
```

**관련 스펙 섹션 (L94-97):**

```diff
## 관련 스펙
- DB: `../db/portfolios.md`
- - DB: `../db/portfolio-items.md`
+ - DB: `../db/portfolio-stock-entries.md`
+ - DB: `../db/portfolio-cash-entries.md`
- UI: `../ui/portfolio/detail.md`
```

> [!NOTE]
> `portfolio-items.md`는 존재하지 않습니다.
> 실제로는 `portfolio-stock-entries.md`와 `portfolio-cash-entries.md`로 분리되었습니다.

### 5. create.md Dead Link 제거

**현재:**

```yaml
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/portfolio/create.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
```

> [!WARNING]
> `ui/portfolio/create.md` 파일이 **존재하지 않습니다**.
> UI 참조를 제거하거나 새 UI 스펙을 생성해야 합니다.

---

## Missing Backlink 참고

| 파일 | 상태 |
|------|------|
| portfolio-stock-entries.md | `related.api: []` - **정상** (내부 테이블) |
| portfolio-cash-entries.md | `related.api: []` - **정상** (내부 테이블) |

> stock-entries와 cash-entries는 portfolios의 하위 테이블로,
> 별도 API 없이 portfolios API에서 함께 처리됩니다 (의도적).

---

## 검증 통과 항목

- ✅ Phase P1 일관성
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (5건)
   - Dead Link 수정: `portfolio-items.md` → 분리된 파일로 변경
   - Dead Link 제거: `ui/portfolio/create.md` 참조

2. 선택 사항:
   - `ui/portfolio/create.md` 스펙 생성 (/prd-prepare portfolio-ui에서 처리)
