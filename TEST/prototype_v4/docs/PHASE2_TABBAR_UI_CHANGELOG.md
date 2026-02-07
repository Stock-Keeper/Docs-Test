# Phase2 Tab Bar UI 변경 정리

- 작성일: 2026-02-07
- 대상: `TEST/prototype_v4`
- 목적: P2/P3에서 하단 탭바 도입에 따른 UI 겹침 해소 및 Phase별 UI 일관성 확보

## 1. 요약

- P1: 기존 화면 구조 유지(탭바 숨김)
- P2/P3: 탭바 노출 시 하단 고정 요소(FAB, 하단 액션바, 스크롤 영역)가 탭바와 겹치지 않도록 보정
- 포트폴리오 리스트 헤더의 설정 버튼(톱니)은 P2/P3에서 숨김 처리

## 2. 변경 파일

### `TEST/prototype_v4/css/screens/community/feed.css`

- `.content-container` 하단 패딩을 탭바 높이 반영으로 변경
  - `padding-bottom: calc(var(--tab-bar-height, 0px) + 80px);`
- 커뮤니티 FAB 하단 위치를 탭바 높이 반영으로 변경
  - `bottom: calc(var(--tab-bar-height, 0px) + 2rem);`
- FAB z-index 조정
  - `z-index: 90;` (탭바/모달 레이어 체계와 정렬)

### `TEST/prototype_v4/css/screens/portfolio/detail.css`

- 하단 고정 액션바 `.detail-actions`를 탭바 높이만큼 위로 이동
  - `bottom: var(--tab-bar-height, 0px);`
- 본문 스크롤 영역 하단 여백 보강
  - `.stocks-section { padding: 24px 24px calc(120px + var(--tab-bar-height, 0px)); }`

### `TEST/prototype_v4/css/screens/portfolio/list.css`

- P2/P3에서 헤더 설정 버튼 숨김
  - `body[data-current-phase="P2"] #screen-portfolio-list #settings-btn { display: none; }`
  - `body[data-current-phase="P3"] #screen-portfolio-list #settings-btn { display: none; }`

### `TEST/prototype_v4/index.html`

- 탭바 관련 스타일/화면 스타일 캐시 우회 쿼리 추가(브라우저 캐시로 인한 구버전 CSS 적용 방지)
  - `css/tab-bar.css?v=20260207`
  - `css/screens/portfolio/list.css?v=20260207`
  - `css/screens/portfolio/detail.css?v=20260207`
  - `css/screens/community/feed.css?v=20260207`

## 3. 기존 탭바 구현 연계 사항

- 탭바 기본 동작은 `data-show-tabbar` 및 `--tab-bar-height` 기반으로 제어됨
- 전역 규칙 파일
  - `TEST/prototype_v4/css/tab-bar.css`
  - `TEST/prototype_v4/css/base.css`

## 4. Phase별 기대 동작

- P1
  - 탭바 숨김
  - 포트폴리오 리스트 헤더 설정 버튼 노출
  - 기존 하단 간격 유지

- P2/P3
  - 탭바 노출
  - 커뮤니티 FAB/포트폴리오 디테일 하단 액션바가 탭바 위로 이동
  - 포트폴리오 리스트 헤더 설정 버튼 숨김(탭바 설정 탭으로 진입)

## 5. 점검한 추가 요소

- `stock-detail` 하단 액션은 내부 패딩 기반 구조로, 현재 탭바 직접 겹침 이슈 없음
- `notification-center`, `settings-main`은 하단 고정 CTA/FAB가 없어 직접 겹침 이슈 없음
- 모달/바텀시트는 기존 `z-index: 200` 체계 유지로 탭바(`z-index: 100`) 위에 정상 표시

## 6. 확인 방법(수동 테스트)

1. `index.html` 실행 후 Phase를 `P1`로 설정
2. `portfolio-list`에서 헤더 설정 버튼(⚙️) 노출 확인
3. Phase를 `P2` 또는 `P3`로 전환
4. `portfolio-list`에서 헤더 설정 버튼 숨김 확인
5. `community-feed`에서 FAB가 탭바 위에 위치하는지 확인
6. `portfolio-detail`에서 하단 액션바가 탭바와 겹치지 않는지 확인

## 7. 비고

- 브라우저 캐시 영향이 있는 환경에서는 쿼리스트링 버전값(`v=20260207`)을 갱신해 반영 상태를 명확히 할 수 있음
