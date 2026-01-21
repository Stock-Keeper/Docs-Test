# Portfolio-UI 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21 portfolio.md` (portfolio-ui 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| list.md | UPDATE | specs/ui/portfolio/list.md | 경로 수정 |
| detail.md | UPDATE | specs/ui/portfolio/detail.md | 경로 수정 |
| create.md | ⚠️ NEW | - | 누락 스펙 (권장 생성) |

## AI 분석 결과

- **추론 유형**: ui
- **추론 Phase**: P1 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 2개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. list.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/portfolio/list.md
  ui:
    - detail.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/portfolio/list.md
  ui:
    - specs/ui/portfolio/detail.md
```

**관련 스펙 섹션 (L87-90):**

```diff
## 관련 스펙
- - API: `../api/portfolio/list.md`
+ - API: `specs/api/portfolio/list.md`
- - UI: `detail.md`
+ - UI: `specs/ui/portfolio/detail.md`
- - UI: `create.md`
+ - UI: ⚠️ `specs/ui/portfolio/create.md` (생성 필요)
```

### 2. detail.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/portfolio/detail.md
  ui:
    - ../stock/add.md
    - ../rebalancing/check.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/portfolio/detail.md
  ui:
    - specs/ui/stock/add.md
    - specs/ui/rebalancing/check.md
```

**관련 스펙 섹션 (L104-107):**

```diff
## 관련 스펙
- - API: `../api/portfolio/detail.md`
+ - API: `specs/api/portfolio/detail.md`
- - UI: `../stock/add.md`
+ - UI: `specs/ui/stock/add.md`
- - UI: `../rebalancing/check.md`
+ - UI: `specs/ui/rebalancing/check.md`
```

---

## 누락 스펙

### create.md (UI) - 생성 권장

`list.md`에서 `create.md` 참조가 있지만 파일이 존재하지 않습니다.

**생성 필요 내용 (권장)**:

```markdown
---
type: ui
phase: P1
screen: 포트폴리오 생성 모달
related:
  api:
    - specs/api/portfolio/create.md
  ui:
    - specs/ui/portfolio/list.md
---

# 포트폴리오 생성 모달

## 개요
새 포트폴리오 생성 화면

## 컴포넌트
- 포트폴리오 이름 입력
- 설명 입력 (선택)
- 생성 버튼
- 취소 버튼
```

> [!WARNING]
> `api/portfolio/create.md`에서도 `ui/portfolio/create.md` 참조가 있으므로
> 일관성을 위해 생성을 권장합니다.

---

## 크로스 도메인 참조 확인

| 참조 | 도메인 | 파일 존재 |
|------|--------|----------|
| stock/add.md | stock | ⚠️ 확인 필요 |
| rebalancing/check.md | rebalancing | ⚠️ 확인 필요 |

---

## 검증 통과 항목

- ✅ Phase P1 일관성
- ✅ 파일 네이밍: kebab-case 준수
- ✅ 화면 구조: 레이아웃 + 컴포넌트 + 상호작용 문서화

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (2건)

2. 선택 사항:
   - `create.md` UI 스펙 생성 (권장)
