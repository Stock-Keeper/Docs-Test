# 아키텍처 가이드

## 폴더 구조

### Frontend (React Native)

```
src/
├── components/       # UI 컴포넌트
│   ├── common/       # 공통 (Button, Input)
│   └── screens/      # 화면별
├── screens/          # 화면
├── navigation/       # 네비게이션
├── services/         # API 호출
├── stores/           # 상태 관리
├── utils/            # 유틸리티
└── types/            # 타입 정의
```

### Backend (Spring Boot)

```
src/main/java/
├── controller/       # API 엔드포인트
├── service/          # 비즈니스 로직
├── repository/       # 데이터 접근
├── entity/           # JPA 엔티티
├── dto/              # DTO
├── config/           # 설정
└── util/             # 유틸리티
```

---

## 의존성 규칙

```
screens → components → common
screens → services
screens → stores
```

상위 → 하위만 허용, 순환 참조 금지
