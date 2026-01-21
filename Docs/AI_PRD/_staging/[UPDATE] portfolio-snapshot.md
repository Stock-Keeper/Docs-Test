# Portfolio-Snapshot 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 portfolio.md` (portfolio-snapshot 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| portfolio-snapshots.md | UPDATE | specs/db/portfolio/portfolio-snapshots.md | 경로 수정 |
| snapshots-list.md | UPDATE | specs/api/portfolio/snapshots-list.md | Dead Link 수정 |
| snapshots-detail.md | UPDATE | specs/api/portfolio/snapshots-detail.md | Dead Link 수정 |
| snapshots-create.md | UPDATE | specs/api/portfolio/snapshots-create.md | Dead Link 수정 |
| snapshots-compare.md | UPDATE | specs/api/portfolio/snapshots-compare.md | Dead Link 수정 |

## AI 분석 결과

- **추론 유형**: db/api
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 5개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. portfolio-snapshots.md 경로 수정

**현재:**

```yaml
related:
  db:
    - portfolio/portfolios.md
  api:
    - portfolio/snapshots-list.md
    - portfolio/snapshots-detail.md
    - portfolio/snapshots-create.md
    - portfolio/snapshots-compare.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolios.md
  api:
    - specs/api/portfolio/snapshots-list.md
    - specs/api/portfolio/snapshots-detail.md
    - specs/api/portfolio/snapshots-create.md
    - specs/api/portfolio/snapshots-compare.md
```

### 2. 스냅샷 API Dead Link 수정 (4건 공통)

**파일**: `snapshots-list.md`, `snapshots-detail.md`, `snapshots-create.md`, `snapshots-compare.md`

**현재:**

```yaml
related:
  db:
    - portfolio-snapshots.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/portfolio/portfolio-snapshots.md
```

> [!NOTE]
> 모든 스냅샷 API가 상대경로 없이 `portfolio-snapshots.md`만 참조하여
> API 폴더(`specs/api/portfolio/`)에서 찾으려 해서 Dead Link 발생.
> 올바른 경로: `specs/db/portfolio/portfolio-snapshots.md`

---

## 검증 통과 항목

- ✅ Phase P1 일관성
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수
- ✅ API 구조: RESTful 패턴 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - Dead Link 수정 (4건): API → DB 참조
   - 경로 표기 통일 (1건): DB 스펙 내부

2. 다른 서브도메인:
   - `/prd-prepare portfolio-ui`
