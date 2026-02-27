---
type: task
phase: P1
domain: stock
status: not-started

specs:
    api:
        - stock/search.md
        - stock/add.md
        - stock/update-delete.md
        - stock/price.md
        - rebalancing/calculate.md
        - rebalancing/snapshot.md
        - rebalancing/history.md
    db:
        - portfolio/portfolios.md
        - portfolio/portfolio-stock-entries.md
        - portfolio/portfolio-cash-entries.md
        - account/account-stock-entries.md
    ui:
     - stock/search.md
    - stock/detail.md
    - stock/add.md
    - rebalancing/check.md


tech:
    backend: spring-boot
    frontend: react-native
---

# Task: 종목 관리 + 리밸런싱 기능 구현

## 목표

종목 CRUD, 실시간 시세, 리밸런싱 제안 기능 구현

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `StockController` 생성
    - [ ] `GET /api/stocks/search` - 종목 검색
    - [ ] `GET /api/stocks/price` - 시세 조회
- [ ] `PortfolioStockEntryController` 생성
    - [ ] `POST /api/portfolios/{id}/stocks` - 종목 추가
    - [ ] `PUT /api/portfolios/{id}/stocks/{entryId}` - 종목 수정
    - [ ] `DELETE /api/portfolios/{id}/stocks/{entryId}` - 종목 삭제
- [ ] `RebalancingController` 생성
    - [ ] `GET /api/portfolios/{id}/rebalancing` - 리밸런싱 제안
- [ ] `HantooApiService` 생성
    - [ ] 종목 검색 API 연동
    - [ ] 현재가 조회 API 연동
    - [ ] Rate Limit 처리
- [ ] `StockCacheService` 생성
    - [ ] Redis/메모리 캐시 (TTL 30초)
    - [ ] 캐시 키 전략
- [ ] `RebalancingService` 생성
    - [ ] 현재 비율 계산
    - [ ] 임계값 초과 판정
    - [ ] 매수/매도 수량 계산
- [ ] 입력 검증
    - [ ] 수량 1 이상 정수
    - [ ] 비율 0~100%
    - [ ] 합계 100% 이하

### Frontend (React Native)

- [ ] 종목 검색 화면
    - [ ] 검색 입력 (디바운스 500ms)
    - [ ] 검색 결과 리스트
- [ ] 종목 추가 화면
    - [ ] 수량 입력 (+/- 버튼)
    - [ ] 목표 비율 슬라이더
    - [ ] 남은 비율 표시
- [ ] 포트폴리오 상세 내 종목 수정
    - [ ] 수량/비율 수정 바텀시트
    - [ ] 스와이프 삭제
- [ ] 리밸런싱 화면
    - [ ] 임계값 선택 버튼
    - [ ] 매수/매도 제안 카드
    - [ ] 균형 종목 섹션
- [ ] 실시간 시세 표시
    - [ ] 장중 30초~1분 갱신
    - [ ] 백그라운드 중단

### Database

- [ ] `portfolio_stock_entries` 테이블 생성
- [ ] `portfolio_cash_entries` 테이블 생성

## 완료 조건

- [ ] 종목 검색 동작 (한투 API)
- [ ] 종목 추가/수정/삭제 동작
- [ ] 50종목 제한, 비율 100% 제한
- [ ] 실시간 시세 조회 (캐싱)
- [ ] 리밸런싱 제안 계산
- [ ] 임계값별 필터링

## 테스트 케이스

| 케이스                    | 예상 결과                    |
| ------------------------- | ---------------------------- |
| 종목 검색                 | 한투 API 결과 반환, 캐싱     |
| 종목 추가 (정상)          | portfolio_stock_entries 생성 |
| 중복 종목 추가            | 409 에러                     |
| 51번째 종목 추가          | 400 에러, "최대 50개"        |
| 비율 합계 초과            | 400 에러, "100% 초과"        |
| 시세 조회 (캐시 히트)     | 캐시 데이터, isCached=true   |
| 시세 조회 (캐시 미스)     | 한투 API 호출, 캐싱          |
| 리밸런싱 계산 (임계값 5%) | 5% 초과 종목만 suggestions   |
| 리밸런싱 계산 (전부 균형) | needsRebalancing=false       |

## 예상 소요 시간

| 파트                 | 예상 시간 |
| -------------------- | --------- |
| Backend - 종목 API   | 2일       |
| Backend - 한투 연동  | 2일       |
| Backend - 캐싱       | 1일       |
| Backend - 리밸런싱   | 2일       |
| Frontend - 종목 관리 | 3일       |
| Frontend - 리밸런싱  | 2일       |
| 테스트               | 2일       |
| **총합**             | **14일**  |
