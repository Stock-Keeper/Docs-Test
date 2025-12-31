# UI/UX 디자인 시스템

## 요약 ⚡

- React Native 기반 모바일 우선 디자인 (iOS/Android)
- 화면 크기: 375px~428px (iPhone SE ~ iPhone Pro Max)
- 디자인 시스템: 컴포넌트, 컴러, 타이포그래피, 아이콘 표준화
- 주요 화면: 로그인, 포트폴리오 목록/상세, 종목 검색/추가, 리밸런싱 분석
- [P2-고려] 태블릿 지원, 다크 모드, 커스텀 테마

---

## Phase 1 (현재)

### 기능 목록

- [P1] 모바일 화면 디자인 (7개 화면)
- [P1] 디자인 시스템 (Color, Typography, Icons)
- [P1] 컴포넌트 라이브러리 (Button, Input, Card, Modal)
- [P1] 상호작용 디자인 (Touch, Gesture, Animation)
- [P1] 접근성 기본 요구사항 (WCAG AA)

### 주요 화면 목록

#### 1. 로그인/회원가입 화면

| 항목 | 내용 |
|------|------|
| 레이아웃 | 중앙 정렬, 앱 로고 + 소개 문구 |
| 로그인 버튼 | Google 소셜 로귶78c버튼 (Google 브랜드 아이덴티티 준수) |
| 배경 | 그라디언트 또는 단색 (팀 논의) |
| 하단 | 이용약관, 개인정보처리방침 링크 |

#### 2. 프로필 입력 화면 (최초 로그인 시)

| 항목 | 내용 |
|------|------|
| 필수 입력 | 닉네임 또는 표시명 (1~20자) |
| 선택 입력 | 프로필 사진 업로드 |
| 버튼 | "시작하기" 버튼 (입력 완료 후 활성화) |
| 안내 | "나중에 설정할 수 있습니다" 텍스트 |

#### 3. 포트폴리오 목록 화면 (홈 화면)

| 항목 | 내용 |
|------|------|
| 헤더 | 상단: 프로필/설정 아이콘 |
| 포트폴리오 카드 | 이름, 총 평가금액, 수익률 (%, 원) |
| 추가 버튼 | + 플로팅 버튼 (우하단) |
| Pull to Refresh | 아래로 당겨서 실시간 업데이트 |
| 빈 상태 | 일러스트 + "첫 포트폴리오를 만들어보세요" |

#### 4. 포트폴리오 상세 화면

| 항목 | 내용 |
|------|------|
| 헤더 | 포트폴리오 이름, 편집 버튼, 뒤로가기 |
| 요약 정보 | 총 평가금액, 수익률, 수익금 (큰 텍스트) |
| 종목 목록 | 종목명, 보유수량, 현재가, 평가금액, 현재/목표 비율 |
| 하단 버튼 | "종목 추가", "리밸런싱 분석" |
| 스와이프 | 종목 왼쪽 스와이프 → 수정/삭제 버튼 |

#### 5. 종목 검색/추가 화면

| 항목 | 내용 |
|------|------|
| 검색창 | 상단 고정, 종목명 또는 종목코드 입력 |
| 검색 결과 | 종목명, 종목코드, 현재가 표시 |
| 선택 시 | 모달 팝업 (보유 수량, 목표 비율 입력) |
| 버튼 | "추가하기" 버튼 |
| 빈 결과 | "검색 결과가 없습니다" 메시지 |

#### 6. 리밸런싱 분석 화면

| 항목 | 내용 |
|------|------|
| 헤더 | "리밸런싱 분석" + 임계값 설정 버튼 |
| 비교 차트 | 현재 비율 vs 목표 비율 (Progress Bar 또는 Donut Chart) |
| 제안 카드 | 종목별 매수/매도 수량, 금액, 우선순위 |
| 정렬 | 비율 차이 큰 순서 |
| 빈 상태 | "모든 종목이 목표 비율 내에 있습니다" |

#### 7. 설정 화면

| 항목 | 내용 |
|------|------|
| 프로필 | 프로필 사진, 닉네임, 이메일 표시 |
| 알림 설정 | ON/OFF, 주기, 시간 선택 |
| 기타 | 로그아웃, 버전 정보, 이용약관, 개인정보처리방침 |

### 디자인 시스템

#### 컴러 팔레트

