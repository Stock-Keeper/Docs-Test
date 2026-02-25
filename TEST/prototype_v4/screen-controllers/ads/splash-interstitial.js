// =================================================================
// Stock-Keeper UI Prototype V4 - Splash Interstitial Screen Controller
// =================================================================

import { goBack } from '../../core/navigation.js';

let splashTimeout = null;
const SPLASH_DURATION = 3000; // 3초 타임아웃

export function init() {
    const screen = document.getElementById('screen-ads-splash-interstitial');
    if (!screen) return;

    // 닫기 버튼 이벤트 연결
    const closeBtn = screen.querySelector('#ad-splash-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            skipSplash();
        });
    }
}

export function start() {
    console.log('[Ads Splash] 전면 광고 화면 진입. 3초 대기 시작...');
    
    // 3초 후 자동 넘어감
    clearTimeout(splashTimeout);
    splashTimeout = setTimeout(() => {
        skipSplash();
    }, SPLASH_DURATION);
}

export function onHide() {
    clearTimeout(splashTimeout);
}

// 다음 화면으로 넘기기 (이전 화면으로 복귀)
function skipSplash() {
    clearTimeout(splashTimeout);
    console.log('[Ads Splash] 메인 화면으로 이동');

    goBack();
}
