---
type: db
phase: P1
table: refresh_tokens
related:
  api:
    - ../api/auth/google-callback.md
    - ../api/auth/refresh.md
    - ../api/auth/logout.md
---

# refresh_tokens 테이블

## 개요
Refresh Token 저장 (로그아웃 처리용)

## 스키마

```sql
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user (user_id),
  INDEX idx_refresh_tokens_hash (token_hash),
  INDEX idx_refresh_tokens_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | INT | Y | PK, AUTO_INCREMENT |
| user_id | UUID | Y | 사용자 ID (FK) |
| token_hash | VARCHAR(255) | Y | Refresh Token 해시값 (SHA-256) |
| expires_at | TIMESTAMP | Y | 토큰 만료 시각 |
| created_at | TIMESTAMP | Y | 생성 시각 |

## 토큰 해시 로직

```java
// Refresh Token 저장 시
String tokenHash = DigestUtils.sha256Hex(refreshToken);
refreshTokenRepository.save(new RefreshToken(userId, tokenHash, expiresAt));

// Refresh Token 검증 시
String tokenHash = DigestUtils.sha256Hex(refreshToken);
Optional<RefreshToken> found = refreshTokenRepository.findByTokenHash(tokenHash);
```

## 정리 배치 작업

```sql
-- 만료된 토큰 정리 (매일 실행)
DELETE FROM refresh_tokens 
WHERE expires_at < NOW();
```

## 로그아웃 처리

```sql
-- 특정 사용자의 모든 토큰 삭제 (전체 기기 로그아웃)
DELETE FROM refresh_tokens WHERE user_id = ?;

-- 특정 토큰만 삭제 (단일 기기 로그아웃)
DELETE FROM refresh_tokens WHERE token_hash = ?;
```

## 관련 스펙
- API: `../api/auth/google-callback.md`
- API: `../api/auth/refresh.md`
- API: `../api/auth/logout.md`
