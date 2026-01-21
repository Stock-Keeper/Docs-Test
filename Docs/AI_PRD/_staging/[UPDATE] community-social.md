# Community-Social 서브도메인 스펙 업데이트

## 원본 출처
>
> 원본 파일: `[VALIDATE] 2026-01-21-community.md` (community-social 부분 추출)

## 항목별 작업 요약

| 항목 | 작업 | 기존 스펙 | 비고 |
|------|------|----------|------|
| follows.md | UPDATE | specs/db/community/follows.md | 경로 수정 |
| user-blocks.md | UPDATE | specs/db/community/user-blocks.md | API 누락 (block.md) |
| profiles.md | - | specs/db/community/profiles.md | API 누락, 고아 스펙 |
| settings.md | - | specs/db/community/settings.md | API 누락, 고아 스펙 |
| nickname-histories.md | - | specs/db/community/nickname-histories.md | 고아 스펙 |
| follow.md | UPDATE | specs/api/community/follow.md | Phase 변경 + 경로 수정 |

## AI 분석 결과

- **추론 유형**: db/api (혼합)
- **추론 Phase**: P2 (DB 기준 통일 권장)
- **비교한 기존 스펙 파일**: 6개

---

## 🔴 사용자 결정 완료 항목

### Phase 불일치 처리

> 원본에서 **Option B** 선택됨: `follow.md`를 P2로 변경 (DB와 일치)

| 스펙 | 현재 Phase | 변경 후 |
|------|-----------|--------|
| follows.md (DB) | P2 | P2 (유지) |
| follow.md (API) | P3 | **P2로 변경** |

---

## 자동 처리 항목 [AI 수정 가능]

### 1. follows.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/community/follow.md
```

**수정 후:**

```yaml
related:
  api:
    - specs/api/community/follow.md
```

### 2. follow.md 경로 + Phase 수정

**현재:**

```yaml
type: api
phase: P3
related:
  db:
    - ../../db/follows.md
  api:
    - profile.md
```

**수정 후:**

```yaml
type: api
phase: P2
related:
  db:
    - specs/db/community/follows.md
  api: []
```

> [!NOTE]
> `profile.md` API는 존재하지 않으므로 제거

### 3. user-blocks.md 경로 수정

**현재:**

```yaml
related:
  api:
    - ../../api/community/block.md
```

**수정 후:**

```yaml
related:
  api: []
```

> [!WARNING]
> `block.md` API가 존재하지 않음 - 하단 누락 API 참조

---

## 누락 API 확인 (3건)

| DB 스펙 | 테이블 | 필요한 API | 상태 |
|---------|-------|---------|------|
| user-blocks.md | user_blocks | `block.md` | ❌ 없음 |
| profiles.md | community_profiles | 프로필 API | ⚠️ `related.api: []` |
| settings.md | community_settings | 설정 API | ⚠️ `related.api: []` |

> [!NOTE]
> 다음 API 스펙 생성이 필요합니다:
>
> **block.md** (사용자 차단):
>
> - `POST /api/community/blocks` - 차단 등록
> - `DELETE /api/community/blocks/{id}` - 차단 해제
> - `GET /api/community/blocks` - 내 차단 목록
>
> **profile.md** (프로필 조회/수정):
>
> - `GET /api/community/profiles/{userId}` - 프로필 조회
> - `PATCH /api/community/profiles/me` - 내 프로필 수정
>
> **settings.md** (커뮤니티 설정):
>
> - `GET /api/community/settings` - 설정 조회
> - `PATCH /api/community/settings` - 설정 수정

---

## 고아 스펙 (Task 미참조)

| 스펙 파일 | Phase | 권장 |
|----------|-------|------|
| profiles.md | P2 | Task 추가 필요 |
| settings.md | P2 | Task 추가 필요 |
| nickname-histories.md | P2 | Task 추가 필요 |
| user-blocks.md | P2 | Task 추가 필요 |

---

## 검증 통과 항목

- ✅ 테이블 네이밍: snake_case 준수
- ✅ 파일 네이밍: kebab-case 준수
- ✅ 1:1 관계 정의: profiles, settings 명확

---

## 다음 단계

1. `/prd-process` 실행 시:
   - 경로 표기 통일 (상대경로 → specs/ 절대경로)
   - `follow.md` Phase P3 → P2 변경
   - Dead Link 제거 (존재하지 않는 API 참조)

2. 추가 작업 (선택):
   - 누락 API 스펙 생성 (block.md, profile.md, settings.md)
   - 고아 스펙 Task 할당
