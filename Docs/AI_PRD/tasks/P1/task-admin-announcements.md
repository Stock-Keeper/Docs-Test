---
type: task
phase: P1
domain: admin
status: not-started

specs:
    api:
        - admin/announcements-list.md
        - admin/announcements-detail.md
        - admin/announcements-popup.md
    db:
        - admin/announcements.md
    ui:
        - admin/announcements.md

tech:
    backend: spring-boot
    frontend: next-js
    app: react-native
---

# Task: Admin 공지사항 관리 기능 구현

## 목표

공지사항, 패치노트, 이벤트, 점검 안내 CRUD 기능 구현

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `Announcement` 엔티티 생성
- [ ] `AnnouncementRepository` 생성
- [ ] `AnnouncementService` 생성
    - [ ] 목록 조회 (타입별 필터, 페이지네이션)
    - [ ] 상세 조회
    - [ ] 생성/수정/삭제 (논리적 삭제)
    - [ ] 상단 고정/해제
    - [ ] 팝업 설정
- [ ] `AdminAnnouncementController` 생성
    - [ ] `GET /api/admin/announcements` - 목록 조회
    - [ ] `GET /api/admin/announcements/{id}` - 상세 조회
    - [ ] `POST /api/admin/announcements` - 생성
    - [ ] `PUT /api/admin/announcements/{id}` - 수정
    - [ ] `DELETE /api/admin/announcements/{id}` - 삭제
    - [ ] `PATCH /api/admin/announcements/{id}/pin` - 상단 고정
- [ ] `AnnouncementController` (사용자용)
    - [ ] `GET /api/announcements` - 공개된 공지 목록
    - [ ] `GET /api/announcements/popup` - 팝업 공지

### Frontend - Admin (Next.js)

- [ ] `/announcements` 페이지 생성
    - [ ] 공지사항 테이블 컴포넌트
    - [ ] 타입별 필터 탭 (전체/공지/패치노트/이벤트/점검)
    - [ ] 검색/정렬
    - [ ] 페이지네이션
- [ ] 공지사항 작성/수정 모달
    - [ ] 타입 선택
    - [ ] 제목/내용 입력 (마크다운 에디터)
    - [ ] 버전 입력 (패치노트용)
    - [ ] 노출 기간 설정
    - [ ] 상단 고정/팝업 토글
- [ ] 삭제 확인 다이얼로그

### Frontend - App (React Native)

- [ ] 공지사항 목록 화면
- [ ] 공지사항 상세 화면 (마크다운 렌더링)
- [ ] 앱 시작 시 팝업 공지 표시

### Database

- [ ] `announcements` 테이블 생성

## 완료 조건

- [ ] 관리자: 공지사항 CRUD 동작
- [ ] 관리자: 타입별 필터링
- [ ] 관리자: 상단 고정/팝업 설정
- [ ] 사용자: 공개된 공지사항 조회
- [ ] 사용자: 앱 시작 시 팝업 공지 표시

## 테스트 케이스

| 케이스        | 예상 결과                          |
| ------------- | ---------------------------------- |
| 공지사항 생성 | DB 저장, 목록에 표시               |
| 상단 고정     | is_pinned=true, 목록 최상단        |
| 팝업 설정     | is_popup=true, 앱 시작 시 표시     |
| 노출 기간 외  | 사용자 목록에서 제외               |
| 논리적 삭제   | is_delete=true, 관리자만 복구 가능 |

## 예상 소요 시간

| 파트                         | 예상 시간 |
| ---------------------------- | --------- |
| Backend - 엔티티/Repository  | 0.5일     |
| Backend - Service/Controller | 1.5일     |
| Frontend Admin - UI          | 2일       |
| Frontend App - UI            | 1일       |
| 테스트                       | 1일       |
| **총합**                     | **6일**   |
