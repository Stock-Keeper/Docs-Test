# API 명세서 (Phase 1)

## 요약 ⚡

- RESTful API 설계 (JSON 포맷)
- 기본 URL: `https://api.example.com/v1`
- 인증: Bearer Token (JWT)
- 응답 코드: 2xx 성공, 4xx 클라이언트 오류, 5xx 서버 오류
- 한국투자증권 API 연동으로 실시간 시세 조회

---

## Phase 1 API 목록

### 인증 (Auth)

- `POST /auth/google` - Google OAuth 로그인
- `POST /auth/kakao` - Kakao OAuth 로그인
- `POST /auth/naver` - Naver OAuth 로그인
- `POST /auth/refresh` - Access Token 갱신
- `POST /auth/logout` - 로그아웃

### 사용자 (Users)

- `GET /users/me` - 내 정보 조회
- `PUT /users/me` - 내 정보 수정
- `DELETE /users/me` - 회원 탈퇴

### 포트폴리오 (Portfolios)

- `GET /portfolios` - 포트폴리오 목록 조회
- `POST /portfolios` - 포트폴리오 생성
- `GET /portfolios/{id}` - 포트폴리오 상세 조회
- `PUT /portfolios/{id}` - 포트폴리오 수정
- `DELETE /portfolios/{id}` - 포트폴리오 삭제
- `PUT /portfolios/{id}/order` - 포트폴리오 순서 변경

### 포트폴리오 종목 (Portfolio Stocks)

- `GET /portfolios/{id}/stocks` - 포트폴리오 내 종목 목록
- `POST /portfolios/{id}/stocks` - 종목 추가
- `PUT /portfolios/{id}/stocks/{stockId}` - 종목 수정
- `DELETE /portfolios/{id}/stocks/{stockId}` - 종목 삭제

### 종목 검색 (Stocks)

- `GET /stocks/search` - 종목 검색
- `GET /stocks/{ticker}/price` - 실시간 시세 조회

### 포트폴리오 현금 (Portfolio Cash)

- `GET /portfolios/{id}/cash` - 포트폴리오 내 현금 목록 조회
- `POST /portfolios/{id}/cash` - 포트폴리오 내 현금 추가
- `PUT /portfolios/{id}/cash/{currency}` - 포트폴리오 내 현금 수정
- `DELETE /portfolios/{id}/cash/{currency}` - 포트폴리오 내 현금 삭제

### 계좌 (Accounts) - 수동 입력

- `GET /accounts` - 계좌 목록 조회
- `POST /accounts` - 계좌 추가 (수동)
- `GET /accounts/{id}` - 계좌 상세 조회
- `PUT /accounts/{id}` - 계좌 수정
- `DELETE /accounts/{id}` - 계좌 삭제

### 계좌 종목 (Account Stocks)

- `GET /accounts/{id}/stocks` - 계좌 내 종목 목록 조회
- `POST /accounts/{id}/stocks` - 계좌 내 종목 추가
- `PUT /accounts/{id}/stocks/{stockId}` - 계좌 내 종목 수정
- `DELETE /accounts/{id}/stocks/{stockId}` - 계좌 내 종목 삭제

### 계좌 현금 (Account Cash) - 수동 입력

- `GET /accounts/{id}/cash` - 계좌 내 현금 잔고 조회
- `POST /accounts/{id}/cash` - 계좌 내 현금 추가
- `PUT /accounts/{id}/cash/{currency}` - 계좌 내 현금 수정
- `DELETE /accounts/{id}/cash/{currency}` - 계좌 내 현금 삭제

### 리밸런싱 (Rebalancing)

- `GET /portfolios/{id}/rebalancing` - 리밸런싱 분석
- `GET /portfolios/{id}/rebalancing/suggestions` - 리밸런싱 제안

### 설정 (Settings)

- `GET /settings` - 앱 설정 조회
- `PUT /settings/notification` - 앱 알림 on/off 설정
- `GET /settings/version` - 버전 정보 조회

### 포트폴리오 설정 (Portfolio Settings)

