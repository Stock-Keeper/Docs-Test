---
type: db
phase: P1
table: ad_units
related:
    api:
        - specs/api/ads/config.md
        - specs/api/admin/ads.md
---

# ad_units 테이블

## 개요

광고 단위(Unit) ID 및 노출 정책을 관리. 플랫폼(AOS/iOS)별, 배치 위치별로 AdMob 등의 광고 ID를 저장하고 운영 중 동적 제어를 지원.

## 스키마

```sql
CREATE TABLE ad_units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placement_type ENUM('SPLASH', 'BANNER_MAIN', 'FEED_NATIVE', 'NOTI_STICKY', 'REWARDED_VIDEO', 'VIDEO_BANNER') NOT NULL COMMENT '광고 위치',
  platform ENUM('ANDROID', 'IOS') NOT NULL COMMENT 'OS 플랫폼',
  provider VARCHAR(50) DEFAULT 'ADMOB' COMMENT '광고 네트워크',
  unit_id VARCHAR(255) NOT NULL COMMENT '실제 광고 단위 ID',
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
  config_json JSON COMMENT '추가 설정 (빈도 제한, 갱신 주기 등)',
  description VARCHAR(255) COMMENT '관리용 설명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_placement_platform (placement_type, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='광고 단위 및 정책 설정';
```

## 컬럼 상세

| 컬럼           | 타입         | 필수 | 기본값            | 설명                                                                                           | Phase |
| -------------- | ------------ | ---- | ----------------- | ---------------------------------------------------------------------------------------------- | ----- |
| id             | INT          | Y    | AUTO_INCREMENT    | PK                                                                                             | P1    |
| placement_type | ENUM         | Y    | -                 | BANNER_MAIN(P1)/SPLASH(P2)/FEED_NATIVE(P3)/NOTI_STICKY(P3)/REWARDED_VIDEO(P3)/VIDEO_BANNER(P3) | P1    |
| platform       | ENUM         | Y    | -                 | ANDROID/IOS                                                                                    | P1    |
| provider       | VARCHAR(50)  | N    | 'ADMOB'           | 광고 네트워크 이름                                                                             | P1    |
| unit_id        | VARCHAR(255) | Y    | -                 | 광고 네트워크에서 발급한 ID                                                                    | P1    |
| is_active      | BOOLEAN      | Y    | TRUE              | 활성화 여부                                                                                    | P1    |
| config_json    | JSON         | N    | NULL              | 빈도 제한, 갱신 주기 등 설정                                                                   | P1    |
| description    | VARCHAR(255) | N    | NULL              | 관리자용 메모                                                                                  | P1    |
| created_at     | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 생성일                                                                                         | P1    |
| updated_at     | TIMESTAMP    | Y    | CURRENT_TIMESTAMP | 수정일                                                                                         | P1    |

## 인덱스

| 인덱스명              | 컬럼                     | 타입   | 용도                    |
| --------------------- | ------------------------ | ------ | ----------------------- |
| uk_placement_platform | placement_type, platform | UNIQUE | 위치+플랫폼별 유일 보장 |

## config_json 예시

```json
{
    "frequency_cap": 2,
    "refresh_interval_sec": 30,
    "feed_interval": 5
}
```

| 키                   | 타입    | 설명                  | 적용 배치           |
| -------------------- | ------- | --------------------- | ------------------- |
| frequency_cap        | INT     | 하루 최대 노출 횟수   | SPLASH (P2)         |
| refresh_interval_sec | INT     | 배너 갱신 주기(초)    | BANNER_MAIN (P1)    |
| feed_interval        | INT     | 게시물 N개당 광고 1개 | FEED_NATIVE (P3)    |
| reward_type          | STRING  | 보상 유형             | REWARDED_VIDEO (P3) |
| reward_amount        | INT     | 보상 수량             | REWARDED_VIDEO (P3) |
| autoplay             | BOOLEAN | 자동 재생 여부        | VIDEO_BANNER (P3)   |

## 유용한 쿼리

### 플랫폼별 활성 광고 조회

```sql
SELECT placement_type, unit_id, config_json
FROM ad_units
WHERE platform = ? AND is_active = TRUE;
```

## 관련 스펙

- API: `../../api/ads/config.md`
- API: `../../api/admin/ads.md`
