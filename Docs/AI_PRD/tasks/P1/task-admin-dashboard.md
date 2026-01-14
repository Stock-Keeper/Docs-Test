# Task: Admin 대시보드 및 통계 구현

## 목표
관리자 대시보드 - 메인 통계 카드 및 차트 구현

## 스펙 참조

### API
- `../../specs/api/admin/stats-overview.md`

### UI
- `../../specs/ui/admin/dashboard.md`

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `AdminStatsController` 생성
  - [ ] `GET /api/admin/stats/overview` - 전체 통계
  - [ ] `GET /api/admin/stats/users` - 사용자 통계 (차트 데이터)
- [ ] `AdminStatsService` 생성
  - [ ] 전체 사용자 수 조회
  - [ ] 오늘 신규 가입자 수 조회
  - [ ] DAU 조회
  - [ ] 포트폴리오/종목 통계
  - [ ] 역할/멤버십 분포 조회
  - [ ] 최근 30일 추이 데이터

### Frontend (Next.js)

- [ ] `/` 대시보드 페이지 생성
  - [ ] 사이드바 네비게이션
  - [ ] 헤더 (로고, 관리자 정보, 로그아웃)
- [ ] 통계 카드 컴포넌트
  - [ ] 전체 사용자 카드 (증감 표시)
  - [ ] 오늘 신규 가입 카드
  - [ ] DAU 카드
  - [ ] 포트폴리오 카드
- [ ] 차트 컴포넌트 (Chart.js 또는 Recharts)
  - [ ] 가입자 추이 라인 차트
  - [ ] DAU 추이 라인 차트
  - [ ] 역할 분포 도넛 차트
  - [ ] 멤버십 분포 도넛 차트
- [ ] React Query로 데이터 fetching
- [ ] 스켈레톤 로딩 UI

## 완료 조건

- [ ] 대시보드 통계 카드 표시
- [ ] 4개 차트 정상 렌더링
- [ ] 로딩 중 스켈레톤 UI
- [ ] 에러 시 재시도 버튼

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| Backend API | 1일 |
| Frontend UI | 2일 |
| 차트 구현 | 1일 |
| **총합** | **4일** |
