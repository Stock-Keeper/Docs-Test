# 처리 내역 - 2026-01-16_1342

## 원본 파일
- [VALIDATE] 2026-01-16.md (검증 결과 파일)

## 삭제된 스펙 (1개)

| 파일 | 테이블 | 사유 |
|------|--------|------|
| specs/db/refresh-tokens.md | refresh_tokens | token-vault로 통합 |

## 수정된 스펙 (3개)

| 파일 | 변경 내용 |
|------|----------|
| specs/db/accounts.md | phase: P1 → P2 |
| specs/db/account-stock-entries.md | phase: P1 → P2 |
| specs/db/account-cash-entries.md | phase: P1 → P2 |

## 생성된 스펙 (10개)

| 파일 | 엔드포인트 | 작업 |
|------|-----------|------|
| specs/api/admin/announcements-list.md | GET /api/announcements | NEW |
| specs/api/admin/announcements-detail.md | GET /api/announcements/{id} | NEW |
| specs/api/admin/announcements-popup.md | GET /api/announcements/popup | NEW |
| specs/api/portfolio/snapshots-list.md | GET /api/portfolios/{id}/snapshots | NEW |
| specs/api/portfolio/snapshots-detail.md | GET /api/portfolios/{id}/snapshots/{id} | NEW |
| specs/api/portfolio/snapshots-create.md | POST /api/portfolios/{id}/snapshots | NEW |
| specs/api/portfolio/snapshots-compare.md | GET /api/portfolios/{id}/snapshots/compare | NEW |
| specs/api/auth/consents-get.md | GET /api/users/consents | NEW |
| specs/api/auth/consents-update.md | PUT /api/users/consents | NEW |
| specs/api/auth/terms.md | GET /api/terms | NEW |

## 관계(Related) 업데이트 (6개)

| 파일 | 추가된 관계 |
|------|-------------|
| specs/db/announcements.md | api: admin/announcements-*.md (3개) |
| specs/db/portfolio-snapshots.md | api: portfolio/snapshots-*.md (4개) |
| specs/db/user-consents.md | api: auth/consents-*.md, terms.md (3개) |
| tasks/P1/task-auth.md | api 3개 추가, db refresh-tokens→token-vault |
| tasks/P1/task-portfolio.md | api snapshots 4개 추가 |
| tasks/P1/task-admin-announcements.md | api 3개 추가 |

## 파일 이동 (1개)

| 파일 | 이전 위치 | 새 위치 |
|------|----------|---------|
| task-accounts.md | tasks/P1/ | tasks/P2/ |

## 처리 시각
- 시작: 2026-01-16 13:42
- 완료: 2026-01-16 13:52
