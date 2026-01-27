// =================================================================
// Stock-Keeper UI Prototype V4 - Profile Input Screen Controller
// Auth Domain
// =================================================================

import { navigateTo } from '../../core/navigation.js';

let state = {
    nickname: '',
    investmentStyle: 'neutral', // conservative, neutral, aggressive
    isLoading: false,
};

/**
 * Initialize profile input screen
 */
export function init() {
    const screen = document.getElementById('screen-profile-input');
    if (!screen) return;

    // Reset state
    state = {
        nickname: '',
        investmentStyle: 'neutral',
        isLoading: false,
    };

    // Nickname input - Re-query to ensure fresh DOM reference
    const nicknameInput = screen.querySelector('#nickname-input');
    if (nicknameInput) {
        // Clone to clear listeners
        const newInput = nicknameInput.cloneNode(true);
        nicknameInput.parentNode.replaceChild(newInput, nicknameInput);

        newInput.value = ''; // Clear value
        newInput.addEventListener('input', handleNicknameInput);
    }

    // Reset counter
    const counter = screen.querySelector('#nickname-count');
    if (counter) counter.textContent = '0';

    // Investment style toggle buttons
    const toggleBtns = screen.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        // Clone
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', () => handleStyleSelect(newBtn));

        // Reset selection visual
        newBtn.classList.toggle('selected', newBtn.dataset.value === 'neutral');
    });

    // Profile Image interaction
    const profileImage = screen.querySelector('.profile-image-wrapper');
    if (profileImage) {
        const newImg = profileImage.cloneNode(true);
        profileImage.parentNode.replaceChild(newImg, profileImage);
        newImg.addEventListener('click', handleProfileImageClick);
    }

    // Submit button
    const submitBtn = screen.querySelector('#profile-submit-btn');
    if (submitBtn) {
        const newBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newBtn, submitBtn);
        newBtn.addEventListener('click', handleSubmit);
        newBtn.disabled = true;
    }

    // Back button
    const backBtn = screen.querySelector('#profile-back-btn');
    if (backBtn) {
        const newBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBtn, backBtn);
        newBtn.addEventListener('click', handleBackClick);
    }

    // Modal buttons (Re-query as they might have been replaced)
    setupModalListeners(screen);

    console.log('[ProfileInput] Screen initialized');
}

function setupModalListeners(screen) {
    const cancelBtn = screen.querySelector('#logout-cancel-btn');
    const confirmBtn = screen.querySelector('#logout-confirm-btn');
    const modalClose = screen.querySelector('.modal-close');

    if (cancelBtn) {
        const newBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newBtn, cancelBtn);
        newBtn.addEventListener('click', closeModal);
    }

    if (confirmBtn) {
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        newBtn.addEventListener('click', handleLogout);
    }

    if (modalClose) {
        const newBtn = modalClose.cloneNode(true);
        modalClose.parentNode.replaceChild(newBtn, modalClose);
        newBtn.addEventListener('click', closeModal);
    }
}

/**
 * Handle nickname input
 * @param {Event} e - Input event
 */
function handleNicknameInput(e) {
    const value = e.target.value;
    state.nickname = value;

    // Update character counter
    const counter = document.getElementById('nickname-count');
    if (counter) {
        counter.textContent = value.length;
    }

    // Update submit button state
    updateSubmitButton();
}

/**
 * Handle investment style selection
 * @param {HTMLElement} btn - Clicked button
 */
function handleStyleSelect(btn) {
    // Remove selected from all
    document.querySelectorAll('.toggle-btn').forEach(b => {
        b.classList.remove('selected');
    });

    // Add selected to clicked
    btn.classList.add('selected');
    state.investmentStyle = btn.dataset.value;

    console.log('[ProfileInput] Style selected:', state.investmentStyle);
}

/**
 * Update submit button disabled state
 */
function updateSubmitButton() {
    const submitBtn = document.getElementById('profile-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = state.nickname.trim().length === 0;
    }
}

/**
 * Handle profile image click
 */
function handleProfileImageClick() {
    console.log('[ProfileInput] Profile image clicked');
    // Visual feedback is handled by CSS :active

    // Optional: Show toast or feedback
    // import { showToast } from '../../core/utils.js';
    // showToast('프로필 사진 변경 기능은 준비 중입니다.');
}

/**
 * Handle submit button click
 */
async function handleSubmit() {
    if (state.isLoading || !state.nickname.trim()) return;

    showLoading(true);
    console.log('[ProfileInput] Submitting profile:', state);

    // Simulate API call
    await delay(1500);

    showLoading(false);
    console.log('[ProfileInput] Profile saved successfully');

    // Should navigate to Home (Portfolio List)
    navigateTo('portfolio-list');
}

/**
 * Handle back button click
 */
function handleBackClick() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Close logout confirmation modal
 */
function closeModal() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Handle logout confirmation
 */
function handleLogout() {
    closeModal();
    console.log('[ProfileInput] User logged out');
    navigateTo('login');
}

/**
 * Show/hide loading overlay
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    state.isLoading = show;

    const overlay = document.getElementById('profile-loading-overlay');
    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }

    // Disable inputs during loading
    const nicknameInput = document.getElementById('nickname-input');
    const submitBtn = document.getElementById('profile-submit-btn');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    if (nicknameInput) nicknameInput.disabled = show;
    if (submitBtn) submitBtn.disabled = show;
    toggleBtns.forEach(btn => { btn.disabled = show; });
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
    if (e.detail.screenId === 'profile-input') {
        setState(e.detail.state);
    }
});

/**
 * Set profile input screen state (for control panel)
 * @param {string} stateId - State ID (loading)
 */
export function setState(stateId) {
    switch (stateId) {
        case 'loading':
            showLoading(true);
            break;
        default:
            showLoading(false);
    }
}

/**
 * Get profile input screen state
 */
export function getState() {
    return { ...state };
}
