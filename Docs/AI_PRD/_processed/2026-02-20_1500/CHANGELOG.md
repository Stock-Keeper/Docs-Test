# CHANGELOG - 배치 2026-02-20_1500

> 처리일: 2026-02-25

## 📋 요약

| 항목        | 수량 |
| ----------- | ---- |
| NEW 스펙    | 11개 |
| UPDATE 스펙 | 5개  |
| DELETE 스펙 | 0개  |

## ✅ NEW (신규 생성)

### DB (4개)

| 파일                                 | 테이블                | 설명                |
| ------------------------------------ | --------------------- | ------------------- |
| `specs/db/bm/membership-products.md` | `membership_products` | 멤버십 구독 상품    |
| `specs/db/bm/payment-histories.md`   | `payment_histories`   | 결제 내역           |
| `specs/db/bm/token-histories.md`     | `token_histories`     | 토큰 적립/사용 내역 |
| `specs/db/bm/token-packages.md`      | `token_packages`      | 토큰 패키지 상품    |

### API (5개)

| 파일                                   | 엔드포인트                        | 설명           |
| -------------------------------------- | --------------------------------- | -------------- |
| `specs/api/bm/products.md`             | GET /api/bm/products              | 상품 목록 조회 |
| `specs/api/bm/token-buy.md`            | POST /api/bm/tokens/buy           | 토큰 구매      |
| `specs/api/bm/membership-subscribe.md` | POST /api/bm/membership/subscribe | 멤버십 구독    |
| `specs/api/portfolio/ai-optimize.md`   | POST /api/portfolio/{id}/optimize | AI 비중 추천   |
| `specs/api/portfolio/backtest.md`      | POST /api/portfolio/backtest      | 백테스팅 실행  |

### UI (2개)

| 파일                             | 화면             | 설명                       |
| -------------------------------- | ---------------- | -------------------------- |
| `specs/ui/bm/shop.md`            | 토큰/멤버십 상점 | 토큰 구매/멤버십 구독 화면 |
| `specs/ui/portfolio/backtest.md` | 백테스팅 화면    | 백테스팅 설정/결과 화면    |

## 🔄 UPDATE (변경)

| 파일                                    | 변경 내용                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `specs/db/auth/users.md`                | `membership_type` → `membership_tier` (ENUM 변경), `token_balance`, `membership_expires_at` 추가 |
| `specs/api/community/portfolio-copy.md` | 멤버십/토큰 권한 체크 로직 추가, 402 에러 추가, related 업데이트                                 |
| `specs/api/community/post-detail.md`    | 포트폴리오 프리미엄 응답 필드 (`isDetailUnlocked`, `premiumStats`) 추가                          |
| `specs/ui/community/post-detail.md`     | 포트폴리오 카피/상세열람 버튼 및 블러 UI 추가                                                    |
| `specs/ui/portfolio/detail.md`          | AI 비중 추천 버튼/모달, 백테스팅 실행 버튼 추가                                                  |

## 📎 원본 출처

- `_inbox/bm-token-membership.md` (비즈니스 모델: 토큰/멤버십 시스템 상세 설계)
- `_inbox/추가사항.md` (모든 BM은 P3에 도입)
