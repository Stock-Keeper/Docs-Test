---
type: db
domain: community
source: _inbox/community/01_db_schema.md
---
# [UPDATE] Community DB Schema

> `community` 도메인의 DB 스키마 변경 사항입니다.

## 1. community_profiles (수정)

사용자 프로필 테이블의 닉네임 길이 조정 및 설정 필드 추가.

- **[UPDATE]** `nickname` 길이: `VARCHAR(50)` → `VARCHAR(20)` (기획 준수)
- **[NEW]** `show_trade` (거래 공개 여부)
- **[NEW]** `notify_*` (알림 설정 6종)
- **[NOTE]** `user_id` 타입은 기존 `specs/db/auth/users.md`와 일치하므로 `INT` 유지 (Inbox의 VARCHAR(36) 미반영)

## 2. reports (구조 변경 제안)

신고 테이블의 사유 관리 방식 변경 제안.

- **[UPDATE]** `target_type`: `ENUM('POST', 'COMMENT', 'USER')` (기존 `ARTICLE`, `REPLY` 용어 변경 제안)
- **[UPDATE]** `reason`: `ENUM` 타입으로 변경 제안 (기존 `report_reasons` 테이블 참조 방식과 충돌)

## 3. community_bookmarks (확인)

- `articles` 테이블 참조 유지 (Inbox의 `post_id`는 `article_id`로 매핑)

## 4. user_blocks (확인)

- 기존 `user_blocks` 테이블 유지.

---

## 🔍 확인 필요 사항

### 1. 신고 사유(Report Reason) 관리 방식

Inbox 요청은 `ENUM` 컬럼을 제안했으나, 기존 스펙은 `report_reasons` 마스터 테이블을 사용 중입니다.
어떤 방식을 따르시겠습니까?

- [X] **옵션 A: 기존 유지 (Master Table)**
  - 장점: 운영 중 사유 추가/수정 용이 (DB 스키마 변경 불필요)
  - 단점: 조인 쿼리 필요
- [ ] **옵션 B: ENUM 변경 (Inbox 요청 반영)**
  - 장점: 구조 단순화, 쿼리 직관적
  - 단점: 사유 추가 시 스키마 변경(ALTER TABLE) 필요
- [ ] 기타: ________________

### 2. 용어 통일 (Article vs Post)

기존 스펙은 `Article`/`Reply`를 사용하고, Inbox는 `Post`/`Comment`를 사용합니다.
UI 용어(`게시글`, `댓글`)와 맞추어 스키마 용어도 변경하시겠습니까?

- [ ] **옵션 A: 기존 유지 (Article/Reply)**
  - 코드/DB 변경 최소화
- [X] **옵션 B: 변경 (Post/Comment)**
  - UI 용어와 일치하여 직관성 향상 (테이블명 변경 필요: `community_articles` → `community_posts`)
- [ ] 기타: ________________
