---
description: 변경 사항을 분석하여 Conventional Commit 형식의 메시지 생성
---

# /commit 워크플로우

변경된 파일을 분석하여 Conventional Commit 형식의 커밋 메시지를 자동 생성합니다.

## 실행 방법

```
/commit
```

## 워크플로우 단계

### 1. 변경 사항 확인

```bash
git status --short
git diff --stat
```

### 2. 변경 내용 분석

```
- 변경된 파일 목록 확인
- 주요 변경 유형 파악 (기능 추가, 버그 수정, 문서, 리팩토링 등)
- 영향 범위(scope) 추론
```

### 3. 커밋 메시지 생성

#### Conventional Commit 형식

```
<type>(<scope>): <subject>

<body>
```

#### Type 종류

| Type       | 설명        | 예시                      |
| ---------- | ----------- | ------------------------- |
| `feat`     | 새로운 기능 | 로그인 기능 추가          |
| `fix`      | 버그 수정   | 포트폴리오 조회 오류 수정 |
| `docs`     | 문서 변경   | README 업데이트           |
| `style`    | 코드 포맷팅 | ESLint 적용               |
| `refactor` | 리팩토링    | 함수 분리                 |
| `test`     | 테스트      | 단위 테스트 추가          |
| `chore`    | 기타 작업   | 의존성 업데이트           |

#### Scope 예시

| Scope       | 대상            |
| ----------- | --------------- |
| `auth`      | 인증 관련       |
| `portfolio` | 포트폴리오 관련 |
| `ui`        | UI 컴포넌트     |
| `db`        | 데이터베이스    |
| `api`       | API 엔드포인트  |
| `AI_PRD`    | PRD 문서        |
| `workflow`  | 워크플로우      |

### 4. 사용자 확인

```
생성된 커밋 메시지:
---
feat(auth): 구글 로그인 기능 추가

- GoogleOAuthController 구현
- JWT 토큰 발급 로직 추가
- 로그인 화면 UI 구현
---

이 메시지로 커밋할까요? (Y/N/수정)
```

### 5. 커밋 실행 (승인 후)

```bash
git add .
git commit -m "<generated message>"
```

## 커밋 메시지 예시

### 기능 추가

```
feat(portfolio): 포트폴리오 생성 API 구현

- PortfolioController.create() 추가
- 최대 5개 제한 로직 포함
- 유효성 검증 추가
```

### 문서 변경

```
docs(AI_PRD): 프론트매터 시스템 및 워크플로우 추가

- 63개 스펙 파일에 YAML 프론트매터 추가
- _inbox, _staging, _processed 폴더 구조 생성
- /prd-prepare, /prd-process 워크플로우 추가
```

### 버그 수정

```
fix(notification): 알림 읽음 처리 오류 수정

- 읽음 상태가 업데이트되지 않는 문제 해결
- related: #123
```

## 주의사항

- 커밋 전 `git diff`로 변경 내용 한번 더 확인
- 메시지가 길면 body에 상세 내용 작성
- 이슈 번호가 있으면 body에 `related: #이슈번호` 추가
