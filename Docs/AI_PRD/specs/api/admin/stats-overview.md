---
type: api
phase: P1
category: admin
method: GET
endpoint: /api/admin/stats/overview
auth: admin
related:
  api:
    - stats-users.md
    - stats-portfolios.md
---

# GET /api/admin/stats/overview

## 개요
관리자 - 전체 통계 조회

## 스펙

### Request
- **URL**: `/api/admin/stats/overview`
- **Method**: `GET`
- **Auth**: Bearer Token (ADMIN role 필수)

## Response

### 성공 (200)
```json
{
  "totalUsers": 1234,
  "todayNewUsers": 15,
  "dailyActiveUsers": 456,
  "totalPortfolios": 2345,
  "totalStocks": 12345,
  "connectedAccounts": 789,
  "usersByRole": {
    "USER": 1230,
    "ADMIN": 4
  },
  "usersByMembership": {
    "NOT": 1200,
    "PRO": 34
  },
  "lastUpdated": "2026-01-13T15:00:00Z"
}
```

### 필드 설명
| 필드 | 설명 | 계산 방법 |
|------|------|----------|
| totalUsers | 전체 가입자 수 | COUNT(users) |
| todayNewUsers | 오늘 신규 가입 | COUNT(users WHERE DATE(created_at) = TODAY) |
| dailyActiveUsers | DAU | COUNT(users WHERE DATE(last_login_at) = TODAY) |
| totalPortfolios | 전체 포트폴리오 수 | COUNT(portfolios) |
| totalStocks | 전체 종목 수 | COUNT(portfolio_items) |
| connectedAccounts | 연동 계좌 수 | COUNT(connected_accounts WHERE is_active = true) |

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 권한 없음 | "관리자 권한이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 role 확인 (ADMIN 아니면 403)
2. 각 통계 쿼리 실행:
   - totalUsers: SELECT COUNT(*) FROM users
   - todayNewUsers: SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()
   - dailyActiveUsers: SELECT COUNT(*) FROM users WHERE DATE(last_login_at) = CURDATE()
   - totalPortfolios: SELECT COUNT(*) FROM portfolios
   - totalStocks: SELECT COUNT(*) FROM portfolio_items
   - connectedAccounts: SELECT COUNT(*) FROM connected_accounts WHERE is_active = true
   - usersByRole: SELECT role, COUNT(*) FROM users GROUP BY role
   - usersByMembership: SELECT membership, COUNT(*) FROM users GROUP BY membership
3. 응답 반환
```

## 성능 고려사항
- 캐싱 권장 (TTL: 5분)
- 무거운 쿼리는 비동기 집계 테이블 사용 고려 (P2)

## 관련 스펙
- API: `stats-users.md`
- API: `stats-portfolios.md`
