# Prototype v4 설계 결정 기록

> **작성일**: 2026-01-26  
> **최종 수정**: 2026-01-26 05:45  
> **목적**: 설계 논의 보존, 새 세션에서 참조용

---

## 확정된 결정사항

### 아키텍처

| 항목 | 결정 | 근거 |
|------|------|------|
| 모듈 시스템 | ES6 (`import/export`) | 의존성 명시, 전역 오염 방지, 라이브러리 불필요 |
| 설정 파일 | `screens.json` | 컨트롤 패널 자동 생성, PRD 매핑 |
| 상태 관리 | StateManager 클래스 | state.js 1,100줄 분리 |
| 폴더 구조 | 도메인별 하위 폴더 (screens/, NOT pages/) | FSD 매핑 문서로 연결 |

### 마이그레이션 (v3 → v4)

| 자원 | 재사용도 | 처리 방법 |
|------|----------|----------|
| CSS variables/base/components | 90%+ | 폴더 이동만 |
| HTML screens | 60% | id 명명규칙 변경 |
| JS | 20% | 리팩토링 필수 |

### 컨트롤 패널

- **Phase 토글**: P1/P2/P3 버튼으로 해당 Phase 화면만 표시
- **동적 생성**: screens.json 기반 네비게이션/상태 버튼 자동 생성

### UI 스펙 문서화 범위

| 포함 | 미포함 |
|------|--------|
| 레이아웃 (ASCII) | 색상 코드 |
| 상태 테이블 | px 값 |
| 상호작용 테이블 | 애니메이션 duration |
| 컴포넌트 목록 | 폰트 사이즈 |

---

## 완료된 작업 ✅

- [x] prototype_v4 폴더 구조 생성
- [x] `config/screens.json` (8개 P1 화면 정의)
- [x] core 모듈 (app, navigation, control-panel, theme, utils)
- [x] CSS 마이그레이션 (variables, base, components)
- [x] `README.md`, `docs/FSD_MAPPING.md`
- [x] `.agent/skills/prototype-architect/SKILL.md`
- [x] `.agent/workflows/proto-implement.md`, `proto-validate.md`
- [x] `.agent/workflows/README.md` (파이프라인 문서)
- [x] 스킬 Quick Ref 섹션 추가 (토큰 절약)

---

## 남은 작업 (새 세션)

```
/proto-implement auth        # splash, login, profile-input
/proto-implement portfolio   # list, detail
/proto-implement stock       # search
/proto-implement rebalancing # check
/proto-implement settings    # main
```

---

## 주요 Q&A 요약

| 질문 | 답변 |
|------|------|
| ES6 라이브러리 필요? | 불필요, 브라우저 내장 |
| Claude/Gemini 분배? | Claude=설계/검증, Gemini=반복생성 |
| FSD 구조 대응? | screens/ 유지 + 매핑 문서 |
| 환각/컨텍스트 방지? | 5개 화면 배치, screens.json=진실의 원천 |

---

## 템플릿화 계획

- v4 완성 후 `prototype-template` 레포로 분리
- 컨트롤 패널, Phase 토글 등 핵심 기능 포함
- 타 프로젝트 재사용 가능
