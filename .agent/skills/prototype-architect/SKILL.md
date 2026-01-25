---
name: prototype-architect
description: PRD UI 스펙 기반 프로토타입 화면 구현 및 관리 스킬
---

# Prototype Architect Skill

PRD `specs/ui/` 스펙을 기반으로 프로토타입 화면을 구현하고 관리합니다.

---

## 빠른 참조 (Quick Ref)

> 토큰 절약용 요약. 상세 내용은 각 MODE 섹션 참조.

| 모드 | 트리거 | 입력 → 출력 |
|------|--------|-------------|
| Implement | `/proto-implement` | `specs/ui/` → HTML/CSS/JS |
| Validate | `/proto-validate` | `specs/` ↔ `screens/` 비교 |

**배치 규칙**: 한 번에 5개 화면 이하, 도메인 단위  
**screens.json**: 진실의 원천 (이 파일에 없으면 존재하지 않음)

---

---

## 2. 기본 경로

```
prototype_v4/
├── config/screens.json      # 화면 정의 (진실의 원천)
├── core/                    # 공통 모듈
├── screens/{domain}/        # 화면 HTML
├── screen-controllers/{domain}/  # 화면별 JS
├── css/screens/{domain}/    # 화면별 CSS
└── README.md                # 구현 체크리스트
```

---

## 3. 작업 모드

### MODE 1: Implement (화면 구현)

> **트리거**: "○○ 화면 구현해줘", `/proto-implement {domain}`

**입력**: `specs/ui/{domain}/{screen}.md`  
**출력**: HTML + CSS + Controller JS + screens.json 업데이트

#### 절차

1. PRD 스펙 로드 및 분석
2. 레이아웃/컴포넌트 구조 파악
3. HTML 생성 (`screens/{domain}/`)
4. CSS 생성 (`css/screens/{domain}/`)
5. Controller JS 생성 (`screen-controllers/{domain}/`)
6. screens.json에 화면 등록
7. README 체크리스트 업데이트

#### 규칙

- **한 번에 최대 5개 화면**까지만 처리
- 도메인 단위로 작업

---

### MODE 2: Validate (검증)

> **트리거**: "프로토타입 검증해줘", `/proto-validate {domain}`

**입력**: `specs/ui/` + `screens/`  
**출력**: 불일치/누락 리포트

#### 검증 항목

- PRD에 있는데 구현 안 된 화면
- 구현되었는데 PRD에 없는 화면  
- 스펙의 컴포넌트 vs 구현된 요소

---

### MODE 3: Register (등록만)

> **트리거**: "screens.json에 등록해줘"

기존 화면을 screens.json에 추가 (Phase, 상태 버튼 등)

---

## 4. screens.json 스키마

```json
{
  "id": "portfolio-list",
  "phase": "P1",
  "name": "포트폴리오 목록",
  "domain": "portfolio",
  "path": "screens/portfolio/list.html",
  "controller": "screen-controllers/portfolio/list.js",
  "prd": "specs/ui/portfolio/list.md",
  "navButton": { "icon": "🏠", "order": 1 },
  "stateButtons": [
    { "id": "empty", "icon": "📭", "title": "Empty 상태" },
    { "id": "loading", "icon": "⏳", "title": "로딩 상태" }
  ]
}
```

---

## 5. 컨텍스트 관리 규칙

| 규칙 | 설명 |
|------|------|
| 배치 크기 | 한 번에 5개 화면 이하 |
| 체크포인트 | 배치 완료 시 README 갱신 |
| 앵커 파일 | screens.json이 "진실의 원천" |
| 환각 방지 | screens.json에 없는 화면은 존재하지 않음 |

---

## 6. Claude/Gemini 분배

| 작업 | 모델 |
|------|------|
| 아키텍처 설계 | Claude |
| HTML/CSS 반복 생성 | Gemini |
| 검증/분석 | Claude |
| 체크리스트 업데이트 | Gemini |

---

## 7. 예시

**사용자**: "/proto-implement portfolio P1"

**AI 수행**:

1. `specs/ui/portfolio/*.md` 로드 (list, detail, create)
2. 3개 화면 구현
3. screens.json 업데이트
4. README 체크리스트 갱신
5. 완료 보고
