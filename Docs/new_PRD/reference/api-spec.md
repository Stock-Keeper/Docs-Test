# API 명세서

## 요약 ⚡

- RESTful API 설계 (JSON 포맷)
- 기본 URL: `https://api.example.com/v1`
- 인증: Bearer Token (JWT)
- 응답 코드: 2xx 성공, 4xx 클라이언트 오류, 5xx 서버 오류
- 한국투자증권 API 연동으로 실시간 시세 조회

---

## Phase 1 (현재)

### API 목록

#### 인증 (Auth)
- `POST /auth/google` - Google OAuth 로그인
- `POST /auth/refresh` - Access Token 갱신
- `POST /auth/logout` - 로그아웃

#### 사용자 (Users)
- `GET /users/me` - 내 정보 조회
- `PUT /users/me` - 내 정보 수정
- `DELETE /users/me` - 회원 탈퇴

#### 포트폴리오 (Portfolios)
- `GET /portfolios` - 포트폴리오 목록 조회
- `POST /portfolios` - 포트폴리오 생성
- `GET /portfolios/{id}` - 포트폴리오 상세 조회
- `PUT /portfolios/{id}` - 포트폴리오 수정
- `DELETE /portfolios/{id}` - 포트폴리오 삭제
- `PUT /portfolios/{id}/order` - 포트폴리오 순서 변경

#### 종목 (Stocks)
- `GET /portfolios/{id}/stocks` - 포트폴리오 내 종목 목록
- `POST /portfolios/{id}/stocks` - 종목 추가
- `PUT /stocks/{id}` - 종목 수정
- `DELETE /stocks/{id}` - 종목 삭제
- `GET /stocks/search` - 종목 검색
- `GET /stocks/{code}/price` - 실시간 시세 조회

#### 리밸런싱 (Rebalancing)
- `GET /portfolios/{id}/rebalancing` - 리밸런싱 분석
- `GET /portfolios/{id}/rebalancing/suggestions` - 리밸런싱 제안

#### 설정 (Settings)
- `GET /settings` - 앱 설정 조회
- `PUT /settings/notification` - 앱 알림 on/off 설정
- `GET /settings/version` - 버전 정보 조회

#### 포트폴리오 설정 (Portfolio Settings)
- `GET /portfolios/{id}/settings/notification` - 알림 설정 조회
- `PUT /portfolios/{id}/settings/notification` - 알림 설정 수정
- `GET /portfolios/{id}/settings/banner` - 배너 색상 조회
- `POST /portfolios/{id}/settings/banner` - 배너 색상 설정
- `PUT /portfolios/{id}/settings/banner` - 배너 색상 수정
- `GET /portfolios/{id}/settings/threshold` - 임계치 조회
- `PUT /portfolios/{id}/settings/threshold` - 임계치 수정

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
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "김세현",
    "profile_image_url": "https://lh3.googleusercontent.com/..."
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

**Request Headers**
```
Content-Type: application/json
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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "bmV3IHJlZnJlc2ggdG9rZW4...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Error Response (401 Unauthorized)**
```json
{
  "error": "invalid_token",
  "message": "Refresh token is invalid or expired"
}
```

---

#### POST /auth/logout

**설명**: 로그아웃 (토큰 무효화)

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
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
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "김세현",
  "profile_image_url": "https://lh3.googleusercontent.com/...",
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-15T14:30:00Z"
}
```

---

#### PUT /users/me

**설명**: 내 정보 수정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "김세현_수정",
  "profile_image_url": "https://example.com/new-profile.jpg"
}
```

**Response (200 OK)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "김세현_수정",
  "profile_image_url": "https://example.com/new-profile.jpg",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /users/me

**설명**: 회원 탈퇴

**Request Headers**
```
Authorization: Bearer {access_token}
```

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

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
[
  {
    "id": "portfolio-uuid-1",
    "name": "메인 포트폴리오",
    "description": "장기 투자용",
    "is_default": true,
    "display_order": 1,
    "total_value": 10000000,
    "total_profit": 500000,
    "profit_rate": 5.0,
    "stock_count": 5,
    "created_at": "2025-12-01T10:00:00Z",
    "updated_at": "2025-12-30T15:00:00Z"
  },
  {
    "id": "portfolio-uuid-2",
    "name": "단기 포트폴리오",
    "description": "단기 매매용",
    "is_default": false,
    "display_order": 2,
    "total_value": 5000000,
    "total_profit": -100000,
    "profit_rate": -2.0,
    "stock_count": 3,
    "created_at": "2025-12-10T14:00:00Z",
    "updated_at": "2025-12-30T15:00:00Z"
  }
]
```

---

#### POST /portfolios

