# Changelog

## [v4.0.0] - 2026-01-26

v3에서 v4로의 전면 리팩토링

### 🏗 Architecture

- ES6 모듈 시스템 도입 (`import/export`)
- `screens.json` 설정 파일 기반 화면 관리
- 도메인별 폴더 구조 적용

### ✨ Features

- **Phase 토글** (P1/P2/P3) 컨트롤 패널 추가
- 컨트롤 패널 동적 생성 (screens.json 기반)
- 상태 버튼 화면별 자동 연결

### 📁 Structure Changes

| v3 | v4 |
|----|-----|
| `js/*.js` (전역 함수) | `core/*.js` (ES6 모듈) |
| `js/state.js` (1,100줄) | `screen-controllers/*/` (분리) |
| `screens/*.html` (플랫) | `screens/{domain}/*.html` |
| 없음 | `config/screens.json` |
| 없음 | `docs/FSD_MAPPING.md` |

### 🔄 Migration from v3

| 자원 | 호환성 | 처리 |
|------|--------|------|
| CSS variables/base/components | 90%+ | 복사 |
| HTML screens | 60% | id 변경 필요 |
| JS | 20% | 리팩토링 필수 |

### 📚 Documentation

- `README.md` - 폴더 구조, 실행법, 체크리스트
- `docs/FSD_MAPPING.md` - 실제 개발 구조 매핑
- `.agent/skills/prototype-architect/SKILL.md` - AI 작업 가이드
- `.agent/workflows/proto-*.md` - 워크플로우 정의
