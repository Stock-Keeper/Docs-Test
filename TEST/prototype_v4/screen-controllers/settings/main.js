// =================================================================
// Stock-Keeper UI Prototype V4 - Settings Main Controller
// Settings Domain
// =================================================================

import { navigateTo, goBack } from '../../core/navigation.js';

// Dummy Data
const USER_PROFILE = {
    nickname: '투자왕김철수',
    email: 'investor@email.com',
    investmentStyle: 'neutral' // conservative, neutral, aggressive
};

const STYLE_LABELS = {
    conservative: '안정형',
    neutral: '중립형',
    aggressive: '공격형'
};

export function init() {
    console.log('[SettingsMain] Initializing...');

    // Render profile info
    setText('display-nickname', USER_PROFILE.nickname);
    setText('display-investment-style', STYLE_LABELS[USER_PROFILE.investmentStyle]);

    attachListeners();
}

function attachListeners() {
    // Nav
    const backBtn = document.getElementById('settings-back-btn');
    if (backBtn) backBtn.onclick = () => goBack();

    // Links
    const profileLink = document.getElementById('profile-edit-link');
    if (profileLink) {
        profileLink.onclick = () => navigateTo('profile-edit');
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    console.log('[SettingsMain] logout-btn element:', logoutBtn);
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log('[SettingsMain] Logout button clicked!');
            const modal = document.getElementById('logout-confirm-modal');
            console.log('[SettingsMain] logout-confirm-modal element:', modal);
            if (modal) {
                modal.style.display = 'flex';
                console.log('[SettingsMain] Modal display set to flex');
            }
        };
    } else {
        console.warn('[SettingsMain] logout-btn NOT FOUND!');
    }

    const logoutCancelBtn = document.getElementById('logout-cancel-btn');
    if (logoutCancelBtn) {
        logoutCancelBtn.onclick = () => {
            document.getElementById('logout-confirm-modal').style.display = 'none';
        };
    }

    const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
    if (logoutConfirmBtn) {
        logoutConfirmBtn.onclick = () => {
            console.log('Logging out...');
            navigateTo('login');
        };
    }

    // Delete Account
    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) {
        deleteBtn.onclick = () => {
            const modal = document.getElementById('delete-confirm-modal');
            if (modal) modal.style.display = 'flex';
        };
    }

    const deleteCancelBtn = document.getElementById('delete-cancel-btn');
    if (deleteCancelBtn) {
        deleteCancelBtn.onclick = () => {
            console.log('Cancel delete clicked');
            document.getElementById('delete-confirm-modal').style.display = 'none';
        };
    }

    const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.onclick = () => {
            console.log('Deleting account...');
            navigateTo('splash');
        };
    }

    // Overlay click close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        };
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

/**
 * Cleanup function called when leaving the screen.
 * Closes any open modals to prevent state leakage.
 */
export function cleanup() {
    console.log('[SettingsMain] Cleaning up...');
    const logoutModal = document.getElementById('logout-confirm-modal');
    const deleteModal = document.getElementById('delete-confirm-modal');

    if (logoutModal) logoutModal.style.display = 'none';
    if (deleteModal) deleteModal.style.display = 'none';
}
