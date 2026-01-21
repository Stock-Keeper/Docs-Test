# Stock 도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 stock.md`

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| add.md (api) | UPDATE | specs/api/stock/add.md | Dead Link + 경로 수정 |
| search.md (api) | UPDATE | specs/api/stock/search.md | Dead Link (UI 미존재) |
| price.md | - | specs/api/stock/price.md | 검증 필요 |
| update-delete.md | UPDATE | specs/api/stock/update-delete.md | Dead Link + 경로 수정 |
| add.md (ui) | - | specs/ui/stock/add.md | 검증 필요 |
| search.md (ui) | NEW | - | 누락 스펙 (사용자 결정 옵션 A) |

## AI 분석 결과

- **추론 유형**: api/ui
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 5개
- **특이 사항**: 별도 DB 없음, portfolio 도메인 테이블 참조

---

## 자동 처리 항목 [AI 수정 가능]

### 1. add.md (api) Dead Link + 경로 수정

**현재:**

```yaml
related:
  db:
    - ../../db/portfolios.md
  ui:
    - ../../ui/stock/add.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
  ui:
    - specs/ui/stock/add.md
```

**관련 스펙 섹션 (L97-99):**

```diff
## 관련 스펙
- - DB: `../db/portfolios.md`
+ - DB: `specs/db/portfolio/portfolios.md`
- - UI: `../ui/stock/add.md`
+ - UI: `specs/ui/stock/add.md`
```

### 2. update-delete.md Dead Link + 경로 수정

**현재:**

```yaml
related:
  db:
    - ../../db/portfolios.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
```

### 3. search.md (api) UI 참조

**현재:**

```yaml
related:
  ui:
    - ../../ui/stock/search.md
```

**수정 후 (옵션 A 적용 시):**

```yaml
related:
  ui:
    - specs/ui/stock/search.md
```

> [!NOTE]
> 사용자가 옵션 A를 선택했습니다.
> `ui/stock/search.md` 스펙을 새로 생성해야 합니다.

---

## 누락 스펙 (사용자 결정 반영)

### search.md (UI) - 옵션 A: 별도 생성

**생성 필요 내용:**

```markdown
---
type: ui
phase: P1
screen: 종목 검색 화면
related:
  api:
    - specs/api/stock/search.md
  ui:
    - specs/ui/stock/add.md
---

# 종목 검색 화면

## 개요
종목 검색 및 선택

## 컴포넌트
- 검색 입력창
- 검색 결과 목록
- 종목 선택 시 add 화면 연동
```

---

## 도메인 구조 참고

stock 도메인은 **별도 DB 테이블이 없으며** portfolio 도메인을 참조합니다:

- `portfolio_stock_entries` - 포트폴리오 내 종목 엔트리

종목 정보는 외부 API(한국투자증권)에서 실시간 조회합니다.

---

## 검증 통과 항목

- ✅ Phase P1 일관성
- ✅ Task에서 참조 유효 (`task-stock-rebalancing.md`)
- ✅ 파일 네이밍: kebab-case 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - Dead Link 수정 (2건): `portfolios.md` 경로
   - 경로 표기 통일 (3건)

2. 추가 작업:
   - `ui/stock/search.md` 스펙 생성 (옵션 A)
