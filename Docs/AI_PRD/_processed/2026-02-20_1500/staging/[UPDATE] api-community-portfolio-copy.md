---
type: api
phase: P3
category: community
method: POST
endpoint: /api/community/portfolios/{portfolioId}/copy
auth: verified
related:
    db:
        - specs/db/portfolio/portfolios.md
        - specs/db/portfolio/portfolio-copies.md
        - specs/db/auth/users.md
        - specs/db/bm/token-histories.md
---

# [UPDATE] api-community-portfolio-copy

## 1. 원본 출처

- `_inbox/bm-token-membership.md`

## 2. 작업 요약

- **[UPDATE]** `copy`: 멤버십 한도 확인 또는 토큰(3개) 차감 로직 추가

## 3. 변경 명세

### 구현 로직

**변경 전**

```
1. JWT 토큰에서 user_id 추출
2. is_verified 확인
3. 본인 포트폴리오 개수 확인 (5개)
4. 원본 조회
5. 복사 실행
```

**변경 후**

```
1. JWT 토큰에서 user_id 추출
2. is_verified 확인
3. 본인 포트폴리오 개수 확인 (5개)

// [NEW] 권한/비용 확인
4. 멤버십(Basic/Pro/Premium) 확인
   - Premium: 무제한 -> 통과
   - Basic/Pro: 월간 잔여 횟수 확인 -> 있으면 차감 후 통과
   - Free/횟수초과: 토큰 잔액 확인 (3개 이상?)
     - 부족하면 402 Payment Required
     - 충분하면 차감 (token_histories: USE, feature: COPY)

5. 원본 조회 (비공개 체크)
6. 복사 실행 (DB Insert)
7. 원본 copy_count 증가
8. 알림 발송
```
