# Community-Ranking 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-community.md` (community-ranking 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| rankings.md | UPDATE | specs/db/community/rankings.md | 경로 수정 |
| badges.md | UPDATE | specs/db/community/badges.md | Dead Link 제거 (API/UI 없음) |
| ranking.md | UPDATE | specs/api/community/ranking.md | Dead Link 수정 |

## AI 분석 결과

- **추론 유형**: db/api
- **추론 Phase**: P3 (모든 스펙 일관)
- **비교한 기존 스펙 파일**: 3개

---

## 자동 처리 항목 [AI 수정 가능]

### 1. rankings.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/community/ranking.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/ranking.md
```

### 2. badges.md Dead Link 제거

**현재:**

```yaml
related:
  api:
    - ../../api/community/badges.md
  ui:
    - ../../ui/community/badges.md
```

**수정 후:**

```yaml
related:
  api: []
  ui: []
```

> [!WARNING]
> `badges.md` API 및 UI 스펙이 **존재하지 않습니다**.
> 하단 누락 API/UI 섹션 참조.

### 3. ranking.md Dead Link 수정

**현재:**

```yaml
related:
  db:
    - ../../db/rankings-badges.md
  api:
    - badges.md
```

**수정 후:**

```yaml
related:
  db:
    - specs/db/community/rankings.md
    - specs/db/community/badges.md
  api: []
```

> [!NOTE]
>
> - `rankings-badges.md`는 `rankings.md` + `badges.md`로 분리됨
> - `badges.md` API는 존재하지 않으므로 제거

### 4. 관련 스펙 섹션 수정 (ranking.md)

**현재 (L126-128):**

```markdown
## 관련 스펙
- DB: `../db/rankings.md`
- API: `badges.md`
```

**수정 후:**

```markdown
## 관련 스펙
- DB: `specs/db/community/rankings.md`
- DB: `specs/db/community/badges.md`
```

---

## 누락 API/UI (2건)

| DB 스펙 | 테이블 | 필요한 스펙 | 상태 |
|---------|-------|------------|------|
| badges.md | badges, user_badges | `api/community/badges.md` | ❌ 없음 |
| badges.md | badges, user_badges | `ui/community/badges.md` | ❌ 없음 |

> [!NOTE]
> 다음 스펙 생성이 필요합니다:
>
> **badges.md (API)**:
>
> - `GET /api/community/badges` - 전체 뱃지 목록
> - `GET /api/community/users/{userId}/badges` - 사용자 획득 뱃지
>
> **badges.md (UI)**:
>
> - 뱃지 목록 화면
> - 프로필 내 뱃지 표시 섹션

---

## 검증 통과 항목

- ✅ Phase 일관성: 모든 ranking 관련 스펙 P3
- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (상대경로 → specs/ 절대경로)
   - Dead Link 제거/수정
   - `rankings-badges.md` → 분리된 파일 참조로 변경

2. 추가 작업 (선택):
   - 누락 API 스펙 생성 (badges.md)
   - 누락 UI 스펙 생성 (badges.md)
