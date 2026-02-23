# CHANGELOG — 2026-02-20_1200

> 📅 처리일: 2026-02-20
> 📦 배치: 2026-02-20_1200
> 🔍 원본: `[VALIDATE] all-2026-02-20.md` (커뮤니티 CRUD 누락 보완)

---

## 신규 생성 (NEW) — 4건

### API 스펙

| 파일                                    | 설명                        | Phase |
| --------------------------------------- | --------------------------- | :---: |
| `specs/api/community/post-detail.md`    | 게시글 상세 조회 API        |  P2   |
| `specs/api/community/post-update.md`    | 게시글 수정 API             |  P2   |
| `specs/api/community/comment-update.md` | 댓글 수정 API               |  P2   |
| `specs/api/community/comment-delete.md` | 댓글 삭제 API (Soft Delete) |  P2   |

---

## 업데이트 (UPDATE) — 4건

### Related 링크 업데이트

| 파일                               | 변경 내용                                              |
| ---------------------------------- | ------------------------------------------------------ |
| `specs/db/community/posts.md`      | `post-detail.md`, `post-update.md` API 참조 추가       |
| `specs/db/community/comments.md`   | `comment-update.md`, `comment-delete.md` API 참조 추가 |
| `specs/api/community/feed-list.md` | `post-detail.md` API 참조 추가                         |
| `specs/INDEX.md`                   | 커뮤니티 API 4건 추가 (api: 49→53, total: 113→117)     |

---

## 삭제 (DELETE) — 0건

없음

---

## 요약

- 커뮤니티 CRUD 완성을 위해 누락된 4개 API 스펙 생성
- 기존 검증(`[VALIDATE] all-2026-02-20.md`)에서 발견된 Dead Link 5건 해소
- 양방향 related 링크 정비 완료
