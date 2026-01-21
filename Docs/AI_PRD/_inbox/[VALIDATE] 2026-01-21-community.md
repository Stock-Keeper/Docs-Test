# PRD 검증 결과 - Community 도메인

> 검증 일시: 2026-01-21 00:05
> 검증 범위: community 도메인
> 발견된 문제: **28건** (사용자 결정 필요: 2건, AI 자동 수정 가능: 26건)

---

## 요약

| 항목 | 수량 |
|------|------|
| 검증 DB 스펙 | 18개 |
| 검증 API 스펙 | 9개 |
| 검증 UI 스펙 | 2개 |
| 검증 Task 파일 | 4개 |
| **총 스펙 파일** | **29개** |
| **발견된 문제** | **28건** |

---

## ❌ Dead Link (16건)

존재하지 않는 파일을 참조하고 있습니다.

### API → DB 참조 오류

| 소스 파일 | 참조 경로 | 상태 |
|----------|----------|------|
| [feed-list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/feed-list.md#L10) | `../../db/posts.md` | ❌ 없음 (→ `articles.md`) |
| [feed-list.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/feed-list.md#L11) | `../../db/portfolios.md` | ❌ 없음 (portfolio 도메인) |
| [post-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/post-create.md#L10) | `../../db/posts.md` | ❌ 없음 (→ `articles.md`) |
| [post-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/post-create.md#L12-L13) | `post-detail.md`, `post-update.md` | ❌ 없음 |
| [comment-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/comment-create.md#L10) | `../../db/comments.md` | ❌ 경로 불일치 |
| [comment-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/comment-create.md#L12-L13) | `comment-update.md`, `comment-delete.md` | ❌ 없음 |
| [reply-create.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/reply-create.md#L10) | `../../db/comments.md` | ❌ 경로 불일치 |
| [follow.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/follow.md#L10) | `../../db/follows.md` | ❌ 경로 불일치 |
| [follow.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/follow.md#L12) | `profile.md` | ❌ 없음 |
| [like.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/like.md#L10) | `../../db/likes.md` | ❌ 경로 불일치 |
| [ranking.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/ranking.md#L10) | `../../db/rankings-badges.md` | ❌ 없음 (→ `rankings.md` + `badges.md`) |
| [ranking.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/ranking.md#L12) | `badges.md` | ❌ 없음 |
| [portfolio-copy.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/api/community/portfolio-copy.md#L10-L11) | `../../db/portfolios.md`, `../../db/portfolio-copies.md` | ❌ 없음 (portfolio 도메인) |
| [user-blocks.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/user-blocks.md#L7) | `../../api/community/block.md` | ❌ 없음 |
| [badges.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/badges.md#L7) | `../../api/community/badges.md` | ❌ 없음 |
| [badges.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/badges.md#L9) | `../../ui/community/badges.md` | ❌ 없음 |

### DB → DB 참조 오류 (경로 불일치)

| 소스 파일 | 현재 경로 | 권장 경로 |
|----------|----------|----------|
| [articles.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/articles.md#L7-L8) | `../api/community/...` | `specs/api/community/...` |
| [articles.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/articles.md#L10-L13) | `community/...` | `specs/db/community/...` |
| [comments.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/comments.md#L7-L8) | `../api/community/...` | `specs/api/community/...` |
| [comments.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/comments.md#L10-L11) | `community/...` | `specs/db/community/...` |
| [likes.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/likes.md#L7) | `../api/community/...` | `specs/api/community/...` |
| [likes.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/likes.md#L9) | `community/articles.md` | `specs/db/community/articles.md` |

---

## 🔴 Phase 불일치 (3건)

### DB vs API Phase 불일치

| DB 스펙 | DB Phase | 참조 API | API Phase | 문제 |
|---------|----------|----------|-----------|------|
| [follows.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/follows.md) | P2 | follow.md | P3 | ⚠️ P2 DB를 P3 API가 사용 |
| [comments.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/comments.md) | P2 | reply-create.md | P3 | ⚠️ P2 DB를 P3 API가 사용 |
| [rankings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/rankings.md) | P3 | ranking.md | P3 | ✅ 일치 |

---

## 🟡 API 누락 (5건)

DB 스펙에 대응하는 API가 없거나 미완성입니다.

| DB 스펙 | 테이블 | 필요한 API | 비고 |
|---------|--------|-----------|------|
| [user-blocks.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/user-blocks.md) | user_blocks | `block.md` | ❌ 없음 |
| [bookmarks.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/bookmarks.md) | community_bookmarks | 북마크 API | ⚠️ `related.api: []` |
| [profiles.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/profiles.md) | community_profiles | 프로필 API | ⚠️ `related.api: []` |
| [settings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/settings.md) | community_settings | 설정 API | ⚠️ `related.api: []` |
| [badges.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/badges.md) | badges, user_badges | `badges.md` | ❌ 없음 |

---

## ⚠️ 경로 표기 불일치 (다수)

상대경로와 절대경로(specs/ 기준)가 혼용되어 있습니다.

| 현재 패턴 | 예시 | 권장 패턴 |
|----------|------|----------|
| `../api/community/` | articles.md 등 | `specs/api/community/` |
| `../../db/community/` | API 파일들 | `specs/db/community/` |
| `community/...` | comments.md 등 | `specs/db/community/...` |
| `../../api/community/` | follows.md | `specs/api/community/` |

---

## 📂 Tasks 검증

### Phase ↔ 폴더 일치 (0건)
✅ 모든 task 파일이 올바른 폴더에 위치

### Specs 참조 유효성 (2건)

| Task 파일 | 잘못된 참조 | 상태 |
|-----------|------------|------|
| [task-community-search.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/tasks/P2/task-community-search.md#L10) | `community/portfolio-copy.md` (P3) | ⚠️ P2 Task가 P3 API 참조 |
| [task-community-search.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/tasks/P2/task-community-search.md#L12) | `portfolio/portfolio-copies.md` | ❌ 파일 없음 |

### 고아 스펙 (9건)

어떤 Task에서도 참조되지 않는 스펙들:

| 스펙 파일 | Phase | 권장 |
|-----------|-------|------|
| [profiles.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/profiles.md) | P2 | Task 추가 필요 |
| [settings.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/settings.md) | P2 | Task 추가 필요 |
| [nickname-histories.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/nickname-histories.md) | P2 | Task 추가 필요 |
| [article-categories.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/article-categories.md) | P2 | Task 추가 필요 |
| [reply-likes.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/reply-likes.md) | P2 | Task 추가 필요 |
| [reports.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/reports.md) | P2 | 내부용 (admin) |
| [report-reasons.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/report-reasons.md) | P2 | 내부용 (admin) |
| [user-blocks.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/user-blocks.md) | P2 | Task 추가 필요 |
| [user-suspensions.md](file:///c:/0_Stcok-Keeper/Docs-Test/Docs/AI_PRD/specs/db/community/user-suspensions.md) | P2 | 내부용 (admin) |

---

## ✅ AI가 자동 처리할 항목 (참고용)

| 항목 | 수량 | 내용 |
|------|------|------|
| Dead Link 경로 수정 | 16건 | 상대경로 → 절대경로 통일, 파일명 변경 반영 |
| 경로 표기 통일 | 다수 | `specs/` 접두사 일관성 적용 |

---

## 🔴 사용자 결정 필요 항목

### 1. `posts.md` → `articles.md` 마이그레이션 확인

여러 API에서 `posts.md`를 참조하지만 실제 파일명은 `articles.md`입니다.

**현황:**
- DB 테이블명: `community_articles` (변경됨)
- 기존 파일명: `posts.md` (삭제/변경됨)
- 현재 파일명: `articles.md`

**조치:**
- [ ] 모든 `posts.md` 참조를 `articles.md`로 변경

### 2. Phase 불일치 처리 방안

`follows.md` (P2)를 `follow.md` (P3)가 참조합니다.

**선택해주세요:**
- [ ] **Option A**: `follows.md`를 P3로 변경 (API와 일치)
- [ ] **Option B**: `follow.md`를 P2로 변경 (DB와 일치)
- [ ] **Option C**: 현재 상태 유지 (P2 DB를 P3에서 사용)

---

## 다음 단계

1. 위 "사용자 결정 필요 항목" 확인
2. 선택 후 **"자동 수정 진행해줘"** 요청
3. AI가 Dead Link 수정 + 경로 통일 + 누락 API 목록 정리
