# 커뮤니티 기능 프로토타입 구현 계획

> **작성일**: 2026-02-01  
> **Phase**: P2  
> **상태**: 📋 계획 완료 (구현 대기)

---

## 1. PRD 스펙 분석 요약

### UI 화면 (8개)

| 화면 | 파일 | 핵심 기능 | 복잡도 |
|------|------|-----------|--------|
| **피드** | feed.md | 게시글/포트폴리오 통합 목록, 필터, FAB | ⭐⭐⭐ |
| **게시글 상세** | post-detail.md | 본문, 댓글/대댓글, 좋아요, 팔로우 | ⭐⭐⭐⭐ |
| **게시글 작성** | post-create.md | 카테고리, 본문, 이미지, 종목태그 | ⭐⭐⭐ |
| **프로필** | profile.md | 내/타인 프로필, 편집, 탭 콘텐츠 | ⭐⭐⭐ |
| **검색** | search.md | 종목/게시글/사용자 통합 검색 | ⭐⭐⭐ |
| **목록** | lists.md | 북마크, 차단 계정 관리 | ⭐⭐ |
| **설정** | settings.md | 커뮤니티 설정, 공개 범위 | ⭐⭐ |
| **온보딩** | onboarding.md | 첫 프로필 설정 | ⭐⭐ |

### 공유 컴포넌트 (추출 필요)

| 컴포넌트 | 사용처 |
|----------|--------|
| 피드 카드 (게시글) | feed, search, profile, lists |
| 피드 카드 (포트폴리오) | feed, search |
| 프로필 헤더 | profile (내/타인) |
| 댓글 아이템 | post-detail |
| 사용자 카드 | search, lists |

---

## 2. 하단 탭 네비게이션 (P2 신규)

P2에서 커뮤니티 기능 추가와 함께 앱 하단에 탭 네비게이션 바를 추가합니다.

### 레이아웃

```
┌─────────────────────────────────────┐
│            (화면 콘텐츠)             │
├─────────────────────────────────────┤
│  [🏠 홈]  [📊 포폴]  [💬 커뮤]  [⚙️ 설정] │
└─────────────────────────────────────┘
```

### 탭 구성

| 탭 | 아이콘 | 화면 | 설명 |
|---|---|---|---|
| 홈 | 🏠 | portfolio-list | 포트폴리오 목록 (메인) |
| 포폴 | 📊 | portfolio-detail | 선택된 포트폴리오 상세 |
| 커뮤 | 💬 | community-feed | 커뮤니티 피드 (진입점) |
| 설정 | ⚙️ | settings-main | 설정 화면 |

### 구현 요구사항

1. **파일 구조**
   - `css/components/tab-bar.css` - 탭바 스타일
   - `core/tab-bar.js` - 탭바 로직

2. **특징**
   - 컨트롤 패널과 **병행 사용** (테스트용 유지)
   - 탭바는 Phase P2 이상에서만 표시
   - 현재 활성 탭 하이라이트

3. **HTML 구조**

   ```html
   <nav id="tab-bar" class="tab-bar" data-phase="P2">
       <button class="tab-item active" data-screen="portfolio-list">
           <span class="tab-icon">🏠</span>
           <span class="tab-label">홈</span>
       </button>
       <button class="tab-item" data-screen="portfolio-detail">
           <span class="tab-icon">📊</span>
           <span class="tab-label">포폴</span>
       </button>
       <button class="tab-item" data-screen="community-feed">
           <span class="tab-icon">💬</span>
           <span class="tab-label">커뮤</span>
       </button>
       <button class="tab-item" data-screen="settings-main">
           <span class="tab-icon">⚙️</span>
           <span class="tab-label">설정</span>
       </button>
   </nav>
   ```

4. **Phase 토글 연동**
   - P1: 탭바 숨김 (`display: none`)
   - P2/P3: 탭바 표시

5. **구현 우선순위**
   - 커뮤니티 화면 구현 전에 탭바 먼저 구현
   - 탭바 → feed → post-detail → ...

---

## 3. 구현 순서 (권장)

### Phase 1: 기반 화면 (피드 흐름)

```
1. feed (피드 목록)
   ↓
2. post-detail (게시글 상세)
   ↓
3. post-create (게시글 작성)
```

**이유**: 사용자 핵심 플로우 우선, 피드 카드 컴포넌트 재사용

### Phase 2: 프로필 흐름

```
4. profile (내 프로필 / 타인 프로필)
   ↓
5. profile-edit (프로필 편집 - profile 내 모드)
```

**이유**: 게시글에서 작성자 클릭 시 이동

### Phase 3: 부가 기능

```
6. search (통합 검색)
7. lists (북마크, 차단)
8. settings (커뮤니티 설정)
9. onboarding (첫 프로필 설정)
```

---

## 3. 파일 구조 계획

