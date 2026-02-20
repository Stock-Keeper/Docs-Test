---
type: db
phase: P1
table: ad_units
related:
    api:
        - specs/api/ads/config.md
        - specs/api/admin/ads.md
    db: []
---

# [NEW] db-ads

## 1. 원본 출처

- `_inbox/ad-revenue-report.md`

## 2. 작업 요약

- **[NEW]** `ad_units`: 광고 단위 ID 및 설정을 관리하는 테이블 생성

## 3. AI 분석 결과

- **동적 제어 필요성**: 광고 ID(Unit ID)는 플랫폼(AOS/iOS)별로 다르고, 운영 중 변경될 수 있으므로 하드코딩보다는 DB 관리가 유리함.
- **배치 유형**: 스플래시, 하단 배너, 네이티브(피드), 알림형 배너 4가지 존재.
- **정책 관리**: '장 중 확인 2~3회', '체류시간' 등의 전제가 있으므로, 노출 빈도(frequency capping) 설정을 JSON으로 저장하여 클라이언트가 참조하도록 함.

## 4. 기존 스펙 비교

- `ads` 도메인은 신규 도메인임.
- 기존 `admin` 도메인과 충돌 없음.

## 5. 변경 명세

### 5.1. ad_units 테이블

```sql
CREATE TABLE ad_units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placement_type ENUM('SPLASH', 'BANNER_MAIN', 'FEED_NATIVE', 'NOTI_STICKY') NOT NULL COMMENT '광고 위치',
  platform ENUM('ANDROID', 'IOS') NOT NULL COMMENT 'OS 플랫폼',
  provider VARCHAR(50) DEFAULT 'ADMOB' COMMENT '광고 네트워크 (예: ADMOB)',
  unit_id VARCHAR(255) NOT NULL COMMENT '실제 광고 단위 ID',
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
  config_json JSON COMMENT '추가 설정 (빈도 제한, 갱신 주기 등)',
  description VARCHAR(255) COMMENT '관리용 설명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_placement_platform (placement_type, platform) -- 위치+플랫폼별 유일
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='광고 단위 및 정책 설정';
```

## 🔍 확인 필요 사항

### 1. 배치(Placement) 확장성

리포트에는 4가지만 정의되어 있으나, 추후 늘어날 수 있습니다.

- [x] **ENUM 사용**: 코드가 명확해지나, 새 배치 추가 시 스키마 변경 필요 (현재 권장)
- [ ] **String 사용**: 유연하지만 오타 위험 존재
- [ ] **테이블 분리**: `ad_placements` 테이블을 만들고 FK 참조

### 2. 네이티브 광고 인젝션 규칙

피드 중간에 광고를 넣는 규칙(예: 5번째 게시물마다)을 어디서 관리할까요?

- [x] **Client/Server Config**: `config_json`에 `interval: 5` 등으로 저장하고 클라이언트가 처리
- [ ] **Server Response**: 게시물 리스트 API 응답에 광고 객체를 섞어서 내려줌 (복잡도 높음)
