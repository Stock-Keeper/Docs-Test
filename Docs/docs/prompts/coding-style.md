# 코딩 스타일

## 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `portfolioList` |
| 컴포넌트/클래스 | PascalCase | `PortfolioCard` |
| 상수 | UPPER_SNAKE | `MAX_COUNT` |

---

## TypeScript

```typescript
// interface 사용
interface Portfolio {
  id: string;
  name: string;
}

// any 금지
const data: any = response; // ❌
```

---

## Java

```java
// Controller: 요청/응답만
@GetMapping("/portfolios")
public ResponseEntity<List<PortfolioDto>> getList() {
    return ResponseEntity.ok(service.getList());
}

// Service: 비즈니스 로직
// Repository: 데이터 접근만
```

---

## 주석

- 한국어 사용
- 비즈니스 로직만 주석 (자명한 코드는 X)

---

## 금지

- any 타입
- console.log 커밋
- 하드코딩된 API Key
- 빈 catch 블록
- 매직 넘버