| 색상 | Hex Code | 사용처 |
|------|----------|--------|
| Primary | `#1E88E5` | 주요 버튼, 링크, 강조 |
| Secondary | `#FFA726` | 보조 버튼, 배지 |
| Success | `#66BB6A` | 수익, 매수, 성공 |
| Error | `#EF5350` | 손실, 매도, 에러 |
| Warning | `#FFA726` | 경고, 주의 |
| Background | `#FFFFFF` | 기본 배경 |
| Background Alt | `#F5F5F5` | 카드, 구분선 |
| Text Primary | `#212121` | 메인 텍스트 |
| Text Secondary | `#757575` | 보조 텍스트 |
| Text Disabled | `#BDBDBD` | 비활성 텍스트 |

**사용 예시**

```javascript
const colors = {
  primary: '#1E88E5',
  secondary: '#FFA726',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD'
};
```

#### 타이포그래피

| 종류 | 폰트 크기 | 글꼴 | 사용처 |
|------|----------|------|--------|
| Heading 1 | 24px | Bold | 화면 제목 |
| Heading 2 | 20px | Bold | 섹션 제목 |
| Heading 3 | 18px | SemiBold | 카드 제목 |
| Body | 16px | Regular | 본문, 기본 텍스트 |
| Caption | 14px | Regular | 보조 설명 |
| Small | 12px | Regular | 라벨, 하단 안내 |

**기본 폰트**
- `Noto Sans KR` (Google Fonts) 또는 시스템 기본 폰트
- iOS: SF Pro Display
- Android: Roboto

#### 아이콘

| 라이브러리 | 설명 |
|-----------|------|
| React Native Vector Icons | Material Icons 또는 Ionicons 사용 |
| 크기 | 24x24px (기본), 32x32px (큰 아이콘) |
| 색상 | Text Primary 또는 컴텍스트에 맞게 |

**사용 예시**
- 홈: `home`, `home-outline`
- 설정: `settings`, `cog`
- 추가: `add-circle`, `plus-circle`
- 삭제: `trash`, `delete`
- 검색: `search`
- 새로고침: `refresh`, `reload`
- 알림: `notifications`, `bell`

### 컴포넌트 라이브러리

#### Button

| 타입 | 스타일 |
|------|------|
| Primary | Background: Primary, Text: White, Radius: 8px |
| Secondary | Background: Secondary, Text: White, Radius: 8px |
| Outline | Border: Primary, Text: Primary, Background: Transparent |
| Text | No Border, Text: Primary, Background: Transparent |
| Disabled | Background: #BDBDBD, Text: White |

**크기**
- Small: 32px height, 12px padding
- Medium: 40px height, 16px padding
- Large: 48px height, 20px padding

#### Input Field

| 타입 | 스타일 |
|------|------|
| Text | Border: #E0E0E0, Radius: 8px, Padding: 12px |
| Number | 위와 동일, Keyboard: Numeric |
| Search | Icon: Search, Border: #E0E0E0, Radius: 20px |
| Focus | Border: Primary, Shadow |
| Error | Border: Error, Helper Text: Error |

#### Card

| 타입 | 스타일 |
|------|------|
| Default | Background: White, Shadow: 0 2px 8px rgba(0,0,0,0.1), Radius: 12px |
| Elevated | Shadow: 0 4px 12px rgba(0,0,0,0.15) |
| Outline | Border: 1px #E0E0E0, No Shadow |

#### Modal / Bottom Sheet

| 타입 | 스타일 |
|------|------|
| Modal | Center, Max Width: 90%, Radius: 16px, Backdrop: rgba(0,0,0,0.5) |
| Bottom Sheet | From Bottom, Full Width, Radius: 16px (top only) |
| 닫기 | X 버튼 또는 바깥 클릭 |

### 상호작용 디자인

#### 터치/제스처

| 제스처 | 동작 |
|--------|------|
| 탭 | 화면 전환, 버튼 클릭 |
| 스와이프 (왼쪽) | 종목 수정/삭제 |
| Pull to Refresh | 실시간 시세 업데이트 |
| Long Press | 컴텍스트 메뉴 (Phase 2) |

#### 피드백

| 상황 | 피드백 |
|------|--------|
| 버튼 클릭 | Haptic + 색상 변화 |
| 로딩 | 스피너 + "불러오는 중..." |
| 성공 | 초록색 Toast + 체크 아이콘 |
| 실패 | 빨간색 Toast + 경고 아이콘 |

