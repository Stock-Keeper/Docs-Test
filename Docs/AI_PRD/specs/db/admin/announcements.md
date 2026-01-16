---
type: db
phase: P1
table: announcements
related:
  db:
    - auth/users.md
  api:
    - admin/announcements-list.md
    - admin/announcements-detail.md
    - admin/announcements-popup.md
---

# announcements 테이블

## 개요
공지사항, 패치노트, 이벤트, 점검 안내 관리

## 스키마

```sql
CREATE TABLE announcements (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  type ENUM('NOTICE', 'PATCH_NOTE', 'EVENT', 'MAINTENANCE') NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(20),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_popup BOOLEAN DEFAULT FALSE,
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_delete BOOLEAN DEFAULT FALSE,
  delete_at TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_announcements_type (type),
  INDEX idx_announcements_pinned (is_pinned),
  INDEX idx_announcements_period (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼 | 타입 | 필수 | 설명 | Phase |
|------|------|------|------|-------|
| id | INTEGER | Y | PK, AUTO_INCREMENT | P1 |
| type | ENUM | Y | NOTICE/PATCH_NOTE/EVENT/MAINTENANCE | P1 |
| title | VARCHAR(200) | Y | 제목 | P1 |
| content | TEXT | Y | 내용 (마크다운 지원) | P1 |
| version | VARCHAR(20) | N | 패치노트 버전 | P1 |
| is_pinned | BOOLEAN | Y | 상단 고정 | P1 |
| is_popup | BOOLEAN | Y | 팝업 공지 | P1 |
| start_at | TIMESTAMP | N | 노출 시작 | P1 |
| end_at | TIMESTAMP | N | 노출 종료 | P1 |
| created_by | INTEGER | N | FK → users.id (관리자) | P1 |
| created_at | TIMESTAMP | Y | 생성일 | P1 |
| updated_at | TIMESTAMP | Y | 수정일 | P1 |
| is_delete | BOOLEAN | Y | 논리적 삭제 | P1 |
| delete_at | TIMESTAMP | N | 삭제 일시 | P1 |

## 활용 예시

| type | 사용 목적 |
|------|----------|
| NOTICE | 일반 공지사항, 서비스 안내 |
| PATCH_NOTE | 앱 버전별 업데이트 내역 |
| EVENT | 프로모션, 이벤트 안내 |
| MAINTENANCE | 서버 점검, 긴급 공지 |

## 관련 스펙
- DB: `users.md`
