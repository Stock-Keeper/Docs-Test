# Stock Keeper 대원칙

## 커뮤니케이션 규칙

- **한국어**로 대화
- 작업 완료 시 **진행상황 보고 + 다음 작업 안내**
- 불확실하면 **구현 전 질문**
- 중요한 결정 시 **선택지 제시 후 확인**
- 에러 발생 시 **원인 분석 + 해결 방안 제시**

---

## 개발 원칙

1. **Phase 1 범위만** - 필수 기능만 구현, 선택/Phase 2 금지
2. **테스트 우선** - 비즈니스 로직은 테스트 먼저
3. **금융 정확성** - 수량 소수점 4자리, 비율 2자리, 금액 정수

---

## 금지 사항

- 요구사항에 없는 기능 추가
- API Key/Secret 하드코딩
- any 타입 사용
- console.log 커밋
- 테스트 없이 비즈니스 로직 수정

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React Native (Expo), Context API |
| Backend | Spring Boot 3.x, Java 17, JPA |
| Database | MySQL 8.0 (AWS RDS) |
| 인증 | Google OAuth 2.0, JWT |
| 외부 API | 한국투자증권 API |

---

## 문서 참조

| 작업 | 문서 |
|------|------|
| 아키텍처/폴더 구조 | `docs/prompts/architecture.md` |
| 개발 워크플로우 | `docs/prompts/workflow.md` |
| 코딩 스타일 | `docs/prompts/coding-style.md` |
| TDD | `docs/prompts/tdd-guide.md` |
| 세션 논의 기록 | `docs/prompts/session-log.md` |
| PRD | `docs/prd/` |