#### 애니메이션

| 타입 | 스타일 |
|------|------|
| 화면 전환 | Slide (200-300ms) |
| 모달 | Fade In + Scale Up (300ms) |
| 리스트 | Fade In 순차 (100ms 간격) |
| 버튼 호버 | Scale 1.05x (150ms) |

### 접근성

| 항목 | 규칙 |
|------|------|
| 터치 타겟 | 최소 44x44pt (iOS), 48x48dp (Android) |
| 컴러 대비 | WCAG AA (4.5:1 이상) |
| 폰트 크기 | 시스템 폰트 크기 설정 따름 |
| Screen Reader | 주요 버튼에 accessibility label 추가 |
| 키보드 네비게이션 | Tab 순서 논리적 |

### 특수 상황 UI

#### 빈 상태 (Empty State)

| 화면 | 내용 |
|------|------|
| 포트폴리오 없음 | 일러스트 + "첫 포트폴리오를 만들어보세요" + 추가 버튼 |
| 종목 없음 | "종목을 추가해주세요" 메시지 |
| 검색 결과 없음 | "검색 결과가 없습니다" |

#### 오류 상태 (Error State)

| 상황 | 내용 |
|------|------|
| 네트워크 오류 | 오프라인 아이콘 + "인터넷 연결을 확인해주세요" + 재시도 |
| 서버 오류 | 오류 아이콘 + "일시적인 오류가 발생했습니다" + 재시도 |
| 데이터 로드 실패 | 재시도 버튼 표시 |

#### 로딩 상태 (Loading State)

| 타입 | 내용 |
|------|------|
| 전체 화면 | 중앙 스피너 + 로고 |
| 부분 로딩 | Skeleton UI 또는 작은 스피너 |
| Pull to Refresh | 상단 로딩 인디케이터 |

#### 성공 상태 (Success State)

| 상황 | 내용 |
|------|------|
| 저장 성공 | 초록색 Toast "저장되었습니다" |
| 삭제 성공 | Toast "삭제되었습니다" |

---

## Phase 2+ (확장 고려사항)

### Phase 2 기능

- [P2] **태블릿 지원**
  - 반응형 레이아웃 (768px 이상)
  - 사이드바 네비게이션
  - 멀티 컴럼 레이아웃

- [P2] **다크 모드**
  - 라이트/다크 테마 토글
  - 시스템 설정 따라 자동 전환
  - 모든 컴포넌트 다크 모드 대응

- [P2] **차트 라이브러리**
  - React Native Chart Kit 또는 Victory Native
  - Donut Chart (포트폴리오 비율)
  - Line Chart (수익률 추이)
  - Bar Chart (종목별 비교)

### Phase 3 기능

- [P3] **커스텀 테마**
  - 사용자 지정 Primary/Secondary 컴러
  - 테마 프리셋 (Classic, Modern, Minimal)
  - 컴러 팔레트 저장 및 공유

- [P3] **웹 버전 (PWA)**
  - 데스크톱 반응형 디자인
  - 하이브리드 앱으로 확장
  - 크로스 플랫폼 UI 통일성

- [P3] **애니메이션 강화**
  - 마이크로 인터랙션
  - 페이지 전환 애니메이션 다양화
  - 로딩 스켈레톤 UI 고도화

---

## 디자인 도구

| 도구 | 사용 목적 |
|------|----------|
| Figma | 화면 디자인, 프로토타입, 디자인 시스템 |
| React Native | 모바일 개발 |
| React Native Paper | UI 컴포넌트 라이브러리 (검토 중) |
| React Native Vector Icons | 아이콘 라이브러리 |

---

## 팀 논의 필요 사항

- [ ] Primary/Secondary 컴러 최종 결정
- [ ] UI 라이브러리 선택 (React Native Paper vs NativeBase vs Custom)
- [ ] 차트 라이브러리 선택 (Phase 2)
- [ ] Modal vs Bottom Sheet 선호도
- [ ] Figma 디자인 시스템 구축 일정

---

## 관련 문서

- **기술 스택**: `core/tech-stack.md#frontend` - React Native, Expo 설정
- **포트폴리오**: `features/portfolio.md` - 화면 플로우
- **종목**: `features/stock.md` - 검색 UI
- **리밸런싱**: `features/rebalancing.md` - 분석 화면
- **알림**: `features/notification.md` - 알림 센터 UI

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: Frontend + Design
