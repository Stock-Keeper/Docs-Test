---
type: api
phase: P3
category: community
method: GET
endpoint: /api/community/posts/{postId}
---

# [UPDATE] api-community-post-detail

## 1. 원본 출처

- `_inbox/bm-token-membership.md` (2-2. 포트폴리오 카피, 2-3. 상세 열람)

## 2. 작업 요약

- **[UPDATE]** 게시글에 첨부된 포트폴리오의 심층 지표(Lv.2, Lv.3) 응답 필드를 추가하되, 결제/멤버십 상태에 따라 가려짐(`isUnlocked`) 여부 제공
- **[NEW]** 포트폴리오 카피 버튼 데이터, 상세 열람 결제 엔드포인트 연동 (개별 해제 API 호출 시)

## 3. 변경 명세

### 응답 스키마 변경 (PostDetail)

기존 응답 스키마의 `portfolio` 객체 내에 프리미엄 상태를 반영합니다.

**추가되는 JSON 필드**

```json
{
    // ... (기존 게시글 정보: 제목, 본문, 작성자)
    "portfolio": {
        "id": 12,
        "returns": "+15.2%",
        "itemCount": 5,
        "isDetailUnlocked": false, // 열람 토큰을 지불했거나 프리미엄인지 여부
        "premiumStats": {
            // isDetailUnlocked=false면 null
            "aiScore": "A",
            "sharpeRatio": 1.5,
            "mdd": "-10.2%",
            "sectorDistribution": [
                { "sector": "IT", "weight": 40 },
                { "sector": "Finance", "weight": 20 }
            ]
        }
    }
}
```

### 새로운 조건/로직

1. 토큰 소모 권한 확인: `isDetailUnlocked` 판별 시
    - 호출자가 Premium/Pro 멤버십인가? -> `true`
    - 호출자가 Basic 멤버십이고 잔여 한도가 있는가? -> `true` (조회 시 자동 차감 여부는 별도 정의)
    - 호출자가 해당 게시글에 2토큰을 이미 지불했는가? (token_histories 조회) -> `true`
    - 위 조건 만족 실패 시 -> `false`, `premiumStats`는 `null`.

## 4. ⚠️ 확인 필요 사항

### 1. 멤버십 한도 자동차감 방식

Basic 멤버십 유저가 상세 열람 시 (월 5건 제한) API 요청 한 번에 바로 차감할까요?

- [ ] 옵션 A: 상세 데이터 요청용 별도 엔드포인트(`POST /api/community/posts/{id}/unlock-detail`)를 만들어사용자가 '버튼 클릭' 시에만 차감
- [ ] 옵션 B: 자동 차감하지만 남은 횟수를 모달로 경고함
- [ ] 기타: **\*\***\_\_\_\_**\*\***
