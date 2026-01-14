# Task: 커뮤니티 피드 및 게시글 기능 구현

## 목표
커뮤니티 피드, 게시글 CRUD, 댓글, 좋아요 기능 구현

## 스펙 참조

### API
- `../../specs/api/community/feed-list.md`
- `../../specs/api/community/post-create.md`
- `../../specs/api/community/comment-create.md`
- `../../specs/api/community/like.md`

### DB
- `../../specs/db/posts.md`
- `../../specs/db/comments.md`
- `../../specs/db/likes.md`

### UI
- `../../specs/ui/community/feed.md`

## 구현 체크리스트

### Backend (Spring Boot)

- [ ] `CommunityController` 생성
  - [ ] `GET /api/community/feed` - 피드 조회
  - [ ] `POST /api/community/posts` - 게시글 작성
  - [ ] `GET /api/community/posts/{id}` - 게시글 상세
  - [ ] `PUT /api/community/posts/{id}` - 게시글 수정
  - [ ] `DELETE /api/community/posts/{id}` - 게시글 삭제
- [ ] `CommentController` 생성
  - [ ] `GET /api/community/posts/{id}/comments` - 댓글 목록
  - [ ] `POST /api/community/posts/{id}/comments` - 댓글 작성
  - [ ] `PUT /api/community/comments/{id}` - 댓글 수정
  - [ ] `DELETE /api/community/comments/{id}` - 댓글 삭제
- [ ] `LikeController` 생성
  - [ ] `POST /api/community/likes` - 좋아요 토글
- [ ] 본인인증 검증 인터셉터 (`VerificationRequired`)
- [ ] 이미지 업로드 (S3)
- [ ] `Post`, `Comment`, `PostLike` 엔티티 생성
- [ ] Repository 생성

### Frontend (React Native)

- [ ] 피드 화면 구현
  - [ ] 피드 리스트 (무한 스크롤)
  - [ ] 카테고리/정렬 필터
  - [ ] Pull to Refresh
  - [ ] 게시글 카드 컴포넌트
  - [ ] 포트폴리오 카드 컴포넌트
- [ ] 게시글 작성 화면
  - [ ] 제목/내용 입력
  - [ ] 카테고리 선택
  - [ ] 이미지 첨부 (ImagePicker)
- [ ] 게시글 상세 화면
  - [ ] 게시글 내용 표시
  - [ ] 좋아요 버튼
  - [ ] 댓글 목록
  - [ ] 댓글 작성
- [ ] 본인인증 미완료 시 모달

### Database

- [ ] `posts` 테이블 생성
- [ ] `post_images` 테이블 생성
- [ ] `comments` 테이블 생성
- [ ] `post_likes` 테이블 생성

## 완료 조건

- [ ] 피드에 게시글/포트폴리오 통합 표시
- [ ] 게시글 CRUD 동작
- [ ] 댓글 작성/수정/삭제
- [ ] 좋아요 토글
- [ ] 본인인증 미완료 시 제한

## 테스트 케이스

| 케이스 | 예상 결과 |
|--------|----------|
| 피드 조회 (미로그인) | 게시글/포트폴리오 목록, isLiked 항상 false |
| 피드 조회 (로그인) | 좋아요 여부 반영된 isLiked |
| 게시글 작성 (본인인증 완료) | 게시글 생성, 피드에 표시 |
| 게시글 작성 (본인인증 미완료) | 403 에러, 인증 필요 모달 |
| 댓글 작성 | 댓글 생성, comment_count 증가 |
| 좋아요 토글 (추가) | like_count 증가, isLiked=true |
| 좋아요 토글 (취소) | like_count 감소, isLiked=false |
| 무한 스크롤 | 다음 페이지 로드, 기존 목록에 추가 |

## 예상 소요 시간

| 파트 | 예상 시간 |
|------|----------|
| Backend API | 4일 |
| Frontend 피드 | 3일 |
| Frontend 게시글 | 2일 |
| Frontend 댓글 | 1일 |
| 테스트 | 2일 |
| **총합** | **12일** |
