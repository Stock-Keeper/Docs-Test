---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/posts/{postId}/share
auth: optional
related:
  ui:
    - specs/ui/community/share-bottom-sheet.md
---

# GET /api/community/posts/{postId}/share

## 개요

특정 게시글(혹은 포트폴리오)을 외부 생태계로 공유하기 위해, 공유 유도용 OG 태그 데이터 및 고유 공유 링크(Short URL 또는 딥링크)를 생성하여 반환합니다.

## 스펙

### Request

- **URL**: `/api/community/posts/{postId}/share`
- **Method**: `GET`
- **Auth**: 불필요 (누구나 공유 링크 생성 가능)

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| postId | string | Y | 게시글(또는 포트폴리오) ID |

### Response

#### 성공 (200)

```json
{
  "shareUrl": "https://stock-keeper.com/s/A1b2C3d",
  "ogTitle": "삼성전자 분석글",
  "ogDescription": "투자왕 님이 작성하신 심도있는 분석을 확인해보세요.",
  "ogImageUrl": "https://cdn.stock-keeper.com/.../thumb.jpg",
  "linkTarget": "app://post/uuid"
}
```

### 에러

| 코드 | 상황 | 메시지 |
|------|------|--------|
| 404 | 게시글 없음 | "공유할 게시글(또는 포트폴리오)을 찾을 수 없습니다" |
| 403 | 비공개 | "작성자가 비공개로 설정한 콘텐츠는 공유할 수 없습니다" |

## 구현 로직

```
1. postId로 게시글 테이블 (또는 포트폴리오 테이블) 조회.
2. 삭제되었거나, is_public=false (포폴) 인지 검증 (실패 시 404/403 처리).
3. 콘텐츠의 요약 텍스트와 썸네일(첫 이미지 등)을 추출하여 ogTitle/ogDesc/ogImage 구성.
4. 해당 콘텐츠로 떨어지는 짧은 공유용 URL 혹은 Dynamic Link 생성 로직 수행.
5. JSON 포맷으로 생성된 메타데이터 응답 반환.
```
