/**
 * Community Settings Screen Controller
 */

const COMMUNITY_BACK_OPTIONS = {
    fallbackScreenId: 'community-feed',
    requirePrefix: 'community-'
};

/**
 * Initialize
 */
export function init() {
    bindEvents();
}

/**
 * Start
 */
export function start() {
    bindEvents();

    // Reset to main menu
    showMainMenu();
}

/**
 * Reset
 */
export function reset() {
    showMainMenu();
}

function bindEvents() {
    const backBtn = document.getElementById('community-settings-back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (isSubSectionOpen()) {
                showMainMenu();
                return;
            }

            import('../../core/navigation.js').then(nav => nav.goBack(COMMUNITY_BACK_OPTIONS));
        };
    }

    document.querySelectorAll('#screen-community-settings .settings-item').forEach(item => {
        item.onclick = () => handleMenuClick(item);
    });

    document.querySelectorAll('#screen-community-settings .toggle-switch input').forEach(toggle => {
        toggle.onchange = e => handleToggle(e.target);
    });
}

/**
 * Show main menu
 */
function showMainMenu() {
    getSettingsMenu()?.classList.remove('hidden');
    document.getElementById('notification-settings-section')?.classList.add('hidden');
    document.getElementById('privacy-settings-section')?.classList.add('hidden');

    const headerTitle = getHeaderTitle();
    if (headerTitle) headerTitle.textContent = '커뮤니티 설정';
}

/**
 * Handle menu click
 */
function handleMenuClick(item) {
    const screenId = item.dataset.screen;
    const action = item.dataset.action;

    if (screenId === 'community-notification-settings') {
        showNotificationSettings();
    } else if (screenId === 'community-privacy-settings') {
        showPrivacySettings();
    } else if (screenId === 'community-lists') {
        const tab = item.dataset.tab;
        // Navigate to lists screen with tab parameter
        console.log('[Settings] Navigate to lists:', tab);
        alert(`${item.querySelector('.settings-item-label').textContent} 기능은 준비 중입니다.`);
    } else if (action) {
        handleAction(action);
    }
}

/**
 * Show notification settings
 */
function showNotificationSettings() {
    getSettingsMenu()?.classList.add('hidden');
    document.getElementById('notification-settings-section')?.classList.remove('hidden');
    document.getElementById('privacy-settings-section')?.classList.add('hidden');

    const headerTitle = getHeaderTitle();
    if (headerTitle) headerTitle.textContent = '알림 설정';
}

/**
 * Show privacy settings
 */
function showPrivacySettings() {
    getSettingsMenu()?.classList.add('hidden');
    document.getElementById('notification-settings-section')?.classList.add('hidden');
    document.getElementById('privacy-settings-section')?.classList.remove('hidden');

    const headerTitle = getHeaderTitle();
    if (headerTitle) headerTitle.textContent = '정보 공개 범위';
}

/**
 * Handle action
 */
function handleAction(action) {
    switch (action) {
        case 'deleted-posts':
            alert('신고·삭제된 글 기능은 준비 중입니다.');
            break;
        case 'community-rules':
            alert('커뮤니티 이용규칙을 표시합니다.');
            break;
        default:
            console.log('[Settings] Unknown action:', action);
    }
}

/**
 * Handle toggle
 */
function handleToggle(toggle) {
    const setting = toggle.dataset.setting;
    const value = toggle.checked;
    console.log(`[Settings] ${setting}: ${value}`);
}

function getSettingsMenu() {
    return document.querySelector('#screen-community-settings .settings-menu');
}

function getHeaderTitle() {
    return document.querySelector('#screen-community-settings .settings-header .header-title');
}

function isSubSectionOpen() {
    const menu = getSettingsMenu();
    return !!menu && menu.classList.contains('hidden');
}