```
screens/
└── community/
    ├── feed.html
    ├── post-detail.html
    ├── post-create.html
    ├── profile.html
    ├── search.html
    ├── lists.html
    ├── settings.html
    └── onboarding.html

css/screens/
└── community/
    ├── feed.css
    ├── post-detail.css
    ├── post-create.css
    ├── profile.css
    ├── search.css
    ├── common.css          ← 공유 컴포넌트 (카드, 버튼)
    └── ...

screen-controllers/
└── community/
    ├── feed.js
    ├── post-detail.js
    ├── post-create.js
    ├── profile.js
    ├── search.js
    └── ...
```

---

## 4. 화면별 상세 요구사항

### 4.1 피드 (feed)

**레이아웃**

- 헤더: 타이틀 + 검색(🔍) + 프로필(👤)
- 콘텐츠 탭: 추천 / 팔로잉
- 필터 바: 카테고리 + 정렬
- 피드 카드 목록 (무한 스크롤)
- FAB: 게시글 작성 (✏️)

**상태**

- 로딩: 스켈레톤 카드
- 빈 상태: "아직 게시글이 없습니다" + 작성 유도
- 에러: 에러 메시지 + 재시도

**Mock 데이터**

```javascript
const MOCK_POSTS = [
  { id: 1, type: 'post', category: '국내주식', title: '삼성전자 분석글', 
    preview: '내용 미리보기...', likes: 42, comments: 5, 
    author: '투자왕', time: '2시간 전' },
  { id: 2, type: 'portfolio', name: '배당주 포트폴리오', 
    stocks: 8, author: '배당러버', likes: 156, copies: 23 }
];
```

---

### 4.2 게시글 상세 (post-detail)

**레이아웃**

- 헤더: ← + 카테고리
- 프로필 영역 (고정): 프사, 닉네임, 날짜, 팔로우
- 본문 영역 (스크롤): 제목, 내용, 이미지
- 통계/액션: ❤️ 💬 🔄 공유
- 댓글 목록: 정렬 + 댓글 카드
- 댓글 입력 (고정)

**상호작용**

- 좋아요 토글
- 팔로우/언팔로우
- 댓글 작성
- 대댓글 (@닉네임)

---

### 4.3 게시글 작성 (post-create)

**레이아웃**

- 헤더: ← 취소 + [게시]
- 카테고리 선택 (토글)
- 제목 입력
- 본문 입력
- 이미지 첨부 미리보기
- 키보드 상단 패널: 📷 사진, 📈 종목태그

**게시 버튼 활성화**

- 제목 1자 이상 AND 본문 1자 이상

**나가기 모달**

- 입력값 있을 때: "작성 중인 글이 저장되지 않아요"

---

### 4.4 프로필 (profile)

**모드 3가지**

1. 내 프로필: 설정(⚙️), 프로필 편집
2. 타인 프로필: 차단(🚫), 팔로우
3. 프로필 편집: 취소/저장, 프사, 닉네임, 자기소개

**탭 콘텐츠**

- 최근활동 / 투자 / TBD

**닉네임 규칙**

- 한글/영어/숫자, 최대 20자
- 90일 쿨타임

---

## 5. 프로토타입 생략 항목

| 항목 | 이유 |
|------|------|
| Pull to Refresh | 실제 API 연동 시 구현 |
| 무한 스크롤 | "더 보기" 버튼으로 대체 |
| 본인인증 체크 | Mock에서는 항상 인증됨으로 처리 |
| 실시간 알림 | 프로토타입 범위 외 |

---

## 6. screens.json 추가 항목

```json
{
  "id": "community-feed",
  "path": "screens/community/feed.html",
  "controller": "screen-controllers/community/feed.js",
  "phase": "P2",
  "stateButtons": [
    { "id": "loading", "icon": "⏳", "title": "로딩" },
    { "id": "empty", "icon": "📭", "title": "빈 상태" }
  ]
},
{
  "id": "community-post-detail",
  "path": "screens/community/post-detail.html",
  "controller": "screen-controllers/community/post-detail.js",
  "phase": "P2"
},
{
  "id": "community-post-create",
  "path": "screens/community/post-create.html",
  "controller": "screen-controllers/community/post-create.js",
  "phase": "P2"
},
{
  "id": "community-profile",
  "path": "screens/community/profile.html",
  "controller": "screen-controllers/community/profile.js",
  "phase": "P2"
}
```

---

## 7. 세션 시작 멘트 (복사용)

```
커뮤니티 기능 프로토타입을 구현합니다.

구현 계획서를 확인해주세요:
- @[TEST/prototype_v4/docs/COMMUNITY_IMPLEMENTATION_PLAN.md]

PRD 스펙:
- @[Docs/AI_PRD/specs/ui/community]

피드(feed) 화면부터 시작해주세요.
```

---

## 8. 예상 작업량

| 화면 | 예상 시간 | 비고 |
|------|-----------|------|
| feed | 1시간 | 피드 카드 컴포넌트 생성 |
| post-detail | 1.5시간 | 댓글 로직 포함 |
| post-create | 1시간 | 폼 유효성 |
| profile | 1시간 | 3가지 모드 |
| search | 45분 | 기존 검색 참고 |
| lists | 30분 | 단순 목록 |
| settings | 30분 | 토글 위주 |
| **총계** | **~6시간** | |
