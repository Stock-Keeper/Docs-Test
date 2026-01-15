---
description: PRD inbox의 자유 형식 파일을 정형화된 초안으로 변환
---

# /prd-prepare 워크플로우

PRD `_inbox/` 디렉토리의 자유 형식 파일들을 분석하여 `_staging/`에 정형화된 초안을 생성합니다.

## 실행 방법
```
/prd-prepare
```

## 파이프라인 위치
```
_inbox/ (자유형식) → [/prd-prepare] → _staging/ (정형화) → [/prd-process] → specs/ (최종)
```

## 워크플로우 단계

### 1. Inbox 스캔
```
- AI_PRD/_inbox/ 디렉토리의 모든 파일 목록 확인
- README.md는 제외
- 빈 경우 "처리할 파일이 없습니다" 알림 후 종료
```

### 2. 파일별 내용 분석
```
각 파일에 대해:
1. 내용 읽기 (형식 무관: 메모, 대화체, 불완전한 문장 등)
2. 의도 파악:
   - 새로운 기능 요청 → [NEW]
   - 기존 기능 변경/추가 → [UPDATE]  
   - 기능 제거 요청 → [DELETE]
3. 스펙 유형 추론:
   - API 관련 (엔드포인트, 요청, 응답) → api
   - 데이터베이스 관련 (테이블, 컬럼, 스키마) → db
   - 화면/UI 관련 (버튼, 화면, 디자인) → ui
   - 그 외 → other
4. Phase 추론:
   - 핵심 기능, 필수 → P1
   - 커뮤니티, 소셜 → P2
   - 고급 기능, 확장 → P3
5. 내용 분리 판단:
   - 하나의 파일에 서로 다른 도메인/기능이 섞여 있는 경우 분리 필요 여부 확인
   - 예: User 테이블과 Portfolio 테이블 정의가 함께 있는 경우 → 별도의 스펙으로 분리 권장
6. 기존 스펙과 연관성 검색
```

### 3. 용어 정규화
```
팀원이 사용한 표현 → 정형화된 용어

예시:
- "로그인 버튼" → "Google OAuth 인증"
- "포폴" → "포트폴리오"
- "디비" → "데이터베이스"
- "걍 삭제해" → "[DELETE]"
- "이거 좀 바꿔" → "[UPDATE]"
```

### 4. 초안 생성 (_staging/)
```
식별된 각 '기능 단위'별로 _staging/에 정형화된 파일 생성 (1개의 Inbox 파일에서 여러 개의 Staging 파일이 나올 수 있음):

파일명 형식: [작업유형] 스펙명.md

예시:
- _staging/[NEW] payment-create.md
- _staging/[UPDATE] auth-google.md
- _staging/[DELETE] deprecated-feature.md

초안 내용 구조:
---
# [추론된 제목]

## 원본 내용
> (사용자가 작성한 원본 그대로)

## AI 분석 결과
- 추론 유형: api / db / ui
- 추론 작업: NEW / UPDATE / DELETE
- 추론 Phase: P1 / P2 / P3
- 연관 기존 스펙: [있으면 표시]

## 정형화된 초안
(AI가 정리한 스펙 초안)

## 확인 필요 사항
- [ ] 위 분석이 맞나요?
- [ ] 추가로 포함할 내용이 있나요?
---
```

### 5. 분석 결과 보고
```
사용자에게 표시:

📥 inbox 처리 결과

| 원본 파일 | 추론 유형 | 추론 작업 | 생성된 초안 |
|----------|----------|----------|------------|
| 결제해줘.txt | api | NEW | [NEW] payment-create.md |
| 통합메모.md | api | NEW | [NEW] auth-login.md <br> [NEW] user-profile.md |
| 로그인수정.md | api | UPDATE | [UPDATE] auth-google.md |

✅ _staging/ 폴더를 확인하고 검토해주세요.
   검토 완료 후 /prd-process를 실행하세요.
```

### 6. 원본 유지
```
- _inbox/ 파일은 그대로 유지 (삭제하지 않음)
- /prd-process 완료 후에만 _processed/로 이동
```

## 처리할 수 없는 경우

| 상황 | 처리 |
|------|-----|
| 내용이 너무 모호함 | _staging/[UNCLEAR] 파일명.md로 생성, 사용자에게 명확화 요청 |
| 이미지만 있음 | _staging/[IMAGE] 파일명.md로 생성, 이미지 설명 요청 |
| 기존 스펙과 완전 중복 | 스킵하고 사용자에게 알림 |

## 주의사항

- 이 단계에서는 실제 specs/에 아무것도 생성하지 않음
- 사용자가 _staging/ 내용을 검토/수정할 시간을 줌
- 검토 완료 후 /prd-process로 최종 반영
