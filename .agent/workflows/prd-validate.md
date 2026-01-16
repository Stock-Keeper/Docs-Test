---
description: PRD 스펙 전체를 점검하여 중복, 누락, 불일치 검출
---

// turbo-all

# /prd-validate 워크플로우

PRD `specs/` 디렉토리 전체를 스캔하여 일관성, 중복, 누락을 점검합니다.

## 실행 방법
```
/prd-validate
```

## 워크플로우 단계

### 1. 스펙 전체 스캔
```
- specs/api/, specs/db/, specs/ui/ 모든 파일 수집
- 각 파일의 프론트매터 파싱 (type, phase, related, table 등)
- INDEX.md의 spec_count와 실제 파일 수 비교
```

### 2. 중복 검출

#### 2-A. 테이블명 중복
```
- 모든 DB 스펙의 table 필드 추출
- 동일/유사 테이블명 식별
- 예: token_vault vs refresh_tokens, device_tokens vs fcm_tokens
```

#### 2-B. 기능 중복
```
- API 엔드포인트 패턴 비교
- 유사 CRUD 패턴 식별
- 예: /users/{id} vs /auth/profile 중복 가능성
```

### 3. 누락 검출

#### 3-A. DB → API 누락
```
각 DB 스펙에 대해:
1. related.api 필드 확인
2. API가 없으면 "API 누락" 보고
3. 내부용 테이블(logs, tokens 등)은 제외 가능
```

#### 3-B. API → UI 누락
```
각 API 스펙에 대해:
1. related.ui 필드 확인  
2. UI가 없으면 "UI 누락" 보고 (내부 API 제외)
```

#### 3-C. FK 참조 누락
```
DB 스펙 내 FK 관계가 related.db에 반영되었는지 확인
```

### 4. 참조 무결성 검사

#### 4-A. Dead Link 검출
```
모든 스펙의 related 필드 순회:
- 경로가 실제 파일로 존재하는지 확인
- 존재하지 않으면 "Dead Link" 보고
```

#### 4-B. 양방향 참조 검증
```
A → B 참조가 있으면 B → A도 있어야 함
- 단방향만 있으면 "Missing Backlink" 보고
```

### 5. 일관성 검사

#### 5-A. Phase 일관성
```
- P1 테이블을 P2/P3 API가 사용하면 경고
- P1 API를 P2/P3 UI가 사용하면 경고
```

#### 5-B. 네이밍 규칙
```
- 파일명: kebab-case (user-consents.md) ✓
- 테이블명: snake_case (user_consents) ✓
- 불일치 시 경고
```

#### 5-C. 프론트매터 검증
```
필수 필드 체크:
- DB: type, phase, table, related
- API: type, phase, endpoint, method, related
- UI: type, phase, screen, related

누락 시 "Missing Field" 보고
```

### 6. Tasks 검증

> tasks/ 디렉토리의 파일들이 specs/와 정합성을 유지하는지 검사

#### 6-A. 프론트매터 필수 필드
```
Task 파일의 필수 필드:
- type: task
- phase: P1 | P2 | P3
- domain: auth | portfolio | accounts | stock | notification | admin | community
- status: not-started | in-progress | completed
- specs: api, db, ui 배열
- tech: backend, frontend (선택: admin, app)

누락 시 "Missing Task Field" 보고
```

#### 6-B. Phase ↔ 폴더 일치
```
각 task 파일에 대해:
1. 프론트매터의 phase 값 추출
2. 파일이 위치한 폴더 확인
3. 불일치 시 "Phase Mismatch" 보고

예: phase: P1 이지만 tasks/P2/에 있으면 오류
```

#### 6-C. Specs 참조 유효성
```
각 task 파일의 specs 필드 순회:
1. specs.api의 각 항목 → specs/api/{항목} 존재 확인
2. specs.db의 각 항목 → specs/db/{항목} 존재 확인
3. specs.ui의 각 항목 → specs/ui/{항목} 존재 확인

존재하지 않으면 "Invalid Spec Reference" 보고
```

#### 6-D. Domain 일관성
```
동일 domain을 가진 task 파일들 그룹화:
1. 같은 domain 내에서 specs 중복 참조 검출
2. 하나의 spec이 여러 task에서 참조되면 경고
   (의도적인 경우가 아니면 task 분리/통합 필요)
```

#### 6-E. 고아 Spec 검출
```
specs/ 디렉토리의 모든 파일 중:
1. 어떤 task 파일에서도 참조되지 않는 스펙 식별
2. 내부용 테이블(logs, tokens 등)은 제외
3. "Orphan Spec" 보고 (task 할당 필요)
```

### 7. 결과 보고

