---
type: task
phase: P3
domain: community
status: not-started

specs:
  api:
    - community/reply-create.md
    - community/follow.md
    - community/ranking.md
  db:
    - community/follows.md
    - community/rankings.md
    - community/badges.md
  ui: []

tech:
  backend: spring-boot
  frontend: react-native
---

# Task: 커뮤니티 P3 기능 구현 (대댓글, 팔로우, 랭킹, 배지)

## 목표
커뮤니티 확장 기능 - 대댓글, 팔로우/팔로워, 랭킹 시스템, 배지 시스템

## 구현 체크리스트

### 대댓글 기능

- [ ] Backend
  - [ ] `POST /api/community/comments/{id}/replies` - 대댓글 작성
  - [ ] `PUT /api/community/replies/{id}` - 대댓글 수정
  - [ ] `DELETE /api/community/replies/{id}` - 대댓글 삭제
  - [ ] `Reply` 엔티티 및 Repository
- [ ] Frontend
  - [ ] 댓글 하위에 대댓글 리스트 표시
  - [ ] 대댓글 작성 UI
- [ ] Database
  - [ ] `replies` 테이블 생성

### 팔로우 기능

- [ ] Backend
  - [ ] `POST /api/community/follows` - 팔로우 토글
  - [ ] `GET /api/community/users/{id}/followers` - 팔로워 목록
  - [ ] `GET /api/community/users/{id}/following` - 팔로잉 목록
  - [ ] `Follow` 엔티티 및 Repository
  - [ ] follower_count, following_count 캐시 관리
- [ ] Frontend
  - [ ] 프로필 화면 팔로우 버튼
  - [ ] 팔로워/팔로잉 목록 화면
  - [ ] 피드에서 팔로잉 우선 정렬 옵션
- [ ] Database
  - [ ] `follows` 테이블 생성
  - [ ] `users` 테이블에 follower_count, following_count 추가

### 랭킹 시스템

- [ ] Backend
  - [ ] `GET /api/community/rankings` - 랭킹 조회
  - [ ] 주간/월간 랭킹 집계 배치 작업
  - [ ] 랭킹 점수 계산 로직
  - [ ] `Ranking` 엔티티 및 Repository
- [ ] Frontend
  - [ ] 랭킹 화면 (주간/월간/전체 탭)
  - [ ] 내 랭킹 표시
  - [ ] TOP 3 하이라이트
- [ ] Database
  - [ ] `rankings` 테이블 생성

### 배지 시스템

- [ ] Backend
  - [ ] `GET /api/community/badges` - 배지 목록
  - [ ] `GET /api/community/users/{id}/badges` - 사용자 배지
  - [ ] 배지 획득 조건 체크 로직
  - [ ] 배지 획득 알림 발송
  - [ ] `BadgeType`, `UserBadge` 엔티티
- [ ] Frontend
  - [ ] 프로필에 배지 표시
  - [ ] 배지 획득 모달
  - [ ] 배지 목록 화면
- [ ] Database
  - [ ] `badge_types` 테이블 생성 + 초기 데이터
  - [ ] `user_badges` 테이블 생성

## 완료 조건

- [ ] 대댓글 작성/수정/삭제
- [ ] 팔로우/언팔로우 동작
- [ ] 주간/월간 랭킹 표시
- [ ] 배지 획득 및 프로필 표시

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| 대댓글 | 2일 |
| 팔로우 | 3일 |
| 랭킹 | 4일 |
| 배지 | 3일 |
| 테스트 | 2일 |
| **총합** | **14일** |
