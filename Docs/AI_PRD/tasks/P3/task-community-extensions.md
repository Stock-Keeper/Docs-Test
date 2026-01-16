---
type: task
phase: P3
domain: community
status: not-started

specs:
  api: []
  db: []
  ui:
    - community/feed.md

tech:
  backend: spring-boot
  frontend: react-native
---

# Task: 커뮤니티 P3 기능 구현 (피드 확장, 공유, 이벤트)

## 목표
피드 확장 기능 - 정렬 옵션, 콘텐츠 필터, 게시글 공유, 이벤트 참여

## 구현 체크리스트

### 피드 정렬 확장

- [ ] Backend
  - [ ] 피드 API에 인기순 정렬 로직 추가
    - `ORDER BY (like_count + comment_count * 2) DESC`
  - [ ] 팔로잉 우선 정렬 로직 추가
    - 팔로잉 사용자 콘텐츠 상단 배치
- [ ] Frontend
  - [ ] 정렬 드롭다운에 "인기순", "팔로잉" 추가
  - [ ] 정렬 변경 시 피드 리로드

### 콘텐츠 필터

- [ ] Backend
  - [ ] 피드 API에 filter 파라미터 추가 (POST/PORTFOLIO)
- [ ] Frontend
  - [ ] 필터 탭 UI ("전체", "게시글만", "포트폴리오만")
  - [ ] 필터 변경 시 피드 리로드

### 게시글 공유

- [ ] Backend
  - [ ] `GET /api/community/posts/{id}/share` - 공유 링크 생성
  - [ ] 공유 페이지 OG 태그 설정
- [ ] Frontend
  - [ ] 게시글 상세에 공유 버튼
  - [ ] 공유 바텀시트 (링크 복사, 카카오톡, SNS)
  - [ ] React Native Share API 연동

### 이벤트 참여

- [ ] Backend
  - [ ] `GET /api/community/events` - 이벤트 목록
  - [ ] `POST /api/community/events/{id}/join` - 이벤트 참여
  - [ ] `GET /api/community/events/{id}/leaderboard` - 이벤트 리더보드
  - [ ] 이벤트 참여 자격 검증 (랭킹/배지 조건)
- [ ] Frontend
  - [ ] 이벤트 목록 화면
  - [ ] 이벤트 상세 화면
  - [ ] 참여 버튼 및 리더보드
- [ ] Database
  - [ ] `events` 테이블 생성
  - [ ] `event_participants` 테이블 생성

## 완료 조건

- [ ] 인기순/팔로잉 우선 정렬 동작
- [ ] 게시글/포트폴리오만 필터 동작
- [ ] 외부 공유 (링크, 카카오톡)
- [ ] 이벤트 참여 및 리더보드

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| 피드 정렬 | 2일 |
| 콘텐츠 필터 | 1일 |
| 게시글 공유 | 2일 |
| 이벤트 | 4일 |
| 테스트 | 2일 |
| **총합** | **11일** |
