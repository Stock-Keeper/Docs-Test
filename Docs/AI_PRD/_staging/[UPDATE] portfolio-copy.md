# Portfolio-Copy 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 portfolio.md` (portfolio-copy 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| portfolio-copies.md | UPDATE | specs/db/portfolio/portfolio-copies.md | 경로 수정 |

## AI 분석 결과

- **추론 유형**: db
- **추론 Phase**: P3
- **비교한 기존 스펙 파일**: 1개
- **크로스 도메인 참조**: community 도메인 API

---

## 자동 처리 항목 [AI 수정 가능]

### 1. portfolio-copies.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../api/community/portfolio-copy.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/portfolio-copy.md
```

### 2. 관련 스펙 섹션 수정 (L56-57)

**현재:**

```markdown
## 관련 스펙
- API: `../api/community/portfolio-copy.md`
```

**수정 후:**

```markdown
## 관련 스펙
- API: `specs/api/community/portfolio-copy.md`
```

---

## 크로스 도메인 참조 확인

| 참조 | 도메인 | 파일 존재 |
|------|--------|----------|
| portfolio-copy.md | community | ✅ 존재 (`specs/api/community/portfolio-copy.md`) |

---

## 참고: portfolios 테이블 ALTER

이 스펙에는 `portfolios` 테이블의 ALTER 문이 포함되어 있습니다:

```sql
ALTER TABLE portfolios ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE portfolios ADD COLUMN like_count INT DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN copy_count INT DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN copied_from_id VARCHAR(36) NULL;
ALTER TABLE portfolios ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE;
```

> [!NOTE]
> P3 기능 구현 시 `portfolios` 테이블에 위 컬럼이 추가되어야 합니다.
> 이 ALTER 문은 `portfolio-copies.md`에 함께 문서화되어 있습니다.

---

## 검증 통과 항목

- ✅ Phase P3 (고급 기능)
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수
- ✅ 크로스 도메인 참조 유효

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (1건)

2. 다른 서브도메인:
   - `/prd-prepare portfolio-ui`