```markdown
# 📋 PRD 점검 결과

## 요약
| 항목 | 수량 |
|------|------|
| 총 스펙 파일 | 76개 |
| 문제 발견 | 8건 |

## ⚠️ 잠재적 중복 (3건)

| 파일 A | 파일 B | 유형 | 권장 조치 |
|--------|--------|------|----------|
| token-vault.md | refresh-tokens.md | 테이블 중복 | 통합 검토 |
| device-tokens.md | notification-settings.md | 기능 중복 | 하나 삭제 |

## ❌ API 누락 (5건)

| DB 스펙 | 테이블 | 필요한 API |
|---------|--------|-----------|
| accounts.md | accounts | CRUD |
| announcements.md | announcements | 조회 |

## 🔗 Dead Link (0건)
✅ 모든 related 경로 유효

## ⚡ Phase 불일치 (0건)
✅ Phase 일관성 유지됨

## 📝 프론트매터 누락 (0건)
✅ 모든 필수 필드 존재

## 📂 Tasks 검증

### Phase 불일치 (0건)
✅ 모든 task 파일이 올바른 폴더에 위치

### 잘못된 스펙 참조 (0건)
✅ 모든 specs 참조가 유효함

### 고아 스펙 (2건)
| 스펙 파일 | 추천 |
|-----------|------|
| audit-logs.md | 로그 테이블 (task 불필요) |
| user-activities.md | 로그 테이블 (task 불필요) |
```

### 8. 검증 결과 파일 생성 (_inbox/)

> **목적**: 검증 결과를 항상 _inbox/에 생성하여 사용자가 확인하고 필요한 조치를 결정

#### 생성 규칙
```
/prd-validate 실행 시 항상 _inbox/ 파일 생성:
- 문제가 없어도 "✅ 모든 검증 통과" 형태로 생성
- 문제가 있으면 사용자 결정 필요 항목 + AI 자동 수정 가능 항목 모두 포함

AI 자동 수정 가능 항목도 포함하는 이유:
- 사용자가 전체 현황을 한눈에 파악 가능
- 자동 수정 전 검토 기회 제공
- 기록 보관 목적
```

#### 파일명 형식
```
_inbox/[VALIDATE] YYYY-MM-DD.md
```

#### 파일 구조
```markdown
# PRD 검증 결과

> 검증 일시: YYYY-MM-DD HH:MM
> 발견된 문제: N건 (사용자 결정 필요: X건, AI 자동 수정 가능: Y건)

---

## 🔴 중복 해결

### 1. device-tokens ↔ fcm_tokens
푸시 토큰 저장 테이블이 2개 존재합니다.

- [ ] `device-tokens.md` 유지 (fcm_tokens 삭제)
- [ ] `fcm_tokens` 유지 (device-tokens.md 삭제)

---

## 🟡 API 생성에 필요한 정보

### 1. accounts (계좌 연동)

**지원할 증권사:**
- [ ] 한국투자증권
- [ ] 삼성증권
- [ ] 키움증권
- [ ] 기타: ________________

**연동 방식:**
- [ ] OAuth
- [ ] Open API
- [ ] 스크래핑 (MTS 연동)

**필요한 기능:**
- [ ] 계좌 목록 조회
- [ ] 계좌 연결/해제
- [ ] 잔고 조회
- [ ] 거래 내역 조회

---

### 2. announcements (공지사항)

**접근 권한:**
- [ ] 누구나 조회 가능
- [ ] 로그인 사용자만

**기능:**
- [ ] 목록 조회
- [ ] 상세 조회
- [ ] 팝업 공지 자동 표시

---

## ✅ AI가 자동 처리할 항목 (참고용)

- Dead Link 수정: 0건
- 프론트매터 보완: 0건
- Phase 조정: 0건
```

#### 생성 후 안내
```
📝 _inbox/[VALIDATE] 2026-01-16.md 생성됨

검증 결과:
- 총 스펙 파일: 86개
- 발견된 문제: 10건 (사용자 결정 필요: 3건, AI 자동 수정 가능: 7건)

파일을 열어 확인 후 필요한 조치를 진행하세요.
- 사용자 결정 항목: 체크박스 선택 후 /prd-prepare 실행
- AI 자동 수정: "자동 수정 진행해줘" 요청

(문제가 없을 경우에도 "✅ 모든 검증 통과" 메시지와 함께 파일 생성)
```

## 점검 제외 대상

| 유형 | 제외 이유 |
|------|----------|
| *-logs.md | 내부 로깅용, API 불필요 |
| token-*.md | 보안 테이블, 직접 API 불필요 |
| README.md | 문서 파일 |
| INDEX.md | 인덱스 파일 |

## 사용 예시

### 문제가 발견된 경우
```
/prd-validate

📋 PRD 점검 결과
- 총 스펙 파일: 86개
- 발견된 문제: 10건

📝 _inbox/[VALIDATE] 2026-01-16.md 생성됨
   파일을 열어 확인 후 필요한 조치를 진행하세요.
```

### 문제가 없는 경우
```
/prd-validate

📋 PRD 점검 결과
- 총 스펙 파일: 86개
- 발견된 문제: 0건 ✅

📝 _inbox/[VALIDATE] 2026-01-16.md 생성됨
   모든 검증을 통과했습니다!
```

## 주의사항

- 이 워크플로우는 **읽기 전용**으로 스펙 파일을 수정하지 않음
- **항상 _inbox/에 결과 파일 생성** (문제 유무와 관계없이)
- 주기적으로 실행하여 PRD 품질 유지 권장

