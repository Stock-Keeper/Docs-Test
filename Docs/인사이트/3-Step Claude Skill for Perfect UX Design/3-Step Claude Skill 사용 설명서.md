# 3-Step Claude Skill 사용 설명서

이 문서는 아래 4개 파일을 하나의 실무 워크플로우로 묶어, 아이디어 단계에서 UI 생성용 프롬프트까지 만드는 방법을 설명합니다.

- `Lite PRD Generator.md`
- `PRD Clarifier.md`
- `PRD To UX Spec.md`
- `UX Spec To Prompt.md`

---

## 1) 이 4개 파일의 역할 요약

1. `Lite PRD Generator.md`
아이디어를 **데모 제작 가능한 PRD(1~7 섹션)**로 빠르게 구조화합니다.

2. `PRD Clarifier.md`
생성된 PRD의 빈틈을 질문으로 메워, **모호성/누락/충돌**을 줄입니다.

3. `PRD To UX Spec.md`
PRD를 6개 UX 패스(멘탈모델~플로우 무결성)로 변환해 **UX 기반 사양서**를 만듭니다.

4. `UX Spec To Prompt.md`
UX 사양서를 의존성 순서로 쪼개 **UI 생성 도구(v0, Bolt, Claude 등)용 빌드 프롬프트 세트**로 변환합니다.

핵심은 “문서 품질을 단계적으로 고정”하는 것입니다.

---

## 2) 권장 사용 순서 (중요)

아래 순서를 그대로 따르는 것을 권장합니다.

1. 아이디어 입력 -> `Lite PRD Generator`
2. 생성된 PRD -> `PRD Clarifier`
3. 정제된 PRD -> `PRD To UX Spec`
4. UX Spec -> `UX Spec To Prompt`

### 왜 이 순서가 좋은가

- 바로 화면부터 만들면 요구사항 누락이 많아집니다.
- Clarifier를 먼저 거치면 뒤 단계(UX/프롬프트) 재작업이 크게 줄어듭니다.
- UX 6패스를 먼저 통과하면 “예쁜데 쓰기 어려운 UI”를 예방할 수 있습니다.

---

## 3) 단계별 상세 사용법

## Step 1. Lite PRD Generator

### 목적

러프한 아이디어를 “빌더가 바로 데모를 만들 수 있는 수준”의 PRD로 만듭니다.

### 입력으로 준비하면 좋은 것

- 해결하려는 문제 1개
- 핵심 사용자 역할 1개
- 데모에서 반드시 보여줘야 할 핵심 흐름 1개
- 데이터 출처(사용자 입력/API/Mock) 초안

### 출력 구조(고정)

반드시 아래 1~7 섹션으로 출력됩니다.

1. One-Sentence Problem
2. Demo Goal
3. Target User
4. Core Use Case (Happy Path)
5. Functional Decisions
6. UX Decisions
7. Data & Logic

### 이 단계에서 품질 체크

- 문제 문장이 한 문장으로 명확한가
- 기능 목록이 “필수 기능”만 있는가 (nice-to-have 제거)
- UX 상태(로딩/성공/실패/부분결과)가 정의됐는가
- 데이터 흐름이 “입력 -> 처리 -> 출력”으로 설명되는가

### 실무 팁

- 아이디어가 매우 모호하면 질문 1개만 받고 진행하도록 되어 있으므로, 초기에 완벽하려고 오래 멈추지 않는 것이 좋습니다.
- 기술스택/아키텍처/가격정책 같은 항목은 여기서 의도적으로 제외합니다.

---

## Step 2. PRD Clarifier

### 목적

Step 1 PRD의 모호함을 질문 기반으로 제거해, 실행 가능한 요구사항으로 정제합니다.

### 실행 시 반드시 지켜야 하는 동작

`PRD Clarifier.md` 기준으로 아래가 핵심입니다.

1. 소스 PRD와 **같은 폴더**에 세션 추적 파일 생성
2. 질문 깊이 선택
- Quick: 5문항
- Medium: 10문항
- Long: 20문항
- Ultralong: 35문항
3. 매 질문/응답마다 추적 파일 업데이트

### 생성 파일 규칙

- 예: `feature-auth.md` -> `feature-auth-clarification-session.md`

### 질문 품질 기준

- PRD의 특정 문장을 근거로 질문
- 한 번에 한 가지 질문
- 답이 바로 요구사항 수정에 연결되어야 함
- 이전 답변과 충돌하면 즉시 재확인

### 이 단계에서 품질 체크

- 핵심 경로 요구사항에 애매한 동사가 남아있는가
- 외부 연동/예외처리/경계조건이 명시됐는가
- 성공 기준(acceptance)이 요구사항별로 말로 설명 가능한가

### 실무 팁

- 데모성 프로젝트는 보통 `Medium(10)`이 비용 대비 효율이 좋습니다.
- 복잡한 워크플로우/정책 엔진/외부 API 다수 연동이면 `Long` 이상을 권장합니다.

---

## Step 3. PRD To UX Spec

### 목적

PRD를 바로 화면으로 건너뛰지 않고, UX 기반 문서로 변환합니다.

### 가장 중요한 원칙

**6개 패스를 끝내기 전에는 비주얼 스펙(색/폰트/레이아웃)으로 넘어가지 않습니다.**

### 6개 패스(순서 고정)

1. Mental Model
2. Information Architecture
3. Affordances
4. Cognitive Load
5. State Design
6. Flow Integrity

### 출력 파일 규칙 (같은 폴더)

