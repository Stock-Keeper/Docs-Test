---
type: ui
phase: P2
screen: 게시글 작성/수정 화면
related:
  api:
    - specs/api/community/post-create.md
  db:
    - specs/db/community/posts.md
  ui:
    - specs/ui/community/feed.md
---

# 게시글 작성/수정 화면 (Post Create/Edit Screen)

## 개요

게시글 작성, 수정, 종목 태그, 이미지 첨부

## 레이아웃

```text
┌─────────────────────────────────────┐
│  ← 취소                    [게시]   │  ← 헤더
├─────────────────────────────────────┤
│                                     │
│  [전체] [국내] [해외]               │  ← 카테고리 선택
│                                     │
├─────────────────────────────────────┤
│                                     │
│  제목을 입력하세요                  │  ← 제목 입력 (`post-title-input`)
│  ─────────────────────────────────  │
│                                     │
│  내용을 입력하세요.                 │  ← 본문 영역 (`post-body-input`)
│  커뮤니티 이용규칙에 맞지 않는 글은  │
│  통보 없이 삭제될 수 있습니다.       │
│                                     │
│                            0 / 3,000│  ← 글자수 표시 (`char-count`)
│                                     │
│  [🖼️ 이미지 미리보기]               │  ← 선택된 첨부 (`image-preview-area`)
│  [📊 포트폴리오 미리보기]            │  ← 첨부된 포폴 (`portfolio-preview-area`)
│  [삼성전자] [삼성SDI]               │  ← 종목 태그 (`stock-tags-preview`)
│                                     │
├─────────────────────────────────────┤
│  삼성전자     005930                │  ← 종목 자동완성 패널 (`stock-autocomplete`)
│  삼성SDI      006400                │
├─────────────────────────────────────┤
│  [📷 사진]  [📈 종목태그]  [📊 포폴]   │  ← 하단 툴바 (`post-toolbar`)
├─────────────────────────────────────┤
│          ⌨️ 키보드                  │
└─────────────────────────────────────┘
```

## 컴포넌트

### 1. 헤더 (`.post-create-header`)

| 요소 | ID / 설명 | Phase |
|---|---|---|
| ← 취소 | `#post-create-cancel-btn` / 나가기 (작성 중이면 확인 모달 `#post-create-exit-modal` 노출) | P1 |
| [게시] | `#post-create-submit-btn` / 조건 충족 시 활성화 | P1 |

### 2. 게시 버튼 활성화 조건

- 제목 1글자 이상 **AND** 본문 내용 존재

### 3. 카테고리 선택 (`.category-selection` > `#category-toggle`)

| 요소 | 클래스 / 설명 | Phase |
|---|---|---|
| 옵션 | `.category-toggle-btn` / 전체, 국내, 해외 | P1 |
| UI 디자인 | 그룹 토글 버튼 (단일 선택, 선택 상태 `.active` 클래스) | P1 |

### 4. 하단 툴바 (`.post-toolbar`)

| 버튼 | ID / 설명 | Phase |
|---|---|---|
| 📷 사진 | `#toolbar-photo-btn` / 기기 갤러리/파일 탐색기에서 이미지 선택 | P1 |
| 📈 종목태그 | `#toolbar-stock-btn` / 선택 시 종목 검색 모드 패널 (`#stock-autocomplete`) 노출 | P1 |
| 📊 포폴 | `#toolbar-portfolio-btn` / 포트폴리오 첨부를 위한 자산 선택 바텀시트 (`#portfolio-select-overlay`) 노출 | P1 |

### 5. 글쓰기 영역 (`.post-editor`)

| 요소 | ID / 설명 | Phase |
|---|---|---|
| 제목 | `#post-title-input` / 타이틀 입력 상자 | P1 |
| 본문 | `#post-body-input` / 최대 3000자 내용 작성 텍스트 영역 (`maxlength="3000"`) | P1 |
| 글자수 | `#char-count`, `#char-current` / "현재 글자 수 / 3,000" 표시, 한도 접근 시 강조 | P1 |
| 포폴 첨부 | `#portfolio-preview-area` / 목록에서 선택된 포트폴리오 렌더링 영역 | P1 |
| 첨부 뷰 | `#image-preview-area`, `#stock-tags-preview` / 썸네일과 종목 태그 목록 영역 | P1 |

### 6. 자동완성 (`#stock-autocomplete`)

- 툴바 📈 탭 시 또는 키워드 입력 등으로 종목 리스트 패널 표시 (하단 툴바 직상단에 위치)
- `#autocomplete-list` 내역 선택 시 `#태그` 형태로 칩이 `#stock-tags-preview` 영역에 생성됨

## 수정 화면 차이점

| 항목 | 작성 | 수정 |
|------|------|------|
| 헤더 버튼 | [게시] | [수정] |
| 초기값 | 빈 값 | 기존 내용 로드 |
| 완료 후 | 피드 이동 | 상세로 복귀 + "(수정됨)" |

## 나가기 확인 모달 (`#post-create-exit-modal`)

작성 중(입력값 있을 때) 취소 버튼 또는 제스처 뒤로가기 클릭 시:
- "⚠️ 작성 중인 글이 저장되지 않아요. 정말 나가시겠어요?" 메시지 모달 노출
- `[닫기]` (`#exit-modal-cancel`), `[나가기]` (`#exit-modal-confirm`)

## 포트폴리오 첨부 바텀시트 (`#portfolio-select-overlay`)

- 📊 포폴 툴바 탭 시 나타나는 하단 모달
- 사용자의 포트폴리오 목록 렌더링 (`#portfolio-select-list`)
- 선택 후 바텀시트가 닫히며 에디터에 포트폴리오 포함 상태로 전환 (첨부된 건은 화면에 프리뷰 표시됨)
