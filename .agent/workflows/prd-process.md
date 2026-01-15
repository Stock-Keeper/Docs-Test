---
description: PRD staging 디렉토리의 정형화된 파일들을 specs로 최종 반영
---

# /prd-process 워크플로우

PRD `_staging/` 디렉토리의 정형화된 초안들을 최종 스펙 파일로 변환하여 `specs/`에 반영합니다.

> ⚠️ 이 워크플로우 실행 전에 `/prd-prepare`를 먼저 실행하세요.

## 파이프라인
```
_inbox/ → [/prd-prepare] → _staging/ → [/prd-process] → specs/
                              ↑ 여기서 읽음
```

## 실행 방법
```
/prd-process
```

## 워크플로우 단계

### 1. Staging 스캔
```
- AI_PRD/_staging/ 디렉토리의 모든 파일 목록 확인
- README.md는 제외
- 빈 경우 "처리할 파일이 없습니다. /prd-prepare를 먼저 실행하세요" 알림 후 종료
```

### 2. 파일별 분석 (각 파일에 대해)
```
- 파일명 접두어 확인:
  - [NEW] 또는 없음 → 신규 생성
  - [UPDATE] → 기존 파일 수정
  - [DELETE] → 삭제 요청
- 파일 내용 읽기
- 스펙 유형 추론: api / db / ui / task / other
- 관련 기존 스펙 검색 (중복 체크)
- Phase 추론: P1 / P2 / P3
- 카테고리 추론 (API의 경우): auth / portfolio / stock / rebalancing / notification / admin / community
```

### 3. 분석 결과 보고 (사용자 확인)
```
사용자에게 분석 결과 표시:

| 원본 파일 | 작업 | 대상 위치 | 비고 |
|----------|------|----------|------|
| [NEW] 결제_api.md | 생성 | specs/api/payment/ | - |
| [UPDATE] auth-google.md | 수정 | specs/api/auth/auth-google.md | 기존 파일 발견 |
| [DELETE] old.md | 삭제 | specs/api/deprecated/old.md | 삭제 예정 |

사용자 승인 대기
```

### 4-A. 신규 생성 ([NEW]) - 승인 후
```
1. 프론트매터 자동 생성 (type, phase, category, related 등)
2. 기존 템플릿 형식에 맞게 본문 정리
3. 적절한 specs/ 하위 디렉토리에 파일 생성
4. 연관 스펙 파일의 related 필드 업데이트 (필요 시)
```

### 4-B. 수정 ([UPDATE]) - 승인 후
```
1. 기존 스펙 파일 로드
2. inbox 파일 내용 분석 (변경 사항 파악)
3. 기존 파일에 변경 사항 적용
4. 프론트매터 유지/업데이트
5. related 필드 업데이트 (필요 시)
```

### 4-C. 삭제 ([DELETE]) - 승인 후
```
1. 대상 스펙 파일 확인
2. 해당 파일 삭제
3. 다른 스펙의 related 필드에서 참조 제거
4. INDEX.md에서 링크 제거
```

### 5. INDEX.md 업데이트
```
- specs/INDEX.md의 프론트매터 spec_count 업데이트
- 해당 섹션에 새 스펙 링크 추가/수정/삭제
```

### 6. 정리 (Cleanup)
```
1. 원본 아카이브:
   - _inbox/의 원본 파일을 _processed/YYYY-MM-DD/ 디렉토리로 이동
   - _inbox/ 디렉토리 비우기

2. Staging 정리:
   - 처리가 완료된 _staging/ 내의 파일들 삭제
```

### 7. 완료 보고
```
처리 결과 요약:
- 생성: N개
- 수정: N개  
- 삭제: N개
- 스킵: N개 (이유)
- 아카이브 위치: _processed/YYYY-MM-DD/
```

## 프론트매터 템플릿

### API 스펙
```yaml
---
type: api
phase: P1 | P2 | P3
category: auth | portfolio | stock | rebalancing | notification | admin | community
method: GET | POST | PUT | PATCH | DELETE
endpoint: /api/...
auth: required | optional | none | admin | verified
related:
  db: [상대 경로 배열]
  ui: [상대 경로 배열]
  api: [상대 경로 배열]
---
```

### DB 스펙
```yaml
---
type: db
phase: P1 | P2 | P3
table: 테이블명 (복수 시 쉼표 구분)
related:
  api: [상대 경로 배열]
---
```

### UI 스펙
```yaml
---
type: ui
phase: P1 | P2 | P3
screen: 화면명
related:
  api: [상대 경로 배열]
  ui: [상대 경로 배열]
reference: (선택) 참조 페이지 경로
---
```

## 중복 처리 규칙

| 상황 | 처리 방식 |
|------|----------|
| 동일 endpoint 존재 | 스킵 + 사용자에게 기존 파일 수정 제안 |
| 유사 기능 존재 | 경고 후 사용자 선택 대기 |
| 완전 신규 | 정상 생성 |

## 주의사항

- 이미지 파일(.png, .jpg 등)은 `reference/images/`로 이동
- 분류 불가능한 파일은 스킵하고 사용자에게 알림
- 프론트매터 생성 시 기존 스펙 파일 형식을 참고하여 일관성 유지
