# 알림 기능

## 요약 ⚡

- 리밸런싱 필요 시 자동 알림 발송 (목표 비율 대비 임계값 초과)
- 푸시 알림 + 앱 내 알림 센터 병행
- 사용자 설정 주기: 매일, 매주, 2주마다, 한 달마다
- 포트폴리오별 개별 알림 설정 가능
- [P2-고려] FCM 토큰 관리 및 배치 발송 인프라

---

## Phase 1 (현재)

### 기능 목록

- [P1] 리밸런싱 필요 알림 (임계값 초과 시)
- [P1] 푸시 알림 (Firebase Cloud Messaging)
- [P1] 앱 내 알림 센터 (History)
- [P1] 알림 설정 (ON/OFF, 주기, 시간)
- [P1] 포트폴리오별 알림 기능 토글

### 알림 트리거 조건

| 항목 | 규칙 |
|------|------|
| 기본 조건 | 목표 비율 대비 임계값(±5%) 초과 |
| 주기 설정 | 매일, 매주, 2주마다, 한 달마다 |
| 시간 설정 | 사용자 지정 시간 (기본: 16:00 장 마감 후) |
| 최소 간격 | 같은 포트폴리오 알림 24시간 당 1회 (스팸 방지) |
| 포트폴리오 설정 | 포트폴리오별 개별 ON/OFF |
| 전체 설정 | 전체 알림 OFF 시 모든 알림 차단 |

### 푸시 알림

| 항목 | 규칙 |
|------|------|
| 플랫폼 | Firebase Cloud Messaging (FCM) |
| 제목 | `[포트폴리오명] 리밸런싱이 필요합니다` |
| 내용 | `n개 종목의 비율 조정이 필요합니다` |
| 액션 | 탭 시 해당 포트폴리오 상세 화면으로 이동 |
| Deep Link | `sms://portfolio/{portfolioId}` |
| 아이콘 | 앱 로고 |
| 사운드 | 기본 알림음 |
| 배지 | 알림 센터 아이콘에 미확인 개수 표시 |

**FCM 페이로드 예시**

```json
{
  "to": "<FCM_TOKEN>",
  "notification": {
    "title": "[내 포트폴리오] 리밸런싱이 필요합니다",
    "body": "3개 종목의 비율 조정이 필요합니다",
    "icon": "@drawable/ic_notification",
    "sound": "default",
    "click_action": "FLUTTER_NOTIFICATION_CLICK"
  },
  "data": {
    "type": "REBALANCING_NEEDED",
    "portfolioId": "12345",
    "portfolioName": "내 포트폴리오",
    "stockCount": "3",
    "deepLink": "sms://portfolio/12345"
  },
  "priority": "high",
  "ttl": 86400
}
```

### 앱 내 알림 센터

| 항목 | 규칙 |
|------|------|
| 위치 | 홈 화면 상단 벨 아이콘 |
| 표시 | 미확인 알림 개수 배지 |
| 목록 | 최근 30일 내 알림 (100개 제한) |
| 정렬 | 최신 순 |
| 항목 클릭 | 해당 포트폴리오 상세 화면 이동 |
| 읽음 처리 | 클릭 시 자동으로 읽음 표시 |
| 삭제 | 스와이프로 개별 삭제 또는 전체 삭제 |
| 보관 기간 | 30일 (30일 경과 시 자동 삭제) |

**알림 항목 구조**

```javascript
{
  id: "notif_123",
  type: "REBALANCING_NEEDED",
  title: "[내 포트폴리오] 리밸런싱이 필요합니다",
  body: "3개 종목의 비율 조정이 필요합니다",
  portfolioId: "12345",
  portfolioName: "내 포트폴리오",
  isRead: false,
  createdAt: "2026-01-15T16:00:00Z",
  expiresAt: "2026-02-14T16:00:00Z"
}
```

### 알림 설정

| 항목 | 규칙 |
|------|------|
| 전체 ON/OFF | 모든 알림 일괄 제어 |
| 주기 설정 | 매일 / 매주(월요일) / 2주마다 / 한 달마다 |
| 시간 설정 | 09:00 ~ 21:00 사이 1시간 단위 |
| 기본값 | ON, 매주 월요일, 16:00 |
| 포트폴리오별 | 각 포트폴리오마다 개별 ON/OFF |
| 저장 | 설정 변경 시 서버 동기화 |
| 권한 | iOS/Android 시스템 알림 권한 요청 |

**설정 데이터 구조**

```javascript
{
  userId: "user_123",
  globalEnabled: true,
  frequency: "WEEKLY",        // DAILY, WEEKLY, BIWEEKLY, MONTHLY
  notificationTime: "16:00",
  portfolios: [
    {
      portfolioId: "12345",
      enabled: true,
      threshold: 5            // ±5%
    },
    {
      portfolioId: "67890",
      enabled: false,
      threshold: 10           // ±10%
    }
  ],
  createdAt: "2026-01-01T10:00:00Z",
  updatedAt: "2026-01-15T14:30:00Z"
}
```

