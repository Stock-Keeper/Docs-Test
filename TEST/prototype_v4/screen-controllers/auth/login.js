// =================================================================
// Stock-Keeper UI Prototype V4 - Login Screen Controller
// Auth Domain
// =================================================================

let state = {
    isLoading: false,
    error: null,
};

/**
 * Initialize login screen
 */
export function initLoginScreen() {
    const screen = document.getElementById('screen-login');
    if (!screen) return;

    // Google login button
    const loginBtn = screen.querySelector('#google-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleGoogleLogin);
    }

    console.log('[Login] Screen initialized');
}

/**
 * Handle Google login button click
 */
async function handleGoogleLogin() {
    if (state.isLoading) return;

    showLoading(true);
    hideError();

    // Simulate OAuth flow (prototype)
    console.log('[Login] Starting Google OAuth flow...');

    // Simulate delay
    await delay(1500);

    // Simulate success/failure (80% success rate for demo)
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
        console.log('[Login] Login successful');
        // In real app: navigate to home or profile-input
        showLoading(false);
    } else {
        console.log('[Login] Login failed');
        showError('로그인에 실패했습니다. 다시 시도해주세요.');
        showLoading(false);
    }
}

/**
 * Show/hide loading overlay
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    state.isLoading = show;

    const overlay = document.getElementById('login-loading-overlay');
    const loginBtn = document.getElementById('google-login-btn');

    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }

    if (loginBtn) {
        loginBtn.disabled = show;
    }
}

/**
 * Show error toast
 * @param {string} message - Error message
 */
function showError(message) {
    state.error = message;

    const toast = document.getElementById('login-error-toast');
    if (toast) {
        toast.querySelector('.toast-message').textContent = message;
        toast.classList.remove('hidden');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            hideError();
        }, 3000);
    }
}

/**
 * Hide error toast
 */
function hideError() {
    state.error = null;

    const toast = document.getElementById('login-error-toast');
    if (toast) {
        toast.classList.add('hidden');
    }
}

/**
 * Utility: delay for simulation
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =================================================================
// STATE MANAGEMENT & DEVELOPER TOOLS
// =================================================================

window.addEventListener('app-state-change', (e) => {
    if (e.detail.screenId === 'login') {
        setLoginState(e.detail.state);
    }
});

/**
 * Set login screen state (for control panel)
 * @param {string} stateId - State ID (loading, error)
 */
export function setLoginState(stateId) {
    switch (stateId) {
        case 'loading':
            showLoading(true);
            break;
        case 'error':
            showLoading(false);
            showError('로그인에 실패했습니다.');
            break;
        default:
            showLoading(false);
            hideError();
    }
}

/**
 * Get login screen state
 */
export function getLoginState() {
    return { ...state };
}
