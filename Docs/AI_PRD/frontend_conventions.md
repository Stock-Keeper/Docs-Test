# Frontend UI Structure & Conventions

본 문서는 `prototype_v4` 개발 시 PRD의 도메인 구분을 준수하면서도, 유지보수성을 위해 예외적으로 허용하는 **컴포넌트 분리 규칙**을 정의합니다.
AI 에이전트(Claude Opus 등)는 코드 분석 시 이 문서를 참조하여 파일 구조를 이해해야 합니다.

## 1. 기본 원칙 (Domain-Driven)

모든 UI 리소스는 PRD의 `specs/ui/{domain}/` 구조와 1:1로 매핑되는 것을 원칙으로 합니다.

- **HTML**: `screens/{domain}/{feature}.html`
- **CSS**: `css/screens/{domain}/{feature}.css`
- **JS**: `screen-controllers/{domain}/{feature}.js`

## 2. 컴포넌트 분리 규칙 (Component Extraction)

다음 조건 중 하나 이상을 만족하는 경우, 도메인 폴더에서 벗어나 `css/components/` 또는 `js/components/`로 분리하는 것을 허용합니다.

1. **재사용성 (Reusability)**: 2개 이상의 서로 다른 도메인 화면에서 동일한 UI 요소가 사용되는 경우.
2. **비대화 방지 (Complexity Control)**: 단일 CSS/JS 파일이 300라인을 초과하거나, 특정 UI 요소의 독립적인 스타일 정의가 100라인 이상인 경우.

## 3. 분리된 컴포넌트 현황 (Registry)

현재 리팩토링되어 분리된 컴포넌트 목록입니다.

| 컴포넌트명 | 파일 경로 | 원래 소속 | 분리 사유 |
| :--- | :--- | :--- | :--- |
| **Modal (Bottom Sheet)** | `css/modal.css` | `portfolio/list` | 전역 사용 (Auth, Portfolio, Settings) 및 코드 중복 방지 |
| **Stock Card** | `css/components/stock-card.css` | `portfolio/detail` | Detail, List, Search 등 다수 화면 사용 및 스타일 복잡도 높음 |
| **Summary Grid** | `css/components/summary-card.css` | `portfolio/detail` | List, Detail 화면 간 유사 스타일 공유 |

> [!NOTE]
> 위 컴포넌트들은 특정 도메인의 PRD 스펙에 포함되어 있더라도, 구현 레벨에서는 공통 리소스로 취급합니다.

## 4. 개발 및 테스트 도구 (Developer Tools)

효율적인 UI 검증을 위해 화면 상태를 강제로 제어하는 **Control Panel**을 운용합니다.

- **위치**: 화면 우측 플로팅 패널
- **기능**:
  - **Phase Toggle**: P1, P2, P3 단계별 기능 노출 제어
  - **Theme Toggle**: 다크/라이트 모드 즉시 전환
  - **State Control**: 각 화면(Screen)의 `default`, `loading`, `empty`, `error` 상태 강제 전환
- **구현 규칙**:
  - 모든 Controller는 `window.addEventListener('app-state-change', ...)`를 구현하여 상태 변경에 대응해야 합니다.
  - 더미 데이터는 `default` 상태에서 렌더링하며, `init()` 시점에 로드합니다.