### 알림 발송 로직

**서버 사이드 배치 작업**

```javascript
// 매일 설정된 시간에 실행
async function sendRebalancingNotifications() {
  // 1. 알림 활성화된 사용자 조회
  const users = await getNotificationEnabledUsers();
  
  for (const user of users) {
    // 2. 오늘 알림 발송 예정인지 확인
    if (!shouldSendToday(user.frequency, user.notificationTime)) {
      continue;
    }
    
    // 3. 사용자의 모든 포트폴리오 검사
    const portfolios = await getPortfolios(user.userId);
    
    for (const portfolio of portfolios) {
      // 4. 포트폴리오 알림 활성화 확인
      if (!portfolio.notificationEnabled) continue;
      
      // 5. 리밸런싱 필요 여부 확인
      const needsRebalancing = await checkRebalancing(
        portfolio.id, 
        portfolio.threshold
      );
      
      if (needsRebalancing.required) {
        // 6. FCM 푸시 알림 발송
        await sendPushNotification(user.fcmToken, {
          portfolioId: portfolio.id,
          portfolioName: portfolio.name,
          stockCount: needsRebalancing.stockCount
        });
        
        // 7. 앱 내 알림 데이터 저장
        await saveInAppNotification(user.userId, {
          type: "REBALANCING_NEEDED",
          portfolioId: portfolio.id,
          portfolioName: portfolio.name,
          stockCount: needsRebalancing.stockCount
        });
        
        // 8. 마지막 알림 시각 기록
        await updateLastNotificationTime(portfolio.id);
      }
    }
  }
}
```

---

## Phase 2+ (확장 고려사항)

### Phase 2 기능

- [P2] **알림 유형 확장**
  - 가격 급등/급락 알림 (±5% 이상 변동)
  - 막대 금액 도달 알림 (예: 1000만원 돌파)
  - 종목 목표가 도달 알림

- [P2] **알림 카테고리 관리**
  - 알림 유형별 개별 ON/OFF
  - 중요도 설정 (중요/일반/정보)
  - 알림 필터링 기능

- [P2] **알림 예약 발송**
  - 사용자가 설정한 시간에 정확히 발송
  - 타임존 고려
  - 배치 작업 모니터링

### Phase 3 기능

- [P3] **스마트 알림**
  - AI 기반 최적 알림 시간 추천
  - 사용자 패턴 학습 (클릭률 기반)
  - 알림 피로도 방지

- [P3] **이메일/SMS 알림**
  - 푸시 알림 외에 이메일/SMS 옵션 추가
  - 주간/월간 리포트 발송
  - 중요 알림은 멀티 채널 발송

- [P3] **알림 통계 및 분석**
  - 알림 발송/열람/클릭률 분석
  - 알림 효과 대시보드
  - A/B 테스트 기능

---

## 성능 목표

| 지표 | 목표 |
|------|------|
| 푸시 알림 발송 | < 3초 |
| 앱 내 알림 저장 | < 500ms |
| 알림 목록 로딩 | < 1초 |
| FCM 토큰 갱신 | < 1초 |
| 배치 작업 실행 | 설정 시간 ±5분 내 |
| 알림 도달률 | > 95% |

---

## 에러 처리

| 에러 케이스 | 처리 방법 |
|------------|----------|
| FCM 토큰 만료 | 토큰 재발급 시도, 실패 시 로그 기록 |
| 푸시 발송 실패 | 3회 재시도, 최종 실패 시 앱 내 알림만 저장 |
| 네트워크 오류 | 오프라인 모드에서도 로컬 알림 표시 |
| 시스템 권한 거부 | "알림 권한을 허용해주세요" 안내 표시 |
| 배치 작업 실패 | Sentry 로그 + 다음 예정 시간에 재실행 |

---

## 보안 및 개인정보

| 항목 | 규칙 |
|------|------|
| FCM 토큰 저장 | 암호화하여 DB 저장 |
| 알림 내용 | 민감 정보(금액, 수익률) 포함 금지 |
| 로그 보관 | 알림 발송 로그 30일 보관 |
| 동의 필수 | 푸시 알림 권한 명시적 동의 |
| 철회 권리 | 설정에서 언제든지 알림 OFF 가능 |

---

## 관련 문서

- **리밸런싱**: `features/rebalancing.md` - 알림 트리거 조건
- **포트폴리오**: `features/portfolio.md` - 포트폴리오별 알림 설정
- **인프라**: `reference/infra.md#fcm` - Firebase Cloud Messaging 설정
- **DB 스키마**: `reference/db-schema.md#notifications` - notifications 테이블
- **API 명세**: `reference/api-spec.md#notification-api` - 알림 엔드포인트
- **보안**: `reference/security.md#push-notification` - FCM 보안 처리

---

> **작성일**: 2025-12-31  
> **Phase**: Phase 1 (MVP)  
> **담당**: Backend + Mobile
