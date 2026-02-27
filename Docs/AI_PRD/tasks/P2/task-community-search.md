---
type: task
phase: P2
domain: community
status: not-started

specs:
  api:
    - community/search.md
    - community/portfolio-copy.md
    - portfolio/visibility.md
  db:
    - portfolio/portfolio-copies.md
    - community/search-histories.md
  ui:
    - community/search.md
    - community/portfolio-detail.md

tech:
  backend: spring-boot
  frontend: react-native
---

# Task: 커뮤니티 검색 및 포트폴리오 복사 기능 구현

## 목표
통합 검색 + 포트폴리오 공유/복사 기능 구현

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `SearchController` 생성
  - [ ] `GET /api/community/search` - 통합 검색
  - [ ] `GET /api/community/stocks/{code}/portfolios` - 종목별 포트폴리오
- [ ] `PortfolioCopyController` 생성
  - [ ] `POST /api/community/portfolios/{id}/copy` - 포트폴리오 복사
  - [ ] `PATCH /api/portfolios/{id}/visibility` - 공개/비공개 설정
- [ ] `SearchService` 생성
  - [ ] 종목 검색 (stocks 테이블 LIKE)
  - [ ] 게시글 검색 (posts 테이블 LIKE)
  - [ ] 사용자 검색 (users 테이블 LIKE)
- [ ] `PortfolioCopyService` 생성
  - [ ] 포트폴리오 복사 로직
  - [ ] copy_count 증가
  - [ ] 알림 발송
- [ ] `PortfolioCopy` 엔티티 생성

### Frontend (React Native)

- [ ] 검색 화면 구현
  - [ ] 검색 입력 (디바운스)
  - [ ] 종목 섹션
  - [ ] 게시글 섹션
  - [ ] 사용자 섹션
  - [ ] 더 보기 기능
- [ ] 종목별 포트폴리오 리스트 화면
- [ ] 포트폴리오 상세 화면
  - [ ] 공개 포트폴리오 표시
  - [ ] 복사 버튼
  - [ ] 좋아요 버튼
- [ ] 포트폴리오 복사 확인 모달
- [ ] 내 포트폴리오 공개/비공개 설정

### Database

- [ ] `portfolio_copies` 테이블 생성
- [ ] `portfolios` 테이블에 컬럼 추가
  - is_public, like_count, copy_count, copied_from_id

## 완료 조건

- [ ] 통합 검색 동작 (종목/게시글/사용자)
- [ ] 종목 클릭 → 해당 종목 포트폴리오 리스트
- [ ] 포트폴리오 복사 동작
- [ ] 공개/비공개 설정 동작

## 테스트 케이스

| 케이스 | 예상 결과 |
|--------|----------|
| 검색어 입력 (2자 이상) | 종목/게시글/사용자 통합 결과 |
| 검색어 입력 (1자) | "2자 이상 입력" 안내 |
| 종목 클릭 | 해당 종목 포함 포트폴리오 목록 |
| 더 보기 클릭 | 해당 카테고리 전체 결과 (페이지네이션) |
| 포트폴리오 복사 (본인인증 완료) | 복사 성공, copy_count 증가, 알림 발송 |
| 포트폴리오 복사 (5개 초과) | 400 에러, "최대 5개" 메시지 |
| 공개/비공개 토글 | is_public 변경, 피드에 반영 |

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| Backend 검색 | 2일 |
| Backend 복사 | 2일 |
| Frontend 검색 | 2일 |
| Frontend 복사 | 1일 |
| 테스트 | 1일 |
| **총합** | **8일** |
