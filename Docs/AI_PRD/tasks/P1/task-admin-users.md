---
type: task
phase: P1
domain: admin
status: not-started

specs:
    api:
        - admin/users-list.md
        - admin/users-detail.md
        - admin/users-role.md
        - admin/users-status.md
        - admin/users-export.md   # TODO: 누락된 CSV 내보내기 API 스펙 작성 필요
    db:
        - admin/audit-logs.md
    ui:
        - admin/users-list.md
        - admin/users-detail.md

tech:
    backend: spring-boot
    frontend: next-js
---

# Task: Admin 사용자 관리 기능 구현

## 목표

관리자 대시보드 - 사용자 목록 조회, 상세 조회, 역할/상태 변경 기능 구현

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `AdminUserController` 생성
    - [ ] `GET /api/admin/users` - 사용자 목록
    - [ ] `GET /api/admin/users/{id}` - 사용자 상세
    - [ ] `PATCH /api/admin/users/{id}/role` - 역할 변경
    - [ ] `PATCH /api/admin/users/{id}/status` - 상태 변경
    - [ ] `GET /api/admin/users/export` - CSV 내보내기
- [ ] `AdminUserService` 생성
    - [ ] 목록 조회 (검색, 필터, 페이지네이션)
    - [ ] 상세 조회 (통계 포함)
    - [ ] 역할 변경 (로그 기록)
    - [ ] 상태 변경 (로그 기록, 토큰 무효화)
- [ ] `AuditLog` 엔티티 생성
- [ ] `AuditLogRepository` 생성
- [ ] 관리자 권한 검증 인터셉터/AOP

### Frontend (Next.js)

- [ ] `/users` 페이지 생성
    - [ ] 사용자 테이블 컴포넌트
    - [ ] 검색바 컴포넌트
    - [ ] 필터 드롭다운
    - [ ] 페이지네이션
- [ ] 사용자 상세 모달
    - [ ] 기본 정보 표시
    - [ ] 통계 정보 표시
    - [ ] 역할 변경 버튼
    - [ ] 상태 변경 버튼
- [ ] 역할 변경 다이얼로그
- [ ] 상태 변경 다이얼로그 (사유 입력)
- [ ] CSV 내보내기 기능

### Database

- [ ] `audit_logs` 테이블 생성
- [ ] users 테이블 `last_login_at`, `login_count` 컬럼 확인 (이미 users.md에 포함)
- [ ] 사용자 정지: `is_suspended = TRUE`, 탈퇴: `is_delete = TRUE` 패턴 사용

## 완료 조건

- [ ] 사용자 목록 조회 (검색, 필터, 정렬, 페이지네이션)
- [ ] 사용자 상세 조회 (통계 포함)
- [ ] 역할 변경 시 audit_logs에 기록
- [ ] 상태 변경 시 audit_logs에 기록 + 토큰 무효화
- [ ] CSV 내보내기
- [ ] 자기 자신 변경 불가 처리

## 테스트 케이스

| 케이스              | 예상 결과                                 |
| ------------------- | ----------------------------------------- |
| 사용자 목록 조회    | 페이지네이션 포함 목록 반환               |
| 검색                | 이메일/닉네임 부분 일치 검색              |
| 역할 변경           | role 업데이트 + 로그 기록                 |
| 상태 비활성화       | is_suspended=true + 토큰 삭제 + 로그 기록 |
| 본인 역할 변경 시도 | 400 에러                                  |

## 예상 소요 시간

| 파트        | 예상 시간 |
| ----------- | --------- |
| Backend API | 3일       |
| Frontend UI | 3일       |
| 테스트      | 1일       |
| **총합**    | **7일**   |
