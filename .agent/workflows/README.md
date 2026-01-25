# Workflows 가이드

> AI 에이전트용 작업 워크플로우 모음

---

## 파이프라인

### PRD 워크플로우

```
요구사항 → [/prd-prepare] → staging → [/prd-process] → specs → [/prd-sync-tasks] → tasks
   │              │              │             │
_inbox/      _staging/      _processed/    specs/db,api,ui/
```

| 순서 | 명령어 | 입력 | 출력 |
|------|--------|------|------|
| 1 | `/prd-prepare` | `_inbox/*.md` | `_staging/[NEW]*.md` |
| 2 | `/prd-process` | `_staging/*.md` | `specs/**/*.md` |
| 3 | `/prd-sync-tasks` | CHANGELOG | `tasks/*.md` 업데이트 |
| - | `/prd-validate` | `specs/` | 검증 리포트 |

---

### 프로토타입 워크플로우

```
specs/ui/ → [/proto-implement] → prototype_v4/ → [/proto-validate] → 검증 리포트
```

| 명령어 | 입력 | 출력 |
|--------|------|------|
| `/proto-implement` | `specs/ui/*.md` | HTML, CSS, JS |
| `/proto-validate` | `specs/ui/` + `screens/` | 불일치 리포트 |

---

## 모델 권장

| 작업 | 권장 모델 | 이유 |
|------|----------|------|
| 설계, 검증, 분석 | Claude | 복잡한 추론 |
| 파일 생성, 반복 작업 | Gemini | 토큰 효율 |

---

## 스킬 참조

| 워크플로우 | 스킬 |
|-----------|------|
| `/prd-*` | `.agent/skills/prd-architect/SKILL.md` |
| `/proto-*` | `.agent/skills/prototype-architect/SKILL.md` |
