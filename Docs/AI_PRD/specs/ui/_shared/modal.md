---
type: ui
phase: P1
component: 공통 모달 (Bottom Sheet)
related:
  ui:
    - specs/ui/portfolio/list.md
    - specs/ui/portfolio/detail.md
    - specs/ui/auth/profile-input.md
    - specs/ui/settings/main.md
---

# 공통 모달 (Bottom Sheet Modal)

## 개요

화면 하단에서 슬라이드업 되는 모달 컴포넌트.
폼 입력, 확인 다이얼로그, 액션 시트 등 다양한 용도로 사용.

## 레이아웃

```text
┌─────────────────────────────────┐
│  (불투명 배경 오버레이)           │
│                                 │
│                                 │
├─────────────────────────────────┤
│  ──── (드래그 핸들)              │
│                                 │
│  모달 타이틀                     │
│  ─────────────────────────────  │
│  [모달 컨텐츠 영역]              │
│                                 │
│  [확인]          [취소]         │
└─────────────────────────────────┘
```

## 변형 (Variants)

### 1. 폼 모달

- 용도: 입력 폼 (포트폴리오 생성/수정, 종목 추가 등)
- 높이: 컨텐츠에 따라 가변
- 버튼: 확인/취소

### 2. 확인 다이얼로그

- 용도: 삭제 확인 등 사용자 확인
- 높이: 고정 (200px 내외)
- 버튼: 확인(위험)/취소

### 3. 액션 시트

- 용도: 선택지 목록
- 높이: 선택지 수에 따라 가변
- 버튼: 없음 (항목 선택 시 닫힘)

## 스타일 속성

| 요소 | 값 |
|---|---|
| border-radius | 16px (상단만) |
| padding | 24px |
| max-height | 80vh |
| backdrop | 불투명 배경 (색상값 `--bg-body` 등 지정 필요) |
| animation | slide-up 300ms ease-out |

## 상호작용

| 액션 | 동작 |
|---|---|
| 배경 탭 | 모달 닫기 |
| 드래그 핸들 아래로 스와이프 | 모달 닫기 |
| ESC 키 | 모달 닫기 |
| 확인 버튼 | 액션 실행 후 닫기 |
| 취소 버튼 | 닫기 |

## 사용 화면

- `portfolio/list`: 포트폴리오 생성/수정 모달
- `portfolio/detail`: 포트폴리오 수정 모달
- `auth/profile-input`: 계정 선택 모달
- `settings/main`: 탈퇴 확인 다이얼로그
