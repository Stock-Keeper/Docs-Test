# AI_PRD

> 🤖 AI 기반 개발을 위한 최적화된 PRD 문서 (맥도날드 시스템)

---

## 📖 시작하기

| 문서 | 용도 |
|------|------|
| **[WRITING_GUIDE.md](WRITING_GUIDE.md)** | 스펙 작성 표준/템플릿 |
| **[AI_USAGE_GUIDE.md](AI_USAGE_GUIDE.md)** | AI 프롬프트 사용법 |

---

## 🗂 폴더 구조

```
AI_PRD/
├── README.md                 # 이 파일
├── WRITING_GUIDE.md          # 스펙 작성 표준
├── AI_USAGE_GUIDE.md         # AI 사용 가이드
│
├── specs/                    # 상세 스펙
│   ├── api/                  # API 엔드포인트
│   │   ├── admin/            # 관리자 API
│   │   ├── auth/             # 인증 API
│   │   └── community/        # 커뮤니티 API
│   ├── db/                   # DB 테이블
│   ├── ui/                   # UI 화면
│   │   ├── admin/            # 관리자 화면
│   │   ├── auth/             # 인증 화면
│   │   └── community/        # 커뮤니티 화면
│   └── logic/                # 비즈니스 로직
│
└── tasks/                    # 개발 태스크
    ├── P1/                   # Phase 1 (MVP)
    ├── P2/                   # Phase 2 (확장)
    └── P3/                   # Phase 3 (고도화)
```

---

## 🚀 빠른 시작

### 1. 태스크 기반 개발 (권장)

```
@AI_PRD/tasks/P1/task-auth.md 이 태스크를 구현해줘
```

### 2. 단일 API 구현

```
@AI_PRD/specs/api/auth/google-callback.md 이 API를 구현해줘
```

### 3. DB 마이그레이션

```
@AI_PRD/specs/db/users.md 테이블 생성해줘
```

---

## 📋 현재 스펙 현황

### Phase 1 (MVP)

| 도메인 | API | DB | UI | Task |
|--------|-----|-----|-----|------|
| Admin | 6개 | 3개 | 2개 | 2개 |
| Auth | 4개 | 2개 | 2개 | 1개 |
| **P1 합계** | 10개 | 5개 | 4개 | 3개 |

### Phase 2 (확장)

| 도메인 | API | DB | UI | Task |
|--------|-----|-----|-----|------|
| Community | 6개 | 4개 | 2개 | 2개 |
| **P2 합계** | 6개 | 4개 | 2개 | 2개 |

### Phase 3 (고도화)

| 도메인 | API | DB | UI | Task |
|--------|-----|-----|-----|------|
| Community | 3개 | 2개 | - | 2개 |
| **P3 합계** | 3개 | 2개 | - | 2개 |

### 총합

| 유형 | 개수 |
|------|------|
| API 스펙 | 19개 |
| DB 스펙 | 11개 |
| UI 스펙 | 6개 |
| Task | 7개 |

---

## 🔗 스펙 인덱스

### API 스펙

#### Admin (`specs/api/admin/`)
- [users-list.md](specs/api/admin/users-list.md) - 사용자 목록
- [users-detail.md](specs/api/admin/users-detail.md) - 사용자 상세
- [users-role.md](specs/api/admin/users-role.md) - 역할 변경
- [users-status.md](specs/api/admin/users-status.md) - 상태 변경
- [stats-overview.md](specs/api/admin/stats-overview.md) - 통계
- [monitoring-errors.md](specs/api/admin/monitoring-errors.md) - 에러 로그

#### Auth (`specs/api/auth/`)
- [google-callback.md](specs/api/auth/google-callback.md) - Google OAuth
- [refresh.md](specs/api/auth/refresh.md) - 토큰 갱신
- [logout.md](specs/api/auth/logout.md) - 로그아웃
- [profile-update.md](specs/api/auth/profile-update.md) - 프로필 입력

#### Community (`specs/api/community/`)
- [feed-list.md](specs/api/community/feed-list.md) - 피드 조회
- [post-create.md](specs/api/community/post-create.md) - 게시글 작성
- [comment-create.md](specs/api/community/comment-create.md) - 댓글 작성
- [search.md](specs/api/community/search.md) - 통합 검색
- [like.md](specs/api/community/like.md) - 좋아요
- [portfolio-copy.md](specs/api/community/portfolio-copy.md) - 포트폴리오 복사
- [reply-create.md](specs/api/community/reply-create.md) - 대댓글 (P3)
- [follow.md](specs/api/community/follow.md) - 팔로우 (P3)
- [ranking.md](specs/api/community/ranking.md) - 랭킹 (P3)

### DB 스펙 (`specs/db/`)
- [users.md](specs/db/users.md)
- [refresh-tokens.md](specs/db/refresh-tokens.md)
- [admin-logs.md](specs/db/admin-logs.md)
- [error-logs.md](specs/db/error-logs.md)
- [api-call-logs.md](specs/db/api-call-logs.md)
- [posts.md](specs/db/posts.md)
- [comments.md](specs/db/comments.md)
- [likes.md](specs/db/likes.md)
- [portfolio-copies.md](specs/db/portfolio-copies.md)
- [follows.md](specs/db/follows.md) (P3)
- [rankings-badges.md](specs/db/rankings-badges.md) (P3)

### Task 목록

#### P1
- [task-auth.md](tasks/P1/task-auth.md) - 인증 기능
- [task-admin-users.md](tasks/P1/task-admin-users.md) - 관리자 사용자 관리
- [task-admin-dashboard.md](tasks/P1/task-admin-dashboard.md) - 관리자 대시보드

#### P2
- [task-community-feed.md](tasks/P2/task-community-feed.md) - 피드/게시글/댓글
- [task-community-search.md](tasks/P2/task-community-search.md) - 검색/복사

#### P3
- [task-community-social.md](tasks/P3/task-community-social.md) - 대댓글/팔로우/랭킹/배지
- [task-community-extensions.md](tasks/P3/task-community-extensions.md) - 피드 확장/공유/이벤트

---

## 📂 관련 문서

- **사람용 PRD**: `Docs/new_PRD/` (기획/이해용)
- **이 폴더**: AI 코드 생성 최적화용

---

> 📅 최종 수정: 2026-01-13