- `GET /portfolios/{id}/settings/notification` - 알림 설정 조회
- `PUT /portfolios/{id}/settings/notification` - 알림 설정 수정
- `GET /portfolios/{id}/settings/banner` - 배너 색상 조회
- `PUT /portfolios/{id}/settings/banner` - 배너 색상 수정
- `GET /portfolios/{id}/settings/threshold` - 임계치 조회
- `PUT /portfolios/{id}/settings/threshold` - 임계치 수정

### 알림 (Notifications)

- `GET /notifications` - 알림 목록 조회
- `PUT /notifications/{id}/read` - 알림 읽음 처리
- `PUT /notifications/read-all` - 모든 알림 읽음 처리
- `DELETE /notifications/{id}` - 알림 삭제

---

## API 상세

### 1. 인증 (Auth)

#### POST /auth/google

**설명**: Google OAuth 로그인

**Request Headers**

```
Content-Type: application/json
```

**Request Body**

```json
{
    "code": "4/0AdLIrYe...",
    "redirect_uri": "https://app.example.com/auth/callback"
}
```

**Response (200 OK)**

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "dGhpcyBpcyByZWZyZXNoIHRva2Vu...",
    "expires_in": 3600,
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "nickname": "사용자",
        "bio": null,
        "profile_image_url": "https://lh3.googleusercontent.com/...",
        "membership_type": "FREE",
        "is_verified": false
    }
}
```

**Error Response (400 Bad Request)**

```json
{
    "error": "invalid_code",
    "message": "Invalid authorization code"
}
```

---

#### POST /auth/refresh

**설명**: Access Token 갱신

**Request Body**

```json
{
    "refresh_token": "dGhpcyBpcyByZWZyZXNoIHRva2Vu..."
}
```

**Response (200 OK)**

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "bmV3IHJlZnJlc2ggdG9rZW4...",
    "expires_in": 3600,
    "token_type": "Bearer"
}
```

---

#### POST /auth/logout

**설명**: 로그아웃 (토큰 무효화)

**Request Headers**

```
Authorization: Bearer {access_token}
```

**Request Body**

```json
{
    "refresh_token": "dGhpcyBpcyByZWZyZXNoIHRva2Vu..."
}
```

**Response (200 OK)**

```json
{
    "message": "Logged out successfully"
}
```

---

### 2. 사용자 (Users)

#### GET /users/me

**설명**: 내 정보 조회

**Request Headers**

```
Authorization: Bearer {access_token}
```

**Response (200 OK)**

```json
{
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자",
    "bio": "투자를 즐기는 직장인입니다.",
    "profile_image_url": "https://lh3.googleusercontent.com/...",
    "provider": "GOOGLE",
    "membership_type": "FREE",
    "is_verified": false,
    "is_suspended": false,
    "created_at": "2025-12-01T10:00:00Z",
    "updated_at": "2025-12-15T14:30:00Z"
}
```

---

#### PUT /users/me

**설명**: 내 정보 수정

**Request Body**

```json
{
    "nickname": "새닉네임",
    "bio": "수정된 자기소개",
    "profile_image_url": "https://example.com/new-profile.jpg"
}
```

**Response (200 OK)**