**설명**: 포트폴리오 생성

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "새 포트폴리오",
  "description": "테스트용 포트폴리오"
}
```

**Response (201 Created)**
```json
{
  "id": "portfolio-uuid-3",
  "name": "새 포트폴리오",
  "description": "테스트용 포트폴리오",
  "is_default": false,
  "display_order": 3,
  "created_at": "2025-12-31T10:00:00Z"
}
```

**Error Response (400 Bad Request)**
```json
{
  "error": "limit_exceeded",
  "message": "Maximum 5 portfolios allowed"
}
```

---

#### GET /portfolios/{id}

**설명**: 포트폴리오 상세 조회

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "id": "portfolio-uuid-1",
  "name": "메인 포트폴리오",
  "description": "장기 투자용",
  "is_default": true,
  "total_value": 10000000,
  "total_cost": 9500000,
  "total_profit": 500000,
  "profit_rate": 5.26,
  "stocks": [
    {
      "id": "stock-uuid-1",
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "quantity": 100,
      "average_price": 70000,
      "current_price": 72000,
      "current_value": 7200000,
      "profit": 200000,
      "profit_rate": 2.86,
      "current_ratio": 72.0,
      "target_ratio": 70.0
    },
    {
      "id": "stock-uuid-2",
      "stock_code": "000660",
      "stock_name": "SK하이닉스",
      "quantity": 20,
      "average_price": 130000,
      "current_price": 135000,
      "current_value": 2700000,
      "profit": 100000,
      "profit_rate": 3.85,
      "current_ratio": 27.0,
      "target_ratio": 30.0
    }
  ],
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-30T15:00:00Z"
}
```

---

#### PUT /portfolios/{id}

**설명**: 포트폴리오 수정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "수정된 포트폴리오",
  "description": "설명 수정"
}
```

**Response (200 OK)**
```json
{
  "id": "portfolio-uuid-1",
  "name": "수정된 포트폴리오",
  "description": "설명 수정",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /portfolios/{id}

**설명**: 포트폴리오 삭제

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "message": "Portfolio deleted successfully"
}
```

**Error Response (400 Bad Request)**
```json
{
  "error": "cannot_delete_last",
  "message": "Cannot delete the last portfolio"
}
```

---

### 4. 종목 (Stocks)

#### GET /portfolios/{id}/stocks

**설명**: 포트폴리오 내 종목 목록

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
[
  {
    "id": "stock-uuid-1",
    "stock_code": "005930",
    "stock_name": "삼성전자",
    "quantity": 100,
    "average_price": 70000,
    "current_price": 72000,
    "current_value": 7200000,
    "profit": 200000,
    "profit_rate": 2.86,
    "current_ratio": 72.0,
    "target_ratio": 70.0
  }
]
```

---

#### POST /portfolios/{id}/stocks

**설명**: 종목 추가

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "stock_code": "005930",
  "quantity": 100,
  "target_ratio": 70.0
}
```

**Response (201 Created)**
```json
{
  "id": "stock-uuid-1",
  "stock_code": "005930",
  "stock_name": "삼성전자",
  "quantity": 100,
  "target_ratio": 70.0,
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

#### PUT /stocks/{id}

**설명**: 종목 수정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "quantity": 120,
  "target_ratio": 75.0
}
```

**Response (200 OK)**
```json
{
  "id": "stock-uuid-1",
  "stock_code": "005930",
  "stock_name": "삼성전자",
  "quantity": 120,
  "target_ratio": 75.0,
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### DELETE /stocks/{id}

**설명**: 종목 삭제

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "message": "Stock deleted successfully"
}
```

---

#### GET /stocks/search

**설명**: 종목 검색

**Request Headers**
```
Authorization: Bearer {access_token}
```

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
    "stock_code": "005930",
    "stock_name": "삼성전자",
    "market": "KOSPI",
    "current_price": 72000
  },
  {
    "stock_code": "028260",
    "stock_name": "삼성물산",
    "market": "KOSPI",
    "current_price": 95000
  }
]
```

---

#### GET /stocks/{code}/price

**설명**: 실시간 시세 조회 (한투증권 API 연동)

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "stock_code": "005930",
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

### 5. 리밸런싱 (Rebalancing)

#### GET /portfolios/{id}/rebalancing

**설명**: 리밸런싱 분석

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "total_value": 10000000,
  "threshold": 5.0,
  "needs_rebalancing": true,
  "stocks": [
    {
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "current_ratio": 72.0,
      "target_ratio": 70.0,
      "difference": 2.0,
      "needs_adjustment": false
    },
    {
      "stock_code": "000660",
      "stock_name": "SK하이닉스",
      "current_ratio": 27.0,
      "target_ratio": 30.0,
      "difference": -3.0,
      "needs_adjustment": false
    }
  ]
}
```

---

#### GET /portfolios/{id}/rebalancing/suggestions

**설명**: 리밸런싱 제안

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "suggestions": [
    {
      "stock_code": "005930",
      "stock_name": "삼성전자",
      "action": "SELL",
      "quantity": 5,
      "amount": 360000,
      "priority": 1
    },
    {
      "stock_code": "000660",
      "stock_name": "SK하이닉스",
      "action": "BUY",
      "quantity": 3,
      "amount": 405000,
      "priority": 2
    }
  ]
}
```

---

### 6. 설정 (Settings)

#### GET /settings

**설명**: 앱 설정 조회

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "notification_enabled": true,
  "app_version": "1.0.0",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /settings/notification

