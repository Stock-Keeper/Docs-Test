# 기술 문서 작성 요령 (맥도날드 시스템)

**작성일**: 2025-12-16

**출처**: 삼양식품 팀 사례 ([https://www.youtube.com/watch?v=c13ormxFbxU&list=LL&index=1](https://www.youtube.com/watch?v=c13ormxFbxU&list=LL&index=1))

**목적**: AI 에이전트 시대의 효율적 문서화 전략

---

## 1. 핵심 개념: 맥도날드 프랜차이즈 모델

## 1.1 왜 맥도날드인가?

**문제 상황:**

```
초기 (바이브코딩 도입):
✅ 누구나 코딩 가능 (Cursor + MCP)
✅ 모든 정보 리포지토리에
✅ 3명이 빠르게 개발

확장 후 (프로젝트 커짐):
❌ AI 환각(Hallucination) 빈발
❌ Cursor.md 2,000줄 넘어가며 컨텍스트 폭발
❌ "왜 이렇게 만들었지?" 의도 사라짐
❌ 테크리드가 매번 리뷰 (병목)
```

**근본 원인:**

1. **컨텍스트 과부화**: 룰 파일 2,000줄 → 채팅 시작부터 30% 소모
2. **비효율적 학습**: MCP로 매번 최신 문서 로딩하지만 사람은 그렇게 안 일함
3. **의도 휘발**: 코드만 남고 "왜"는 채팅창에만 존재 → 사라짐

---

## 1.2 맥도날드 은유

```
맥도날드 알바 = AI 에이전트 (Cursor, Claude)
├─ 전문 셰프 아니어도 OK
├─ 200줄 매뉴얼만 읽고 즉시 일 시작
└─ 햄버거 못 만들어도 프랜차이즈 가능

지점장 = 바이브 코더 (개발자)
├─ AI 에이전트 관리
├─ "왜"를 기록
└─ 의사결정 및 우선순위

본사 = 테크리드
├─ 매뉴얼 제공
├─ 표준 워크플로우 설계
└─ 전체 시스템 관리
```

**핵심 인사이트:**

> AI는 200줄 매뉴얼로 일하는 알바. 많이 안다고 똑똑해지는 게 아님.
> 

---

## 2. 세 가지 핵심 원칙

## 2.1 원칙 1: 200줄 가이드

**규칙:**

```
✅ AI 에이전트가 200줄 읽고 즉시 일 시작
✅ 200줄 넘으면 가이드 분할 필요
✅ 부족할 경우 Appendix에 참고 링크
✅ 최신 정보 필요 시 웹사이트 URL 명시
```

**나쁜 예:**

```
Cursor.md (2,000줄):
- 모든 컴포넌트 규칙
- 모든 API 패턴
- 모든 상태 관리 로직
- DB 스키마 전체
→ 컨텍스트 폭발, 환각 증가
```

**좋은 예:**

```
/docs/prompts/
├─ ui-component.md (200줄)
├─ api-pattern.md (200줄)
├─ state-management.md (200줄)
└─ appendix/
    ├─ full-docs.md
    └─ external-links.md
```

---

## 2.2 원칙 2: 컨텍스트 휘발

**규칙:**

```
✅ 한 작업 끝나면 AI는 컨텍스트 잊어버림
✅ "리포지토리에 없는 정보 = 휘발되어도 됨"
✅ 채팅창에만 남는 정보는 잘못된 업무

→ 중요한 결정은 무조건 문서화
```

**문제 레이어:**

```
1단계: 200줄 가이드로 해결 (90%)
2단계: Appendix 참고 (9%)
3단계: 사람에게 질문 (1%)
```

**적용:**

- AI와 대화 중 중요한 결정 나오면 즉시 문서화
- "나중에 기록하자" → 절대 안 함
- PR에 "왜" 필수 작성

---

## 2.3 원칙 3: "왜(Why)" 강제 기록

**나쁜 예:**

```
"로그인 버튼 빨간색으로 변경"
```

**좋은 예:**

```
## 변경: 로그인 버튼 빨간색

### 이유
- A/B 테스트 결과 클릭률 15% 향상
- 전환율 우선 (브랜드 가이드 벗어나지만)

### 고려한 대안
1. 주황색 (브랜드 컬러)
   - 대비 부족, 클릭률 5%만 증가
2. 녹색 (일반적 "진행" 색상)
   - 사용자 테스트에서 혼란 보고

### 결정
빨간색 선택. 브랜드팀과 협의 완료.
Phase 2에서 브랜드 컬러 재검토.
```

---

## 3. GitHub /docs 폴더 구조

## 3.1 권장 구조

```
/docs
├─ prompts/
│   ├─ workflow/
│   │   ├─ 01-context.md
│   │   ├─ 02-requirement.md
│   │   ├─ 03-design.md
│   │   ├─ 04-dependency.md
│   │   ├─ 05-implementation.md
│   │   └─ 06-risk.md
│   │
│   ├─ guidelines/
│   │   ├─ ui-component.md (200줄)
│   │   ├─ api-pattern.md (200줄)
│   │   ├─ state-management.md (200줄)
│   │   └─ code-style.md (200줄)
│   │
│   └─ appendix/
│       ├─ tech-stack-full.md
│       └─ external-resources.md
│
├─ architecture/
│   ├─ system-overview.md
│   └─ data-flow.md
│
└─ api/
    └─ api-contracts.md
```

---

## 3.2 200줄 가이드 템플릿

**예시: ui-component.md**

```
# UI 컴포넌트 가이드

> 200줄 이내로 작성. 상세한 내용은 appendix 참조.

## 기술 스택
- React 18 + TypeScript
- CSS Modules (Tailwind 사용 금지)
- Zustand (전역 상태)

## 폴더 구조
src/components/
├─ atoms/ (Button, Input)
├─ molecules/ (FormField, Card)
└─ organisms/ (Navigation, Form)

## 파일 규칙

### 네이밍
- PascalCase: Button.tsx
- 스타일: Button.module.css
- 테스트: Button.test.tsx
```

```tsx
### 타입 정의

interface ButtonProps {
label: string;
onClick: () => void;
variant?: 'primary' | 'secondary';
disabled?: boolean;
}
```

```tsx
### 기본 구조

export const Button: React.FC<ButtonProps> = ({
label,
onClick,
variant = 'primary',
disabled = false
}) => {
return (
<button className={styles[variant]} onClick={onClick} disabled={disabled} >
{label}
</button>
);
};
```

```
## 스타일링
- CSS Modules 필수
- 색상: styles/colors.css 변수 사용
- 반응형: breakpoints 상수 사용

## 상태 관리
- 로컬 상태: useState
- 전역 상태: Zustand stores (src/stores/)
- Props drilling 3단계 이상 시 Zustand 고려

## API 호출
- src/api/ 함수만 사용
- 컴포넌트 내 fetch 금지
- 에러 핸들링: ErrorBoundary 활용

## 금지 사항
❌ any 타입
❌ 인라인 스타일
❌ 컴포넌트 내 직접 fetch
❌ console.log 커밋

## 참고
- 상세 패턴: appendix/react-patterns.md
- 공식 문서: https://react.dev
- Zustand: https://zustand-demo.pmnd.rs
```

---

## 3.3 .cursorrules 파일

**프로젝트 루트에 위치 (200줄 이내):**

```
# 프로젝트 룰

## 기술 스택
Frontend: React 18, TypeScript, Vite
Styling: CSS Modules
State: Zustand
Backend: (추후 추가)

## 폴더 구조
src/
├─ components/ (Atomic Design)
├─ api/ (API 호출)
├─ stores/ (Zustand)
├─ utils/ (유틸리티)
└─ styles/ (전역 스타일)

## 코딩 규칙
1. TypeScript strict 모드
2. 함수형 컴포넌트만
3. Props는 interface로 타입 정의
4. API 호출은 src/api/ 함수만
5. 상태는 로컬 우선, 필요시 Zustand

## 컴포넌트 작성
- PascalCase 파일명
- 타입 먼저 정의
- Props 구조분해 할당
- CSS Module로 스타일링

## 절대 금지
- any 타입
- 인라인 스타일
- 컴포넌트 내 fetch
- console.log 커밋

## 참고 문서
상세 가이드: /docs/prompts/guidelines/
- ui-component.md
- api-pattern.md
- state-management.md
```

---

## 4. Notion: "왜(Why)" 중심 문서

## 4.1 Notion 문서 종류

```
Notion (지식 저장):
├─ PRD/ (제품 요구사항 문서)
├─ 회의록/ (Discord 회의 기록)
├─ 결정 로그/ (ADR: Architecture Decision Record)
└─ 회고/ (주간/월간 회고)
```

---

## 4.2 PRD 템플릿 (6단계 워크플로우)

```
# Feature: [기능명]

생성일: 2025-01-16
담당: 김종현
우선순위: Must Have
Linear 이슈: PROJ-42

---

## 1. Context (현재 상황)
- 현재: 로그인 기능 없음
- 문제: 사용자 데이터 저장 불가
- 경쟁사: 모두 로그인 제공

## 2. Requirement (요구사항)

### Must Have
- [ ] 이메일/비밀번호 로그인
- [ ] 회원가입
- [ ] 로그아웃

### Should Have
- [ ] 소셜 로그인 (Google)
- [ ] 비밀번호 재설정

### Nice to Have
- [ ] 프로필 사진
- [ ] 닉네임 중복 체크

## 3. Design (설계)

### UI 플로우
1. 로그인 버튼 클릭
2. 이메일/비밀번호 입력
3. "로그인" 클릭
4. 대시보드로 이동

### UI 참고
[Figma 링크 또는 스크린샷]

## 4. Dependency (의존성)

### 새로 필요
- DB: users 테이블
- API: POST /api/auth/login
- API: POST /api/auth/signup
- Library: bcrypt

### 기존 재사용
- 없음 (신규 기능)

## 5. Implementation Plan

### Phase 1: Backend (김승호, 2일)
- users 테이블 생성
- 로그인/회원가입 API
- JWT 토큰 발급

### Phase 2: Frontend (김종현, 2일)
- 로그인 폼 컴포넌트
- 회원가입 폼
- 토큰 저장 (httpOnly cookie)

### Phase 3: Integration (김세현, 1일)
- API 연결
- 에러 핸들링
- E2E 테스트

## 6. Risk (리스크)

### 예상 문제
- 비밀번호 보안
- 토큰 관리 복잡도

### 대응 방안
- bcrypt 10 rounds 해싱
- JWT 사용 (7일 만료)
- httpOnly 쿠키 저장

---

## 결정 사항

### JWT vs Session
**선택: JWT**
- 이유: 서버 부담 적음, 확장성 좋음
- 대안: Session (서버 상태 관리 복잡)
- 추후: Refresh Token Phase 2 추가

### 소셜 로그인
**선택: Should Have (Phase 2)**
- 이유: MVP 필수 아님, 구현 2일 추가
- 우선순위: Google 먼저, 나머지는 수요 보고

---

**관련 Linear 이슈:**
- PROJ-42: 로그인 UI
- PROJ-43: 로그인 API
- PROJ-44: 통합 테스트
```

---

## 4.3 결정 로그 (ADR) 템플릿

```
# ADR-001: 상태 관리 라이브러리 선택

날짜: 2025-01-16
작성자: 김세현
상태: 승인됨

## 상황
전역 상태 관리 필요. 사용자 정보를 여러 컴포넌트에서 접근.

## 고려 옵션

### 옵션 1: Context API
**장점:**
- 내장 기능, 추가 라이브러리 불필요
- 간단한 사용법

**단점:**
- 리렌더링 성능 이슈
- 복잡한 상태에 부적합

### 옵션 2: Redux Toolkit
**장점:**
- 강력한 DevTools
- 대규모 팀 표준
- 풍부한 생태계

**단점:**
- 보일러플레이트 많음
- 학습 곡선 높음
- 3명 팀에 과함

### 옵션 3: Zustand
**장점:**
- 간단한 API (20줄로 store 생성)
- 보일러플레이트 최소
- 성능 우수
- AI가 이해하기 쉬움

**단점:**
- Redux보다 생태계 작음
- 대규모 프로젝트엔 부족할 수 있음

## 결정
**Zustand 사용**

## 이유
1. 3명 소규모 팀 → 간단한 API 필요
2. 바이브코딩 스타일 → AI가 쉽게 이해
3. 학습 시간: 1시간 (vs Redux 1일)
4. 충분한 성능

## 결과
- 코드 줄 수 50% 감소
- 팀원 학습 1시간 만에 완료
- AI 에이전트도 쉽게 사용

## 재검토 시점
- 팀 규모 10명 넘을 때
- 복잡한 상태 로직 필요 시
- 타임 트래블 디버깅 필요 시
```

---

## 5. 실전 적용 가이드

## 5.1 첫 2주 작업

**Week 1: 프롬프트 폴더 생성**

```
1. GitHub /docs/prompts 폴더 생성
2. .cursorrules 파일 작성 (200줄)
3. 첫 가이드 작성: ui-component.md
4. Cursor에서 테스트
```

**Week 2: PRD 작성 연습**

```
1. 첫 기능으로 PRD 작성
2. 6단계 워크플로우 적용
3. Notion에 저장
4. 팀 피드백
```

---

## 5.2 작성 체크리스트

**200줄 가이드 작성 시:**

- [ ]  200줄 이내인가?
- [ ]  핵심 규칙만 포함했는가?
- [ ]  예시 코드 있는가?
- [ ]  상세 내용은 appendix로 빼는가?
- [ ]  외부 링크 명시했는가?

**PRD 작성 시:**

- [ ]  6단계 모두 작성했는가?
- [ ]  "왜"가 명확한가?
- [ ]  Must/Should/Nice 구분했는가?
- [ ]  다른 옵션도 고려했는가?
- [ ]  리스크 분석했는가?

**결정 로그 작성 시:**

- [ ]  여러 옵션 비교했는가?
- [ ]  선택 이유 명확한가?
- [ ]  재검토 시점 명시했는가?

---

## 5.3 회의 → PRD 자동화

**워크플로우:**

```
1. Discord/Zoom 회의 (녹음 ON)
2. 회의 후 녹음 파일을 Claude에게
3. 프롬프트:
   "이 회의 녹음을 6단계 PRD 템플릿으로 작성해줘"
4. 결과를 Notion에 붙여넣기
5. 팀원 검토 및 수정
6. Linear 이슈 생성
```

---

## 6. 핵심 인사이트

## 6.1 컨텍스트는 적을수록 좋다

```
❌ 나쁜 접근:
- Cursor.md 2,000줄
- MCP로 전체 문서 로딩
→ 컨텍스트 폭발, 환각 증가

✅ 좋은 접근:
- 200줄 가이드 5개로 분할
- 필요한 것만 참조
→ 정확도 UP, 속도 UP
```

---

## 6.2 "왜"가 없으면 레거시가 된다

```
3개월 후:
"이 코드 왜 이렇게 짰지?"
"Cursor가 만든 건가 내가 만든 건가?"
"이 API 왜 두 개야?"

→ PRD + ADR에 "왜" 기록하면 해결
```

---

## 6.3 AI는 알바, 사람은 지점장

```
AI(알바)가 잘하는 것:
✅ 반복 작업
✅ 정해진 룰 따르기
✅ 빠른 실행

사람(지점장)이 잘하는 것:
✅ 의사결정 ("왜?")
✅ 예외 상황 판단
✅ 우선순위 설정

→ 역할 분담 명확히!
```

---

## 7. 다음 단계

**즉시 작업:**

- [ ]  GitHub /docs/prompts 폴더 생성
- [ ]  .cursorrules 파일 작성
- [ ]  첫 200줄 가이드 주제 선정

**2주 내:**

- [ ]  200줄 가이드 3개 완성
- [ ]  PRD 템플릿으로 첫 기능 작성
- [ ]  결정 로그 1개 작성 연습

**한 달 내:**

- [ ]  모든 주요 영역 가이드 완성
- [ ]  PRD 2-3개 작성하며 템플릿 개선
- [ ]  팀원 피드백 반영