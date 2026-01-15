---
# P1 사용자(User) DB 스키마

## 원본 내용
> AI_PRD/_inbox/sk_p1.md (User 관련 테이블)
> - users, user_consents, token_vault, settings
> - Phase 1 필수 기능

## AI 분석 결과
- 추론 유형: db
- 추론 작업: NEW
- 추론 Phase: P1
- 연관 도메인: 인증, 사용자 관리

## 정형화된 초안

```dbml
// 사용자 정보
Table users {
  id integer [primary key, increment]
  email varchar // 재가입자를 위해 null 허용
  nickname varchar
  bio text // 자기소개
  provider enum ('GOOGLE', 'KAKAO', 'NAVER') // 소셜 제공자
  role enum ('USER', 'ADMIN') // 사용자, 관리자
  profile_image_url varchar
  created_at timestamp // 가입 날짜
  updated_at timestamp // 업데이트 날짜
  membership_type enum ('FREE', 'PRO', 'EXPERT') // 멤버쉽 여부
  is_verified boolean // 본인인증 여부
  last_login_at timestamp // 마지막 로그인 날짜
  login_count integer // 로그인 횟수
  is_suspended boolean [default: false] // 현재 정지 상태
  suspended_until timestamp // 정지 해제 일시
  is_delete boolean [default: false] // 논리적 삭제 여부
  delete_at timestamp // 논리적 삭제 일시

  Indexes {
    email [unique, name: 'idx_users_email']
    provider [name: 'idx_users_provider']
  }
}

// 사용자 동의 정보 (약관 등)
Table user_consents {
  id integer [primary key, increment]
  user_id integer [ref: > users.id]
  consent_type enum('TERMS', 'PRIVACY', 'MARKETING')
  is_agreed boolean [default: false]
  agreed_at timestamp
  version varchar
  created_at timestamp
  updated_at timestamp
}

// 토큰 암호화 저장소
Table token_vault {
  id integer [primary key, increment]
  owner_type enum('USER', 'ACCOUNT') [not null]
  owner_id integer [not null]
  token_type enum('ACCESS', 'REFRESH') [not null]
  encrypted_token text [not null]
  iv varchar [not null]
  expires_at timestamp
  created_at timestamp [default: `now()`]
  updated_at timestamp
  is_revoked boolean [default: false]
}

// 사용자 설정값
Table settings {
  id integer [primary key, increment]
  user_id integer [ref: - users.id]
  is_notification boolean
  is_privacy boolean
  is_tutorial_completed boolean
  created_at timestamp
  updated_at timestamp
}
```

## 확인 필요 사항
- [ ] `token_vault`는 Users와 Accounts 모두 사용하므로 공통 모듈로 볼 수도 있으나, 인증의 핵심이므로 여기에 포함했습니다.
---
