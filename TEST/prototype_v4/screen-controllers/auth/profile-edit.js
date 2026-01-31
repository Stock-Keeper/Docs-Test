// =================================================================
// Stock-Keeper UI Prototype V4 - Profile Edit Controller
// Auth Domain
// =================================================================

import { navigateTo, goBack } from '../../core/navigation.js';

// State to track values
const state = {
    original: {
        nickname: '투자왕',
        investmentStyle: 'neutral'
    },
    current: {
        nickname: '투자왕',
        investmentStyle: 'neutral'
    }
};

export function init() {
    console.log('[ProfileEdit] Initialized');
    resetState();
    updateUI();
    addEventListeners();
}

function resetState() {
    // In a real app, fetch data here.
    state.current = { ...state.original };

    // Reset DOM elements
    const nicknameInput = document.getElementById('edit-nickname-input');
    if (nicknameInput) nicknameInput.value = state.original.nickname;

    updateCharCount(state.original.nickname.length);
    updateInvestmentStyleUI(state.original.investmentStyle);
    updateSaveButton();
}

function updateUI() {
    const nicknameInput = document.getElementById('edit-nickname-input');
    if (nicknameInput) {
        nicknameInput.value = state.current.nickname;
        updateCharCount(state.current.nickname.length);
    }
    updateInvestmentStyleUI(state.current.investmentStyle);
    updateSaveButton();
}

function addEventListeners() {
    // Back Button
    const backBtn = document.getElementById('profile-edit-back-btn');
    if (backBtn) {
        // Remove existing listeners to be safe, though init usually runs once
        const newBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBtn, backBtn);
        newBtn.addEventListener('click', handleBack);
    }

    // Nickname Input
    const nicknameInput = document.getElementById('edit-nickname-input');
    if (nicknameInput) {
        nicknameInput.addEventListener('input', (e) => {
            const value = e.target.value;
            state.current.nickname = value;
            updateCharCount(value.length);
            updateSaveButton();
        });
    }

    // Investment Style Toggles
    const styleGroup = document.getElementById('edit-investment-style-group');
    if (styleGroup) {
        styleGroup.addEventListener('click', (e) => {
            const btn = e.target.closest('.toggle-btn');
            if (!btn) return;

            const value = btn.dataset.value;
            state.current.investmentStyle = value;
            updateInvestmentStyleUI(value);
            updateSaveButton();
        });
    }

    // Save Button
    const saveBtn = document.getElementById('profile-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSave);
    }

    // Cancel Modal Buttons
    const stayBtn = document.getElementById('profile-edit-cancel-stay-btn');
    const leaveBtn = document.getElementById('profile-edit-cancel-leave-btn');
    const closeBtn = document.querySelector('#profile-edit-cancel-modal .modal-close');

    if (stayBtn) stayBtn.addEventListener('click', hideModal);
    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    if (leaveBtn) leaveBtn.addEventListener('click', () => {
        hideModal();
        goBack();
    });
}

function updateCharCount(length) {
    const countSpan = document.getElementById('edit-nickname-count');
    if (countSpan) countSpan.textContent = length;
}

function updateInvestmentStyleUI(selectedValue) {
    const buttons = document.querySelectorAll('#edit-investment-style-group .toggle-btn');
    buttons.forEach(btn => {
        if (btn.dataset.value === selectedValue) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

function updateSaveButton() {
    const saveBtn = document.getElementById('profile-save-btn');
    if (!saveBtn) return;

    const isChanged =
        state.current.nickname !== state.original.nickname ||
        state.current.investmentStyle !== state.original.investmentStyle;

    const isValid = state.current.nickname.trim().length > 0;

    if (isChanged && isValid) {
        saveBtn.removeAttribute('disabled');
    } else {
        saveBtn.setAttribute('disabled', 'true');
    }
}

function handleSave() {
    // Show loading
    const loadingOverlay = document.getElementById('profile-edit-loading-overlay');
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');

    // Mock API call
    setTimeout(() => {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');

        // Update original state to reflect "saved" data
        state.original = { ...state.current };
        updateSaveButton();

        // Update Settings UI (Dummy Data Sync)
        const nicknameDisplay = document.getElementById('display-nickname');
        if (nicknameDisplay) nicknameDisplay.textContent = state.current.nickname;

        // Show Toast (if available) - assuming imported showToast or global
        // Note: For now, simple alert or console
        console.log('Saved');

        // Navigate back
        goBack();

    }, 1500);
}

function handleBack() {
    const isChanged =
        state.current.nickname !== state.original.nickname ||
        state.current.investmentStyle !== state.original.investmentStyle;

    if (isChanged) {
        showModal();
    } else {
        goBack();
    }
}

function showModal() {
    const modal = document.getElementById('profile-edit-cancel-modal');
    if (modal) modal.style.display = 'flex';
}

function hideModal() {
    const modal = document.getElementById('profile-edit-cancel-modal');
    if (modal) modal.style.display = 'none';
}
