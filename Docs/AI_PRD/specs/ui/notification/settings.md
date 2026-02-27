---
type: ui
phase: P1
screen: 알림 설정 화면
related:
  api:
    - ../../api/notification/settings.md
reference: ../../../reference/pages/settings.md
---

# 알림 설정 화면 (Notification Settings)

## 개요
알림 ON/OFF, 주기, 시간, 포트폴리오별 설정

## 레이아웃

```text
┌───────────────────────────────────────┐
│  ← 알림 설정                          │  ← 헤더 (`header`)
├───────────────────────────────────────┤
│                                       │
│  기본 설정                             │  ← 그룹 타이틀 (`settings-group-title`)
│  [ 알림 받기                    [━━●] ] │  ← `settings-item` / `global-noti-toggle`
│                                       │
│  알림 주기 (`noti-detail-settings`)     │
│  ┌─────────────────────────────────┐  │
│  │ 매일                        [✔] │  │  ← `radio-option` / `radio-check`
│  │ 매주 (월요일)                    │  │
│  │ 2주마다                          │  │
│  │ 한 달마다                        │  │
│  └─────────────────────────────────┘  │
│                                       │
│  알림 시간                             │
│  [ 시간 설정               [16:00 ▼] ] │  ← `noti-time-row` / `noti-time-value`
│                                       │
│  포트폴리오별 설정                     │  ← 그룹 타이틀
│                                       │  (JS 렌더링 영역 - `portfolio-settings-list`)
│  [ 내 포트폴리오  [5%]          [━━●] ] │  ← `pf-name` / `pf-threshold-btn` / `toggle-switch small`
│  [ 배당주        [10%]         [●━━] ] │
│  [ 성장주         [5%]         [━━●] ] │
└───────────────────────────────────────┘
```

## 컴포넌트

### 1. 헤더 (`header`)
- 뒤로가기 (`noti-settings-back-btn`)
- 타이틀: "알림 설정" (`header-title`)

### 2. 기본 설정 (`settings-group`)
- 항목명: "알림 받기" (`settings-label`)
- 전체 알림 토글스위치 (`global-noti-toggle`)
- **[동작]**: OFF 시 세부 설정 영역 (`noti-detail-settings`) 숨김 처리 (opacity 처리나 숨김 표출)

### 3. 알림 주기 선택 (`noti-detail-settings` 내)
| 범위 지정 (`noti-frequency` radio group) | 컴포넌트 (`radio-option`) | 단계 |
|---|---|---|
| 매일 (`daily`) | 선택 시 우측 `radio-check` 아이콘 (✔) 표시 | P1 |
| 매주 (`weekly`) | 라디오 버튼 동작 형태 | P1 |
| 2주마다 (`biweekly`) | 라디오 버튼 동작 형태 | P1 |
| 한 달마다 (`monthly`) | 라디오 버튼 동작 형태 | P1 |

### 4. 알림 시간 선택 (`noti-time-row`)
- 항목명: "시간 설정"
- 피커 호출용 텍스트상자: `noti-time-value` 박스 클릭 혹은 해당 행 클릭 시 시간 선택 (16:00 ▼)

### 5. 포트폴리오별 설정 (`portfolio-settings-list`)
| 요소 | 클래스명 / 형태 | 설명 | Phase |
|---|---|---|---|
| 포트폴리오명 | `pf-name` | 포트폴리오 이름 표시 | P1 |
| 임계값 버튼 | `pf-threshold-btn` | 예: "5%", "10%" 클릭 시 바텀시트 모달(`threshold-modal`) 호출 | P1 |
| 개별 토글 | `toggle-switch small` | 해당 포트폴리오의 리밸런싱 알림만 ON/OFF | P1 |

### 6. 리밸런싱 알림 기준 모달 (`threshold-modal`)
| 요소 | 클래스명 | 설명 | Phase |
|---|---|---|---|
| 헤더/타이틀 | `modal-header` | "리밸런싱 알림 기준" | P1 |
| 닫기버튼 | `threshold-close-btn` | `×` 형태 우측 상단 닫기 | P1 |
| 현재값 뷰 | `threshold-value-display` | 슬라이더 조작에 따라 실시간 텍스트 변환 (1~20%) | P1 |
| 슬라이더 | `threshold-slider` | 1단위 스텝형 범위 지정 | P1 |
| 저장버튼 | `threshold-save-btn` | 선택 및 저장 | P1 |

## 상호작용

| 액션 | 동작 |
|------|------|
| 전체 토글 OFF | 모든 설정 비활성화 |
| 주기 선택 | 라디오 버튼 변경 |
| 시간 탭 | 시간 피커 표시 |
| 임계값 탭 | 임계값 변경 바텀시트 (1~20%) |
| 포트폴리오 토글 | 개별 알림 ON/OFF |
| 뒤로가기 | 자동 저장 후 이동 |

## 상태

| 상태 | UI |
|------|-----|
| 로딩 중 | 스켈레톤 |
| 저장 중 | 토스트 "저장 중..." |
| 저장 완료 | 토스트 "저장되었습니다" |
| 에러 | 에러 토스트 + 재시도 |

## 관련 스펙
- API: `../api/notification/settings.md`
