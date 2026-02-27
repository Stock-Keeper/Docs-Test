# 멤버십 구독 레벨 선택 페이지 구현 계획서

`prototype_v4`에 토큰/멤버십 하이브리드 BM에 기반한 멤버십 구독 선택 페이지를 추가합니다.
참조: [bm-token-membership.md](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/Docs/bm-token-membership.md)

---

## 멤버십 등급 체계 (4단계)

> [!IMPORTANT]
> 기존 초안(3단계)에서 BM 문서에 맞춰 **4단계(Free/Basic/Pro/Premium)**로 변경합니다.

| 항목 | Free | Basic | Pro | Premium |
|------|:----:|:-----:|:---:|:-------:|
| **월 구독료** | ₩0 | ₩4,900 | ₩9,900 | ₩19,900 |
| 백테스팅 | ❌ | 3회/월 | 15회/월 | 무제한 |
| 비교 분석 | ❌ | 1회/월 | 5회/월 | 무제한 |
| 포트폴리오 카피 | ❌ | 1회/월 | 5회/월 | 무제한 |
| 상세 열람 | ❌ | 5건/월 | 20건/월 | 무제한 |
| AI 비중 추천 | ❌ | 2회/월 | 10회/월 | 무제한 |
| 추가 토큰 포함 | 0개 | 10개 | 30개 | 50개 |
| 광고 제거 | ❌ | ❌ | ✅ | ✅ |
| 우선 고객 지원 | ❌ | ❌ | ❌ | ✅ |

---

## Proposed Changes

### Membership Domain (신규)

#### [NEW] [plans.html](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/screens/membership/plans.html)

멤버십 레벨 선택 화면. 구조:

```
screen (id="screen-membership-plans")
└── screen-body
    ├── header (← 뒤로가기 + "멤버십 구독")
    ├── current-plan-banner (현재 등급 + 토큰 잔여)
    ├── billing-toggle (월간/연간 토글)
    ├── plan-cards-container
    │   ├── plan-card (Free) — "현재 플랜"
    │   ├── plan-card (Basic)
    │   ├── plan-card (Pro) ← "BEST" 추천 배지
    │   └── plan-card (Premium) ← "VIP" 배지
    ├── feature-comparison-table (기능별 비교표)
    └── token-purchase-section (토큰 개별 구매 안내)
```

**각 플랜 카드 구성 요소:**
- 등급 아이콘 + 이름 + 추천 배지(Pro)
- 월/연 가격 (토글 연동, 연간 결제 시 할인율 표시)
- 핵심 혜택 5줄 (✓/✗ 마크)
  - 프리미엄 기능 사용량 (예: "백테스팅 15회/월")
  - 포함 토큰 수
  - 광고 제거 여부
  - 우선 지원 여부
- CTA 버튼: "현재 플랜" / "구독하기" / "업그레이드"

**현재 플랜 배너:**
- 현재 등급 표시 (예: "Free 플랜 이용 중")
- 보유 토큰 잔여량 (예: "🪙 12 토큰 보유")
- 이번 달 기능 사용량 게이지 (프로토타입에서는 목업 데이터)

**토큰 구매 섹션:**
- "토큰으로 건별 이용도 가능합니다" 안내 문구
- 토큰 패키지 4종 미니 카드 (10개 ₩1,900 ~ 120개 ₩14,900)

---

#### [NEW] [plans.css](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/css/screens/membership/plans.css)

핵심 스타일 요소:
- **현재 플랜 배너**: `--gradient-primary-light` 배경, 토큰 아이콘 + 게이지 바
- **플랜 카드**: `--bg-card` 글래스모피즘, Pro 카드에 `--gradient-primary` 보더 + 글로우
- **추천 배지**: `position: absolute` 리본, `--primary` 배경색
- **비교표**: `border-collapse` 테이블, ✓/✗ 색상 구분 (`--primary` / `--text-tertiary`)
- **토큰 섹션**: 가로 스크롤 미니 카드, "인기" 배지 강조
- **CTA 버튼**: 등급별 차등 스타일 (Free=ghost, Basic=outline, Pro=gradient, Premium=gold)

---

#### [NEW] [plans.js](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/screen-controllers/membership/plans.js)

컨트롤러 구조 (기존 패턴 준수):

```javascript
export function init() { ... }      // 초기화 + 데이터 렌더링 + attachListeners
export function cleanup() { ... }   // 모달 닫기 등 상태 정리
```

주요 기능:
- **빌링 주기 토글**: 월간 ↔ 연간 전환 시 가격 동적 변경 (연간 = 월간 × 10, ~16% 할인)
- **플랜 카드 렌더링**: `MEMBERSHIP_PLANS` 데이터 배열 기반 동적 생성
- **"구독하기" CTA**: 확인 바텀시트 모달 (등급명 + 가격 표시)
- **비교표 토글**: "전체 기능 비교" 접기/펼치기
- **토큰 구매 카드 클릭**: 구매 확인 모달
- **뒤로가기**: `goBack('settings-main')`

