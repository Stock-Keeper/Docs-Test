---
type: task
phase: P1
domain: portfolio
status: not-started

specs:
    api:
        - portfolio/list.md
        - portfolio/detail.md
        - portfolio/create.md
        - portfolio/update.md
        - portfolio/delete.md
        - portfolio/reorder.md
        - portfolio/snapshots-list.md
        - portfolio/snapshots-detail.md
        - portfolio/snapshots-create.md
        - portfolio/snapshots-compare.md
        # ai-optimize.md, backtest.md → P3 태스크로 이동
    db:
        - portfolio/portfolios.md
        - portfolio/portfolio-stock-entries.md
        - portfolio/portfolio-cash-entries.md
        - portfolio/portfolio-snapshots.md
    ui:
        - portfolio/list.md
        - portfolio/create.md
        - portfolio/detail.md
        - portfolio/backtest.md

tech:
    backend: spring-boot
    frontend: react-native
---

# Task: 포트폴리오 관리 기능 구현

## 목표

포트폴리오 CRUD, 정렬, 현금 자산 관리 기능 구현

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `PortfolioController` 생성
    - [ ] `GET /api/portfolios` - 목록 조회
    - [ ] `GET /api/portfolios/{id}` - 상세 조회
    - [ ] `POST /api/portfolios` - 생성
    - [ ] `PUT /api/portfolios/{id}` - 수정
    - [ ] `DELETE /api/portfolios/{id}` - 삭제
    - [ ] `PATCH /api/portfolios/reorder` - 순서 변경
- [ ] `PortfolioService` 생성
    - [ ] 5개 제한 검증
    - [ ] 마지막 삭제 시 기본 포트폴리오 자동 생성
    - [ ] 총 평가금액 계산 (종목 + 현금)
    - [ ] 회원가입 시 기본 포트폴리오 생성
- [ ] `Portfolio` 엔티티 생성
- [ ] `PortfolioStockEntry` 엔티티 생성 (목표 종목)
- [ ] `PortfolioCashEntry` 엔티티 생성 (목표 현금 비중)
- [ ] Repository 생성
- [ ] 입력 검증 (이름 1~20자, 특수문자 차단)

### Frontend (React Native)

- [ ] 포트폴리오 목록 화면
    - [ ] 포트폴리오 카드 리스트
    - [ ] 롱프레스 드래그 순서 변경
    - [ ] 스와이프 액션 (수정/삭제)
    - [ ] Pull to Refresh
- [ ] 포트폴리오 생성 모달
    - [ ] 이름 입력 (글자수 표시)
    - [ ] 설명 입력 (선택)
    - [ ] 5개 초과 시 버튼 비활성화
- [ ] 포트폴리오 상세 화면
    - [ ] 요약 카드 (총 평가금액, 현금)
    - [ ] 리밸런싱 필요 알림
    - [ ] 종목 목록 (현재가, 비율, 괴리율)
    - [ ] 종목 추가 버튼
    - [ ] 실시간 업데이트 (30초~1분)
- [ ] 삭제 확인 다이얼로그

### Database

- [ ] `portfolios` 테이블 생성
- [ ] `portfolio_stock_entries` 테이블 생성
- [ ] `portfolio_cash_entries` 테이블 생성

## 완료 조건

- [ ] 포트폴리오 CRUD 동작
- [ ] 최대 5개 제한
- [ ] 마지막 삭제 시 기본 포트폴리오 자동 생성
- [ ] 드래그로 순서 변경
- [ ] 현금 자산 입력/표시
- [ ] 총 평가금액 계산

## 테스트 케이스

| 케이스                      | 예상 결과                                   |
| --------------------------- | ------------------------------------------- |
| 포트폴리오 생성             | 목록에 추가                                 |
| 5개 초과 생성 시도          | 400 에러, "최대 5개" 메시지                 |
| 이름 20자 초과              | 400 에러, 검증 실패                         |
| 특수문자 포함 이름          | 400 에러, 검증 실패                         |
| 마지막 포트폴리오 삭제      | 기본 포트폴리오 자동 생성                   |
| 순서 변경                   | 순서 업데이트, 목록 순서 반영 (reorder API) |
| 다른 사용자 포트폴리오 접근 | 403 에러                                    |

## 예상 소요 시간

| 파트                 | 예상 시간 |
| -------------------- | --------- |
| Backend - CRUD API   | 3일       |
| Backend - 순서/검증  | 1일       |
| Frontend - 목록      | 2일       |
| Frontend - 상세      | 2일       |
| Frontend - 생성/수정 | 1일       |
| 테스트               | 1일       |
| **총합**             | **10일**  |
