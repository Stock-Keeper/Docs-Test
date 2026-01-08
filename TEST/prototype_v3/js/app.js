// =================================================================
// Stock-Keeper UI Prototype V3 - Main App
// Modular structure with dynamic screen loading
// =================================================================

// =============================================
// CONFIGURATION
// =============================================
const SCREENS = [
    'login', 'profile', 'home', 'detail', 'search', 'rebalance', 'settings'
];

let currentScreen = 'screen-login';

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllScreens();
    await loadModals();
    initTheme();
    initNavigation();
    console.log('✅ Stock-Keeper V3 initialized');
});

// =============================================
// SCREEN LOADING
// =============================================
async function loadAllScreens() {
    const container = document.getElementById('screen-container');

    for (const screen of SCREENS) {
        try {
            const response = await fetch(`screens/${screen}.html`);
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);
            }
        } catch (error) {
            console.error(`Failed to load screen: ${screen}`, error);
        }
    }
}

async function loadModals() {
    const container = document.getElementById('modal-container');

    try {
        const response = await fetch('components/modals.html');
        if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
        }
    } catch (error) {
        console.error('Failed to load modals', error);
    }
}

// =============================================
// NAVIGATION
// =============================================
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        updateNavButtons();
    }
}

function initNavigation() {
    document.querySelectorAll('.nav-btn-vertical').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.screen);
        });
    });
}

function updateNavButtons() {
    document.querySelectorAll('.nav-btn-vertical').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === currentScreen);
    });
}

// =============================================
// THEME MANAGEMENT
// =============================================
let currentMode = localStorage.getItem('sk-mode') || 'dark';

function initTheme() {
    setMode(currentMode);

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
}

function setMode(modeName) {
    if (!['dark', 'light'].includes(modeName)) return;

    document.documentElement.setAttribute('data-mode', modeName);
    currentMode = modeName;
    localStorage.setItem('sk-mode', modeName);

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === modeName);
    });
}

// =============================================
// MODAL MANAGEMENT
// =============================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// =============================================
// STATE TOGGLE FUNCTIONS (for demo)
// =============================================
let emptyStates = { home: false, detail: false, search: false };
let loadingState = false;
let errorState = false;

// Helper to manage button state by active status
function setButtonState(title, isActive) {
    const btn = document.querySelector(`.state-btn[data-title="${title}"]`);
    if (btn) {
        btn.classList.toggle('active', isActive);
    }
}

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



// =============================================
// UTILITIES
// =============================================
function showToast(message) {
    let toast = document.getElementById('demo-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

function showStockDetail(stockName) {
    showToast(`종목 상세: ${stockName}`);
    // TODO: 종목 상세 화면으로 이동
}
