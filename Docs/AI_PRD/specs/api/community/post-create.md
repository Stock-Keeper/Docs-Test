# POST /api/community/posts

## 개요
게시글 작성

## 스펙

### Request
- **URL**: `/api/community/posts`
- **Method**: `POST`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Headers
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

### Body (FormData)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | Y | 제목 (1~100자) |
| content | string | Y | 내용 (1~3000자) |
| category | enum | Y | 카테고리 (포트폴리오/토론/질문/국내주식/해외주식/자유) |
| images | file[] | N | 이미지 (최대 5장, 각 5MB 이하) |

## Response

### 성공 (201)
```json
{
  "id": "uuid",
  "title": "삼성전자 분석글",
  "content": "내용...",
  "category": "국내주식",
  "author": {
    "id": "uuid",
    "nickname": "투자왕",
    "profileCharacter": 1
  },
  "images": [
    "https://s3.../image1.jpg",
    "https://s3.../image2.jpg"
  ],
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "2026-01-13T10:00:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 제목 누락 | "제목을 입력해주세요" |
| 400 | 내용 누락 | "내용을 입력해주세요" |
| 400 | 카테고리 누락 | "카테고리를 선택해주세요" |
| 400 | 글자수 초과 | "내용은 3000자 이내로 입력해주세요" |
| 400 | 이미지 5장 초과 | "이미지는 최대 5장까지 첨부할 수 있습니다" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 본인인증 미완료 | "본인인증이 필요합니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. users 테이블에서 is_verified 확인
   - false면 403 에러
3. Request Body 검증
4. 이미지가 있으면 S3 업로드
5. posts 테이블에 INSERT
6. 이미지 URL을 post_images 테이블에 저장
7. 응답 반환
```

## 관련 스펙
- DB: `../db/posts.md`
- API: `post-detail.md`
- API: `post-update.md`
