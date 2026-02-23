# CHANGELOG - 2026-02-20_0246

> 📅 처리 완료: 2026-02-20
> 📥 원본: `_inbox/ad-revenue-report.md`

---

## 변경 요약

| 작업 | 파일               | 대상 위치                       |
| ---- | ------------------ | ------------------------------- |
| NEW  | `ad-units.md`      | `specs/db/ads/ad-units.md`      |
| NEW  | `config.md`        | `specs/api/ads/config.md`       |
| NEW  | `ads.md`           | `specs/api/admin/ads.md`        |
| NEW  | `ad-components.md` | `specs/ui/ads/ad-components.md` |

## 신규 도메인

- **ads (광고)**: 인앱 광고 단위(Unit) 관리, 플랫폼별 설정 조회, 어드민 CRUD

## 상세 내역

### [NEW] specs/db/ads/ad-units.md

- `ad_units` 테이블: 광고 위치(SPLASH, BANNER_MAIN, FEED_NATIVE, NOTI_STICKY) × 플랫폼(AOS/iOS) 별 광고 ID 및 정책(config_json) 관리

### [NEW] specs/api/ads/config.md

- `GET /api/v1/ads/config?platform=ANDROID|IOS`: 클라이언트가 앱 실행 시 활성 광고 설정 조회

### [NEW] specs/api/admin/ads.md

- `GET/POST/PUT /api/v1/admin/ads`: 관리자 전용 광고 단위 CRUD (Super Admin Only)

### [NEW] specs/ui/ads/ad-components.md

- 4가지 광고 컴포넌트 UI/동작 명세: 전면(Splash), 하단 배너, 네이티브 인피드, 알림 고정 배너

## INDEX.md 갱신

| 항목 | 변경 전 | 변경 후 |
| ---- | ------- | ------- |
| API  | 47      | 49      |
| DB   | 39      | 40      |
| UI   | 23      | 24      |
| 합계 | 109     | 113     |
