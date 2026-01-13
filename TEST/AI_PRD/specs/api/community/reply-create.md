# POST /api/community/comments/{commentId}/replies

## 개요
대댓글 작성 (P3)

## 스펙

### Request
- **URL**: `/api/community/comments/{commentId}/replies`
- **Method**: `POST`
- **Auth**: Bearer Token 필수 (본인인증 필수)

### Path Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| commentId | uuid | Y | 부모 댓글 ID |

### Body
```json
{
  "content": "string (1~500자)"
}
```

## Response

### 성공 (201)
```json
{
  "id": "uuid",
  "commentId": "uuid",
  "content": "대댓글 내용",
  "author": {
    "id": "uuid",
    "nickname": "대댓글러",
    "profileCharacter": 2
  },
  "createdAt": "2026-01-13T10:30:00Z"
}
```

### 에러
| 코드 | 상황 | 메시지 |
|------|------|--------|
| 400 | 내용 누락 | "대댓글 내용을 입력해주세요" |
| 401 | 인증 실패 | "로그인이 필요합니다" |
| 403 | 본인인증 미완료 | "본인인증이 필요합니다" |
| 404 | 댓글 없음 | "댓글을 찾을 수 없습니다" |

## 구현 로직

```
1. JWT 토큰에서 user_id 추출
2. users 테이블에서 is_verified 확인 (false면 403)
3. comments 테이블에서 commentId 존재 확인 (없으면 404)
4. Request Body 검증 (content 필수, 길이)
5. replies 테이블에 INSERT
6. 댓글 작성자에게 알림 발송 (본인 제외)
7. 응답 반환
```

## 깊이 제한
- 대댓글은 1단계까지만 (대대댓글 X)
- replies 테이블은 comment_id만 참조 (중첩 없음)

## 관련 스펙
- DB: `../db/comments.md` (replies 테이블)
