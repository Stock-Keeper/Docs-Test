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
├── specs/                    # 상세 스펙 (필수 참조)
│   ├── api/                  # API 엔드포인트
│   │   ├── admin/            # 관리자 API
│   │   ├── auth/             # 인증 API
│   │   ├── portfolio/        # 포트폴리오 API
│   │   ├── stock/            # 종목 API
│   │   ├── rebalancing/      # 리밸런싱 API
│   │   ├── notification/     # 알림 API
│   │   └── community/        # 커뮤니티 API
│   ├── db/                   # DB 테이블
│   ├── ui/                   # UI 화면 (간결한 스펙)
│   │   ├── admin/            # 관리자 화면
│   │   ├── auth/             # 인증 화면
│   │   ├── portfolio/        # 포트폴리오 화면
│   │   ├── stock/            # 종목 화면
│   │   ├── rebalancing/      # 리밸런싱 화면
│   │   ├── notification/     # 알림 화면
│   │   └── community/        # 커뮤니티 화면
│   └── logic/                # 비즈니스 로직
│
├── reference/                # 선택 참조 (사용자 요청 시)
│   └── pages/                # 페이지 상세 시나리오
│       ├── 00_onboarding.md  # 온보딩
│       ├── 01_login.md       # 로그인
│       ├── 02_profile.md     # 프로필
│       └── ...               # 기타 페이지
│
└── tasks/                    # 개발 태스크
    ├── P1/                   # Phase 1 (MVP)
    ├── P2/                   # Phase 2 (확장)
    └── P3/                   # Phase 3 (고도화)
