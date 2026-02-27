---
type: task
phase: P1
domain: accounts
status: not-started

specs:
  api:
    - account/cash.md
    - account/list-create.md
    - account/stocks.md
    - account/update-delete.md
  db:
    - account/accounts.md
    - account/account-stock-entries.md
    - account/account-cash-entries.md
  ui:
    - account/create.md
    - account/list.md

tech:
  backend: spring-boot
  frontend: react-native
---

# Task: 계좌 수동 입력 기능 구현

## 목표

P1 단계에서는 증권사 연동 없이 사용자가 직접 계좌 정보를 입력하여 관리

> [!NOTE]
> - **P1**: 수동 입력 (증권사 연동 없음)
> - **P2**: 증권사 API 연동 (자동 동기화)

## 구현 체크리스트

### Backend (Spring Boot)

-   [ ] `Account` 엔티티 생성
-   [ ] `AccountStockEntry` 엔티티 생성
-   [ ] `AccountCashEntry` 엔티티 생성
-   [ ] `AccountRepository` 생성
-   [ ] `AccountService` 생성
    -   [ ] 계좌 생성/수정/삭제
    -   [ ] 계좌 목록 조회
    -   [ ] 종목 수동 입력/수정
    -   [ ] 현금 잔고 수동 입력/수정
-   [ ] `AccountController` 생성
    -   [ ] `GET /api/accounts` - 계좌 목록
    -   [ ] `POST /api/accounts` - 계좌 생성
    -   [ ] `PUT /api/accounts/{id}` - 계좌 수정
    -   [ ] `DELETE /api/accounts/{id}` - 계좌 삭제
    -   [ ] `POST /api/accounts/{id}/stocks` - 종목 추가
    -   [ ] `PUT /api/accounts/{id}/stocks/{stockId}` - 종목 수정
    -   [ ] `DELETE /api/accounts/{id}/stocks/{stockId}` - 종목 삭제
    -   [ ] `PUT /api/accounts/{id}/cash` - 현금 잔고 수정

### Frontend (React Native)

-   [ ] 계좌 목록 화면
-   [ ] 계좌 생성/수정 모달
-   [ ] 종목 수동 입력 화면
-   [ ] 현금 잔고 입력

### Database

-   [ ] `accounts` 테이블 생성
-   [ ] `account_stock_entries` 테이블 생성
-   [ ] `account_cash_entries` 테이블 생성

## 완료 조건

-   [ ] 계좌 CRUD 가능
-   [ ] 계좌에 종목 수동 입력/수정/삭제
-   [ ] 계좌에 현금 잔고 수동 입력
-   [ ] 포트폴리오와 계좌 1:1 연결 (선택)

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| Backend - 엔티티/Repository | 1일 |
| Backend - Service/Controller | 2일 |
| Frontend - 계좌 관리 | 2일 |
| 테스트 | 1일 |
| **총합** | **6일** |
