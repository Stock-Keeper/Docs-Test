# 🤖 Agent Docs (AI 에이전트 가이드)

> **AI 에이전트(Cursor, Claude 등)가 Stock-Keeper 프로젝트에서 작업할 때 참조하는 규칙과 가이드**  
> **최종 수정일:** 2026-01-15

---

## 🎯 이 폴더의 목적

**맥도날드 시스템** 기반의 AI 에이전트 워크플로우입니다.

- AI 에이전트는 **200줄 매뉴얼**만 읽고 작업
- 컨텍스트 폭발 방지, 환각 감소
- 일관된 코드 품질 유지

---

## 📂 폴더 구조

```
📁 agent_docs/
├── 📄 README.md           ← 현재 문서 (전체 안내)
├── 📄 RULES.md            ← ⭐ 대원칙 (항상 먼저 읽음)
├── 📄 start.md            ← 작업 시작 워크플로우
│
└── 📁 prompts/            ← 작업별 상세 가이드
    ├── 📄 architecture.md  ← 폴더 구조, 의존성 규칙
    ├── 📄 workflow.md      ← 빌드/커밋 워크플로우
    ├── 📄 coding-style.md  ← 네이밍, 코딩 규칙
    ├── 📄 tdd-guide.md     ← TDD 워크플로우
    └── 📄 session-log.md   ← 세션 논의 기록 형식
```

---

## 🚀 작업 시작 방법

### `/start` 명령 실행 후:

1. **RULES.md 읽기** — 대원칙 확인
2. **작업 유형 파악** — 해당 가이드 참조
3. **PRD 확인** — 기능 구현 시 `docs/prd/` 참조
4. **작업 수행**

---

## 📋 문서별 역할

| 문서 | 역할 | 언제 참조? |
|------|------|----------|
| [RULES.md](./RULES.md) | 대원칙, 금지사항, 기술스택 | ⭐ 항상 |
| [start.md](./start.md) | 작업 시작 초기화 | 새 세션 시작 시 |
| [architecture.md](./prompts/architecture.md) | 폴더 구조, 의존성 | 새 파일 생성 시 |
| [workflow.md](./prompts/workflow.md) | 빌드/테스트/커밋 | 코드 수정 후 |
| [coding-style.md](./prompts/coding-style.md) | 네이밍, 코딩 규칙 | 코드 작성 시 |
| [tdd-guide.md](./prompts/tdd-guide.md) | TDD 워크플로우 | 비즈니스 로직 작성 시 |
| [session-log.md](./prompts/session-log.md) | 논의 기록 형식 | 결정사항 정리 시 |

---

## ⚠️ 핵심 규칙 요약

### ✅ 필수

```
✅ RULES.md 먼저 읽기
✅ Phase 1 범위만 구현
✅ 비즈니스 로직은 테스트 먼저
✅ 금융 정확성 (수량 4자리, 비율 2자리)
✅ 한국어 커밋 메시지
```

### ❌ 금지

```
❌ 요구사항에 없는 기능 추가
❌ API Key 하드코딩
❌ any 타입 사용
❌ console.log 커밋
❌ 테스트 없이 비즈니스 로직 수정
```

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React Native (Expo), Context API |
| Backend | Spring Boot 3.x, Java 17, JPA |
| Database | MySQL 8.0 (AWS RDS) |
| 인증 | Google OAuth 2.0, JWT |
| 외부 API | 한국투자증권 API |

---

## 📐 아키텍처 요약

### Frontend 폴더
```
src/
├── components/  → UI 컴포넌트
├── screens/     → 화면
├── services/    → API 호출
├── stores/      → 상태 관리
└── types/       → 타입 정의
```

### Backend 폴더
```
src/main/java/
├── controller/  → API 엔드포인트
├── service/     → 비즈니스 로직
├── repository/  → 데이터 접근
└── entity/      → JPA 엔티티
```

---

## 🔄 TDD 워크플로우

```
🔴 Red    → 실패하는 테스트 먼저
🟢 Green  → 테스트 통과하는 최소 코드
🔵 Refactor → 코드 개선
```

**필수 대상:** 리밸런싱 계산, 비율/금액 계산

---

*📌 이 폴더는 AI 에이전트가 효율적이고 일관된 작업을 수행하도록 돕는 가이드입니다.*