**설명**: 앱 알림 on/off 설정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "notification_enabled": false
}
```

**Response (200 OK)**
```json
{
  "notification_enabled": false,
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /settings/version

**설명**: 버전 정보 조회

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "current_version": "1.0.0",
  "latest_version": "1.0.1",
  "update_required": false,
  "update_url": "https://play.google.com/store/apps/...",
  "release_notes": "버그 수정 및 성능 개선"
}
```

---

### 7. 포트폴리오 설정 (Portfolio Settings)

#### GET /portfolios/{id}/settings/notification

**설명**: 포트폴리오 알림 설정 조회

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "is_enabled": true,
  "frequency": "weekly",
  "notification_time": "09:00",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /portfolios/{id}/settings/notification

**설명**: 포트폴리오 알림 설정 수정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "is_enabled": true,
  "frequency": "daily",
  "notification_time": "10:00"
}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "is_enabled": true,
  "frequency": "daily",
  "notification_time": "10:00",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /portfolios/{id}/settings/banner

**설명**: 포트폴리오 배너 색상 조회

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "banner_color": "#4A90D9",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### POST /portfolios/{id}/settings/banner

**설명**: 포트폴리오 배너 색상 설정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "banner_color": "#4A90D9"
}
```

**Response (201 Created)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "banner_color": "#4A90D9",
  "created_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /portfolios/{id}/settings/banner

**설명**: 포트폴리오 배너 색상 수정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "banner_color": "#FF6B6B"
}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "banner_color": "#FF6B6B",
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### GET /portfolios/{id}/settings/threshold

**설명**: 포트폴리오 리밸런싱 임계치 조회

**Request Headers**
```
Authorization: Bearer {access_token}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "threshold": 5.0,
  "updated_at": "2025-12-31T10:00:00Z"
}
```

---

#### PUT /portfolios/{id}/settings/threshold

**설명**: 포트폴리오 리밸런싱 임계치 수정

**Request Headers**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**
```json
{
  "threshold": 3.0
}
```

**Response (200 OK)**
```json
{
  "portfolio_id": "portfolio-uuid-1",
  "threshold": 3.0,
  "updated_at": "2025-12-31T10:00:00Z"
}
```

**Error Response (400 Bad Request)**
```json
{
  "error": "invalid_threshold",
  "message": "Threshold must be between 1.0 and 20.0"
}
```

---

## 공통 요소

### 인증 헤더

모든 인증이 필요한 API는 다음 헤더 필수:

```
Authorization: Bearer {access_token}
```

### 오류 응답 형식

모든 오류 응답은 다음 형식:

```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": {} // optional
}
```

### HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| 200 OK | 성공 (GET, PUT, DELETE) |
| 201 Created | 생성 성공 (POST) |
| 400 Bad Request | 잘못된 요청 (입력값 오류) |
| 401 Unauthorized | 인증 실패 (토큰 없음/만료) |
| 403 Forbidden | 권한 없음 |
| 404 Not Found | 리소스 없음 |
| 429 Too Many Requests | Rate Limit 초과 |
| 500 Internal Server Error | 서버 에러 |
| 503 Service Unavailable | 서비스 일시 중단 |

### Pagination

목록 조회 API는 페이지네이션 지원 (Phase 2):

**Query Parameters**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 결과 수 (default: 20, max: 100)

**Response**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

## 외부 API 연동

### 한국투자증권 API

| 항목 | 내용 |
|------|------|
| API 문서 | [API 포털](https://apiportal.koreainvestment.com/apiservice) |
| 인증 | App Key + App Secret |
| 사용 API | 국내주식시세, 종목검색 |
| Rate Limit | 분당 20~30회 (문서 확인 필요) |
| 장 운영 시간 | 평일 09:00-15:30 |

**백엔드 처리**
1. 클라이언트 요청 → 백엔드 API
2. 백엔드가 한투증권 API 호출
3. 시세 데이터 가공 후 응답
4. [P2] Redis 캠싱 (1분 TTL)

---

## Phase 2+ (확장 고려사항)

### Phase 2 기능

- [P2] **GraphQL API**
  - REST API와 병행 제공
  - 클라이언트가 필요한 필드만 조회

- [P2] **Webhook**
  - 리밸런싱 알림 발송 시 Webhook 호출
  - 사용자 지정 Webhook URL

- [P2] **Batch API**
  - 여러 종목 일괄 추가/수정
  - `/portfolios/{id}/stocks/batch`

### Phase 3 기능

- [P3] **실시간 통신 (WebSocket)**
  - 실시간 시세 발송
  - 리밸런싱 상태 실시간 업데이트

- [P3] **API 버전관리**
  - `/v2/...` 로 새 버전 제공
  - v1 유지보수 1년

---

## 관련 문서

- **인증**: `features/auth.md` - JWT, OAuth 상세
- **보안**: `reference/security.md` - API 보안 헤더
- **DB 스키마**: `reference/db-schema.md` - 테이블 구조
- **기술 스택**: `core/tech-stack.md#backend` - Spring Boot 설정

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: Backend + API
