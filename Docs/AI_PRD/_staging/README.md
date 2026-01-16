# PRD Staging (검토 대기)

> `/prd-prepare`로 정형화된 초안이 이곳에 생성됩니다.
> 검토 후 `/prd-process`로 최종 반영하세요.

## 파이프라인

```
_inbox/     →   _staging/   →   specs/
(자유형식)      (여기!)        (최종)
            /prd-prepare   /prd-process
```

## 사용법

1. `/prd-prepare` 실행 후 이 폴더 확인
2. 생성된 초안 파일들 검토
3. 필요시 내용 수정
4. `/prd-process` 실행하여 최종 반영

## 파일 형식

```
[NEW] payment-create.md      ← 신규 생성 예정
[UPDATE] auth-google.md      ← 기존 파일 수정 예정
[DELETE] deprecated.md       ← 삭제 예정
[UNCLEAR] 모호한내용.md      ← 명확화 필요
```

---

## 스펙 템플릿

### API 스펙
```yaml
---
type: api
phase: P1 | P2 | P3
category: auth | portfolio | stock | rebalancing | notification | admin | community
method: GET | POST | PUT | DELETE
endpoint: /api/...
auth: required | optional | none | admin
related:
  db: [경로]
  ui: [경로]
---
```

```markdown
# [METHOD] [endpoint]

## 개요
[한 줄 설명]

## 스펙

### Request
- **URL**: [endpoint]
- **Method**: [GET/POST/PUT/DELETE]
- **Auth**: [Bearer Token 필수/불필요]

### Body (해당 시)
```json
{ }
```

## Response

### 성공 (200)
```json
{ }
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|

## 구현 로직
1. 
2. 

## 관련 스펙
- DB: 
- UI: 
```

---

### DB 스펙
```yaml
---
type: db
phase: P1 | P2 | P3
table: 테이블명
related:
  api: [경로]
---
```

```markdown
# [테이블명] 테이블

## 개요
[한 줄 설명]

## 스키마
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|

## 관련 스펙
- API: 
```

---

### UI 스펙
```yaml
---
type: ui
phase: P1 | P2 | P3
screen: 화면명
related:
  api: [경로]
---
```

```markdown
# [화면명] ([영문명])

## 개요
[한 줄 설명]

## 레이아웃
```
[ASCII 다이어그램]
```

## 컴포넌트
| 요소 | 설명 |
|------|------|

## 상호작용
| 액션 | 동작 |
|------|------|

## 관련 스펙
- API: 
```

---

## 검토 체크리스트

- [ ] AI 분석 결과가 맞는지 확인
- [ ] 누락된 내용 없는지 확인
- [ ] 잘못 분류된 항목 수정
- [ ] 확인 완료 후 `/prd-process` 실행

---

**현재 대기 중인 초안: 없음** ✨