더미 데이터:
```javascript
const MEMBERSHIP_PLANS = [
  { id: 'free', name: 'Free', price: 0, icon: '🆓', features: {...} },
  { id: 'basic', name: 'Basic', price: 4900, icon: '⭐', features: {...} },
  { id: 'pro', name: 'Pro', price: 9900, icon: '💎', badge: 'BEST', features: {...} },
  { id: 'premium', name: 'Premium', price: 19900, icon: '👑', badge: 'VIP', features: {...} }
];

const TOKEN_PACKAGES = [
  { tokens: 10, price: 1900 },
  { tokens: 30, price: 4900 },
  { tokens: 60, price: 8900, badge: '인기' },
  { tokens: 120, price: 14900 }
];
```

---

### 기존 파일 수정

#### [MODIFY] [screens.json](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/config/screens.json)

```json
{
  "id": "membership-plans",
  "phase": "P3",
  "domain": "membership",
  "name": "멤버십 구독",
  "path": "screens/membership/plans.html",
  "controller": "screen-controllers/membership/plans.js",
  "navButton": { "icon": "💎", "order": 18 },
  "stateButtons": [],
  "hideTabBar": true
}
```

#### [MODIFY] [index.html](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/index.html)

CSS 링크 추가: `<link rel="stylesheet" href="css/screens/membership/plans.css">`

#### [MODIFY] [main.html](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/screens/settings/main.html)

"앱 정보" 그룹 위에 멤버십 섹션 추가 (현재 등급 + 토큰 잔여 미리보기 포함)

#### [MODIFY] [main.js](file:///c:/Projects/2026/Stock_Keeper/Docs-Test/TEST/prototype_v4/screen-controllers/settings/main.js)

멤버십 링크 클릭 핸들러: `navigateTo('membership-plans')`

---

## UI 디자인

```
┌─────────────────────────────────┐
│  ←  멤버십 구독                  │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │  🆓 Free 플랜 이용 중        │ │ ← 현재 플랜 배너
│ │  🪙 12 토큰 보유              │ │
│ └─────────────────────────────┘ │
│                                 │
│    ┌─ 월간 ─┐─ 연간(16%↓) ─┐   │ ← 빌링 토글
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🆓 Free                    │ │
│ │  ₩0 / 월                   │ │
│ │  ✗ 프리미엄 기능 미포함     │ │
│ │  ✗ 광고 포함                │ │
│ │  [현재 플랜]                │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  ⭐ Basic                   │ │
│ │  ₩4,900 / 월               │ │
│ │  ✓ 백테스팅 3회/월          │ │
│ │  ✓ 토큰 10개 포함           │ │
│ │  ✗ 광고 포함                │ │
│ │  [구독하기]                 │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  💎 Pro          ▸ BEST     │ │ ← 추천 강조
│ │  ₩9,900 / 월               │ │
│ │  ✓ 백테스팅 15회/월         │ │
│ │  ✓ 토큰 30개 + 광고 제거    │ │
│ │  [구독하기]                 │ │
│ └═════════════════════════════┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👑 Premium       ▸ VIP    │ │
│ │  ₩19,900 / 월              │ │
│ │  ✓ 모든 기능 무제한         │ │
│ │  ✓ 토큰 50개 + 우선 지원    │ │
│ │  [구독하기]                 │ │
│ └─────────────────────────────┘ │
│                                 │
│  ▼ 전체 기능 비교 (접기/펼치기)  │
│ ┌─────────────────────────────┐ │
│ │       Free Basic Pro Prem   │ │ ← 비교표
│ │ 백테스팅 ✗   3   15   ∞    │ │
│ │ 카피    ✗   1    5   ∞    │ │
│ │ AI추천  ✗   2   10   ∞    │ │
│ │ ...                        │ │
│ └─────────────────────────────┘ │
│                                 │
│  🪙 토큰으로 건별 이용           │
│ ┌────┐┌────┐┌────┐┌────┐       │ ← 가로 스크롤
│ │10개││30개││60개││120 │       │
│ │1.9k││4.9k││8.9k││14.9│       │
│ └────┘└────┘└────┘└────┘       │
│                                 │
└─────────────────────────────────┘
```

---

## Verification Plan

### 브라우저 테스트
1. 로컬 서버 실행 → 설정 → "멤버십 구독" 진입 확인
2. 현재 플랜 배너 + 토큰 잔여 표시 확인
3. 빌링 토글(월간/연간) 전환 시 4개 카드 가격 동적 변경 확인
4. Pro 카드 "BEST" 배지 및 시각적 강조 확인
5. "구독하기" CTA → 확인 모달 동작 확인
6. "전체 기능 비교" 접기/펼치기 확인
7. 토큰 구매 카드 가로 스크롤 및 클릭 확인
8. 다크/라이트 테마 전환 시 스타일 정상 표시
9. 뒤로가기 → 설정 화면 복귀 확인
