# 개발 워크플로우

## 코드 수정 후

### Frontend

```bash
npm run lint:fix
npm run type-check
npm run build
```

### Backend

```bash
./gradlew test
./gradlew build
```

---

## 커밋 메시지

`타입: 한국어 설명`

| 타입 | 용도 |
|------|------|
| feat | 새 기능 |
| fix | 버그 수정 |
| docs | 문서 |
| refactor | 리팩터링 |
| test | 테스트 |

예: `feat: 포트폴리오 생성 기능 추가`

---

## 새 기능 개발

1. PRD 확인 (`docs/prd/`)
2. 테스트 먼저 (비즈니스 로직)
3. 구현
4. 빌드/테스트 통과 후 커밋