```

### specs vs reference 차이

| 항목 | `specs/` | `reference/` |
|------|----------|--------------|
| **용도** | AI 코드 생성용 핵심 스펙 | 상세 UI/UX 시나리오 |
| **분량** | 간결 (~100줄) | 상세 (~200줄) |
| **참조** | 항상 (Task에서 자동) | 사용자 요청 시만 |
| **예시** | API 스펙, DB 스키마 | 페이지 플로우, 엣지케이스 |

---

## 🚀 빠른 시작

### 1. 태스크 기반 개발 (권장)

```
@AI_PRD/tasks/P1/task-auth.md 이 태스크를 구현해줘
```

### 2. 단일 API 구현

```
@AI_PRD/specs/api/portfolio/create.md 이 API를 구현해줘
```

### 3. DB 마이그레이션

```
@AI_PRD/specs/db/portfolios.md 테이블 생성해줘
```

---

## 📋 현재 스펙 현황

### Phase 1 (MVP) - 총 47일

| 도메인 | API | DB | UI | Task | 예상 시간 |
|--------|-----|-----|-----|------|----------|
| Admin | 6개 | 3개 | 2개 | 2개 | - |
| Auth | 4개 | 2개 | 2개 | 1개 | 9일 |
| Portfolio | 6개 | 1개 | 2개 | 1개 | 10일 |
| Stock | 4개 | - | 1개 | - | - |
| Rebalancing | 1개 | - | 1개 | 1개 | 14일 |
| Notification | 4개 | 2개 | 2개 | 1개 | 14일 |
| **P1 합계** | **25개** | **8개** | **10개** | **6개** | **47일** |

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
| API 스펙 | 34개 |
| DB 스펙 | 14개 |
| UI 스펙 | 12개 |
| Task | 10개 |

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

#### Portfolio (`specs/api/portfolio/`)
- [list.md](specs/api/portfolio/list.md) - 목록 조회
- [detail.md](specs/api/portfolio/detail.md) - 상세 조회
- [create.md](specs/api/portfolio/create.md) - 생성
- [update.md](specs/api/portfolio/update.md) - 수정
- [delete.md](specs/api/portfolio/delete.md) - 삭제
- [reorder.md](specs/api/portfolio/reorder.md) - 순서 변경

#### Stock (`specs/api/stock/`)
- [search.md](specs/api/stock/search.md) - 종목 검색
- [add.md](specs/api/stock/add.md) - 종목 추가
- [update-delete.md](specs/api/stock/update-delete.md) - 종목 수정/삭제
- [price.md](specs/api/stock/price.md) - 실시간 시세

#### Rebalancing (`specs/api/rebalancing/`)
- [calculate.md](specs/api/rebalancing/calculate.md) - 리밸런싱 제안

#### Notification (`specs/api/notification/`)
- [list.md](specs/api/notification/list.md) - 알림 목록
- [read.md](specs/api/notification/read.md) - 읽음 처리
- [settings.md](specs/api/notification/settings.md) - 알림 설정
- [fcm-token.md](specs/api/notification/fcm-token.md) - FCM 토큰

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

#### P1
- [users.md](specs/db/users.md) - 사용자
- [refresh-tokens.md](specs/db/refresh-tokens.md) - 리프레시 토큰
- [portfolios.md](specs/db/portfolios.md) - 포트폴리오/종목
- [notifications.md](specs/db/notifications.md) - 알림
- [notification-settings.md](specs/db/notification-settings.md) - 알림 설정/FCM
- [admin-logs.md](specs/db/admin-logs.md) - 관리자 로그
- [error-logs.md](specs/db/error-logs.md) - 에러 로그
- [api-call-logs.md](specs/db/api-call-logs.md) - API 호출 로그

#### P2
- [posts.md](specs/db/posts.md) - 게시글
- [comments.md](specs/db/comments.md) - 댓글
- [likes.md](specs/db/likes.md) - 좋아요
- [portfolio-copies.md](specs/db/portfolio-copies.md) - 포트폴리오 복사

#### P3
- [follows.md](specs/db/follows.md) - 팔로우
- [rankings-badges.md](specs/db/rankings-badges.md) - 랭킹/배지

### UI 스펙 (`specs/ui/`)

#### Admin
- [dashboard.md](specs/ui/admin/dashboard.md) - 관리자 대시보드
- [users-list.md](specs/ui/admin/users-list.md) - 사용자 목록

#### Auth
- [login-screen.md](specs/ui/auth/login-screen.md) - 로그인
- [profile-input.md](specs/ui/auth/profile-input.md) - 프로필 입력

#### Portfolio
- [list.md](specs/ui/portfolio/list.md) - 목록
- [detail.md](specs/ui/portfolio/detail.md) - 상세

#### Stock
- [add.md](specs/ui/stock/add.md) - 종목 추가

#### Rebalancing
- [check.md](specs/ui/rebalancing/check.md) - 리밸런싱 확인

#### Notification
- [center.md](specs/ui/notification/center.md) - 알림 센터
- [settings.md](specs/ui/notification/settings.md) - 알림 설정

#### Community
- [feed.md](specs/ui/community/feed.md) - 피드
- [search.md](specs/ui/community/search.md) - 검색

### Task 목록

#### P1 (MVP)
- [task-auth.md](tasks/P1/task-auth.md) - 인증 기능 (9일)
- [task-portfolio.md](tasks/P1/task-portfolio.md) - 포트폴리오 관리 (10일)
- [task-stock-rebalancing.md](tasks/P1/task-stock-rebalancing.md) - 종목/리밸런싱 (14일)
- [task-notification.md](tasks/P1/task-notification.md) - 알림 기능 (14일)
- [task-admin-users.md](tasks/P1/task-admin-users.md) - 관리자 사용자 관리
- [task-admin-dashboard.md](tasks/P1/task-admin-dashboard.md) - 관리자 대시보드

#### P2 (확장)
- [task-community-feed.md](tasks/P2/task-community-feed.md) - 피드/게시글/댓글
- [task-community-search.md](tasks/P2/task-community-search.md) - 검색/복사

#### P3 (고도화)
- [task-community-social.md](tasks/P3/task-community-social.md) - 대댓글/팔로우/랭킹/배지
- [task-community-extensions.md](tasks/P3/task-community-extensions.md) - 피드 확장/공유/이벤트

---

## 📂 관련 문서

- **사람용 PRD**: `Docs/new_PRD/` (기획/이해용)
- **이 폴더**: AI 코드 생성 최적화용

---

> 📅 최종 수정: 2026-01-13
