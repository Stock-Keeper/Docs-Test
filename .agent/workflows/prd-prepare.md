---
description: PRD inbox의 자유 형식 파일을 정형화된 초안으로 변환
---

# /prd-prepare 워크플로우

> 이 워크플로우는 `prd-architect` 스킬의 **Prepare 모드**를 호출합니다.

## 실행 방법

```
/prd-prepare              # 전체 inbox 처리
/prd-prepare {domain}     # 특정 도메인만 처리 (권장)
```

## 동작

이 명령을 받으면:

1. `.agent/skills/prd-architect/SKILL.md` 파일을 읽습니다.
2. **MODE 1: Prepare** 섹션의 지침을 따릅니다.
3. `_inbox/` → `_staging/` 변환을 수행합니다.

## 파이프라인

```
_inbox/ → [/prd-prepare] → _staging/ → [/prd-process] → specs/
         (이 워크플로우)
```

## 상세 지침

스킬 파일의 다음 섹션을 참조하세요:
- **MODE 1: Prepare (inbox → staging)**

// turbo-all