- `feature-x.md` -> `feature-x-ux-spec.md`
- `PRD.md` 같은 일반 이름이면 `UX-spec.md`

### 이 단계에서 품질 체크

- 사용자 오해 가능성이 문서에 명시됐는가 (Pass 1)
- 사용자에게 보이는 모든 개념이 분류됐는가 (Pass 2)
- “무엇이 클릭/편집/읽기전용인지” 신호가 정의됐는가 (Pass 3)
- 사용자가 멈추는 지점과 단순화 전략이 있는가 (Pass 4)
- Empty/Loading/Success/Partial/Error 상태표가 있는가 (Pass 5)
- 초보 사용자가 실패할 경로와 완충 장치가 있는가 (Pass 6)

### 실무 팁

- 이 문서는 “디자인 시안”이 아니라 “디자인의 의사결정 근거” 문서입니다.
- IA와 상태 설계를 대충 하면 다음 단계 프롬프트 품질이 급격히 떨어집니다.

---

## Step 4. UX Spec To Prompt

### 목적

UX 사양서를 UI 생성 도구에서 바로 사용할 수 있는 **순차 빌드 프롬프트 묶음**으로 바꿉니다.

### 빌드 순서(권장)

1. Foundation
2. Layout Shell
3. Core Components
4. Interactions
5. States & Feedback
6. Polish

### 프롬프트 작성 핵심 규칙

- 각 프롬프트는 독립 실행 가능해야 함
- 이전 프롬프트 참조 금지 (“앞에서 정의한...” 금지)
- 해당 기능의 상태/상호작용/치수를 모두 포함
- 범위를 명확히 제한(이번 프롬프트에서 안 하는 것 명시)

### 산출물 형태

- 빌드 시퀀스 목록
- Prompt 1..N 본문 (각각 Context/Requirements/States/Interactions/Constraints 포함)

### 이 단계에서 품질 체크

- UX Spec의 수치/상태/인터랙션이 누락 없이 반영됐는가
- 의존성 순서가 맞는가 (기초 -> 구성요소 -> 상호작용 -> 상태)
- 하나의 프롬프트가 과도하게 크지 않은가

---

## 4) 권장 파일 구조 예시

동일 폴더 내에서 아래처럼 관리하면 추적이 쉽습니다.

- `my-feature-prd.md`
- `my-feature-prd-clarification-session.md`
- `my-feature-prd-ux-spec.md`
- `my-feature-build-prompts.md`

원본 문서 4개(`Lite PRD Generator.md` 등)는 템플릿/스킬 정의로 유지하고, 실제 산출물은 별도 파일로 쌓는 방식을 권장합니다.

---

## 5) 실제 운영 시 추천 루틴

1. 아이디어 5~10줄로 Step 1 실행
2. Step 2에서 `Medium(10)` 기본 선택 후 모호성 제거
3. Clarifier 결과를 PRD에 반영(수정본 확정)
4. 확정 PRD로 Step 3 실행해 UX Spec 생성
5. UX Spec로 Step 4 실행해 Prompt 세트 생성
6. UI 생성 도구에서 Prompt 1부터 순서대로 실행
7. 구현 결과를 다시 PRD/UX Spec과 대조해 편차 수정

---

## 6) 자주 발생하는 실패 패턴과 예방

- 실패: PRD 확인 없이 바로 UI 생성
- 예방: 최소 Step 1 + Step 2 완료 후 진행

- 실패: UX 6패스 중 일부 생략
- 예방: Pass 1~6 헤더가 모두 채워졌는지 확인

- 실패: 프롬프트 간 “이전 내용 참고” 의존
- 예방: 각 프롬프트를 독립 문서처럼 작성

- 실패: 상태 설계 누락
- 예방: 주요 컴포넌트/화면마다 5상태(Empty/Loading/Success/Partial/Error) 확인

- 실패: 프롬프트 범위 과대
- 예방: 원자 단위(컴포넌트/뷰/인터랙션)로 분해

---

## 7) 최소 실행 템플릿

아래 형태로 요청하면 각 단계 시작이 빠릅니다.

### Step 1 시작 템플릿

```md
아이디어:
- 문제:
- 대상 사용자(역할):
- 데모에서 반드시 보여줄 흐름:
- 입력 데이터/출력 결과:

`Lite PRD Generator` 형식으로 1~7 섹션 PRD를 만들어줘.
```

### Step 2 시작 템플릿

```md
다음 PRD 파일을 기준으로 `PRD Clarifier`를 시작해줘.
질문 깊이는 Medium(10)으로 진행하고, 세션 추적 파일을 같은 폴더에 생성해줘.
```

### Step 3 시작 템플릿

```md
정제된 PRD를 `PRD To UX Spec` 규칙으로 변환해줘.
6개 패스를 순서대로 완료하고, 결과를 같은 폴더 `*-ux-spec.md`로 저장해줘.
```

### Step 4 시작 템플릿

```md
UX Spec을 `UX Spec To Prompt` 규칙으로 변환해줘.
Build order 기준으로 self-contained prompt 묶음을 만들어줘.
```

---

## 8) 결론

이 4개 파일은 “아이디어 -> PRD -> 정제 -> UX 기반화 -> 구현 프롬프트화”의 연속 체인을 구성합니다.
가장 중요한 운영 원칙은 아래 3가지입니다.

1. 순서를 지킨다 (특히 Clarifier/UX 6패스 생략 금지)
2. 모든 중간 산출물을 파일로 남긴다
3. 다음 단계로 넘기기 전에 체크리스트로 품질을 고정한다

