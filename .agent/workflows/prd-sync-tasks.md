---
description: CHANGELOG 기반으로 변경된 specs를 tasks에 동기화
---

# /prd-sync-tasks 워크플로우

> 이 워크플로우는 `prd-architect` 스킬의 **Sync Tasks 모드**를 호출합니다.

## 실행 방법

```
/prd-sync-tasks                    # 가장 최근 CHANGELOG 자동 감지
/prd-sync-tasks 2026-01-16_0028    # 특정 아카이브 지정
/prd-sync-tasks P1                 # P1 task 파일만 처리 (권장)
/prd-sync-tasks --verify           # 스펙 참조 유효성만 빠르게 체크
```

## 동작

이 명령을 받으면:

1. `.agent/skills/prd-architect/SKILL.md` 파일을 읽습니다.
2. **MODE 5: Sync Tasks** 섹션의 지침을 따릅니다.
3. CHANGELOG를 읽고 관련 task 파일의 스펙 참조를 업데이트합니다.

## 파이프라인

```
/prd-process → CHANGELOG.md 생성
                    ↓
/prd-sync-tasks → CHANGELOG 읽고 → tasks/ 업데이트
                 (이 워크플로우)
```

## 처리 내용 (요약)

- CHANGELOG에서 NEW/UPDATE/DELETE 스펙 추출
- 도메인 → Task 매핑
- Task 파일의 "스펙 참조" 섹션 업데이트
- 매핑 없는 스펙은 사용자에게 확인 요청

## 상세 지침

스킬 파일의 다음 섹션을 참조하세요:
- **MODE 5: Sync Tasks (태스크 동기화)**

// turbo-all
