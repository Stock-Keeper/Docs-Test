---
description: PRD 스펙 전체를 점검하여 중복, 누락, 불일치 검출
---

# /prd-validate 워크플로우

> 이 워크플로우는 `prd-architect` 스킬의 **Validate 모드**를 호출합니다.

## 실행 방법

```
/prd-validate                      # 전체 specs 검증
/prd-validate {domain}             # 특정 도메인만 검증 (권장)
/prd-validate --quick              # 프론트매터 + 파일 존재만 빠르게
/prd-validate --tasks              # tasks 관련 검증만 수행
/prd-validate --tasks P1           # P1 phase의 tasks만 검증
```

## 동작

이 명령을 받으면:

1. `.agent/skills/prd-architect/SKILL.md` 파일을 읽습니다.
2. **MODE 4: Validate** 섹션의 지침을 따릅니다.
3. `specs/` 디렉토리를 스캔하여 일관성, 중복, 누락을 점검합니다.
4. 결과를 `_inbox/[VALIDATE] YYYY-MM-DD.md`로 생성합니다.

## 검증 항목 (요약)

- 중복 검출 (테이블명, API 엔드포인트)
- 누락 검출 (DB→API, API→UI, FK 참조)
- 참조 무결성 (Dead Link, 양방향 참조)
- 일관성 검사 (Phase, 네이밍, 프론트매터)
- Tasks 검증 (스펙 참조 유효성, 고아 스펙)

## UI 스펙 필수 섹션 검증

`specs/ui/**/*.md` 파일은 아래 섹션이 **필수**:

| 섹션 | 설명 |
|------|------|
| 개요 | 화면 목적 한 줄 설명 |
| 레이아웃 | ASCII 다이어그램 |
| 컴포넌트 | 주요 UI 요소 목록 |
| 상호작용 | 액션 → 동작 테이블 |
| 상태 | 로딩/빈/에러 처리 테이블 |

**포함하지 않을 것**: 색상 코드, px 값, 애니메이션 duration

## 상세 지침

스킬 파일의 다음 섹션을 참조하세요:

- **MODE 4: Validate (전수 검사)**

// turbo-all
