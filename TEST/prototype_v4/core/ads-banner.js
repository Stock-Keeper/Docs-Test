// =================================================================
// Stock-Keeper UI Prototype V4 - Global Ads Banner Controller (P2+)
// =================================================================

import AdConfig from './mock/ads.js';

let bannerInterval = null;
let currentBannerIdx = 1;

/**
 * 전역 하단 배너 초기화
 */
export function initGlobalBanner() {
    const bannerContainer = document.getElementById('global-bottom-banner');
    if (!bannerContainer) return;

    // 배너 갱신 주기 가져오기 (기본값 30초)
    const config = AdConfig.getConfigByPlacement('BANNER_MAIN');
    const intervalSec = config.refresh_interval_sec || 30;

    // 초기 표시
    updateBannerContent(bannerContainer);

    // 주기적 갱신
    clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        // P1 상태면 업데이트 안 함 (CSS로 이미 숨겨져 있음)
        if (document.body.getAttribute('data-current-phase') === 'P1') return;

        currentBannerIdx = currentBannerIdx >= 3 ? 1 : currentBannerIdx + 1;
        updateBannerContent(bannerContainer);
    }, intervalSec * 1000);
}

function updateBannerContent(container) {
    const contentDiv = container.querySelector('.ad-content');
    if (contentDiv) {
        contentDiv.textContent = `[Ad] 스폰서 배너 광고 영역 #${currentBannerIdx}`;
    }
}
