---
description: _staging/의 정형화된 초안을 최종 specs/에 반영
---

# /prd-process 워크플로우

> 이 워크플로우는 `prd-architect` 스킬의 **Process 모드**를 호출합니다.

## 실행 방법

```
/prd-process              # 모든 staging 파일 처리
/prd-process {domain}     # 특정 도메인만 처리 (권장)
```

## 동작

이 명령을 받으면:

1. `.agent/skills/prd-architect/SKILL.md` 파일을 읽습니다.
2. **MODE 2: Process** 섹션의 지침을 따릅니다.
3. `_staging/` → `specs/` 반영을 수행합니다.

## 파이프라인

```
_inbox/ → [/prd-prepare] → _staging/ → [/prd-process] → specs/
                                       (이 워크플로우)
```

## 상세 지침

스킬 파일의 다음 섹션을 참조하세요:
- **MODE 2: Process (staging → specs)**

// turbo-all
