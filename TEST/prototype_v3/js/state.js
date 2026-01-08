// =================================================================
// Stock-Keeper UI Prototype V3 - State Management
// Empty, Loading, Error state toggles for demo
// =================================================================

let emptyStates = { home: false, detail: false, search: false };
let loadingState = false;
let errorState = false;

/**
 * Helper to manage button state by title
 * @param {string} title - Button data-title attribute
 * @param {boolean} isActive - Active state
 */
function setButtonState(title, isActive) {
    const btn = document.querySelector(`.state-btn[data-title="${title}"]`);
    if (btn) {
        btn.classList.toggle('active', isActive);
    }
}

/**
 * Toggle empty state for a screen
 * @param {string} screen - Screen name (home, detail, search)
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleEmptyState(screen, btnElement) {
    emptyStates[screen] = !emptyStates[screen];
    const isOn = emptyStates[screen];

    // Toggle active class on button
    if (btnElement) {
        btnElement.classList.toggle('active', isOn);
    }

    if (screen === 'home') {
        const content = document.querySelector('#screen-home .portfolio-section');
        const summary = document.querySelector('#screen-home .home-summary');
        const emptyEl = document.getElementById('home-empty-state');
        const fab = document.querySelector('#screen-home .fab');

        if (content) content.style.display = isOn ? 'none' : '';
        if (summary) summary.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
        if (fab) fab.style.display = isOn ? 'none' : '';

        if (isOn) {
            loadingState = false;
            errorState = false;
            setButtonState('로딩 상태', false);
            setButtonState('에러 상태', false);

            document.getElementById('home-loading-state').style.display = 'none';
            document.getElementById('home-error-state').style.display = 'none';
        }
    } else if (screen === 'detail') {
        const summary = document.querySelector('#screen-detail .detail-summary');
        const stocks = document.querySelector('#screen-detail .stocks-section');
        const actions = document.querySelector('#screen-detail .detail-actions');
        const emptyEl = document.getElementById('detail-empty-state');

        if (summary) summary.style.display = isOn ? 'none' : '';
        if (stocks) stocks.style.display = isOn ? 'none' : '';
        if (actions) actions.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
    } else if (screen === 'search') {
        const results = document.querySelector('#screen-search .search-results');
        const emptyEl = document.getElementById('search-empty-state');

        if (results) results.style.display = isOn ? 'none' : '';
        if (emptyEl) emptyEl.style.display = isOn ? 'flex' : 'none';
    }

    showToast(`${screen} Empty: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Toggle loading state (home screen only)
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleLoadingState(btnElement) {
    loadingState = !loadingState;
    const isOn = loadingState;

    // Toggle active class on button
    if (btnElement) {
        btnElement.classList.toggle('active', isOn);
    }

    const homeContent = document.querySelector('#screen-home .portfolio-section');
    const homeSummary = document.querySelector('#screen-home .home-summary');
    const homeLoading = document.getElementById('home-loading-state');
    const fab = document.querySelector('#screen-home .fab');

    if (homeContent) homeContent.style.display = isOn ? 'none' : '';
    if (homeSummary) homeSummary.style.display = isOn ? 'none' : '';
    if (homeLoading) homeLoading.style.display = isOn ? 'block' : 'none';
    if (fab) fab.style.display = isOn ? 'none' : '';

    if (isOn) {
        emptyStates.home = false;
        errorState = false;
        setButtonState('홈 Empty State', false);
        setButtonState('에러 상태', false);

        const emptyEl = document.getElementById('home-empty-state');
        const errorEl = document.getElementById('home-error-state');
        if (emptyEl) emptyEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
    }

    showToast(`Loading: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Toggle error state (home screen only)
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleErrorState(btnElement) {
    errorState = !errorState;
    const isOn = errorState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const homeContent = document.querySelector('#screen-home .portfolio-section');
    const homeSummary = document.querySelector('#screen-home .home-summary');
    const homeError = document.getElementById('home-error-state');
    const fab = document.querySelector('#screen-home .fab');

    if (homeContent) homeContent.style.display = isOn ? 'none' : '';
    if (homeSummary) homeSummary.style.display = isOn ? 'none' : '';
    if (homeError) homeError.style.display = isOn ? 'flex' : 'none';
    if (fab) fab.style.display = isOn ? 'none' : '';

    if (isOn) {
        emptyStates.home = false;
        loadingState = false;

        // Sync visuals
        setButtonState('홈 Empty State', false);
        setButtonState('로딩 상태', false);

        const emptyEl = document.getElementById('home-empty-state');
        const loadingEl = document.getElementById('home-loading-state');
        if (emptyEl) emptyEl.style.display = 'none';
        if (loadingEl) loadingEl.style.display = 'none';
    }

    showToast(`Error: ${isOn ? 'ON' : 'OFF'}`);
}

// =================================================================
// LOGIN SCREEN STATES
// =================================================================

let loginLoadingState = false;
let loginErrorState = false;

/**
 * Toggle login loading overlay
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleLoginLoading(btnElement) {
    loginLoadingState = !loginLoadingState;
    const isOn = loginLoadingState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const overlay = document.getElementById('login-loading-overlay');
    if (overlay) overlay.style.display = isOn ? 'flex' : 'none';

    // Turn off error if loading is on
    if (isOn && loginErrorState) {
        loginErrorState = false;
        setButtonState('로그인 에러', false);
        const errorToast = document.getElementById('login-error-toast');
        if (errorToast) errorToast.style.display = 'none';
    }

    showToast(`로그인 로딩: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Toggle login error toast
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleLoginError(btnElement) {
    loginErrorState = !loginErrorState;
    const isOn = loginErrorState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const errorToast = document.getElementById('login-error-toast');
    if (errorToast) errorToast.style.display = isOn ? 'flex' : 'none';

    // Turn off loading if error is on
    if (isOn && loginLoadingState) {
        loginLoadingState = false;
        setButtonState('로그인 로딩', false);
        const overlay = document.getElementById('login-loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    showToast(`로그인 에러: ${isOn ? 'ON' : 'OFF'}`);
}

// =================================================================
// PROFILE SCREEN STATES
// =================================================================

let profileLoadingState = false;

/**
 * Toggle profile loading overlay
 * @param {HTMLElement} btnElement - Button element that triggered the toggle
 */
