/**
 * Tab Bar Controller
 * 
 * 하단 탭 네비게이션 관리 (P2+ 전용)
 * 
 * 의존성:
 * - navigation.js: navigateTo, getCurrentScreenId
 * - control-panel.js: getCurrentPhase
 */

// 탭 설정
const TAB_CONFIG = [
    { id: 'portfolio-list', label: '홈', icon: '🏠' },

    { id: 'community-feed', label: '커뮤니티', icon: '💬' },
    { id: 'settings-main', label: '설정', icon: '⚙️' }
];

// 탭바에 연결된 화면 ID 목록
const TAB_SCREEN_IDS = TAB_CONFIG.map(t => t.id);

/**
 * 탭바 초기화
 * @param {Function} navigateTo - 화면 이동 함수
 */
export function initTabBar(navigateTo) {
    const tabBar = document.getElementById('tab-bar');
    if (!tabBar) {
        console.warn('[TabBar] #tab-bar 요소를 찾을 수 없습니다.');
        return;
    }

    // 탭 아이템 클릭 이벤트
    const tabItems = tabBar.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            if (screenId && typeof navigateTo === 'function') {
                // 히스토리 추가 없이 이동 (탭 전환은 루트 이동)
                navigateTo(screenId, false);
            }
        });
    });

    console.log('[TabBar] 초기화 완료');
}

/**
 * 탭바 활성 상태 업데이트
 * @param {string} screenId - 현재 화면 ID
 */
export function updateTabBarState(screenId) {
    const tabBar = document.getElementById('tab-bar');
    if (!tabBar) return;

    const tabItems = tabBar.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        const isActive = item.dataset.screen === screenId;
        item.classList.toggle('active', isActive);
    });
}

/**
 * 탭바 표시/숨김 설정
 * @param {boolean} show - 표시 여부
 */
export function setTabBarVisibility(show) {
    document.body.setAttribute('data-show-tabbar', String(show));
}

/**
 * 현재 화면이 탭바 관련 화면인지 확인
 * @param {string} screenId - 화면 ID
 * @returns {boolean}
 */
export function isTabScreen(screenId) {
    return TAB_SCREEN_IDS.includes(screenId);
}

/**
 * 화면 설정에 따라 탭바 표시 여부 결정
 * @param {Object} screenConfig - screens.json의 화면 설정
 * @param {string} currentPhase - 현재 Phase (P1, P2, P3)
 */
export function updateTabBarForScreen(screenConfig, currentPhase) {
    // P1에서는 항상 숨김
    if (currentPhase === 'P1') {
        setTabBarVisibility(false);
        return;
    }

    // hideTabBar 속성이 있으면 숨김
    if (screenConfig && screenConfig.hideTabBar === true) {
        setTabBarVisibility(false);
        return;
    }

    // P2/P3에서는 표시
    setTabBarVisibility(true);
}

/**
 * Phase 변경 시 탭바 처리
 * @param {string} newPhase - 새 Phase
 * @param {string} currentScreenId - 현재 화면 ID
 * @param {Function} navigateTo - 화면 이동 함수
 */
export function handlePhaseChange(newPhase, currentScreenId, navigateTo) {
    if (newPhase === 'P1') {
        setTabBarVisibility(false);

        // P1으로 전환 시 커뮤니티 화면이면 홈으로 이동
        if (currentScreenId && currentScreenId.startsWith('community-')) {
            if (typeof navigateTo === 'function') {
                navigateTo('portfolio-list', false);
            }
        }
    } else {
        setTabBarVisibility(true);
    }
}
