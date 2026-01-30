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
    document.getElementById('settings-back-btn')?.addEventListener('click', () => goBack());

    // Links
    document.getElementById('profile-edit-link')?.addEventListener('click', () => {
        navigateTo('profile-input'); // Reusing onboarding/profile input as edit page or create new one?
        // In v3, there was profile-edit.html. In v4 plan, checks screens.json...
        // screens.json has 'profile-input' (onboarding). 
        // We might need a separate profile edit screen later or reuse profile-input with 'edit' mode params.
        // For now, let's navigate to profile-input.
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        const modal = document.getElementById('logout-confirm-modal');
        if (modal) modal.style.display = 'flex';
    });

    document.getElementById('logout-cancel-btn')?.addEventListener('click', () => {
        document.getElementById('logout-confirm-modal').style.display = 'none';
    });

    document.getElementById('logout-confirm-btn')?.addEventListener('click', () => {
        console.log('Logging out...');
        navigateTo('login');
    });

    // Delete Account
    document.getElementById('delete-account-btn')?.addEventListener('click', () => {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.style.display = 'flex';
    });

    document.getElementById('delete-cancel-btn')?.addEventListener('click', () => {
        document.getElementById('delete-confirm-modal').style.display = 'none';
    });

    document.getElementById('delete-confirm-btn')?.addEventListener('click', () => {
        console.log('Deleting account...');
        navigateTo('splash');
    });

    // Overlay click close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        });
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
