// =================================================================
// Stock-Keeper UI Prototype V4 - Ads Mock Data (P2)
// API Endpoint: /api/v1/ads/config
// =================================================================

/**
 * 광고 위치 및 관련 설정 모의 데이터
 * 실제 API 명세(specs/api/ads/config.md)를 바탕으로 작성됨
 */
const mockAdConfigs = [
  {
      "placement": "SPLASH",
      "unit_id": "ca-app-pub-xxxxx/yyyyy",
      "config": {
          "frequency_cap": 2 // 하루 최대 노출 횟수
      }
  },
  {
      "placement": "BANNER_MAIN",
      "unit_id": "ca-app-pub-xxxxx/zzzzz",
      "config": {
          "refresh_interval_sec": 30 // 배너 갱신 주기
      }
  },
  {
      "placement": "FEED_NATIVE",
      "unit_id": "ca-app-pub-xxxxx/aaaaa",
      "config": {
          "feed_interval": 5 // 피드 5개마다 노출
      }
  },
  {
      "placement": "NOTI_STICKY",
      "unit_id": "ca-app-pub-xxxxx/bbbbb",
      "config": {} // 알림 상단 고정
  }
];

// 전역 공유 객체
window.AdConfig = {
  get: () => mockAdConfigs,
  getConfigByPlacement: (placement) => {
      const ad = mockAdConfigs.find(item => item.placement === placement);
      return ad ? ad.config : {};
  }
};

export default window.AdConfig;
