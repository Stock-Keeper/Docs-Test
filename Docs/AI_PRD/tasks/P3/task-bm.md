---
type: task
phase: P3
domain: bm
status: not-started

specs:
    api:
        - bm/products.md
        - bm/token-buy.md
        - bm/membership-subscribe.md
    db:
        - bm/token-packages.md
        - bm/membership-products.md
        - bm/token-histories.md
        - bm/payment-histories.md
    ui:
        - bm/shop.md
        - _shared/token-modal.md

tech:
    backend: spring-boot
    frontend: react-native
---

# Task: 비즈니스 모델 구현 (토큰/멤버십 시스템)

## 목표

토큰 구매, 멤버십 구독, 프리미엄 기능 과금 시스템 구현

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `BmProductController` 생성
    - [ ] `GET /api/bm/products` - 상품 목록 조회
- [ ] `BmTokenController` 생성
    - [ ] `POST /api/bm/tokens/buy` - 토큰 구매
- [ ] `BmMembershipController` 생성
    - [ ] `POST /api/bm/membership/subscribe` - 멤버십 구독
- [ ] `BmService` 생성
    - [ ] PG사 결제 검증 로직
    - [ ] 토큰 잔액 관리 (token_balance)
    - [ ] 멤버십 등급/만료일 관리
    - [ ] 월간 토큰 지급 (MEMBERSHIP_GRANT)
- [ ] `TokenService` 생성
    - [ ] 토큰 차감 공통 로직 (USE)
    - [ ] 멤버십 한도 확인 로직
    - [ ] 잔액 부족 시 402 응답
- [ ] 엔티티 생성
    - [ ] `TokenPackage`
    - [ ] `MembershipProduct`
    - [ ] `TokenHistory`
    - [ ] `PaymentHistory`
- [ ] Repository 생성

### Frontend (React Native)

- [ ] 토큰/멤버십 상점 화면
    - [ ] 나의 상태 카드 (보유 토큰, 현재 멤버십)
    - [ ] 탭 전환 (토큰 충전 / 멤버십 구독)
    - [ ] 토큰 패키지 리스트
    - [ ] 멤버십 상품 리스트
    - [ ] 추천(인기) 상품 배지
- [ ] PG 결제 연동
    - [ ] WebView 또는 SDK 결제 모달
    - [ ] 결제 완료/실패 처리
- [ ] 토큰 차감 확인 모달 (공통 컴포넌트)
    - [ ] "🪙 N개 소모됩니다" 확인 다이얼로그
    - [ ] 잔액 부족 시 충전 유도

### Database

- [ ] `token_packages` 테이블 생성 + 초기 데이터
- [ ] `membership_products` 테이블 생성 + 초기 데이터
- [ ] `token_histories` 테이블 생성
- [ ] `payment_histories` 테이블 생성
- [ ] `users` 테이블 마이그레이션 (membership_tier, token_balance, membership_expires_at)

## 완료 조건

- [ ] 토큰 패키지/멤버십 상품 목록 표시
- [ ] 토큰 구매 → 잔액 증가
- [ ] 멤버십 구독 → 등급/만료일 업데이트
- [ ] 프리미엄 기능 사용 시 토큰 차감 동작
- [ ] 멤버십 한도 초과 시 토큰 차감 fallback
- [ ] 잔액 부족 시 402 + 충전 유도

## 테스트 케이스

| 케이스                    | 예상 결과                              |
| ------------------------- | -------------------------------------- |
| 상품 목록 조회            | 활성 패키지/멤버십 표시                |
| 토큰 구매 (성공)          | 잔액 증가, payment_histories 기록      |
| 토큰 구매 (금액 불일치)   | 400 에러                               |
| 멤버십 구독               | tier 변경, 만료일 설정, 월간 토큰 지급 |
| 프리미엄 기능 (토큰 충분) | 차감 후 기능 실행                      |
| 프리미엄 기능 (토큰 부족) | 402 에러, 충전 유도                    |
| 멤버십 한도 내 기능 사용  | 한도 차감, 토큰 미소모                 |

## 예상 소요 시간

| 파트                      | 예상 시간 |
| ------------------------- | --------- |
| Backend - 상품/결제 API   | 3일       |
| Backend - 토큰 관리       | 2일       |
| Backend - 멤버십          | 2일       |
| Frontend - 상점 화면      | 3일       |
| Frontend - 결제 연동      | 2일       |
| Frontend - 토큰 확인 모달 | 1일       |
| Database + 마이그레이션   | 1일       |
| 테스트                    | 2일       |
| **총합**                  | **16일**  |
