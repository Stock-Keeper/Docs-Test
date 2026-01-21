# Community-Search 서브도메인 스펙 검증

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-community.md` (community-search 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| search-histories.md | - | specs/db/community/search-histories.md | ✅ 경로 올바름 |
| search.md (api) | - | specs/api/community/search.md | ✅ 경로 올바름 |
| search.md (ui) | - | specs/ui/community/search.md | ✅ 경로 올바름 |

## AI 분석 결과

- **추론 유형**: db/api/ui
- **추론 Phase**: P2 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 3개
- **특이 사항**: 모든 스펙이 이미 올바른 경로 형식(`specs/`) 사용 중

---

## ✅ 검증 통과 항목

### 경로 형식

| 스펙 | related 경로 | 상태 |
|------|-------------|------|
| search-histories.md | `specs/api/community/search.md` | ✅ 올바름 |
| search-histories.md | `specs/ui/community/search.md` | ✅ 올바름 |
| search-histories.md | `specs/db/auth/users.md` | ✅ 올바름 |
| search.md (api) | `../../ui/community/search.md` | ⚠️ 상대경로 |
| search.md (ui) | `../../api/community/search.md` | ⚠️ 상대경로 |

### 상대경로 사용 스펙 (선택 수정)

`search.md` (API/UI)는 상대경로를 사용하지만 **파일이 존재하므로** 선택적 수정 대상입니다.

**현재 (api/community/search.md):**

```yaml
related:
  ui:
    - ../../ui/community/search.md
```

**수정 후 (선택):**

```yaml
related:
  ui:
    - specs/ui/community/search.md
```

> [!NOTE]
> 상대경로도 동작하지만, 프로젝트 전체 일관성을 위해 `specs/` 형식으로 통일을 권장합니다.

---

## 검증 통과 항목

- ✅ Phase 일관성: 모든 search 관련 스펙 P2
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수
- ✅ API-DB-UI 연결 완전

---

## 다음 단계

1. `/prd-process` 실행 시:
   - **선택**: API/UI search.md의 상대경로 → `specs/` 절대경로 통일

2. **필수 수정 없음**: 모든 참조가 유효함

---

## 결론

> **이 서브도메인은 필수 수정 사항이 없습니다.**
>
> 일부 상대경로가 있으나 파일이 존재하여 동작에 문제없음.
> 경로 일관성을 위해 선택적으로 수정 가능.
