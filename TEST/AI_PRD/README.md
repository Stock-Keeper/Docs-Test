# AI_PRD

> 🤖 AI 기반 개발을 위한 최적화된 PRD 문서

## 목적

이 폴더는 생성형 AI(Antigravity, Claude 등)가 효율적으로 코드를 생성할 수 있도록 최적화된 스펙 문서를 제공합니다.

## 폴더 구조

```
AI_PRD/
├── README.md           # 이 파일 (진입점)
├── specs/              # 상세 스펙 (코드 생성용)
│   ├── api/            # API 엔드포인트별 스펙
│   ├── db/             # DB 테이블별 스펙
│   ├── ui/             # UI 화면별 스펙
│   └── logic/          # 비즈니스 로직 스펙
└── tasks/              # 개발 태스크 단위
    ├── P1/             # Phase 1 태스크
    └── P2/             # Phase 2 태스크
```

## 사용 방법

### 1. AI에게 작업 지시 시

```
@AI_PRD/tasks/P1/task-001-google-oauth.md 이 태스크를 구현해줘
```

### 2. 특정 API 구현 시

```
@AI_PRD/specs/api/auth-google.md 스펙대로 API 구현해줘
```

### 3. DB 마이그레이션 시

```
@AI_PRD/specs/db/users.md 테이블 생성 SQL 만들어줘
```

## 스펙 파일 네이밍 규칙

| 유형 | 패턴 | 예시 |
|------|------|------|
| API | `{리소스}-{액션}.md` | `portfolio-create.md` |
| DB | `{테이블명}.md` | `users.md` |
| UI | `{화면명}.md` | `login-screen.md` |
| Logic | `{기능명}.md` | `rebalancing-calc.md` |

## 태스크 파일 네이밍 규칙

| 패턴 | 예시 |
|------|------|
| `task-{번호}-{기능명}.md` | `task-001-google-oauth.md` |

## 관련 문서

- **사람용 PRD**: `Docs/new_PRD/` (기획/이해용)
- **이 폴더**: AI 코드 생성 최적화용

---

> 📅 생성일: 2026-01-13