```json
{
    "id": 1,
    "email": "user@example.com",
    "nickname": "새닉네임",
    "bio": "수정된 자기소개",
    "profile_image_url": "https://example.com/new-profile.jpg",
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /users/me

**설명**: 회원 탈퇴

**Response (200 OK)**

```json
{
    "message": "Account deleted successfully"
}
```

---

### 3. 포트폴리오 (Portfolios)

#### GET /portfolios

**설명**: 포트폴리오 목록 조회

**Response (200 OK)**

```json
[
    {
        "id": 1,
        "name": "메인 포트폴리오",
        "description": "장기 투자용",
        "banner_color": "#4CAF93",
        "account_id": 1,
        "total_value": 10000000,
        "total_profit": 500000,
        "profit_rate": 5.0,
        "stock_count": 5,
        "created_at": "2025-12-01T10:00:00Z",
        "updated_at": "2025-12-30T15:00:00Z"
    }
]
```

---

#### POST /portfolios

**설명**: 포트폴리오 생성

**Request Body**

```json
{
    "name": "새 포트폴리오",
    "description": "테스트용 포트폴리오",
    "banner_color": "#3498db"
}
```

**Response (201 Created)**

```json
{
    "id": 2,
    "name": "새 포트폴리오",
    "description": "테스트용 포트폴리오",
    "banner_color": "#3498db",
    "created_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /portfolios/

**설명**: 포트폴리오 상세 조회

**Response (200 OK)**

```json
{
    "id": 1,
    "name": "메인 포트폴리오",
    "description": "장기 투자용",
    "banner_color": "#4CAF93",
    "account_id": 1,
    "total_value": 10000000,
    "total_cost": 9500000,
    "total_profit": 500000,
    "profit_rate": 5.26,
    "stocks": [
        {
            "id": 1,
            "ticker": "005930",
            "stock_name": "삼성전자",
            "group": "반도체",
            "target_weight": 70.0,
            "current_weight": 72.0,
            "current_value": 7200000
        }
    ],
    "cash_entries": [
        {
            "currency": "KRW",
            "target_weight": 10.0
        }
    ],
    "created_at": "2025-12-01T10:00:00Z",
    "updated_at": "2025-12-30T15:00:00Z"
}
```

---

#### PUT /portfolios/

**설명**: 포트폴리오 수정

**Request Body**

```json
{
    "name": "수정된 포트폴리오",
    "description": "설명 수정",
    "banner_color": "#e74c3c"
}
```

**Response (200 OK)**

```json
{
    "id": 1,
    "name": "수정된 포트폴리오",
    "description": "설명 수정",
    "banner_color": "#e74c3c",
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /portfolios/

**설명**: 포트폴리오 삭제

**Response (200 OK)**

```json
{
    "message": "Portfolio deleted successfully"
}
```

---

### 4. 포트폴리오 종목 (Portfolio Stocks)

#### GET /portfolios//stocks

**설명**: 포트폴리오 내 종목 목록

**Response (200 OK)**

```json
[
    {
        "id": 1,
        "ticker": "005930",
        "stock_name": "삼성전자",
        "group": "반도체",
        "target_weight": 70.0,
        "current_price": 72000,
        "created_at": "2025-12-01T10:00:00Z"
    }
]
```

---

#### POST /portfolios//stocks

**설명**: 종목 추가

**Request Body**

```json
{
    "ticker": "005930",
    "group": "반도체",
    "target_weight": 70.0
}
```

**Response (201 Created)**

```json
{
    "id": 1,
    "ticker": "005930",
    "stock_name": "삼성전자",
    "group": "반도체",
    "target_weight": 70.0,
    "created_at": "2025-12-31T10:00:00Z"
}
```

**Error Response (400 Bad Request)**

```json
{
    "error": "stock_already_exists",
    "message": "This stock already exists in the portfolio"
}
```

---

#### PUT /portfolios//stocks/

**설명**: 종목 수정

**Request Body**

```json
{
    "group": "IT",
    "target_weight": 75.0
}
```

**Response (200 OK)**

```json
{
    "id": 1,
    "ticker": "005930",
    "stock_name": "삼성전자",
    "group": "IT",
    "target_weight": 75.0,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /portfolios//stocks/

**설명**: 종목 삭제

**Response (200 OK)**

```json
{
    "message": "Stock deleted successfully"
}
```

---

### 5. 종목 검색 (Stocks)

#### GET /stocks/search

**설명**: 종목 검색

**Query Parameters**

- `q` (required): 검색어 (종목명 또는 종목코드)
- `limit` (optional): 결과 개수 (default: 10, max: 50)

**Request Example**

```
GET /stocks/search?q=삼성&limit=5
```

**Response (200 OK)**

```json
[
    {
        "ticker": "005930",
        "stock_name": "삼성전자",
        "market": "KOSPI",
        "current_price": 72000
    },
    {
        "ticker": "028260",
        "stock_name": "삼성물산",
        "market": "KOSPI",
        "current_price": 95000
    }
]
```

---

#### GET /stocks//price

**설명**: 실시간 시세 조회 (한투증권 API 연동)

**Response (200 OK)**

```json
{
    "ticker": "005930",
    "stock_name": "삼성전자",
    "current_price": 72000,
    "change": 1000,
    "change_rate": 1.41,
    "volume": 15000000,
    "market": "KOSPI",
    "timestamp": "2025-12-31T14:30:00Z"
}
```

---

### 6. 포트폴리오 현금 (Portfolio Cash)

#### GET /portfolios//cash

**설명**: 포트폴리오 내 현금 목표 비중 목록 조회

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "cash_entries": [
        {
            "currency": "KRW",
            "target_weight": 10.0,
            "created_at": "2025-12-31T10:00:00Z"
        },
        {
            "currency": "USD",
            "target_weight": 5.0,
            "created_at": "2025-12-31T10:00:00Z"
        }
    ],
    "total_cash_weight": 15.0
}
```

---

#### POST /portfolios//cash

**설명**: 포트폴리오 내 현금 항목 추가

**Request Body**

```json
{
    "currency": "KRW",
    "target_weight": 10.0
}
```

**Response (201 Created)**

```json
{
    "portfolio_id": 1,
    "currency": "KRW",
    "target_weight": 10.0,
    "created_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /portfolios//cash/

**설명**: 포트폴리오 내 현금 항목 수정

**Request Body**

```json
{
    "target_weight": 15.0
}
```

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "currency": "KRW",
    "target_weight": 15.0,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /portfolios//cash/

**설명**: 포트폴리오 내 현금 항목 삭제

**Response (200 OK)**

```json
{
    "message": "Cash entry deleted successfully"
}
```

---

### 7. 계좌 (Accounts)

#### GET /accounts

**설명**: 계좌 목록 조회

**Response (200 OK)**

```json
[
    {
        "id": 1,
        "brokerage_name": "한국투자증권",
        "account_number": "****1234",
        "is_connected": true,
        "created_at": "2025-12-01T10:00:00Z"
    }
]
```

---

#### POST /accounts

**설명**: 계좌 추가 (수동)

**Request Body**

```json
{
    "brokerage_name": "한국투자증권",
    "account_number": "12345678901234"
}
```

**Response (201 Created)**

```json
{
    "id": 1,
    "brokerage_name": "한국투자증권",
    "account_number": "****1234",
    "is_connected": false,
    "created_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /accounts/

**설명**: 계좌 상세 조회

**Response (200 OK)**

```json
{
    "id": 1,
    "brokerage_name": "한국투자증권",
    "account_number": "****1234",
    "is_connected": true,
    "stocks": [
        {
            "id": 1,
            "ticker": "005930",
            "stock_name": "삼성전자",
            "current_quantity": 100,
            "bought_price": 70000,
            "currency": "KRW",
            "exchange": "KRX"
        }
    ],
    "cash_entries": [
        {
            "currency": "KRW",
            "amount": 1000000
        }
    ],
    "created_at": "2025-12-01T10:00:00Z",
    "updated_at": "2025-12-30T15:00:00Z"
}
```

---

#### PUT /accounts/

**설명**: 계좌 수정

**Request Body**

```json
{
    "brokerage_name": "삼성증권"
}
```

**Response (200 OK)**

```json
{
    "id": 1,
    "brokerage_name": "삼성증권",
    "account_number": "****1234",
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /accounts/

**설명**: 계좌 삭제

**Response (200 OK)**

```json
{
    "message": "Account deleted successfully"
}
```

---

### 8. 계좌 종목 (Account Stocks)

#### GET /accounts//stocks

**설명**: 계좌 내 종목 목록 조회

**Response (200 OK)**

```json
[
    {
        "id": 1,
        "ticker": "005930",
        "stock_name": "삼성전자",
        "group": "반도체",
        "current_quantity": 100,
        "bought_price": 70000,
        "current_price": 72000,
        "currency": "KRW",
        "exchange": "KRX",
        "profit": 200000,
        "profit_rate": 2.86
    }
]
```

---

#### POST /accounts//stocks

**설명**: 계좌 내 종목 추가

**Request Body**

```json
{
    "ticker": "005930",
    "group": "반도체",
    "current_quantity": 100,
    "bought_price": 70000,
    "currency": "KRW",
    "exchange": "KRX"
}
```

**Response (201 Created)**

```json
{
    "id": 1,
    "ticker": "005930",
    "stock_name": "삼성전자",
    "group": "반도체",
    "current_quantity": 100,
    "bought_price": 70000,
    "currency": "KRW",
    "exchange": "KRX",
    "created_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /accounts//stocks/

**설명**: 계좌 내 종목 수정

**Request Body**

```json
{
    "current_quantity": 150,
    "bought_price": 68000
}
```

**Response (200 OK)**

```json
{
    "id": 1,
    "ticker": "005930",
    "current_quantity": 150,
    "bought_price": 68000,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /accounts//stocks/

**설명**: 계좌 내 종목 삭제

**Response (200 OK)**

```json
{
    "message": "Stock entry deleted successfully"
}
```

---

### 9. 계좌 현금 (Account Cash)

#### GET /accounts//cash

**설명**: 계좌 내 현금 잔고 조회

**Response (200 OK)**

```json
{
    "account_id": 1,
    "cash_entries": [
        {
            "currency": "KRW",
            "amount": 1000000,
            "updated_at": "2025-12-31T10:00:00Z"
        },
        {
            "currency": "USD",
            "amount": 500.0,
            "updated_at": "2025-12-31T10:00:00Z"
        }
    ],
    "total_krw_value": 1650000
}
```

---

#### POST /accounts//cash

**설명**: 계좌 내 현금 추가

**Request Body**

```json
{
    "currency": "KRW",
    "amount": 1000000
}
```

**Response (201 Created)**

```json
{
    "account_id": 1,
    "currency": "KRW",
    "amount": 1000000,
    "created_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /accounts//cash/

**설명**: 계좌 내 현금 수정

**Request Body**

```json
{
    "amount": 1500000
}
```

**Response (200 OK)**

```json
{
    "account_id": 1,
    "currency": "KRW",
    "amount": 1500000,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /accounts//cash/

**설명**: 계좌 내 현금 삭제

**Response (200 OK)**

```json
{
    "message": "Cash entry deleted successfully"
}
```

---

### 10. 리밸런싱 (Rebalancing)

#### GET /portfolios//rebalancing

**설명**: 리밸런싱 분석

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "total_value": 10000000,
    "analysis": [
        {
            "ticker": "005930",
            "stock_name": "삼성전자",
            "current_weight": 72.0,
            "target_weight": 70.0,
            "deviation": 2.0,
            "action": "SELL",
            "suggested_amount": 200000
        },
        {
            "type": "CASH",
            "currency": "KRW",
            "current_weight": 8.0,
            "target_weight": 10.0,
            "deviation": -2.0,
            "action": "BUY",
            "suggested_amount": 200000
        }
    ],
    "is_balanced": false,
    "threshold_percentage": 20.0,
    "max_deviation": 2.0,
    "analyzed_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /portfolios//rebalancing/suggestions

**설명**: 리밸런싱 제안

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "suggestions": [
        {
            "order": 1,
            "action": "SELL",
            "ticker": "005930",
            "stock_name": "삼성전자",
            "quantity": 3,
            "estimated_amount": 216000,
            "reason": "목표 비중 초과 (현재 72% → 목표 70%)"
        }
    ],
    "estimated_transactions": 1,
    "generated_at": "2025-12-31T10:00:00Z"
}
```

---

### 11. 설정 (Settings)

#### GET /settings

**설명**: 앱 설정 조회

**Response (200 OK)**

```json
{
    "is_notification": true,
    "is_privacy": true,
    "is_tutorial_completed": true,
    "created_at": "2025-12-01T10:00:00Z",
    "updated_at": "2025-12-30T15:00:00Z"
}
```

---

#### PUT /settings/notification

**설명**: 앱 알림 on/off 설정

**Request Body**

```json
{
    "is_notification": false
}
```

**Response (200 OK)**

```json
{
    "is_notification": false,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /settings/version

**설명**: 버전 정보 조회

**Response (200 OK)**

```json
{
    "current_version": "1.0.0",
    "min_required_version": "1.0.0",
    "force_update": false,
    "release_notes": "첫 번째 릴리스"
}
```

---

### 12. 포트폴리오 설정 (Portfolio Settings)

#### GET /portfolios//settings/notification

**설명**: 알림 설정 조회

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "is_enabled": true,
    "alert_cycle": "WEEKLY",
    "alert_time": "09:00:00",
    "threshold_percentage": 20.0
}
```

---

#### PUT /portfolios//settings/notification

**설명**: 알림 설정 수정

**Request Body**

```json
{
    "is_enabled": true,
    "alert_cycle": "MONTHLY",
    "alert_time": "10:00:00"
}
```

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "is_enabled": true,
    "alert_cycle": "MONTHLY",
    "alert_time": "10:00:00",
    "threshold_percentage": 20.0,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /portfolios//settings/banner

**설명**: 배너 색상 조회

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "banner_color": "#4CAF93"
}
```

---

#### PUT /portfolios//settings/banner

**설명**: 배너 색상 수정

**Request Body**

```json
{
    "banner_color": "#3498db"
}
```

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "banner_color": "#3498db",
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /portfolios//settings/threshold

**설명**: 임계치 조회

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "threshold_percentage": 20.0
}
```

---

#### PUT /portfolios//settings/threshold

**설명**: 임계치 수정

**Request Body**

```json
{
    "threshold_percentage": 15.0
}
```

**Response (200 OK)**

```json
{
    "portfolio_id": 1,
    "threshold_percentage": 15.0,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

### 13. 알림 (Notifications)

#### GET /notifications

**설명**: 알림 목록 조회

**Query Parameters**

- `page` (optional): 페이지 번호 (default: 1)
- `limit` (optional): 페이지당 개수 (default: 20)
- `is_read` (optional): 읽음 여부 필터 (true/false)

**Response (200 OK)**

```json
{
    "notifications": [
        {
            "id": 1,
            "type": {
                "id": 1,
                "code": "REBALANCING_CYCLE",
                "name": "주기 알림"
            },
            "title": "리밸런싱 알림",
            "message": "메인 포트폴리오의 리밸런싱 주기가 도래했습니다.",
            "related_entity_id": 1,
            "is_read": false,
            "created_at": "2025-12-31T09:00:00Z"
        }
    ],
    "pagination": {
        "current_page": 1,
        "total_pages": 5,
        "total_count": 100,
        "has_next": true
    }
}
```

---

#### PUT /notifications//read

**설명**: 알림 읽음 처리

**Response (200 OK)**

```json
{
    "id": 1,
    "is_read": true,
    "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /notifications/read-all

**설명**: 모든 알림 읽음 처리

**Response (200 OK)**

```json
{
    "message": "All notifications marked as read",
    "count": 10
}
```

---

#### DELETE /notifications/

**설명**: 알림 삭제

**Response (200 OK)**

```json
{
    "message": "Notification deleted successfully"
}
```

---

## 공통 응답 코드

| 코드 | 설명             |
| ---- | ---------------- |
| 200  | 성공             |
| 201  | 생성 성공        |
| 400  | 잘못된 요청      |
| 401  | 인증 실패        |
| 403  | 권한 없음        |
| 404  | 리소스 없음      |
| 409  | 충돌 (중복 등)   |
| 422  | 유효성 검증 실패 |
| 429  | 요청 횟수 초과   |
| 500  | 서버 오류        |

---

## 관련 문서

- **DB 스키마**: `db-schema_p1.md` - 테이블 구조 및 관계
- **기술 스택**: `core/tech-stack.md` - 백엔드 기술 스택
- **보안**: `reference/security.md` - API 보안 체크리스트

---

> **작성일**: 2026-01-14
> **담당**: Backend
> **마지막 업데이트**: 2026-01-14 - Phase 1 API 명세서 초안 작성
