# CHANGELOG - 배치 2026-01-24_1602

> community 도메인 DB 스키마 및 UI 대규모 업데이트

## 처리 일시
- 시작: 2026-01-24 16:02
- 완료: 2026-01-24 16:22

---

## DB 스펙 변경

### [UPDATE] specs/db/community/profiles.md
- `nickname` 길이: VARCHAR(50) → VARCHAR(20) (기획 준수)
- `show_trade` 필드 추가 (거래 공개 여부)

### [UPDATE] specs/db/community/reports.md
- `target_type` 용어 통일: `ARTICLE`/`REPLY` → `POST`/`COMMENT`
- 기존 Master Table 방식 유지 (ENUM 변경 미반영)

### [UPDATE] specs/db/community/settings.md
- 알림 설정 6종 완성: `notify_reply`, `notify_mention` 추가

---

## UI 스펙 변경

### [UPDATE] specs/ui/community/feed.md
- 헤더: "커뮤니티" → "피드", 프로필 아이콘 추가
- 콘텐츠 탭: 추천 / 팔로잉
- FAB (게시글 작성 버튼) 추가

### [UPDATE] specs/ui/community/search.md
- 핫토픽 기능 P1 제외 결정 명시

### [NEW] specs/ui/community/onboarding.md
- 커뮤니티 온보딩 화면 (약관 동의, 닉네임 설정)

### [NEW] specs/ui/community/post-detail.md
- 게시글 상세 화면 (본문, 댓글/대댓글)

### [NEW] specs/ui/community/profile.md
- 프로필 화면 (내 프로필, 타인 프로필, 편집)

### [NEW] specs/ui/community/post-create.md
- 게시글 작성/수정 화면

### [NEW] specs/ui/community/lists.md
- 참조 목록 (북마크, 차단 계정)

### [NEW] specs/ui/community/settings.md
- 커뮤니티 설정 화면 (알림, 공개 범위)

---

## INDEX.md 갱신

| 항목 | 변경 전 | 변경 후 |
|------|:-------:|:-------:|
| UI 스펙 | 17 | 23 |
| 총 스펙 | 103 | 109 |

---

## 사용자 결정 사항

### DB 스키마
1. **신고 사유 관리**: 옵션 A 선택 (기존 Master Table 유지)
2. **용어 통일**: 옵션 B 선택 (Article/Reply → Post/Comment)

### UI 화면
1. **파일 분리 전략**: 옵션 A 선택 (기능 단위 분리)
2. **핫토픽 기능**: 옵션 A 선택 (P1 제외)

---

## 다음 단계

```
/prd-sync-tasks
```

태스크 파일에 신규/변경 스펙 반영 필요