function toggleProfileLoading(btnElement) {
    profileLoadingState = !profileLoadingState;
    const isOn = profileLoadingState;

    if (btnElement) btnElement.classList.toggle('active', isOn);

    const overlay = document.getElementById('profile-loading-overlay');
    if (overlay) overlay.style.display = isOn ? 'flex' : 'none';

    showToast(`프로필 로딩: ${isOn ? 'ON' : 'OFF'}`);
}

/**
 * Validate nickname input (1-20 characters)
 * @param {HTMLInputElement} inputElement - The nickname input element
 */
function validateNickname(inputElement) {
    const value = inputElement.value.trim();
    const hint = document.getElementById('nickname-hint');
    const error = document.getElementById('nickname-error');

    if (value.length < 1 || value.length > 20) {
        // Invalid
        if (hint) hint.style.display = 'none';
        if (error) error.style.display = 'block';
        inputElement.style.borderColor = 'var(--error)';
    } else {
        // Valid
        if (hint) hint.style.display = 'block';
        if (error) error.style.display = 'none';
        inputElement.style.borderColor = '';
    }
}


// =================================================================
// DETAIL SCREEN INTERACTIONS
// =================================================================

/**
 * Toggle portfolio notification setting
 */
/**
 * Toggle Detail Menu Dropdown
 */
function toggleDetailMenu() {
    const dropdown = document.getElementById('detail-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');

        // Close when clicking outside
        if (dropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', closeDetailMenuOutside);
            }, 0);
        }
    }
}

function closeDetailMenuOutside(e) {
    const dropdown = document.getElementById('detail-menu-dropdown');
    const btn = document.querySelector('.menu-btn');

    if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeDetailMenuOutside);
    }
}

/**
 * Toggle Edit Mode
 */
function toggleEditMode() {
    const screen = document.getElementById('screen-detail');
    const textSpan = document.getElementById('edit-mode-text');
    const menuBtn = document.querySelector('.menu-btn');
    const doneBtn = document.getElementById('edit-done-btn');

    if (screen) {
        screen.classList.toggle('edit-mode');
        const isEditMode = screen.classList.contains('edit-mode');

        if (textSpan) {
            textSpan.textContent = isEditMode ? '편집 완료' : '편집';
        }

        // Switch between hamburger and done button
        if (menuBtn && doneBtn) {
            if (isEditMode) {
                menuBtn.style.display = 'none';
                doneBtn.style.display = 'block';
            } else {
                menuBtn.style.display = 'block';
                doneBtn.style.display = 'none';
            }
        }

        // Close menu after selection (if entering edit mode from menu)
        const dropdown = document.getElementById('detail-menu-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDetailMenuOutside);
        }

        showToast(`편집 모드: ${isEditMode ? 'ON' : 'OFF'}`);
    }
}

/**
 * Notification Modal Logic
 */
function openNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.style.display = 'flex';

        // Close menu
        const dropdown = document.getElementById('detail-menu-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDetailMenuOutside);
        }
    }
}

function closeNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active'); // Just in case
    }
}

function saveNotificationSettings() {
    const toggle = document.getElementById('notification-toggle');
    const isOn = toggle ? toggle.checked : false;

    showToast(`알림 설정이 저장되었습니다. (전체 알림: ${isOn ? 'ON' : 'OFF'})`);
    closeNotificationModal();
}

/**
 * Toggle Notification Switch Label (Optional)
 */
function toggleNotificationToggle(checkbox) {
    // Logic if needed when toggling inside modal immediately
}

/**
 * Simulate stock deletion
 * @param {Event} event - Click event
 * @param {string} stockName - Name of the stock to delete
 */
function deleteStock(event, stockName) {
    if (event) {
        event.stopPropagation(); // Prevent card click event
    }

    // In a real app, this would show a confirmation modal or delete API call
    // For prototype, we just remove the element visually or show toast
    const card = event.target.closest('.stock-card');
    if (card) {
        card.style.opacity = '0.5';
        setTimeout(() => {
            // card.remove(); // Optional: actually remove it
            card.style.opacity = '1'; // Restore for demo
        }, 1000);
    }
    showToast(`${stockName} 종목이 삭제되었습니다.`);
}
