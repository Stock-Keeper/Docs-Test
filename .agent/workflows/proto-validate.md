---
description: PRD 스펙과 프로토타입 구현 일치 검증
---

# 프로토타입 검증

## 사용법

```
/proto-validate [domain]
```

예시:

- `/proto-validate` - 전체 검증
- `/proto-validate portfolio` - 특정 도메인만

## 검증 항목

1. **누락 검출**
   - PRD에 있는데 구현 안 된 화면
   - screens.json에 없는 화면

2. **불일치 검출**
   - 스펙의 컴포넌트 vs 구현된 요소
   - 상태(empty/loading/error) 누락

3. **링크 검증**
   - screens.json의 prd 경로 유효성
   - controller/css 파일 존재 확인

## 출력

검증 결과를 테이블로 출력:

- ✅ 일치
- ⚠️ 부분 누락
- ❌ 미구현

## 참고

- 스킬: `.agent/skills/prototype-architect/SKILL.md`
